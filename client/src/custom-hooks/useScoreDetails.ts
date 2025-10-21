import { useEffect, useState } from "react";
import { getMemberDetails, getTeamDetails } from "../api/leaderboard";

interface GameScore {
  gameName: string;
  points: number;
}

export function useScoreDetails(id: string | null, type: "team" | "member") {
  const [data, setData] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const response =
          type === "team"
            ? await getTeamDetails(id)
            : await getMemberDetails(id);
        setData(response);
      } catch (error) {
        console.error(`Failed to load ${type} details:`, error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, type]);

  return { data, loading };
}
