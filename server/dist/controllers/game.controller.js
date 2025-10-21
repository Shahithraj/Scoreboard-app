"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.updateGame = exports.listGames = exports.createGame = void 0;
const Game_js_1 = require("../models/Game.js");
// ➕ Create Game
const createGame = async (req, res) => {
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
        const existingNames = await Game_js_1.Game.find({
            name: { $in: cleanGames.map((g) => new RegExp(`^${g.name}$`, "i")) },
        }).select("name");
        const existingSet = new Set(existingNames.map((g) => g.name.toLowerCase()));
        // Filter out duplicates
        const newGames = cleanGames.filter((g) => !existingSet.has(g.name.toLowerCase()));
        if (newGames.length === 0) {
            return res.status(409).json({ error: "All games already exist" });
        }
        // Insert all new games
        const createdGames = await Game_js_1.Game.insertMany(newGames);
        return res.status(201).json({
            message: `✅ ${createdGames.length} game(s) added successfully`,
            createdGames,
            skipped: cleanGames.length - newGames.length,
        });
    }
    catch (err) {
        console.error("Error creating games:", err);
        res.status(500).json({ error: "Failed to create games" });
    }
};
exports.createGame = createGame;
// 📋 Get all Games
const listGames = async (_req, res) => {
    try {
        const games = await Game_js_1.Game.find().sort({ createdAt: -1 });
        res.json(games);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch games" });
    }
};
exports.listGames = listGames;
// ✏️ Update Game
const updateGame = async (req, res) => {
    try {
        const { name, points } = req.body;
        const game = await Game_js_1.Game.findByIdAndUpdate(req.params.id, { name, points }, { new: true });
        if (!game)
            return res.status(404).json({ error: "Game not found" });
        res.json({ message: "Game updated successfully", game });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update game" });
    }
};
exports.updateGame = updateGame;
// ❌ Delete Game
const deleteGame = async (req, res) => {
    try {
        const game = await Game_js_1.Game.findByIdAndDelete(req.params.id);
        if (!game)
            return res.status(404).json({ error: "Game not found" });
        res.json({ message: "Game deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete game" });
    }
};
exports.deleteGame = deleteGame;
