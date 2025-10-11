// src/controllers/ResumeController.ts
import { Request, Response } from "express";
import { generateResumeFromPrompt } from "../utils/Client";
import User from "../models/User";

// 이력서 생성 기능
export const generateResume = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }
  const { userId, name, email, phone, desiredJob, address, certificates, experiences, title } = req.body;
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
  이름: ${name}
  이메일: ${email}
  전화번호: ${phone || "미입력"}
  희망직무: ${desiredJob || "미입력"}
  주소: ${address?.address || "미입력"}
  자격증: ${certificates?.map(c => c.name).join(", ")}
  경력: ${experiences?.map(e => `${e.company} (${e.position})`).join(", ")}
  `;


  try {
    const resume = await generateResumeFromPrompt(prompt);

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
    }

    user.resumes?.push({
      title: title || "AI 생성 이력서",
      content: resume,
      createdAt: new Date(),
    });

    await user.save();

    res.status(200).json({ message: "이력서 생성 및 저장 완료", resume });
  } catch (error) {
    console.error("Resume generation error:", error);
    res.status(500).json({ error: "이력서 생성 실패" });
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
