import { Router } from "express";
import * as ctrl from "../controllers/member.controller";

const router = Router();

// ➕ Create a new member
router.post("/create", ctrl.createMember);

// 📋 Get all members or filter by team
router.get("/get", ctrl.listMembers);

// ✏️ Update member details (like name, role, or team)
router.put("/update/:id", ctrl.updateMember);

// ❌ Delete a member
router.delete("/delete/:id", ctrl.deleteMember);

export default router;
