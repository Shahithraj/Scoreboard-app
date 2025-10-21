import { apiRequest } from "./index";

// Used when sending to backend (createGame)
export interface GamePayload {
  name: string;
  shortName?: string;
  points: number;
}

// Used when receiving from backend
export interface Game extends GamePayload {
  _id: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Create multiple games
export async function createGame(payload: { games: GamePayload[] }) {
  return apiRequest<Game[]>("/games/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ✅ Fetch all games
export async function getGames(): Promise<Game[]> {
  return apiRequest<Game[]>("/games/get", {
    method: "GET",
  });
}
