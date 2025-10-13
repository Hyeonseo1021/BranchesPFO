// src/routes/ChatRoutes.ts
import { Router } from "express";
import { generateChatResponse, generateSimpleText } from "../controllers/ChatController";
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/", verifyToken, generateChatResponse);
router.post("/generate-text", verifyToken, generateSimpleText);

export default router;
