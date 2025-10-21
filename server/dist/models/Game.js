"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const mongoose_1 = require("mongoose");
const GameSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    shortName: { type: String, trim: true },
    description: { type: String, trim: true },
    points: { type: Number, required: true, default: 0 },
}, { timestamps: true });
exports.Game = (0, mongoose_1.model)("Game", GameSchema);
