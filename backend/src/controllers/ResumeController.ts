// src/controllers/ResumeController.ts
import { Request, Response } from "express";
import { generateResumeFromPrompt } from "../utils/Client";
import User from "../models/User";
import Resume from "../models/Resume";

// Create A Resume
export const generateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1~3단계: 그대로
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }
    const user = await User.findById(res.locals.jwtData?.id);
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const { name, email, phone, desiredJob, address, certificates, experiences, title } = req.body;

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

    // 4) AI로 이력서 생성 (그대로)
    const aiResult = await generateResumeFromPrompt(prompt);

    // ✅ 5) 별도 Resume 문서 생성 (여기만 변경)
    const resumeDoc = await Resume.create({
      user: user._id,
      title: title || "AI 생성 이력서",
      content: aiResult,           // 스키마에서 content: Object 또는 String이면 그대로 OK
    });

    // ✅ 6) User.resumes에 ObjectId만 추가 (참조 방식)
    await User.findByIdAndUpdate(user._id, { $push: { resumes: resumeDoc._id } });

    // 7) 성공 응답
    res.status(200).json({
      message: "이력서 생성 및 저장 완료",
      resumeId: resumeDoc._id,
      resume: resumeDoc,
    });
  } catch (error) {
    console.error("Resume generation error:", error);
    res.status(500).json({
      error: "이력서 생성 실패",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
};

// ✅ 특정 이력서 조회
export const getResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const resume = await Resume.findById(resumeId).populate('user', 'name email');
    
    if (!resume) {
      res.status(404).json({ message: "이력서를 찾을 수 없습니다." });
      return;
    }
    
    // 본인 확인
    if (resume.user._id.toString() !== res.locals.jwtData?.id) {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }
    
    res.status(200).json({ 
      message: "이력서 조회 성공",
      resume 
    });
  } catch (error) {
    console.error("Resume fetch error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};

// ✅ 내 이력서 목록 조회
export const getMyResumes = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const userId = res.locals.jwtData?.id;
    const resumes = await Resume.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('title createdAt updatedAt content');
    
    res.status(200).json({ 
      message: "이력서 목록 조회 성공",
      count: resumes.length,
      resumes 
    });
  } catch (error) {
    console.error("Resume list fetch error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};

// ✅ 이력서 수정
export const updateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      res.status(404).json({ message: "이력서를 찾을 수 없습니다." });
      return;
    }
    
    // 본인 확인
    if (resume.user.toString() !== res.locals.jwtData?.id) {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }
    
    // 수정 가능한 필드들
    const { title, content } = req.body;
    
    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    
    const updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      updateData,
      { new: true }
    );
    
    res.status(200).json({ 
      message: "이력서 수정 완료", 
      resume: updatedResume 
    });
  } catch (error) {
    console.error("Resume update error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};

// ✅ 이력서 삭제
export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      res.status(404).json({ message: "이력서를 찾을 수 없습니다." });
      return;
    }
    
    // 본인 확인
    if (resume.user.toString() !== res.locals.jwtData?.id) {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }
    
    // Resume 문서 삭제
    await Resume.findByIdAndDelete(resumeId);
    
    // User 문서에서도 제거
    await User.findByIdAndUpdate(res.locals.jwtData?.id, {
      $pull: { resumes: resumeId }
    });
    
    res.status(200).json({ 
      message: "이력서 삭제 완료" 
    });
  } catch (error) {
    console.error("Resume delete error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};