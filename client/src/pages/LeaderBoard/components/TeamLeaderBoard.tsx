import { useEffect, useState } from "react";
import CustomTable, {
  type Column,
} from "../../../custom-components/CustomTable/CustomTable";
import { getTeamLeaderboard } from "../../../api/leaderboard";
import ScoreDetailModal from "./ScoreDetailModel";

interface TeamLeaderboardEntry {
  _id: string;
  teamName: string;
  totalPoints: number;
}

const TeamLeaderboard = () => {
  const [data, setData] = useState<TeamLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<TeamLeaderboardEntry | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await getTeamLeaderboard();
        setData(res);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleView = (team: TeamLeaderboardEntry) => {
    setSelectedTeam(team);
  };

  const columns: Column<TeamLeaderboardEntry>[] = [
    { key: "rank", label: "Rank", render: (_, index) => index + 1 },
    { key: "teamName", label: "Team Name", sortable: true },
    { key: "totalPoints", label: "Points", sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (team) => (
        <button
          onClick={() => handleView(team)}
          style={{
            background: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            padding: "4px 8px",
          }}
        >
          View
        </button>
      ),
    },
  ];

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div>
      <h3 style={{ marginBottom: "1rem" }}>🏆 Team Leaderboard</h3>
      <CustomTable<TeamLeaderboardEntry>
        data={data}
        columns={columns}
        searchPlaceholder="Search teams..."
        emptyMessage="No teams found"
        pageSize={10}
      />

      {selectedTeam && (
        <ScoreDetailModal
          id={selectedTeam._id}
          type="team"
          name={selectedTeam.teamName}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
};

export default TeamLeaderboard;
