import { Router } from "express";
import * as ctrl from "../controllers/game.controller";

const router = Router();

router.post("/create", ctrl.createGame);
router.get("/get", ctrl.listGames);
router.put("/update/:id", ctrl.updateGame);
router.delete("/delete/:id", ctrl.deleteGame);

export default router;
