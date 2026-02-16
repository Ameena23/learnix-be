import express from "express";
import { batches, classes } from "./filter.controller.js";

const router = express.Router();

router.get("/batches", batches);
router.get("/classes", classes);

export default router;
