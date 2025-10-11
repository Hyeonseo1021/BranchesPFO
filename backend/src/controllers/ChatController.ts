// src/controllers/ChatController.ts
import { Request, Response } from "express";
import { generateTextFromPrompt } from "../utils/Client";

export const generateChatResponse = async (req: Request, res: Response) => {
  console.log("Received chat request!");
  const { prompt } = req.body;

  if (!prompt) {
   res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await generateTextFromPrompt(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Chat generation error:", error);
    res.status(500).json({ error: "Failed to generate chat response" });
  }
};

export const generateSimpleText = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
   res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const text = await generateTextFromPrompt(prompt);
    res.status(200).json({ text }); // 프론트엔드에서 기대하는 { text: ... } 형식으로 응답
  } catch (error) {
    console.error("Text generation error:", error);
    res.status(500).json({ error: "Failed to generate text" });
  }
};