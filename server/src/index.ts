import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import memberRoutes from "./routes/member.routes";
import teamRoutes from "./routes/team.routes";
import gameRoutes from "./routes/game.routes";
import scoreRoutes from "./routes/score.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.use("/api/teams", teamRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Startup error", err);
  process.exit(1);
});
