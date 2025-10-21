"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMember = exports.updateMember = exports.listMembers = exports.createMember = void 0;
const Member_js_1 = require("../models/Member.js");
const Team_js_1 = require("../models/Team.js");
const createMember = async (req, res) => {
    try {
        const { members } = req.body;
        if (!Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ error: "Members array is required" });
        }
        const normalizedMembers = members.map((m) => ({
            name: m.name?.trim(),
            role: m.role || "player",
            team: m.team,
        }));
        const invalid = normalizedMembers.find((m) => !m.name || !m.team);
        if (invalid) {
            return res
                .status(400)
                .json({ error: "Each member must have a valid name and team" });
        }
        // ✅ Validate all provided team IDs exist
        const teamIds = [...new Set(normalizedMembers.map((m) => m.team))];
        const existingTeams = await Team_js_1.Team.find({ _id: { $in: teamIds } }).lean();
        const validTeamIds = new Set(existingTeams.map((t) => t._id.toString()));
        const invalidTeams = teamIds.filter((id) => !validTeamIds.has(id));
        if (invalidTeams.length > 0) {
            return res.status(400).json({
                error: `Invalid team ID(s): ${invalidTeams.join(", ")}`,
            });
        }
        // ✅ Check duplicates (case-insensitive)
        const existing = await Member_js_1.Member.find({
            name: {
                $in: normalizedMembers.map((m) => new RegExp(`^${m.name}$`, "i")),
            },
        });
        const existingNames = new Set(existing.map((m) => m.name.toLowerCase()));
        const uniqueMembers = normalizedMembers.filter((m) => !existingNames.has(m.name.toLowerCase()));
        if (uniqueMembers.length === 0) {
            return res.status(409).json({
                error: "All provided members already exist",
                existingCount: existing.length,
            });
        }
        // ✅ Bulk insert new members
        const createdMembers = (await Member_js_1.Member.insertMany(uniqueMembers));
        // ✅ Update team documents
        const teamMemberMap = {};
        createdMembers.forEach((member) => {
            const teamId = member.team.toString();
            if (!teamMemberMap[teamId])
                teamMemberMap[teamId] = [];
            teamMemberMap[teamId].push(member._id.toString());
        });
        await Promise.all(Object.entries(teamMemberMap).map(([teamId, memberIds]) => Team_js_1.Team.findByIdAndUpdate(teamId, {
            $addToSet: { members: { $each: memberIds } },
        })));
        return res.status(201).json({
            message: `✅ Created ${createdMembers.length} of ${members.length} member(s) successfully`,
            created: createdMembers,
            skipped: members.length - createdMembers.length,
        });
    }
    catch (err) {
        console.error("Error creating members:", err);
        if (err instanceof Error && "code" in err && err.code === 11000) {
            return res.status(409).json({ error: "Duplicate member name detected" });
        }
        res.status(500).json({ error: "Failed to create members" });
    }
};
exports.createMember = createMember;
const listMembers = async (req, res) => {
    const { team } = req.query;
    const filter = team ? { team } : {};
    const members = await Member_js_1.Member.find(filter).populate("team", "name");
    res.json(members);
};
exports.listMembers = listMembers;
const updateMember = async (req, res) => {
    const member = await Member_js_1.Member.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!member)
        return res.status(404).json({ error: "Member not found" });
    res.json(member);
};
exports.updateMember = updateMember;
const deleteMember = async (req, res) => {
    const member = await Member_js_1.Member.findByIdAndDelete(req.params.id);
    if (!member)
        return res.status(404).json({ error: "Member not found" });
    res.json({ success: true });
};
exports.deleteMember = deleteMember;
