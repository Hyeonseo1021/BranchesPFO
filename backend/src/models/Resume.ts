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
  appliedPosition: { type: String, default: '' },
  name: { type: String, default: '' },
  birth: { type: String, default: '' },
  address: { type: String, default: '' },
  email: {type:String, default: ''},
  phone: { type: String, default: '' },
  mobile: { type: String, default: '' },

  // ✅ 학력 (Profile과 동일하게)
  education: [{
    school: String,
    major: String,
    degree: String,
    period: String
  }],

  // ✅ 경력 (Profile과 동일하게)
  experiences: [{
    company: String,
    position: String,
    period: String,
    description: String
  }],

  // ✅ 자격증 (Profile과 동일하게)
  certificates: [{
    name: String,
    issuedBy: String,
    date: String
  }],

  // ✅ 기술 역량 (Profile에서 추가)
  skills: [String],

  // ✅ 활용 툴 (Profile에서 추가)
  tools: [String],

  // ✅ 프로젝트 경험 (Profile에서 추가)
  projects: [{
    title: String,
    description: String,
    role: String,
    techStack: [String],
    period: String,
    link: String
  }],

  // 자기소개서 (4개 섹션)
  coverLetter: {
    strengths: { type: String, default: '' },
    growth: { type: String, default: '' },
    personality: { type: String, default: '' },
    motivation: { type: String, default: '' }
  }

}, { timestamps: true });

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;