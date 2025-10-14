
import express, { Router, RequestHandler } from "express";
import { generateResume } from "../controllers/ResumeController";
import verifyToken from '../middleware/verifyToken';
const ResumeRoutes = express.Router();

// 이력서 생성
ResumeRoutes.post("/generate", verifyToken, generateResume);



export default ResumeRoutes;
