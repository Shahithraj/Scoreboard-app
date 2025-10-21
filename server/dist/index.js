"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const member_routes_1 = __importDefault(require("./routes/member.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const game_routes_1 = __importDefault(require("./routes/game.routes"));
const score_routes_1 = __importDefault(require("./routes/score.routes"));
const leaderboard_routes_1 = __importDefault(require("./routes/leaderboard.routes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Server is running successfully");
});
app.use("/api/teams", team_routes_1.default);
app.use("/api/members", member_routes_1.default);
app.use("/api/games", game_routes_1.default);
app.use("/api/scores", score_routes_1.default);
app.use("/api/leaderboard", leaderboard_routes_1.default);
async function start() {
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
}
start().catch((err) => {
    console.error("Startup error", err);
    process.exit(1);
});
