import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // 프로필 사진
  avatar: {
    type: String, // 이미지 URL (ex: S3, Cloudinary, local uploads)
    default: ''   // 비어있으면 기본 이미지 사용
  },

  // 기본 인적 사항
  name: { type: String},
  birth: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },

  // 자기소개
  introductionKeywords: {
    positions: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 3;
        },
        message: '희망 직무는 최소 3개 이상 선택해주세요.'
      }
    },
    strengths: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 3;
        },
        message: '강점은 최소 3개 이상 선택해주세요.'
      }
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 3;
        },
        message: '관심 분야는 최소 3개 이상 선택해주세요.'
      }
    },
    goals: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 3;
        },
        message: '목표는 최소 3개 이상 선택해주세요.'
      }
    }
  },

  // 학력
  education: [{
    schoolType: {  // ✅ 추가
      type: String,
      enum: ['고등학교', '대학교', '대학원']
    },
    school: String,
    major: String,
    degree: String,
    period: String
  }],

  // 경력
  experiences: [{
    company: String,
    position: String,
    period: String,
    description: String
  }],

  // 자격증
  certificates: [{
    name: String,
    issuedBy: String,
    date: String
  }],

  // 기술 역량
  skills: [String],

  // 활용 툴
  tools: [String],

  // 프로젝트 경험
  projects: [{
    title: String,
    description: String,
    role: String,
    techStack: [String],
    period: String,
    link: String
  }]
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;
