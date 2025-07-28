// src/routes/resume.ts
import express from "express";
import { generateResume } from "../controllers/ResumeController";

const router = express.Router();

router.post("/generate", generateResume);

export default router;
