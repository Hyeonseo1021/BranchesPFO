// src/models/Profile.ts

import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  avatar: {
    type: String,
    default: ''
  },

  name: { type: String },
  birth: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },

  // ✅ 자기소개 키워드 - validation 수정
  introductionKeywords: {
    positions: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          // ✅ 빈 배열이거나 3개 이상이면 통과
          return v.length === 0 || v.length >= 3;
        },
        message: '희망 직무는 0개 또는 최소 3개 이상 선택해주세요.'
      }
    },
    strengths: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length === 0 || v.length >= 3;
        },
        message: '강점은 0개 또는 최소 3개 이상 선택해주세요.'
      }
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length === 0 || v.length >= 3;
        },
        message: '관심 분야는 0개 또는 최소 3개 이상 선택해주세요.'
      }
    },
    goals: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length === 0 || v.length >= 3;
        },
        message: '목표는 0개 또는 최소 3개 이상 선택해주세요.'
      }
    }
  },

  education: [{
    schoolType: {
      type: String,
      enum: ['고등학교', '대학교', '대학원']
    },
    school: String,
    major: String,
    degree: String,
    period: String
  }],

  experiences: [{
    company: String,
    position: String,
    period: String,
    description: String
  }],

  certificates: [{
    name: String,
    issuedBy: String,
    date: String
  }],

  skills: [String],
  tools: [String],

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