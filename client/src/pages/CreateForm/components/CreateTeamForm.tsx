import { useState } from "react";
import CustomForm, {
  type FormField,
} from "../../../custom-components/CustomForm/CustomForm";
import { useAppStore } from "../../../store/useAppStore";

const CreateTeamForm = () => {
  const [teamName, setTeamName] = useState("");
  const { addTeam } = useAppStore();

  const fields: FormField[] = [
    {
      type: "input",
      name: "name",
      label: "Team Name",
      placeholder: "Enter Team name",
      required: true,
      value: teamName,
      onChange: (val) => setTeamName(val as string),
    },
  ];

  const handleSubmit = async (data: Record<string, string | string[]>) => {
    const name = Array.isArray(data.name) ? data.name[0] : data.name; // 🧠 safely handle both
    if (!name.trim()) return alert("Enter a valid team name");

    await addTeam({ name });
    alert("✅ Team created successfully!");
    setTeamName("");
  };

  return (
    <CustomForm
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Create Team"
      isShowBtn={true}
    />
  );
};

export default CreateTeamForm;
