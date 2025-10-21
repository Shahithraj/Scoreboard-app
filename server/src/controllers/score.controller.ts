import { Request, Response } from "express";
import { Score } from "../models/Score";
import { Game } from "../models/Game";
import { Team } from "../models/Team";
import { Member } from "../models/Member";

/**
 * 🧩 Create team or member scores
 */
export const createScore = async (req: Request, res: Response) => {
  try {
    const { game, team, memberIds = [], points } = req.body;

    // ✅ Basic validation
    if (!game || !team)
      return res.status(400).json({ error: "Game and team are required." });

    const existingGame = await Game.findById(game);
    if (!existingGame)
      return res.status(404).json({ error: "Game not found." });

    const existingTeam = await Team.findById(team);
    if (!existingTeam)
      return res.status(404).json({ error: "Team not found." });

    // 🏆 CASE 1: Team-wide score (no members selected)
    if (!memberIds.length) {
      const existingScore = await Score.findOne({ game, team, member: null });
      if (existingScore) {
        existingScore.points += points;
        await existingScore.save();
      } else {
        await Score.create({ game, team, member: null, points }); // ✅ ensure member: null
      }
      return res
        .status(201)
        .json({ message: "✅ Team score added/updated successfully" });
    }

    // 🧑‍🤝‍🧑 CASE 2: Member-specific scores
    const operations = memberIds.map(async (memberId: string) => {
      const existingMember = await Member.findById(memberId);
      if (!existingMember)
        throw new Error(`Member with ID ${memberId} not found`);

      const existingScore = await Score.findOne({
        game,
        team,
        member: memberId,
      });

      if (existingScore) {
        existingScore.points += points;
        await existingScore.save();
      } else {
        await Score.create({ game, team, member: memberId, points });
      }
    });

    await Promise.all(operations);

    res
      .status(201)
      .json({ message: "✅ Member scores added/updated successfully" });
  } catch (err) {
    console.error("Error creating score:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to create scores",
    });
  }
};

/**
 * 🔍 Get all scores
 */
export const getScores = async (_req: Request, res: Response) => {
  try {
    const scores = await Score.find()
      .populate("game", "name points")
      .populate("team", "name")
      .populate("member", "name role");

    res.json(scores);
  } catch (err) {
    console.error("Error fetching scores:", err);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
};

/**
 * 🗑️ Delete score
 */
export const deleteScore = async (req: Request, res: Response) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) return res.status(404).json({ error: "Score not found" });

    res.json({ message: "Score deleted successfully" });
  } catch (err) {
    console.error("Error deleting score:", err);
    res.status(500).json({ error: "Failed to delete score" });
  }
};
