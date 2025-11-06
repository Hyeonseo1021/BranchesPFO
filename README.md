# BranchesPFO
AI-Powered Portfolio Website
사용자의 경력, 프로젝트, 스킬 등의 정보를 기반으로 포트폴리오와 이력서를 자동으로 생성하는 AI 기반 웹 플랫폼

# 기능
- Claude AI를 활용한 맞춤형 포트폴리오 및 이력서 생성
- 이력서 특화 AI 챗봇
- 커뮤니티
- 프로필 관리
- 취업 추천 시스템(개발중)

# 기술 스택
**Frontend**
- React + TypeScript
- Tailwind CSS
- Axios
  
**Backend**
- Node.js + Express
- MongoDB
- JWT
- Claude AI

# 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/pfo-platform.git
cd pfo-platform

# Backend 설정
cd backend
npm install
npm run dev

# Frontend 설정 (새 터미널)
cd frontend
npm install
npm start
```

# 환경변수 설정
**Backend `.env`**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pfo
JWT_SECRET=your_secret_key
ANTHROPIC_API_KEY=your_api_key
CLIENT_URL=http://localhost:3000
```

**Frontend `.env`**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

# 라이선스

MIT License

# 개발자

- **프로젝트명**: BranchesPFO (Portfolio & Resume Generator)
- **개발기간**: 2025.04 - 진행중

