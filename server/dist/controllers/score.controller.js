"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScore = exports.getScores = exports.createScore = void 0;
const Score_js_1 = require("../models/Score.js");
const Game_js_1 = require("../models/Game.js");
const Team_js_1 = require("../models/Team.js");
const Member_js_1 = require("../models/Member.js");
/**
 * 🧩 Create team or member scores
 */
const createScore = async (req, res) => {
    try {
        const { game, team, memberIds = [], points } = req.body;
        // ✅ Basic validation
        if (!game || !team)
            return res.status(400).json({ error: "Game and team are required." });
        const existingGame = await Game_js_1.Game.findById(game);
        if (!existingGame)
            return res.status(404).json({ error: "Game not found." });
        const existingTeam = await Team_js_1.Team.findById(team);
        if (!existingTeam)
            return res.status(404).json({ error: "Team not found." });
        // 🏆 CASE 1: Team-wide score (no members selected)
        if (!memberIds.length) {
            const existingScore = await Score_js_1.Score.findOne({ game, team, member: null });
            if (existingScore) {
                existingScore.points += points;
                await existingScore.save();
            }
            else {
                await Score_js_1.Score.create({ game, team, member: null, points }); // ✅ ensure member: null
            }
            return res
                .status(201)
                .json({ message: "✅ Team score added/updated successfully" });
        }
        // 🧑‍🤝‍🧑 CASE 2: Member-specific scores
        const operations = memberIds.map(async (memberId) => {
            const existingMember = await Member_js_1.Member.findById(memberId);
            if (!existingMember)
                throw new Error(`Member with ID ${memberId} not found`);
            const existingScore = await Score_js_1.Score.findOne({
                game,
                team,
                member: memberId,
            });
            if (existingScore) {
                existingScore.points += points;
                await existingScore.save();
            }
            else {
                await Score_js_1.Score.create({ game, team, member: memberId, points });
            }
        });
        await Promise.all(operations);
        res
            .status(201)
            .json({ message: "✅ Member scores added/updated successfully" });
    }
    catch (err) {
        console.error("Error creating score:", err);
        res.status(500).json({
            error: err instanceof Error ? err.message : "Failed to create scores",
        });
    }
};
exports.createScore = createScore;
/**
 * 🔍 Get all scores
 */
const getScores = async (_req, res) => {
    try {
        const scores = await Score_js_1.Score.find()
            .populate("game", "name points")
            .populate("team", "name")
            .populate("member", "name role");
        res.json(scores);
    }
    catch (err) {
        console.error("Error fetching scores:", err);
        res.status(500).json({ error: "Failed to fetch scores" });
    }
};
exports.getScores = getScores;
/**
 * 🗑️ Delete score
 */
const deleteScore = async (req, res) => {
    try {
        const score = await Score_js_1.Score.findByIdAndDelete(req.params.id);
        if (!score)
            return res.status(404).json({ error: "Score not found" });
        res.json({ message: "Score deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting score:", err);
        res.status(500).json({ error: "Failed to delete score" });
    }
};
exports.deleteScore = deleteScore;
