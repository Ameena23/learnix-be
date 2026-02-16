import express from "express";
import {
  topStudentsOverall,
  topStudentsSubject,
  leaderboard,
} from "./table.controller.js";

const router = express.Router();

router.get("/top-students-overall", topStudentsOverall);
router.get("/top-students-subject", topStudentsSubject);
router.get("/leaderboard", leaderboard);

export default router;
