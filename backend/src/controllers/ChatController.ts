import { Request, Response } from "express";
import { generateTextFromPrompt } from "../utils/Client";

export const generateChatResponse = async (req: Request, res: Response): Promise<void> => {
  console.log("Received chat request!");
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  try {
    const response = await generateTextFromPrompt(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Chat generation error:", error);
    res.status(500).json({ error: "Failed to generate chat response" });
  }
};