import express from "express";
import {
  createScore,
  getScores,
  deleteScore,
} from "../controllers/score.controller";

const router = express.Router();

router.post("/", createScore);
router.get("/", getScores);
router.delete("/:id", deleteScore);

export default router;
