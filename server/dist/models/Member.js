"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const mongoose_1 = require("mongoose");
const MemberSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: "Team", required: true },
}, { timestamps: true });
exports.Member = (0, mongoose_1.model)("Member", MemberSchema);
