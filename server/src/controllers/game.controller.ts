import { Request, Response } from "express";
import { Game } from "../models/Game";

// ➕ Create Game
export const createGame = async (req: Request, res: Response) => {
  try {
    const { games } = req.body;

    if (!Array.isArray(games) || games.length === 0) {
      return res.status(400).json({ error: "Games array is required" });
    }

    // Normalize and validate inputs
    const cleanGames = games
      .map((g) => ({
        name: g.name?.trim(),
        shortName: g.shortName?.trim(),
        points: Number(g.points) || 0,
      }))
      .filter((g) => g.name); // remove invalid

    if (cleanGames.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one valid game name is required" });
    }

    // Fetch existing games (case-insensitive check)
    const existingNames = await Game.find({
      name: { $in: cleanGames.map((g) => new RegExp(`^${g.name}$`, "i")) },
    }).select("name");

    const existingSet = new Set(existingNames.map((g) => g.name.toLowerCase()));

    // Filter out duplicates
    const newGames = cleanGames.filter(
      (g) => !existingSet.has(g.name.toLowerCase())
    );

    if (newGames.length === 0) {
      return res.status(409).json({ error: "All games already exist" });
    }

    // Insert all new games
    const createdGames = await Game.insertMany(newGames);

    return res.status(201).json({
      message: `✅ ${createdGames.length} game(s) added successfully`,
      createdGames,
      skipped: cleanGames.length - newGames.length,
    });
  } catch (err) {
    console.error("Error creating games:", err);
    res.status(500).json({ error: "Failed to create games" });
  }
};

// 📋 Get all Games
export const listGames = async (_req: Request, res: Response) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
};

// ✏️ Update Game
export const updateGame = async (req: Request, res: Response) => {
  try {
    const { name, points } = req.body;
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { name, points },
      { new: true }
    );
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ message: "Game updated successfully", game });
  } catch (err) {
    res.status(500).json({ error: "Failed to update game" });
  }
};

// ❌ Delete Game
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete game" });
  }
};
