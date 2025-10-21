import { apiRequest } from "./index";

// 🧩 Types
export interface TeamLeaderboardResponse {
  _id: string;
  teamName: string;
  totalPoints: number;
}

export interface MemberLeaderboardResponse {
  _id: string;
  memberName: string;
  teamName?: string;
  totalPoints: number;
}

export interface GameScoreDetail {
  gameId: string;
  gameName: string;
  points: number;
}

// 🏆 TEAM LEADERBOARD
export const getTeamLeaderboard = () =>
  apiRequest<TeamLeaderboardResponse[]>("/leaderboard/teams");

// 🏅 MEMBER LEADERBOARD
export const getMemberLeaderboard = () =>
  apiRequest<MemberLeaderboardResponse[]>("/leaderboard/members");

// 🎯 TEAM DETAILS (Game-wise)
export const getTeamDetails = (teamId: string) =>
  apiRequest<GameScoreDetail[]>(`/leaderboard/team/${teamId}/details`);

// 🎯 MEMBER DETAILS (Game-wise)
export const getMemberDetails = (memberId: string) =>
  apiRequest<GameScoreDetail[]>(`/leaderboard/member/${memberId}/details`);
