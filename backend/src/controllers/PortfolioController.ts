// src/controllers/PortfolioController.ts
import { Request, Response } from "express";
import { generatePortfolioWithClaude } from "../utils/Client";
import User from "../models/User";
import Portfolio from "../models/Portfolio";

// 포트폴리오 생성
export const generatePortfolio = async (req: Request, res: Response): Promise<void> => {
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
      title,
      name,
      email,
      phone,
      introductionKeywords,
      projects,
      skills,
      tools,
      experiences,
      education,
      certificates
    } = req.body;

    console.log('🔥 받은 프로젝트:', projects);
    console.log('🔥 받은 introductionKeywords:', introductionKeywords);

    // ✅ 프로젝트가 있는지 확인
    const hasProjects = projects && projects.length > 0;

    // ✅ Claude 프롬프트 작성 (프로젝트 중심)
    const prompt = `당신은 세계적인 웹 디자이너이자 프론트엔드 개발자입니다.
다음 정보를 바탕으로 **현대적이고 시각적으로 매력적인 HTML 포트폴리오 웹페이지**를 생성해주세요.

<사용자_정보>
이름: ${name}
이메일: ${email}
전화: ${phone}

<희망_포지션>
${introductionKeywords?.positions?.join(', ') || '정보 없음'}

<강점>
${introductionKeywords?.strengths?.join(', ') || '정보 없음'}

<관심_분야>
${introductionKeywords?.interests?.join(', ') || '정보 없음'}

<목표>
${introductionKeywords?.goals?.join(', ') || '정보 없음'}

<프로젝트_경험>
${hasProjects ? projects.map((p: any, idx: number) => `
${idx + 1}. ${p.title}
   - 설명: ${p.description}
   - 역할: ${p.role}
   - 기술스택: ${p.techStack?.join(', ')}
   - 기간: ${p.period}
   - 링크: ${p.link || '없음'}
`).join('\n') : '프로젝트 정보 없음'}
</프로젝트_경험>

<기술_스택>
${skills?.join(', ') || '정보 없음'}
</기술_스택>

<활용_툴>
${tools?.join(', ') || '정보 없음'}
</활용_툴>

${experiences && experiences.length > 0 ? `
<경력>
${experiences.map((e: any, idx: number) => `
${idx + 1}. ${e.company} - ${e.position}
   - 기간: ${e.period}
   - 설명: ${e.description}
`).join('\n')}
</경력>
` : ''}

${education && education.length > 0 ? `
<학력>
${education.map((e: any, idx: number) => `
${idx + 1}. ${e.school} ${e.major ? `- ${e.major}` : ''}
   - ${e.degree || ''} (${e.period})
`).join('\n')}
</학력>
` : ''}

${certificates && certificates.length > 0 ? `
<자격증>
${certificates.map((c: any) => `- ${c.name} (${c.issuedBy}, ${c.date})`).join('\n')}
</자격증>
` : ''}
</사용자_정보>

---

# 요구사항

1. **완전한 HTML 문서** 생성 (<!DOCTYPE html>부터 시작)
2. **반응형 디자인** - 모바일/태블릿/데스크톱 완벽 대응
3. **현대적인 디자인**:
   - 세련된 색상 팔레트 (예: 그라데이션, 다크모드, 미니멀)
   - 적절한 여백과 타이포그래피
   - 부드러운 그림자와 호버 효과
4. **섹션 구성**:
   - Hero Section: 이름, 포지션, 간단한 소개
   - About Me: 강점과 목표를 자연스럽게 풀어서 작성
   - Projects: 카드 형식으로 각 프로젝트 전시 (이미지 플레이스홀더 포함)
   - Skills & Tools: 시각적인 태그 또는 아이콘 형태
   - Contact: 이메일, 전화번호 등
5. **프로젝트 카드**:
   - 제목, 설명, 기술스택 표시
   - 링크가 있으면 버튼 추가
   - 호버 시 부드러운 애니메이션
6. **애니메이션**: 스크롤 시 fade-in 효과
7. **스타일**: 모든 CSS는 <style> 태그 내부에 작성 (외부 라이브러리 사용 금지)
8. **한국어로 작성**: 모든 텍스트는 한국어로

**매우 세련되고 프로페셔널한 포트폴리오 HTML을 생성해주세요. 코드만 출력하고 설명은 생략하세요.**`;

    console.log('🤖 Claude API 호출 시작...');
    const generatedHTML = await generatePortfolioWithClaude(prompt);
    console.log('🤖 Claude 응답 완료');

    // ✅ 포트폴리오 저장
    const portfolioDoc = await Portfolio.create({
      user: user._id,
      title: title || "내 포트폴리오",
      
      // 기본 정보
      name: name || "",
      email: email || "",
      phone: phone || "",
      
      // 키워드
      introductionKeywords: introductionKeywords || {
        positions: [],
        strengths: [],
        interests: [],
        goals: []
      },
      
      // Profile 데이터 그대로 복사
      projects: projects || [],
      skills: skills || [],
      tools: tools || [],
      experiences: experiences || [],
      education: education || [],
      certificates: certificates || [],
      
      // ✅ Claude가 생성한 HTML
      generatedContent: generatedHTML
    });

    await User.findByIdAndUpdate(user._id, { 
      $push: { portfolios: portfolioDoc._id } 
    });

    res.status(200).json({
      message: "포트폴리오 생성 및 저장 완료",
      portfolioId: portfolioDoc._id,
      portfolio: portfolioDoc,
    });

  } catch (error) {
    console.error("❌ Portfolio generation error:", error);
    res.status(500).json({
      error: "포트폴리오 생성 실패",
      details: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
};

// ✅ 특정 포트폴리오 조회
export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { portfolioId } = req.params;
    
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const portfolio = await Portfolio.findById(portfolioId).populate('user', 'nickname email');
    
    if (!portfolio) {
      res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
      return;
    }
    
    // 본인 확인
    if (portfolio.user._id.toString() !== res.locals.jwtData?.id) {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }
    
    // 조회수 증가
    portfolio.viewCount = (portfolio.viewCount || 0) + 1;
    await portfolio.save();
    
    res.status(200).json({ 
      message: "포트폴리오 조회 성공",
      portfolio 
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};

// ✅ 내 포트폴리오 목록 조회
export const getMyPortfolios = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const userId = res.locals.jwtData?.id;
    const portfolios = await Portfolio.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('title createdAt updatedAt viewCount');
    
    res.status(200).json({ 
      message: "포트폴리오 목록 조회 성공",
      count: portfolios.length,
      portfolios 
    });
  } catch (error) {
    console.error("Portfolio list fetch error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};

// ✅ 포트폴리오 수정
export const updatePortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { portfolioId } = req.params;
    
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
      return;
    }
    
    // 본인 확인
    if (portfolio.user.toString() !== res.locals.jwtData?.id) {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }
    
    const { 
      title,
      name,
      email,
      phone,
      introductionKeywords,
      projects,
      skills,
      tools,
      experiences,
      education,
      certificates,
      generatedContent,
      status
    } = req.body;
    
    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (introductionKeywords) updateData.introductionKeywords = introductionKeywords;
    if (projects) updateData.projects = projects;
    if (skills) updateData.skills = skills;
    if (tools) updateData.tools = tools;
    if (experiences) updateData.experiences = experiences;
    if (education) updateData.education = education;
    if (certificates) updateData.certificates = certificates;
    if (generatedContent) updateData.generatedContent = generatedContent;
    if (status) updateData.status = status;
    
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolioId,
      updateData,
      { new: true }
    );
    
    res.status(200).json({ 
      message: "포트폴리오 수정 완료", 
      portfolio: updatedPortfolio 
    });
  } catch (error) {
    console.error("Portfolio update error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};

// ✅ 포트폴리오 삭제
export const deletePortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { portfolioId } = req.params;
    
    if (!res.locals.jwtData?.id) {
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
      return;
    }

    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
      return;
    }
    
    // 본인 확인
    if (portfolio.user.toString() !== res.locals.jwtData?.id) {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }
    
    // Portfolio 문서 삭제
    await Portfolio.findByIdAndDelete(portfolioId);
    
    // User 문서에서도 제거
    await User.findByIdAndUpdate(res.locals.jwtData?.id, {
      $pull: { portfolios: portfolioId }
    });
    
    res.status(200).json({ 
      message: "포트폴리오 삭제 완료" 
    });
  } catch (error) {
    console.error("Portfolio delete error:", error);
    res.status(500).json({ 
      message: "서버 오류",
      details: error instanceof Error ? error.message : "알 수 없는 오류"
    });
  }
};