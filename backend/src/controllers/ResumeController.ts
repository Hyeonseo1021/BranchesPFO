// src/controllers/ResumeController.ts
import { Request, Response } from "express";
import { generateResumeFromPrompt } from "../utils/Client";
import User from "../models/User";

// 이력서 생성 기능
export const generateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. 인증된 사용자 확인
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const user = await User.findById(res.locals.jwtData?.id);
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    // 2. 요청 본문 데이터 추출
    const { name, email, phone, desiredJob, address, certificates, experiences, title } = req.body;

    // 3. AI 프롬프트 생성
    const prompt = `
      당신은 대한민국 HR 전문가이자 이력서 작성 코치입니다.
      아래 사용자 정보를 기반으로 "표준 국문 이력서"를 작성하세요.

      ⚙️ 출력 형식 (JSON)
      {
        "personal": { "name": "", "birth": "", "phone": "", "email": "", "address": "" },
        "education": [ { "school": "", "major": "", "period": "", "status": "" } ],
        "experience": [ { "company": "", "position": "", "period": "", "description": "" } ],
        "certificates": [ { "name": "", "issuedBy": "", "date": "" } ],
        "skills": [ "" ],
        "projects": [ { "name": "", "role": "", "techStack": "", "description": "" } ],
        "introduction": "자기소개 및 포부 (500자 이내)"
      }

      ⚙️ 작성 조건
      - 반드시 위 JSON 구조에 맞게만 출력하세요 (그 외 문장 금지)
      - 불필요한 수식어, 존칭, 이모티콘은 사용하지 마세요
      - 간결하고 구체적으로 작성하세요
      - 모든 내용은 한국어로 작성하세요

      사용자 정보:
      이름: ${name || "미입력"}
      이메일: ${email || "미입력"}
      전화번호: ${phone || "미입력"}
      희망직무: ${desiredJob || "미입력"}
      주소: ${address?.address || "미입력"}
      자격증: ${certificates?.map((c: any) => c.name).join(", ") || "없음"}
      경력: ${experiences?.map((e: any) => `${e.company} (${e.position})`).join(", ") || "없음"}
      `;

    // 4. AI로 이력서 생성
    const resume = await generateResumeFromPrompt(prompt);

    // 5. 사용자 이력서 배열에 추가
    if (!user.resumes) {
      user.resumes = [];
    }

    user.resumes.push({
      title: title || "AI 생성 이력서",
      content: resume,
      createdAt: new Date(),
    });

    // 6. 저장
    await user.save();

    // 7. 성공 응답
    res.status(200).json({ 
      message: "이력서 생성 및 저장 완료", 
      resume 
    });

  } catch (error) {
    console.error("Resume generation error:", error);
    res.status(500).json({ 
      error: "이력서 생성 실패",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};

// 이력서 수정 기능
export const updateResume = async (req: Request, res: Response) => {
  const { userId, updatedContent, title } = req.body;
  const { resumeId } = req.params;

  try {
    const user = await User.findOne({ id: userId });
    if (!user || !user.resumes) {
      return res.status(404).json({ message: "사용자 또는 이력서 없음" });
    }

    const resume = user.resumes.find(
      (r) => r._id?.toString() === resumeId
    );

    if (!resume) {
      return res.status(404).json({ message: "해당 이력서를 찾을 수 없습니다." });
    }

    resume.content = updatedContent;
    if (title) resume.title = title;
    resume.createdAt = new Date();

    await user.save();

    return res.status(200).json({ message: "이력서 수정 완료", resume });
  } catch (err: any) {
    res.status(500).json({ message: "이력서 수정 실패", cause: err.message });
  }
};
