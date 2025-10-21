import { useEffect, useState } from "react";
import CustomForm, {
  type FormField,
} from "../../../custom-components/CustomForm/CustomForm";
import CustomButton from "../../../custom-components/CustomButton/CustomButton";
import { useAppStore } from "../../../store/useAppStore";

const role = [
  { id: 1, label: "Captain", value: "captain" },
  { id: 2, label: "Vice Captain", value: "vice-captain" },
  { id: 3, label: "Player", value: "player" },
];

const CreateMemberForm = () => {
  const { teams, fetchTeams, addMembers } = useAppStore();
  const [members, setMembers] = useState([
    { name: "", role: "player", team: "" },
  ]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const addMemberRow = () =>
    setMembers((prev) => [...prev, { name: "", role: "player", team: "" }]);
  const removeMemberRow = (index: number) =>
    setMembers((prev) => prev.filter((_, i) => i !== index));

  const handleMemberChange = (
    index: number,
    field: keyof (typeof members)[0],
    value: string
  ) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    const validMembers = members.filter((m) => m.name.trim() && m.team);
    if (validMembers.length === 0) {
      alert("⚠️ Please fill in all required fields (Name and Team).");
      return;
    }

    await addMembers({ members: validMembers });
    alert(`✅ Successfully added ${validMembers.length} member(s)`);

    // Reset form
    setMembers([{ name: "", role: "player", team: "" }]);
  };

  return (
    <div>
      <h3 style={{ marginBottom: "1rem" }}>Create Multiple Members</h3>

      {members.map((member, index) => {
        const fields: FormField[] = [
          {
            type: "input",
            name: `name_${index}`,
            label: "Member Name",
            placeholder: "Enter member name",
            required: true,
            value: member.name,
            onChange: (val) => handleMemberChange(index, "name", val as string),
          },
          {
            type: "dropdown",
            name: `role_${index}`,
            label: "Role",
            options: role,
            value: member.role,
            onChange: (val) => handleMemberChange(index, "role", val as string),
          },
          {
            type: "dropdown",
            name: `team_${index}`,
            label: "Select Team",
            options: teams.map((t) => ({ label: t.name, value: t._id! })),
            required: true,
            value: member.team,
            onChange: (val) => handleMemberChange(index, "team", val as string),
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
            {members.length > 1 && index === members.length - 1 && (
              <CustomButton
                label="Remove Member"
                variant="warning"
                onClick={() => removeMemberRow(index)}
              />
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: "1rem" }}>
        <CustomButton label="+ Add Another Member" onClick={addMemberRow} />
        <CustomButton
          label="Submit All Members"
          variant="primary"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateMemberForm;
