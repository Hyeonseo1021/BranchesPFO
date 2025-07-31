// src/utils/Client.ts
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_URL = process.env.GEMINI_API_URL || "";

export async function generateResumeFromPrompt(prompt: string) {
/**
 * Gemini에게 prompt를 전달하고 마크다운 이력서를 생성해 반환한다.
 * @param prompt 사용자 정보 기반으로 구성된 이력서 생성 요청 텍스트
 * @returns 마크다운 형식의 이력서 문자열
 */

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}