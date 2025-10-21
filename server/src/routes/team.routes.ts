import { Router } from "express";
import * as ctrl from "../controllers/team.controller";

const router = Router();

router.post("/create", ctrl.createTeam);
router.get("/get", ctrl.listTeams);
router.get("/get/:id", ctrl.getTeam);
router.put("/update/:id", ctrl.updateTeam);
router.delete("/delete/:id", ctrl.deleteTeam);
router.get("/:id/members", ctrl.getTeamMembers);

export default router;
