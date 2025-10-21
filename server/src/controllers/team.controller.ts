import { Request, Response } from "express";
import { Team } from "../models/Team";

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Team name is required" });

    // Normalize name (case-insensitive check)
    const normalized = name.trim();

    // Check if a team with the same name (case-insensitive) already exists
    const existing = await Team.findOne({
      name: { $regex: new RegExp(`^${normalized}$`, "i") },
    });

    if (existing)
      return res.status(409).json({ error: "Team name already exists" });

    const team = await Team.create({ name: normalized });

    res.status(201).json({ message: "Team created successfully", team });
  } catch (err: unknown) {
    console.error("Error creating team:", err);

    // Handle unique constraint error from MongoDB
    if (err instanceof Error && "code" in err && (err as any).code === 11000) {
      return res.status(409).json({ error: "Team name already exists" });
    }

    res.status(500).json({ error: "Failed to create team" });
  }
};

export const listTeams = async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("members") // ✅ populate linked Member documents
      .exec();
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ error: "Failed to fetch team" });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json({ message: "Team updated successfully", team });
  } catch (err) {
    console.error("Error updating team:", err);
    res.status(500).json({ error: "Failed to update team" });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("Error deleting team:", err);
    res.status(500).json({ error: "Failed to delete team" });
  }
};

export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id).populate("members");
    if (!team) return res.status(404).json({ error: "Team not found" });

    res.json({
      teamId: team._id,
      teamName: team.name,
      members: team.members,
    });
  } catch (err) {
    console.error("Error fetching team members:", err);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};
