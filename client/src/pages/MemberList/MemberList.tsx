import { useEffect, useState } from "react";
import styles from "./MemberList.module.css";
import {
  getMembers,
  deleteMember,
  updateMember,
  type Member,
} from "../../api/memberApi";
import { getTeams, type Team } from "../../api/teamApi";
import { Pencil, Trash2 } from "lucide-react";
import CustomDropdown from "../../custom-components/CustomDropdown/CustomDropdown";
import CustomButton from "../../custom-components/CustomButton/CustomButton";
import CustomTable, {
  type Column,
} from "../../custom-components/CustomTable/CustomTable";
import CustomInput from "../../custom-components/CustomInput/CustomInput";

// ✅ Helper to safely get team ID
const getTeamId = (team: Member["team"]): string | undefined => {
  if (typeof team === "object" && team !== null && "_id" in team) {
    return (team as Team)._id;
  }
  if (typeof team === "string") return team;
  return undefined;
};

const MemberList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");

  // ✅ Fetch members & teams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberData, teamData] = await Promise.all([
          getMembers(),
          getTeams(),
        ]);
        setMembers(memberData);
        setTeams(teamData);
      } catch (err) {
        console.error("Error fetching members or teams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter members by team
  const filteredMembers = selectedTeam
    ? members.filter((m) => getTeamId(m.team) === selectedTeam)
    : members;

  // ✅ Handle member deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      alert("✅ Member deleted successfully");
    } catch {
      alert("❌ Failed to delete member");
    }
  };

  // ✅ Handle edit save
  const handleEditSave = async () => {
    if (!editingMember) return;
    try {
      const updated = await updateMember(editingMember._id!, {
        name: editName,
        role: editRole,
      });
      setMembers((prev) =>
        prev.map((m) => (m?._id === updated.member?._id ? updated.member : m))
      );
      setEditingMember(null);
      alert("✅ Member updated successfully");
    } catch {
      alert("❌ Failed to update member");
    }
  };

  // ✅ Define table columns
  const columns: Column<Member>[] = [
    { key: "name", label: "Member Name", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (m) => m.role || "—",
    },
    {
      key: "team",
      label: "Team",
      render: (m) =>
        typeof m.team === "object" && m.team !== null ? m.team.name : "—",
    },
  ];

  // ✅ Dropdown options
  const teamOptions = [...teams.map((t) => ({ label: t.name, value: t._id! }))];

  if (loading) return <p>Loading members...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>👥 Member List</h2>
        <div className={styles.filters}>
          <CustomDropdown
            label="Filter by Team"
            name="team"
            options={teamOptions}
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          />
          <CustomButton
            label="Clear Filter"
            variant="secondary"
            onClick={() => setSelectedTeam("")}
          />
        </div>
      </div>

      {/* ✅ Custom Table */}
      <CustomTable<Member>
        data={filteredMembers}
        columns={columns}
        actions={(member) => (
          <div className={styles.actionButtons}>
            <button
              onClick={() => {
                setEditingMember(member);
                setEditName(member.name);
                setEditRole(member.role || "");
              }}
              className={styles.iconBtn}
              title="Edit Member"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(member._id!)}
              className={`${styles.iconBtn} ${styles.delete}`}
              title="Delete Member"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        searchPlaceholder="Search members by name or role..."
        pageSize={6}
      />

      {/* ✅ Edit Modal */}
      {editingMember && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Edit Member</h3>
            <CustomInput
              label="Name"
              name="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <CustomInput
              label="Role"
              name="role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            />
            <div className={styles.modalActions}>
              <CustomButton
                label="Cancel"
                variant="secondary"
                onClick={() => setEditingMember(null)}
              />
              <CustomButton
                label="Save"
                variant="primary"
                onClick={handleEditSave}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
