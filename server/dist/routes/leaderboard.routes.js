"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboard_controller_js_1 = require("../controllers/leaderboard.controller.js");
const router = express_1.default.Router();
router.get("/teams", leaderboard_controller_js_1.getTeamLeaderboard);
router.get("/members", leaderboard_controller_js_1.getMemberLeaderboard);
router.get("/team/:teamId/details", leaderboard_controller_js_1.getTeamScoresByGame);
router.get("/member/:memberId/details", leaderboard_controller_js_1.getMemberScoresByGame);
exports.default = router;
