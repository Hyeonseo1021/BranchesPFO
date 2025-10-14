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
  phone: { type: String },
  address: { type: String },

  // 자기소개
  introduction: { type: String, default: '' },

  // 학력
  education: [{
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
