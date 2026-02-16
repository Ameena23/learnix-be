import express from "express";
import { getBasicData } from "./common.controller.js";

const router = express.Router();

// Basic data endpoint
router.post("/get/basic/json", getBasicData);

export default router;