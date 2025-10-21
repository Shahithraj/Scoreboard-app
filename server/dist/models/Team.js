"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const TeamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Member" }],
}, { timestamps: true });
TeamSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
exports.Team = (0, mongoose_1.model)("Team", TeamSchema);
