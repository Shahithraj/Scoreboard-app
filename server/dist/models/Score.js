"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
const mongoose_1 = require("mongoose");
const ScoreSchema = new mongoose_1.Schema({
    game: { type: mongoose_1.Schema.Types.ObjectId, ref: "Game", required: true },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: "Team", required: true },
    member: { type: mongoose_1.Schema.Types.ObjectId, ref: "Member" },
    points: { type: Number, required: true, default: 0 },
}, { timestamps: true });
// You can enforce one unique combination of (game, member) or (game, team)
ScoreSchema.index({ game: 1, team: 1, member: 1 }, { unique: true, sparse: true });
exports.Score = (0, mongoose_1.model)("Score", ScoreSchema);
