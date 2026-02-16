import express from "express";
import {
  generateReportCardPDF,
  getReportCardDataJSON, getBatchesForClass, getClassesForReport, getStudentsByClassBatch, saveTermRemarkController
} from "./reports.controller.js";

import checkPermission from "../../utils/rbacMiddleware.js";

const router = express.Router();

router.get("/classes", getClassesForReport);
router.get("/classes/:classNumber/batches", getBatchesForClass);
router.get("/students-by-class-batch", getStudentsByClassBatch);

// Report card PDF generation
router.get("/report-card/pdf", checkPermission('reports', 'read'), generateReportCardPDF);

// Report card data (JSON)
router.get("/report-card/data", checkPermission('reports', 'read'), getReportCardDataJSON);
router.post("/term-remark", checkPermission('reports', 'update'), saveTermRemarkController);


export default router;