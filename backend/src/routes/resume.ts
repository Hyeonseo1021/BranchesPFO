import express, { Router } from "express";
import { generateResume, updateResume } from "../controllers/Resumecontroller";
const router: Router = express.Router();

// 이력서 생성
router.post("/generate", generateResume);

// 이력서 수정
router.put("/update/:resumeId", updateResume);

export default router;
