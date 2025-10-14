import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // 기본 정보
  title: { type: String, required: true, default: 'AI 생성 이력서' },
  template: { type: String, enum: ['default', 'modern'], default: 'default' },
  photoUrl: { type: String, default: '' },
  appliedPosition: { type: String, default: '' }, // 응시직종
  name: { type: String, default: '' },
  gender: { type: String, default: '' },
  birth: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  mobile: { type: String, default: '' },

  // 학력
  education: [{
    enterAt: String,
    graduateAt: String,
    school: String,
    location: String,
    gpa: String
  }],

  // 경력
  experiences: [{
    company: String,
    period: String,
    position: String,
    department: String,
    reasonToLeave: String
  }],

  // 자격증
  certificates: [{
    year: String,
    name: String,
    issuedBy: String
  }],

  // 어학능력
  languages: [{
    category: String,
    testName: String,
    score: String,
    year: String
  }],

  // 가족사항
  family: [{
    relation: String,
    name: String,
    age: String,
    education: String,
    job: String,
    mobile: String
  }],

  // 자기소개서(4개 섹션)
  coverLetter: {
    strengths: { type: String, default: '' },   // 주요경력 / 업무강점
    growth: { type: String, default: '' },      // 성장과정
    personality: { type: String, default: '' }, // 성격의 장단점
    motivation: { type: String, default: '' }   // 지원동기 및 입사포부
  }

}, { timestamps: true });

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;
