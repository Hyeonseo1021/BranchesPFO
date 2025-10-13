
import express, { Router, RequestHandler } from "express";
import { generateResume, updateResume } from "../controllers/ResumeController";
import verifyToken from '../middleware/verifyToken';
const router = express.Router();

// 이력서 생성
router.post("/generate", verifyToken, generateResume as RequestHandler);

// 이력서 수정
router.put("/update/:resumeId", verifyToken, updateResume as RequestHandler);

export default router;
