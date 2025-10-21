import React, { useEffect, useState } from "react";
import Select from "react-select";
import CustomForm, {
  type FormField,
} from "../../custom-components/CustomForm/CustomForm";
import CustomButton from "../../custom-components/CustomButton/CustomButton";
import { getMembers, type Member } from "../../api/memberApi";
import { createScore } from "../../api/scoreApi";
import { getGames, type Game } from "../../api/gameApi";
import { getTeams, type Team } from "../../api/teamApi";

interface Option {
  label: string;
  value: string;
}

const AddScoreForm: React.FC = () => {
  const [games, setGames] = useState<Option[]>([]);
  const [teams, setTeams] = useState<Option[]>([]);
  const [members, setMembers] = useState<Option[]>([]);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [points, setPoints] = useState<string>("");

  // 🧠 Load Games & Teams
  useEffect(() => {
    (async () => {
      try {
        const gameList: Game[] = await getGames();
        setGames(gameList.map((g) => ({ label: g.name, value: g._id })));

        const teamList: Team[] = await getTeams();
        setTeams(teamList.map((t) => ({ label: t.name, value: t._id! })));
      } catch (err) {
        console.error("Error fetching games or teams:", err);
      }
    })();
  }, []);

  // 🧠 Load Members based on Team
  useEffect(() => {
    if (!selectedTeam) return;
    (async () => {
      try {
        const memberList: Member[] = await getMembers(selectedTeam);
        setMembers(memberList.map((m) => ({ label: m.name, value: m._id! })));
      } catch (err) {
        console.error("Failed to load members:", err);
      }
    })();
  }, [selectedTeam]);

  // 🧠 Auto-fill points based on Game
  useEffect(() => {
    if (!selectedGame) return;
    (async () => {
      try {
        const gameList: Game[] = await getGames();
        const game = gameList.find((g) => g._id === selectedGame);
        if (game) setPoints(String(game.points || ""));
      } catch {
        // silent ignore
      }
    })();
  }, [selectedGame]);

  const handleSubmit = async () => {
    if (!selectedGame || !selectedTeam) {
      alert("Please select both a game and a team");
      return;
    }

    try {
      const payload = {
        game: selectedGame,
        team: selectedTeam,
        memberIds: selectedMembers,
        points: Number(points) || 0,
      };

      await createScore(payload);
      alert("✅ Score added successfully!");

      setSelectedGame("");
      setSelectedTeam("");
      setSelectedMembers([]);
      setPoints("");
    } catch (err) {
      if (err instanceof Error) alert(err.message);
      else alert("⚠️ Failed to add score");
    }
  };

  // 🎨 Form Fields except Members (handled separately with React Select)
  const formFields: FormField[] = [
    {
      type: "dropdown",
      name: "game",
      label: "Select Game",
      options: games, // ✅ removed the "Other" option here
      required: true,
      value: selectedGame,
      onChange: (value) => setSelectedGame(value as string),
    },
    {
      type: "dropdown",
      name: "team",
      label: "Select Team",
      options: teams,
      required: true,
      value: selectedTeam,
      onChange: (value) => setSelectedTeam(value as string),
    },
    {
      type: "input",
      name: "points",
      label: "Points",
      placeholder: "Auto-filled from Game",
      required: false,
      value: points,
      onChange: (value) => setPoints(value as string),
    },
  ];

  return (
    <div>
      <h3 style={{ marginBottom: "1rem" }}>Add Team / Member Scores</h3>
      <CustomForm fields={formFields} />

      {/* ✅ React Select Multi-Select for Members */}
      <div style={{ marginTop: "1rem" }}>
        <label
          style={{
            display: "block",
            fontWeight: 500,
            marginBottom: "0.5rem",
            color: "#374151",
          }}
        >
          Select Members
        </label>
        <Select
          isMulti
          options={members}
          value={members.filter((m) => selectedMembers.includes(m.value))}
          onChange={(selected) =>
            setSelectedMembers(selected.map((s) => s.value))
          }
          placeholder="Choose members..."
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "#d1d5db",
              boxShadow: "none",
              "&:hover": { borderColor: "#9ca3af" },
            }),
          }}
        />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <CustomButton
          label="Add Score"
          variant="primary"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddScoreForm;
