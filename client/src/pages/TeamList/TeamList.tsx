import { useEffect, useState } from "react";
import styles from "./TeamList.module.css";
import { useAppStore } from "../../store/useAppStore"; // ✅ import Zustand store
import { deleteTeam, updateTeam, type Team } from "../../api/teamApi";
import { Pencil, Trash2 } from "lucide-react";
import CustomButton from "../../custom-components/CustomButton/CustomButton";
import CustomInput from "../../custom-components/CustomInput/CustomInput";
import CustomTable, {
  type Column,
} from "../../custom-components/CustomTable/CustomTable";

const TeamList = () => {
  const { teams, loading, fetchTeams } = useAppStore(); // ✅ use Zustand store
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  // ✅ Fetch teams only once (if not already loaded)
  useEffect(() => {
    if (teams.length === 0) {
      fetchTeams();
    }
  }, [teams.length, fetchTeams]);

  // ✅ Delete a team
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      setLocalLoading(true);
      await deleteTeam(id);
      await fetchTeams(); // ✅ Refresh teams from store after deletion
      alert("✅ Team deleted successfully");
    } catch {
      alert("❌ Failed to delete team");
    } finally {
      setLocalLoading(false);
    }
  };

  // ✅ Save edited team
  const handleEditSave = async () => {
    if (!editingTeam) return;
    try {
      setLocalLoading(true);
      await updateTeam(editingTeam._id!, { name: editName });
      await fetchTeams(); // ✅ Refresh teams in store
      setEditingTeam(null);
      alert("✅ Team updated successfully");
    } catch {
      alert("❌ Failed to update team");
    } finally {
      setLocalLoading(false);
    }
  };

  // ✅ Define table columns
  const columns: Column<Team>[] = [
    { key: "name", label: "Team Name", sortable: true },
    {
      key: "members",
      label: "Members Count",
      render: (team) => team.members?.length ?? 0,
    },
  ];

  if (loading || localLoading) return <p>Loading teams...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🏅 Team List</h2>
        <CustomButton
          label="Refresh"
          variant="secondary"
          onClick={fetchTeams}
        />
      </div>

      {/* ✅ Table */}
      <CustomTable<Team>
        data={teams}
        columns={columns}
        actions={(team) => (
          <div className={styles.actionButtons}>
            <button
              onClick={() => {
                setEditingTeam(team);
                setEditName(team.name);
              }}
              className={styles.iconBtn}
              title="Edit Team"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(team._id!)}
              className={`${styles.iconBtn} ${styles.delete}`}
              title="Delete Team"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        searchPlaceholder="Search teams by name..."
        pageSize={6}
      />

      {/* ✅ Edit Modal */}
      {editingTeam && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Edit Team</h3>
            <CustomInput
              label="Team Name"
              name="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className={styles.modalActions}>
              <CustomButton
                label="Cancel"
                variant="secondary"
                onClick={() => setEditingTeam(null)}
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

export default TeamList;
