import express from "express";
import authRoutes from "../apps/auth/auth.routes.js";
import attendanceRoutes from "../apps/attendance/attendance.routes.js";
import studentRoutes from "../apps/students/student.routes.js";
import basicStudentRoutes from "../apps/students/basicStudent.routes.js";
import usersRoutes from "../apps/users/users.routes.js";
import chartRoutes from "../apps/charts/chart.routes.js";
import filterRoutes from "../apps/filters/filter.routes.js";
import tableRoutes from "../apps/tables/table.routes.js";
import importRoutes from "../apps/imports/import.routes.js";
import commonRoutes from "../apps/common/common.routes.js";
import reportRoutes from "../apps/reports/reports.routes.js";
import teacherRoutes from "../apps/teachers/teacher.routes.js";
import rbacRoutes from "../apps/rbac/rbac.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/students", studentRoutes);
router.use("/basic-students", basicStudentRoutes);
router.use("/users", usersRoutes);
router.use("/charts", chartRoutes);
router.use("/filters", filterRoutes);
router.use("/table", tableRoutes);
router.use("/import-csv", importRoutes);
router.use("/common", commonRoutes);
router.use("/reports", reportRoutes);
router.use("/teachers", teacherRoutes);
router.use("/rbac", rbacRoutes);

export default router;
