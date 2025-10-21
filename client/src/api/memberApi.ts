import { apiRequest } from "./index";
import type { Team } from "./teamApi";

// ✅ Member interface
export interface Member {
  _id?: string;
  name: string;
  role?: string;
  team: Team | string; // can be a full Team object (populated) or just an ID
  createdAt?: string;
  updatedAt?: string;
}

// 👇 Request payload type — always array of members
export interface CreateMemberPayload {
  members: Pick<Member, "name" | "role" | "team">[];
}

// 👇 Response type based on your controller
export interface CreateMemberResponse {
  message: string;
  created: Member[];
  skipped: number;
}

/* ──────────────────────────────────────────────
   ➕ CREATE MEMBER
────────────────────────────────────────────── */
export async function createMember(
  payload: CreateMemberPayload
): Promise<CreateMemberResponse> {
  return await apiRequest<CreateMemberResponse>("/members/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ──────────────────────────────────────────────
   📜 GET ALL MEMBERS (optionally filtered by team)
   Example: /members/get or /members/get?team=<teamId>
────────────────────────────────────────────── */
export const getMembers = (teamId?: string) => {
  const endpoint = teamId ? `/members/get?team=${teamId}` : `/members/get`;
  return apiRequest<Member[]>(endpoint);
};

/* ──────────────────────────────────────────────
   🧾 GET MEMBERS BY TEAM (explicit route)
────────────────────────────────────────────── 
export const getMembersByTeam = (teamId: string) =>
  apiRequest<Member[]>(`/teams/${teamId}/members`);
*/

/* ──────────────────────────────────────────────
   ✏️ UPDATE MEMBER
────────────────────────────────────────────── */
export const updateMember = (
  id: string,
  updates: Partial<Pick<Member, "name" | "role" | "team">>
) =>
  apiRequest<{ message: string; member: Member }>(`/members/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

/* ──────────────────────────────────────────────
   ❌ DELETE MEMBER
────────────────────────────────────────────── */
export const deleteMember = (id: string) =>
  apiRequest<{ message: string }>(`/members/delete/${id}`, {
    method: "DELETE",
  });
