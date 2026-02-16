import express from "express";
import {
  performanceDistribution,
  subjectPassFail,
  subjectAverage,
  termComparison,
  reportSubjectAvg,
  reportTermAvg,
} from "./chart.controller.js";

import checkPermission from "../../utils/rbacMiddleware.js";

const router = express.Router();

router.get("/performance-distribution", checkPermission('dashboard', 'read'), performanceDistribution);
router.get("/subject-pass-fail", checkPermission('dashboard', 'read'), subjectPassFail);
router.get("/subject-average", checkPermission('dashboard', 'read'), subjectAverage);
router.get("/term-comparison", checkPermission('dashboard', 'read'), termComparison);
router.get("/report-subject-avg", checkPermission('dashboard', 'read'), reportSubjectAvg);
router.get("/report-term-avg", checkPermission('dashboard', 'read'), reportTermAvg);

export default router;
