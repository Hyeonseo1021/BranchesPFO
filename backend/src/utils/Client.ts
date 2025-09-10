// src/utils/Client.ts
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateResumeFromPrompt(prompt: string) {
/**
 * Gemini에게 prompt를 전달하고 마크다운 이력서를 생성해 반환한다.
 * @param prompt 사용자 정보 기반으로 구성된 이력서 생성 요청 텍스트
 * @returns 마크다운 형식의 이력서 문자열
 */

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function generateTextFromPrompt(prompt: string) {
  /**
   * Gemini에게 prompt를 전달하고 텍스트를 생성해 반환한다.
   * @param prompt 사용자 정보 기반으로 구성된 생성 요청 텍스트
   * @returns 마크다운 형식의 문자열
   */
  
    try {
      const systemPrompt = `당신은 이력서 작성 전문가 입니다. 다음과 같은 조건을 반드시 지켜주세요:
      1. 답변은 매우 간결하고 명확하게 답변해 주세요.
      2. 문장은 짧고 핵심 위주로 작성해 주세요.
      3. 불필요한 수식어는 사용하지 마세요.
      4. 이력서 작성에 도움이 되는 정보만 제공해 주세요.
      5. 절대 일력서 정보 이외의 내용은 포함하지 마세요.
      6. 당신의 답변은 모두 한국어로 작성해 주세요. 필요하다면 영어도 사용이 가능합니다.
      7. 당신의 이름은 FPO AI 도우미 입니다.
      8. 답변에 공손하게 대답하십시오.
    `;
      const finalPrompt = systemPrompt + "\n\n" + prompt;

      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error: any) {
      console.error("Gemini API Error:", error.message);
      if (error.response) {
        console.error("Gemini API Error Response Data:", error.response.data);
      }
      throw error;
    }
  }