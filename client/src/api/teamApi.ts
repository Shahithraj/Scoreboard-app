import { apiRequest } from "./index";

export interface Team {
  _id?: string;
  name: string;
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ➕ Create team
export const createTeam = (team: Pick<Team, "name">) =>
  apiRequest<{ message: string; team: Team }>("/teams/create", {
    method: "POST",
    body: JSON.stringify(team),
  });

// 📜 Get all teams
export const getTeams = () => apiRequest<Team[]>("/teams/get");

// 🧾 Get single team by ID
export const getTeamById = (id: string) => apiRequest<Team>(`/teams/get/${id}`);

// 🗑️ Delete team
export const deleteTeam = (id: string) =>
  apiRequest<{ message: string }>(`/teams/delete/${id}`, {
    method: "DELETE",
  });

export async function updateTeam(id: string, payload: { name: string }) {
  const res = await fetch(`/teams/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update team");
  return res.json();
}
