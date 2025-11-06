// src/routes/ResumeRoutes.ts
import express, { Router, RequestHandler } from "express";
import { 
  generateResume,
  getResume,
  getMyResumes,
  updateResume,
  deleteResume
} from "../controllers/ResumeController";
import verifyToken from '../middleware/verifyToken';

const ResumeRoutes = express.Router();

// ✅ 모든 라우트에 인증 미들웨어 적용
ResumeRoutes.use(verifyToken);

// ✅ 이력서 생성
ResumeRoutes.post("/generate", generateResume);

// ✅ 내 이력서 목록 조회 (먼저 선언해야 /:resumeId와 충돌 방지)
ResumeRoutes.get("/my-resumes", getMyResumes);

// ✅ 특정 이력서 조회
ResumeRoutes.get("/:resumeId", getResume);

// ✅ 이력서 수정
ResumeRoutes.put("/:resumeId", updateResume);

// ✅ 이력서 삭제
ResumeRoutes.delete("/:resumeId", deleteResume);

export default ResumeRoutes;