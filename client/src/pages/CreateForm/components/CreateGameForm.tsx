import { useState } from "react";
import CustomForm, {
  type FormField,
} from "../../../custom-components/CustomForm/CustomForm";
import CustomButton from "../../../custom-components/CustomButton/CustomButton";
import { useAppStore } from "../../../store/useAppStore";

const CreateGameForm = () => {
  const [games, setGames] = useState([{ name: "", points: "", nickName: "" }]);
  const { addGame } = useAppStore();

  // ➤ Add new game row
  const addGameRow = () => {
    setGames((prev) => [...prev, { name: "", points: "", nickName: "" }]);
  };

  // ➤ Remove a game row
  const removeGameRow = (index: number) => {
    setGames((prev) => prev.filter((_, i) => i !== index));
  };

  // ➤ Handle input change for each game
  const handleGameChange = (
    index: number,
    field: keyof (typeof games)[0],
    value: string
  ) => {
    setGames((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // ➤ Submit games to backend via Zustand store
  const handleSubmit = async () => {
    try {
      const validGames = games.filter(
        (g) => g.name.trim() && g.points.trim() && !isNaN(Number(g.points))
      );

      if (validGames.length === 0) {
        alert("⚠️ Please fill in all required fields (Name and Points).");
        return;
      }

      const payload = {
        games: validGames.map((g) => ({
          name: g.name.trim(),
          shortName: g.nickName.trim(),
          points: Number(g.points),
        })),
      };

      await addGame(payload);
      alert(`✅ Successfully added ${payload.games.length} game(s)`);

      // Reset form
      setGames([{ name: "", points: "", nickName: "" }]);
    } catch (err: unknown) {
      if (err instanceof Error) alert(`❌ ${err.message}`);
      else alert("⚠️ Failed to create games");
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: "1rem" }}>Create Multiple Games</h3>

      {games.map((game, index) => {
        const fields: FormField[] = [
          {
            type: "input",
            name: `name_${index}`,
            label: "Game Name",
            placeholder: "Enter Game name",
            required: true,
            value: game.name,
            onChange: (val) => handleGameChange(index, "name", val as string),
          },
          {
            type: "input",
            name: `points_${index}`,
            label: "Points",
            placeholder: "Enter points (numeric)",
            required: true,
            value: game.points,
            onChange: (val) => handleGameChange(index, "points", val as string),
          },
          {
            type: "input",
            name: `nickname_${index}`,
            label: "Nick Name",
            placeholder: "Enter short name (optional)",
            value: game.nickName,
            onChange: (val) =>
              handleGameChange(index, "nickName", val as string),
          },
        ];

        return (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <CustomForm fields={fields} />
            {games.length > 1 && index === games.length - 1 && (
              <CustomButton
                label="Remove Game"
                variant="warning"
                onClick={() => removeGameRow(index)}
              />
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: "1rem" }}>
        <CustomButton label="+ Add Another Game" onClick={addGameRow} />
        <CustomButton
          label="Submit All Games"
          variant="primary"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateGameForm;
