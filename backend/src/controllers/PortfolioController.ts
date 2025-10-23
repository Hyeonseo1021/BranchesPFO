// src/controllers/PortfolioController.ts
import { Request, Response } from "express";
import { generatePortfolioWithClaude } from "../utils/Client";
import User from "../models/User";
import Portfolio from "../models/Portfolio";

// ✅ 디자인 다양성을 위한 랜덤 요소
const DESIGN_VARIATIONS = {
  colorSchemes: [
    { name: '모던 블루', primary: '#2563eb', secondary: '#60a5fa', accent: '#dbeafe' },
    { name: '엘레강트 퍼플', primary: '#7c3aed', secondary: '#a78bfa', accent: '#ede9fe' },
    { name: '프로페셔널 그린', primary: '#059669', secondary: '#34d399', accent: '#d1fae5' },
    { name: '크리에이티브 오렌지', primary: '#ea580c', secondary: '#fb923c', accent: '#fed7aa' },
    { name: '테크 틸', primary: '#0891b2', secondary: '#22d3ee', accent: '#cffafe' },
    { name: '다크 슬레이트', primary: '#1e293b', secondary: '#475569', accent: '#cbd5e1' },
    { name: '로즈 골드', primary: '#be185d', secondary: '#f472b6', accent: '#fce7f3' },
    { name: '네이비 골드', primary: '#1e3a8a', secondary: '#3b82f6', accent: '#fbbf24' },
  ],
  
  layouts: [
    { name: '모던 그리드', style: 'CSS Grid 기반, 대칭적이고 깔끔한 레이아웃' },
    { name: '다이나믹 카드', style: '비대칭 카드 레이아웃, 각 섹션이 독립적인 카드' },
    { name: '미니멀 세로형', style: '단순하고 세련된 1열 레이아웃, 넓은 여백' },
    { name: '매거진 스타일', style: '잡지처럼 큰 타이포그래피와 이미지 중심' },
    { name: '타임라인 형식', style: '시간 순서대로 흐르는 스토리텔링 레이아웃' },
    { name: '포트폴리오 갤러리', style: '프로젝트 중심, 갤러리 형태의 비주얼 중심' },
    { name: 'Split Screen', style: '좌우 분할, 한쪽은 고정 네비게이션' },
  ],
  
  styles: [
    { name: '모던 플랫', desc: '평면적, 그림자 최소, 깔끔한 선' },
    { name: '뉴모피즘', desc: '부드러운 그림자, 입체감, 3D 느낌' },
    { name: '글래스모피즘', desc: '반투명, 블러 효과, 유리 질감' },
    { name: '그라데이션', desc: '화려한 그라데이션 배경, 현대적' },
    { name: '일러스트', desc: '손그림 느낌, 친근하고 창의적' },
    { name: '미니멀 모노', desc: '흑백 위주, 타이포그래피 중심, 세련됨' },
    { name: '레트로 빈티지', desc: '복고풍, 따뜻한 색감, 향수' },
  ],
  
  animations: [
    'fade-in과 slide-up을 조합한 부드러운 스크롤 애니메이션',
    '호버 시 확대되는 역동적인 카드 효과',
    '타이핑 효과가 있는 히어로 섹션',
    '패럴랙스 스크롤로 깊이감 있는 배경',
    '요소가 하나씩 나타나는 순차 애니메이션',
    '마우스 따라다니는 인터랙티브 요소',
    '스크롤 진행도에 따른 네비게이션 변화',
  ],
  
  typography: [
    'Pretendard 기반의 모던하고 읽기 좋은 폰트',
    'Inter와 Noto Sans KR 조합의 글로벌한 느낌',
    '큰 헤딩과 작은 본문의 극적인 대비',
    'Serif 폰트로 클래식하고 우아한 느낌',
    '둥근 폰트로 친근하고 따뜻한 분위기',
    'Monospace 폰트로 테크니컬한 느낌',
  ]
};

// ✅ 랜덤 선택 함수
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

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
      certificates,
      userPrompt  // ✅ 사용자가 직접 입력한 프롬프트/요청사항
    } = req.body;

    // ✅ 랜덤 디자인 요소 선택
    const randomColor = getRandomElement(DESIGN_VARIATIONS.colorSchemes);
    const randomLayout = getRandomElement(DESIGN_VARIATIONS.layouts);
    const randomStyle = getRandomElement(DESIGN_VARIATIONS.styles);
    const randomAnimation = getRandomElement(DESIGN_VARIATIONS.animations);
    const randomTypography = getRandomElement(DESIGN_VARIATIONS.typography);
    

    // ✅ 프로젝트가 있는지 확인
    const hasProjects = projects && projects.length > 0;

    // ✅ 사용자 특성 분석
    const userCharacteristics = [];
    if (introductionKeywords?.positions?.length > 0) {
      userCharacteristics.push(`희망 포지션: ${introductionKeywords.positions.join(', ')}`);
    }
    if (introductionKeywords?.strengths?.length > 0) {
      userCharacteristics.push(`핵심 강점: ${introductionKeywords.strengths.join(', ')}`);
    }
    if (introductionKeywords?.interests?.length > 0) {
      userCharacteristics.push(`관심 분야: ${introductionKeywords.interests.join(', ')}`);
    }

    // ✅ 개선된 Claude 프롬프트 (사용자 프롬프트 최우선!)
    const prompt = `당신은 세계적인 웹 디자이너이자 프론트엔드 개발자입니다.

⚠️ **중요: 이번 포트폴리오는 반드시 이전에 만든 것들과 완전히 다른 독창적인 디자인이어야 합니다!**

${userPrompt ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 사용자의 특별 요청사항 (최우선으로 반영!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${userPrompt}

※ 위 요청사항을 최우선으로 반영하되, 아래 기본 가이드라인도 함께 고려하세요.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

<사용자_정보>
이름: ${name}
이메일: ${email}
전화: ${phone}

<사용자_특성>
${userCharacteristics.join('\n')}
목표: ${introductionKeywords?.goals?.join(', ') || '정보 없음'}
</사용자_특성>

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

<기술_및_도구>
기술 스택: ${skills?.join(', ') || '정보 없음'}
활용 툴: ${tools?.join(', ') || '정보 없음'}
</기술_및_도구>

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

${!userPrompt ? `
# 🎨 AI 추천 디자인 가이드 (사용자 요청이 없으므로 이 가이드를 따름)

## 추천 색상 팔레트
- **메인 색상**: ${randomColor.primary}
- **보조 색상**: ${randomColor.secondary}
- **강조 색상**: ${randomColor.accent}
- **테마 이름**: ${randomColor.name}
→ 이 색상들을 창의적으로 활용하되, 완전히 다른 조합으로 사용하세요!

## 추천 레이아웃 스타일
- **타입**: ${randomLayout.name}
- **구성**: ${randomLayout.style}
→ 이 레이아웃 스타일을 독특하게 구현하세요!

## 추천 비주얼 스타일
- **스타일**: ${randomStyle.name}
- **특징**: ${randomStyle.desc}
→ 이 스타일의 특징을 극대화하세요!

## 추천 애니메이션
- ${randomAnimation}

## 추천 타이포그래피
- ${randomTypography}

---
` : ''}

# 📋 필수 요구사항

1. **완전한 HTML 문서** 생성 (<!DOCTYPE html>부터 시작)

2. **반응형 디자인** 
   - 모바일 (320px~768px)
   - 태블릿 (768px~1024px)
   - 데스크톱 (1024px+)

3. **섹션 구성** (순서와 스타일을 창의적으로 변경)
   - 🌟 Hero Section: 첫인상이 강렬하고 독특하게
   - 👤 About Me: ${name}님의 개성과 특성을 스토리텔링으로
   - 💼 Projects: 프로젝트를 시각적으로 매력적이게 배치
   - 🛠️ Skills & Tools: 독특한 방식으로 시각화
   - 📞 Contact: 연락처 섹션

4. **프로젝트 카드**
   - 각 프로젝트마다 고유한 느낌
   - 호버/클릭 인터랙션
   - 기술스택 태그는 색상별로 차별화
   - 링크가 있으면 버튼 추가

5. **차별화 요소 (매우 중요!)**
   - 다른 포트폴리오와 완전히 다른 헤더 디자인
   - 독특한 프로젝트 카드 레이아웃 (겹침, 회전, 스택 등)
   - 개성 있는 About Me 섹션 구성
   - 창의적인 네비게이션 (고정 헤더, 사이드바, 플로팅 등)
   - 독특한 색상 배합과 그라데이션

6. **스타일**
   - 모든 CSS는 <style> 태그 내부에 작성
   - 외부 라이브러리 사용 금지 (단, Font Awesome CDN은 허용)
   - Google Fonts 사용 가능

7. **한국어로 작성**

8. **JavaScript 기능 (선택)**
   - 부드러운 스크롤 네비게이션
   - 스크롤 애니메이션
   - 모바일 메뉴 토글
   - 다크모드 토글 (요청 시)

${userPrompt ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 다시 한번 강조: 사용자의 요청사항을 반드시 반영하세요!
"${userPrompt}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

---

🚀 **매우 독창적이고 ${name}님만의 개성이 드러나는 포트폴리오를 만들어주세요!**
**다른 포트폴리오들과 확연히 구별되는 디자인을 만드는 것이 가장 중요합니다!**
⚠️ **중요: HTML 코드만 출력하세요. \`\`\`html 같은 마크다운 코드 블록 마커는 절대 사용하지 마세요. <!DOCTYPE html>부터 바로 시작하세요.**`;

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
      
      // ✅ 사용자 프롬프트도 저장 (나중에 재생성 시 활용)
      userPrompt: userPrompt || "",
      
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
      userPrompt,  // ✅ 사용자 프롬프트도 업데이트 가능
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
    if (userPrompt !== undefined) updateData.userPrompt = userPrompt;
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