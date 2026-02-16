import express from "express";
import {
  loadFilters,
  divisions,
  students,
  years,
  report,
  leaderboard,
  saveExamMarks,
  getExamMarkEntries,
  getMarksByEntry,
  getExamEntry,
  updateExamMarks,
  addStudent,
} from "./student.controller.js";


import checkPermission from "../../utils/rbacMiddleware.js";

const router = express.Router();

/* FILTERS */
router.get("/filters", loadFilters);

/* DIVISIONS */
router.get("/divisions", divisions);

/* STUDENTS */
router.get("/students", students);

/* YEARS */
router.get("/years", years);

/* REPORT */
router.get("/reports", checkPermission('reports', 'read'), report);

/* LEADERBOARD */
router.get("/leaderboard", leaderboard);

/* ✅ EXAM MARK ENTRY */
router.post("/exams/marks", checkPermission('student_mark_entry', 'create'), saveExamMarks);
router.put("/exams/marks", checkPermission('exam_mark_view_edit', 'update'), updateExamMarks);


router.get("/exams/entries", checkPermission('exam_mark_view_edit', 'read'), getExamMarkEntries);
router.get("/exams/marks/:entryId", checkPermission('exam_mark_view_edit', 'read'), getMarksByEntry);
router.get("/exams/entries/:entryId", checkPermission('exam_mark_view_edit', 'read'), getExamEntry);

router.post("/", checkPermission('user_management', 'create'), addStudent);



export default router;

