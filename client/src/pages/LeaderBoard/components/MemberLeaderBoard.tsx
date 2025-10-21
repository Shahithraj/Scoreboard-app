import { useEffect, useState } from "react";
import CustomTable, {
  type Column,
} from "../../../custom-components/CustomTable/CustomTable";
import { getMemberLeaderboard } from "../../../api/leaderboard";
import ScoreDetailModal from "./ScoreDetailModel";

interface MemberLeaderboardEntry {
  _id: string;
  memberName: string;
  totalPoints: number;
  teamName?: string;
}

const MemberLeaderboard = () => {
  const [data, setData] = useState<MemberLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] =
    useState<MemberLeaderboardEntry | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMemberLeaderboard();
        setData(res);
      } catch (error) {
        console.error("Failed to load member leaderboard:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleView = (member: MemberLeaderboardEntry) => {
    setSelectedMember(member);
  };

  const columns: Column<MemberLeaderboardEntry>[] = [
    { key: "rank", label: "Rank", render: (_, index) => index + 1 },
    { key: "memberName", label: "Member Name", sortable: true },
    {
      key: "teamName",
      label: "Team",
      sortable: true,
      render: (member) => member.teamName || "-",
    },
    { key: "totalPoints", label: "Points", sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (member) => (
        <button
          onClick={() => handleView(member)}
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

  if (loading) return <div>Loading member leaderboard...</div>;

  return (
    <div>
      <h3 style={{ marginBottom: "1rem" }}>🏅 Member Leaderboard</h3>

      <CustomTable<MemberLeaderboardEntry>
        data={data}
        columns={columns}
        searchPlaceholder="Search members..."
        emptyMessage="No member scores available"
        pageSize={10}
      />

      {selectedMember && (
        <ScoreDetailModal
          id={selectedMember._id}
          type="member"
          name={selectedMember.memberName}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

export default MemberLeaderboard;
