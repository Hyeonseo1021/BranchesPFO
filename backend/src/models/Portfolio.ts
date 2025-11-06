import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 기본 정보
  title: {
    type: String,
    default: '내 포트폴리오'
  },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },

  // 자기소개 키워드
  introductionKeywords: {
    positions: [String],
    strengths: [String],
    interests: [String],
    goals: [String]
  },

  // 프로젝트 (핵심!)
  projects: [{
    title: String,
    description: String,
    role: String,
    techStack: [String],
    period: String,
    link: String
  }],

  // 기술 & 툴
  skills: [String],
  tools: [String],

  // 선택적: 경력, 학력, 자격증
  experiences: [{
    company: String,
    position: String,
    period: String,
    description: String
  }],
  education: [{
    schoolType: String,
    school: String,
    major: String,
    degree: String,
    period: String
  }],
  certificates: [{
    name: String,
    issuedBy: String,
    date: String
  }],

  userPrompt: {
    type: String,
    default: ''
  },

  // AI 생성된 포트폴리오 내용
  generatedContent: {
    type: String,  // HTML 또는 마크다운
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);
export default Portfolio;