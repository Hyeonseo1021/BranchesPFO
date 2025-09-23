// src/routes/ChatRoutes.ts
import { Router } from "express";
import { generateChatResponse } from "../controllers/ChatController";

const router = Router();

router.post("/chat", generateChatResponse);

export default router;
