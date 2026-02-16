import express from "express";
import { getStudents } from "./basicStudent.controller.js";

const router = express.Router();

router.get("/", getStudents);

export default router;
