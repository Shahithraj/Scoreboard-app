"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const score_controller_js_1 = require("../controllers/score.controller.js");
const router = express_1.default.Router();
router.post("/", score_controller_js_1.createScore);
router.get("/", score_controller_js_1.getScores);
router.delete("/:id", score_controller_js_1.deleteScore);
exports.default = router;
