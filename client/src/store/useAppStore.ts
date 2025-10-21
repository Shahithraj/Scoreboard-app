import { create } from "zustand";
import { getTeams, createTeam, type Team } from "../api/teamApi";
import { getGames, createGame, type Game } from "../api/gameApi";
import { createMember, type Member } from "../api/memberApi";

interface AppStore {
  teams: Team[];
  games: Game[];
  members: Member[];
  loading: boolean;
  error: string | null;

  // Fetch
  fetchTeams: () => Promise<void>;
  fetchGames: () => Promise<void>;

  // Create
  addTeam: (payload: { name: string }) => Promise<void>;
  addGame: (payload: {
    games: { name: string; shortName?: string; points: number }[];
  }) => Promise<void>;
  addMembers: (payload: {
    members: { name: string; role?: string; team: string }[];
  }) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  teams: [],
  games: [],
  members: [],
  loading: false,
  error: null,

  /* ───────────────────────────────
     📦 Fetch Teams
  ─────────────────────────────── */
  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTeams();
      set({ teams: data });
    } catch (err) {
      console.error("[AppStore] Failed to fetch teams:", err);
      set({ error: "Failed to fetch teams" });
    } finally {
      set({ loading: false });
    }
  },

  /* ───────────────────────────────
     📦 Fetch Games
  ─────────────────────────────── */
  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getGames();
      set({ games: data });
    } catch (err) {
      console.error("[AppStore] Failed to fetch games:", err);
      set({ error: "Failed to fetch games" });
    } finally {
      set({ loading: false });
    }
  },

  /* ───────────────────────────────
     ➕ Add Team
  ─────────────────────────────── */
  addTeam: async (payload) => {
    try {
      const response = await createTeam(payload);
      const newTeam = "team" in response ? response.team : response;
      set({ teams: [...get().teams, newTeam] });
    } catch (err) {
      console.error("[AppStore] Failed to create team:", err);
    }
  },

  /* ───────────────────────────────
     ➕ Add Game (create multiple)
     → API returns: Game[]
  ─────────────────────────────── */
  addGame: async (payload) => {
    try {
      const createdGames = await createGame(payload); // returns Game[]
      if (Array.isArray(createdGames)) {
        set({ games: [...get().games, ...createdGames] });
      }
    } catch (err) {
      console.error("[AppStore] Failed to create games:", err);
    }
  },

  /* ───────────────────────────────
     ➕ Add Members (create multiple)
     → API returns: { message, created, skipped }
  ─────────────────────────────── */
  addMembers: async (payload) => {
    try {
      const response = await createMember(payload);
      if (Array.isArray(response.created)) {
        set({ members: [...get().members, ...response.created] });
      }
      if (response.skipped > 0) {
        console.warn(`[AppStore] ${response.skipped} member(s) were skipped.`);
      }
    } catch (err) {
      console.error("[AppStore] Failed to create members:", err);
    }
  },
}));
