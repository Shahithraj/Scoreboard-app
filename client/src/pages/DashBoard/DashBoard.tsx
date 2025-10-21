import React, { useEffect, useState } from "react";
import { getTeamLeaderboard } from "../../api/leaderboard";
import { Users } from "lucide-react";
import styles from "./DashBoard.module.css";
import Widget from "../../components/Widgets/Widget";

interface TeamLeaderboardEntry {
  teamName: string;
  totalPoints: number;
}

const DashBoard: React.FC = () => {
  const [teams, setTeams] = useState<TeamLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTeamLeaderboard();
        setTeams(data);
      } catch (err) {
        console.error("Failed to fetch team leaderboard:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading Dashboard...</div>;

  if (teams.length === 0)
    return <div style={{ textAlign: "center" }}>No teams available.</div>;

  // 🎨 Optional: assign different colors dynamically
  const colors = ["#2563eb", "#eab308", "#10b981", "#f97316", "#8b5cf6"];

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.heading}>🏆 Team Scoreboard</h2>

      <div className={styles.widgetGrid}>
        {teams.map((team, index) => (
          <Widget
            key={team.teamName}
            title={team.teamName}
            value={team.totalPoints}
            icon={<Users size={24} color="#fff" />}
            color={colors[index % colors.length]}
          />
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
