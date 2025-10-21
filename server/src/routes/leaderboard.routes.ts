import express from "express";
import {
  getTeamLeaderboard,
  getMemberLeaderboard,
  getTeamScoresByGame,
  getMemberScoresByGame,
} from "../controllers/leaderboard.controller";

const router = express.Router();

router.get("/teams", getTeamLeaderboard);
router.get("/members", getMemberLeaderboard);
router.get("/team/:teamId/details", getTeamScoresByGame);
router.get("/member/:memberId/details", getMemberScoresByGame);

export default router;
