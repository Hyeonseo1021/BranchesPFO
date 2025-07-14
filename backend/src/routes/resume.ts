import express from "express";
import { generateResumeFromPrompt } from "../utils/geminiClient";
import User from "../models/User";

const router = express.Router();

// POST /api/resume/generate
router.post("/generate", async (req, res) => {
  const { userId, name, experience, skills, projects, jobTitle, title } = req.body;

  const prompt = `
다음 정보를 바탕으로 IT 이력서를 작성해줘:

이름: ${name}
경력: ${experience}
기술 스택: ${skills}
프로젝트: ${projects}
희망 직무: ${jobTitle}

형식은 다음과 같아야 해:
1. 이름
2. 직무 요약
3. 기술 스택
4. 프로젝트 경험
5. 경력
6. 자격증 및 수상
7. 연락처

마크다운 형식으로 작성해줘.
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
});

export default router;
