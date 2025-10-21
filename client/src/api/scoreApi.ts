import { apiRequest } from "./index";

export async function createScore(payload: {
  game: string;
  team: string;
  memberIds?: string[];
  points: number;
}) {
  return apiRequest("/scores", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
