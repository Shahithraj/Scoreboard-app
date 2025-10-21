"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberScoresByGame = exports.getTeamScoresByGame = exports.getMemberLeaderboard = exports.getTeamLeaderboard = void 0;
const Score_js_1 = require("../models/Score.js");
const mongoose_1 = require("mongoose");
// 🏆 TEAM LEADERBOARD
const getTeamLeaderboard = async (_req, res) => {
    try {
        const data = await Score_js_1.Score.aggregate([
            {
                $match: {
                    $or: [{ member: null }, { member: { $exists: false } }], // ✅ handle both
                },
            },
            {
                $group: {
                    _id: "$team",
                    totalPoints: { $sum: "$points" },
                },
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "_id",
                    foreignField: "_id",
                    as: "team",
                },
            },
            { $unwind: "$team" },
            {
                $project: {
                    _id: "$team._id",
                    teamName: "$team.name",
                    totalPoints: 1,
                },
            },
            { $sort: { totalPoints: -1 } },
        ]);
        res.json(data);
    }
    catch (error) {
        console.error("[Leaderboard] getTeamLeaderboard:", error);
        res.status(500).json({ error: "Error fetching team leaderboard" });
    }
};
exports.getTeamLeaderboard = getTeamLeaderboard;
// 🏅 MEMBER LEADERBOARD
const getMemberLeaderboard = async (_req, res) => {
    try {
        const data = await Score_js_1.Score.aggregate([
            { $match: { member: { $ne: null } } },
            {
                $group: {
                    _id: "$member",
                    totalPoints: { $sum: "$points" },
                },
            },
            {
                $lookup: {
                    from: "members",
                    localField: "_id",
                    foreignField: "_id",
                    as: "member",
                },
            },
            { $unwind: "$member" },
            {
                $lookup: {
                    from: "teams",
                    localField: "member.team",
                    foreignField: "_id",
                    as: "team",
                },
            },
            { $unwind: "$team" },
            {
                $project: {
                    _id: "$member._id",
                    memberName: "$member.name",
                    teamName: "$team.name",
                    totalPoints: 1,
                },
            },
            { $sort: { totalPoints: -1 } },
        ]);
        res.json(data);
    }
    catch (error) {
        console.error("[Leaderboard] getMemberLeaderboard:", error);
        res.status(500).json({ error: "Error fetching member leaderboard" });
    }
};
exports.getMemberLeaderboard = getMemberLeaderboard;
// 🎯 TEAM GAME-WISE SCORES
const getTeamScoresByGame = async (req, res) => {
    try {
        const teamId = new mongoose_1.Types.ObjectId(req.params.teamId);
        const data = await Score_js_1.Score.aggregate([
            {
                $match: {
                    team: teamId,
                    $or: [{ member: null }, { member: { $exists: false } }],
                },
            },
            {
                $lookup: {
                    from: "games",
                    localField: "game",
                    foreignField: "_id",
                    as: "game",
                },
            },
            { $unwind: "$game" },
            {
                $project: {
                    _id: 0,
                    gameId: "$game._id",
                    gameName: "$game.name",
                    points: 1,
                },
            },
            { $sort: { points: -1 } },
        ]);
        res.json(data);
    }
    catch (error) {
        console.error("[Leaderboard] getTeamScoresByGame:", error);
        res.status(500).json({ error: "Error fetching team scores per game" });
    }
};
exports.getTeamScoresByGame = getTeamScoresByGame;
// 🎯 MEMBER GAME-WISE SCORES
const getMemberScoresByGame = async (req, res) => {
    try {
        const memberId = new mongoose_1.Types.ObjectId(req.params.memberId);
        const data = await Score_js_1.Score.aggregate([
            { $match: { member: memberId } },
            {
                $lookup: {
                    from: "games",
                    localField: "game",
                    foreignField: "_id",
                    as: "game",
                },
            },
            { $unwind: "$game" },
            {
                $project: {
                    _id: 0,
                    gameId: "$game._id",
                    gameName: "$game.name",
                    points: 1,
                },
            },
            { $sort: { points: -1 } },
        ]);
        res.json(data);
    }
    catch (error) {
        console.error("[Leaderboard] getMemberScoresByGame:", error);
        res.status(500).json({ error: "Error fetching member scores per game" });
    }
};
exports.getMemberScoresByGame = getMemberScoresByGame;
