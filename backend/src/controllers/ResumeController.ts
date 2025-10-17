// src/controllers/ResumeController.ts
import { Request, Response } from "express";
import { generateResumeFromPrompt } from "../utils/Client";
import User from "../models/User";
import Resume from "../models/Resume";

// Create A Resume
export const generateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }
    const user = await User.findById(res.locals.jwtData?.id);
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const { 
      name, email, phone, desiredJob, address, certificates, experiences, 
      introductionKeywords,  // ✅ introduction 대신 introductionKeywords
      skills, tools, projects, education, birth, title 
    } = req.body;

    console.log('📥 받은 education:', education);
    console.log('📥 받은 introductionKeywords:', introductionKeywords);
    console.log('📥 받은 address:', address);

    // ✅ address 처리 (객체일 경우 문자열로 변환)
    const addressStr = typeof address === 'object' ? (address?.address || '') : (address || '');

    // ✅ 키워드가 있는지 확인
    const hasKeywords = introductionKeywords && 
      (introductionKeywords.positions?.length > 0 || 
       introductionKeywords.strengths?.length > 0 || 
       introductionKeywords.interests?.length > 0 || 
       introductionKeywords.goals?.length > 0);

    // ✅ 키워드 기반 프롬프트
    const prompt = hasKeywords 
      ? `당신은 대한민국 HR 전문가이자 이력서 작성 코치입니다.

    <사용자_정보>
    이름: ${name}
    희망직무: ${desiredJob || "미입력"}

    <선택한_키워드>
    - 희망 직무: ${introductionKeywords.positions?.join(', ') || '미입력'}
    - 주요 강점: ${introductionKeywords.strengths?.join(', ') || '없음'}
    - 관심 분야: ${introductionKeywords.interests?.join(', ') || '없음'}
    - 목표/지향점: ${introductionKeywords.goals?.join(', ') || '없음'}
    </선택한_키워드>

    경력: ${experiences?.map((e: any) => `${e.company} ${e.position}`).join(", ") || "신입"}
    기술: ${skills?.join(", ") || "없음"}
    프로젝트: ${projects?.map((p: any) => p.title).join(", ") || "없음"}
    </사용자_정보>

    위 정보를 바탕으로 자기소개서를 4개 섹션으로 작성하세요.
    선택한 키워드를 자연스럽게 녹여내되, 키워드를 그대로 나열하지 말고 스토리텔링 형식으로 작성하세요.

    다음 JSON 형식으로만 응답하세요:

    {
      "coverLetter": {
        "strengths": "주요 경력과 업무 강점 (500자)",
        "growth": "성장 과정 (500자)",
        "personality": "성격의 장단점 (500자)",
        "motivation": "지원동기 및 입사포부 (500자)"
      }
    }

    각 섹션은 구체적이고 설득력 있게 한국어로 작성하세요.`
          : `당신은 대한민국 HR 전문가이자 이력서 작성 코치입니다.

    <사용자_정보>
    이름: ${name}
    희망직무: ${desiredJob || "미입력"}
    경력: ${experiences?.map((e: any) => `${e.company} ${e.position}`).join(", ") || "신입"}
    기술: ${skills?.join(", ") || "없음"}
    프로젝트: ${projects?.map((p: any) => p.title).join(", ") || "없음"}
    </사용자_정보>

    위 정보를 바탕으로 자기소개서를 4개 섹션으로 작성하세요.
    다음 JSON 형식으로만 응답하세요:

    {
      "coverLetter": {
        "strengths": "주요 경력과 업무 강점 (500자)",
        "growth": "성장 과정 (500자)",
        "personality": "성격의 장단점 (500자)",
        "motivation": "지원동기 및 입사포부 (500자)"
      }
    }

    각 섹션은 구체적이고 설득력 있게 한국어로 작성하세요.`;

    console.log('🤖 AI 호출 시작...');
    const aiResult = await generateResumeFromPrompt(prompt);
    console.log('🤖 AI 응답:', JSON.stringify(aiResult, null, 2));

    // ✅ AI는 coverLetter만, 나머지는 Profile 데이터 그대로
    const resumeDoc = await Resume.create({
      user: user._id,
      title: title || "AI 생성 이력서",
      
      // ✅ 기본 정보 - req.body에서 직접
      name: name || "",
      email: email || "",
      phone: phone || "",
      birth: birth || "",
      address: addressStr,  // ✅ 문자열로 변환된 주소
      
      // ✅ 키워드 저장
      introductionKeywords: introductionKeywords || {
        positions: [],
        strengths: [],
        interests: [],
        goals: []
      },
      
      // ✅ Profile 데이터 그대로 복사 (AI 의존 안 함)
      education: education || [],
      experiences: experiences || [],
      certificates: certificates || [],
      skills: skills || [],
      tools: tools || [],
      projects: projects || [],
      
      // ✅ AI가 생성한 자기소개서만 사용
      coverLetter: {
        strengths: aiResult.coverLetter?.strengths || '',
        growth: aiResult.coverLetter?.growth || '',
        personality: aiResult.coverLetter?.personality || '',
        motivation: aiResult.coverLetter?.motivation || ''
      }
    });

    await User.findByIdAndUpdate(user._id, { $push: { resumes: resumeDoc._id } });

    res.status(200).json({
      message: "이력서 생성 및 저장 완료",
      resumeId: resumeDoc._id,
      resume: resumeDoc,
    });
  } catch (error) {
    console.error("❌ Resume generation error:", error);
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
    
    // 프론트엔드에서 보내는 모든 이력서 필드들
    const { 
      personal,
      education,
      experience,
      certificates,
      skills,
      tools,
      projects,
      coverLetter,
      title,
      content 
    } = req.body;
    
    const updateData: any = {};
    
    // 개인정보 업데이트
    if (personal) {
      if (personal.name) updateData.name = personal.name;
      if (personal.birth) updateData.birth = personal.birth;
      if (personal.phone) updateData.phone = personal.phone;
      if (personal.email) updateData.email = personal.email;
      if (personal.address) updateData.address = personal.address;
    }
    
    // 배열 필드들 업데이트
    if (education) updateData.education = education;
    if (experience) updateData.experiences = experience;  // ⚠️ 주의: experiences로 저장
    if (certificates) updateData.certificates = certificates;
    if (skills) updateData.skills = skills;
    if (tools) updateData.tools = tools;
    if (projects) updateData.projects = projects;
    if (coverLetter) updateData.coverLetter = coverLetter;
    
    // 기존 필드들 (있다면)
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