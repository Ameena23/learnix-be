import express from "express";
import { importCSV } from "./import.controller.js";

const router = express.Router();

router.post("/", importCSV);

export default router;
