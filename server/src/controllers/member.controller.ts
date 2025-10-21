import { Request, Response } from "express";
import { Member, IMember } from "../models/Member";
import { Team, ITeam } from "../models/Team";

export const createMember = async (req: Request, res: Response) => {
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
    const existingTeams = await Team.find({ _id: { $in: teamIds } }).lean<
      ITeam[]
    >();
    const validTeamIds = new Set(existingTeams.map((t) => t._id.toString()));

    const invalidTeams = teamIds.filter((id) => !validTeamIds.has(id));
    if (invalidTeams.length > 0) {
      return res.status(400).json({
        error: `Invalid team ID(s): ${invalidTeams.join(", ")}`,
      });
    }

    // ✅ Check duplicates (case-insensitive)
    const existing = await Member.find({
      name: {
        $in: normalizedMembers.map((m) => new RegExp(`^${m.name}$`, "i")),
      },
    });
    const existingNames = new Set(existing.map((m) => m.name.toLowerCase()));
    const uniqueMembers = normalizedMembers.filter(
      (m) => !existingNames.has(m.name.toLowerCase())
    );

    if (uniqueMembers.length === 0) {
      return res.status(409).json({
        error: "All provided members already exist",
        existingCount: existing.length,
      });
    }

    // ✅ Bulk insert new members
    const createdMembers = (await Member.insertMany(
      uniqueMembers
    )) as IMember[];

    // ✅ Update team documents
    const teamMemberMap: Record<string, string[]> = {};
    createdMembers.forEach((member) => {
      const teamId = member.team.toString();
      if (!teamMemberMap[teamId]) teamMemberMap[teamId] = [];
      teamMemberMap[teamId].push(member._id.toString());
    });

    await Promise.all(
      Object.entries(teamMemberMap).map(([teamId, memberIds]) =>
        Team.findByIdAndUpdate(teamId, {
          $addToSet: { members: { $each: memberIds } },
        })
      )
    );

    return res.status(201).json({
      message: `✅ Created ${createdMembers.length} of ${members.length} member(s) successfully`,
      created: createdMembers,
      skipped: members.length - createdMembers.length,
    });
  } catch (err) {
    console.error("Error creating members:", err);

    if (err instanceof Error && "code" in err && (err as any).code === 11000) {
      return res.status(409).json({ error: "Duplicate member name detected" });
    }

    res.status(500).json({ error: "Failed to create members" });
  }
};

export const listMembers = async (req: Request, res: Response) => {
  const { team } = req.query;
  const filter = team ? { team } : {};
  const members = await Member.find(filter).populate("team", "name");
  res.json(members);
};

export const updateMember = async (req: Request, res: Response) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!member) return res.status(404).json({ error: "Member not found" });
  res.json(member);
};

export const deleteMember = async (req: Request, res: Response) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) return res.status(404).json({ error: "Member not found" });
  res.json({ success: true });
};
