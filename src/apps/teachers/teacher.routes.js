import express from "express";
import {
  registerTeacher,
  teacherLogin,
  getAllTeachers,
  getTeacherById,
  addTeacherEndorsement,
  updateTeacherEndorsement,
} from "./teacher.controller.js";
 
const router = express.Router();
 
// Public routes
router.post("/register", registerTeacher);
router.post("/login", teacherLogin);
 
// Teacher routes
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
 
// Endorsement routes
router.post("/:teacher_id/endorsements", addTeacherEndorsement);
router.put("/endorsements/:endorsement_id", updateTeacherEndorsement);
 
export default router;