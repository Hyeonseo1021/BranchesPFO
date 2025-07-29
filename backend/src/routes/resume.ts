import express from "express";
import { generateResume, updateResume } from "../controllers/ResumeController";
const router = express.Router();

// 이력서 생성
router.post("/generate", generateResume);

// 이력서 수정
router.put("/update/:resumeId", updateResume);

export default router;
