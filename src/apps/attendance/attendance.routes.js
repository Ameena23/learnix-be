import express from "express";
import {
  getAttendanceByDate,
  saveAttendance,
  updateAttendance,
  deleteAttendance,
} from "./attendance.controller.js";



import checkPermission from "../../utils/rbacMiddleware.js";

const router = express.Router();

router.get("/by-date", checkPermission('attendance', 'read'), getAttendanceByDate);
router.post("/save", checkPermission('attendance', 'create'), saveAttendance);
router.put("/update/:sessionId", checkPermission('attendance', 'update'), updateAttendance);
router.delete("/delete/:sessionId", checkPermission('attendance', 'delete'), deleteAttendance);

export default router;
