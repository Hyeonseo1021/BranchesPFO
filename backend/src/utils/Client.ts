import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Gemini API의 정확한 URL 설정
const GEMINI_API_URL ="";

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

    // 옵셔널 체이닝으로 응답을 안전하게 추출
    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // 정상 응답이 없을 경우 기본 메시지 반환
    return result || "이력서를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}