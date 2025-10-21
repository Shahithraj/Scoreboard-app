"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamMembers = exports.deleteTeam = exports.updateTeam = exports.getTeam = exports.listTeams = exports.createTeam = void 0;
const Team_js_1 = require("../models/Team.js");
const createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ error: "Team name is required" });
        // Normalize name (case-insensitive check)
        const normalized = name.trim();
        // Check if a team with the same name (case-insensitive) already exists
        const existing = await Team_js_1.Team.findOne({
            name: { $regex: new RegExp(`^${normalized}$`, "i") },
        });
        if (existing)
            return res.status(409).json({ error: "Team name already exists" });
        const team = await Team_js_1.Team.create({ name: normalized });
        res.status(201).json({ message: "Team created successfully", team });
    }
    catch (err) {
        console.error("Error creating team:", err);
        // Handle unique constraint error from MongoDB
        if (err instanceof Error && "code" in err && err.code === 11000) {
            return res.status(409).json({ error: "Team name already exists" });
        }
        res.status(500).json({ error: "Failed to create team" });
    }
};
exports.createTeam = createTeam;
const listTeams = async (_req, res) => {
    try {
        const teams = await Team_js_1.Team.find().sort({ createdAt: -1 });
        res.json(teams);
    }
    catch (err) {
        console.error("Error fetching teams:", err);
        res.status(500).json({ error: "Failed to fetch teams" });
    }
};
exports.listTeams = listTeams;
const getTeam = async (req, res) => {
    try {
        const team = await Team_js_1.Team.findById(req.params.id)
            .populate("members") // ✅ populate linked Member documents
            .exec();
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.json(team);
    }
    catch (err) {
        console.error("Error fetching team:", err);
        res.status(500).json({ error: "Failed to fetch team" });
    }
};
exports.getTeam = getTeam;
const updateTeam = async (req, res) => {
    try {
        const { name } = req.body;
        const team = await Team_js_1.Team.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.json({ message: "Team updated successfully", team });
    }
    catch (err) {
        console.error("Error updating team:", err);
        res.status(500).json({ error: "Failed to update team" });
    }
};
exports.updateTeam = updateTeam;
const deleteTeam = async (req, res) => {
    try {
        const team = await Team_js_1.Team.findByIdAndDelete(req.params.id);
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.json({ message: "Team deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting team:", err);
        res.status(500).json({ error: "Failed to delete team" });
    }
};
exports.deleteTeam = deleteTeam;
const getTeamMembers = async (req, res) => {
    try {
        const team = await Team_js_1.Team.findById(req.params.id).populate("members");
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.json({
            teamId: team._id,
            teamName: team.name,
            members: team.members,
        });
    }
    catch (err) {
        console.error("Error fetching team members:", err);
        res.status(500).json({ error: "Failed to fetch team members" });
    }
};
exports.getTeamMembers = getTeamMembers;
