// src/utils/Client.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Claude API를 사용한 이력서 생성
export const generateResumeFromPrompt = async (prompt: string): Promise<any> => {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Claude의 응답에서 텍스트 추출
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // JSON 파싱
    // Claude가 ```json ``` 로 감싸서 반환할 수 있으므로 제거
    let cleanedText = responseText.trim();
    
    // 마크다운 코드 블록 제거
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const parsedResult = JSON.parse(cleanedText.trim());
    return parsedResult;

  } catch (error) {
    console.error("Claude API 호출 오류:", error);
    throw new Error(error instanceof Error ? error.message : "AI 이력서 생성 실패");
  }
};

/**
 * Claude API를 사용한 텍스트 생성 (채팅용)
 * @param prompt 사용자 입력 프롬프트
 * @returns 생성된 텍스트
 */
export async function generateTextFromPrompt(prompt: string): Promise<string> {
  try {
    const systemPrompt = `
당신은 이력서 작성 전문가입니다. 다음과 같은 조건을 반드시 지켜주세요:
1. 답변은 매우 간결하고 명확하게 답변해 주세요.
2. 문장은 짧고 핵심 위주로 작성해 주세요.
3. 불필요한 수식어는 사용하지 마세요.(특수문자 포함 예) !@#$%^&*() 등)
4. 이력서 작성에 도움이 되는 정보만 제공해 주세요.
5. 절대 이력서 정보 이외의 내용은 포함하지 마세요.
6. 당신의 답변은 모두 한국어로 작성해 주세요. 필요하다면 영어도 사용이 가능합니다.
7. 당신의 이름은 PFO AI 도우미입니다.
8. 답변에 공손하게 대답하십시오.
9. 질문에 대한 대답을 할 때 한번 더 생각하고 답변해 주세요.
    `.trim();

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      temperature: 0.7,
      system: systemPrompt, // 시스템 프롬프트 분리
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // 텍스트 응답 추출
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    return responseText;

  } catch (error: any) {
    console.error("Claude API Error:", error.message);
    if (error.response) {
      console.error("Claude API Error Response Data:", error.response);
    }
    throw error;
  }
}