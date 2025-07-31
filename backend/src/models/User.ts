// src/models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

// 자격증 인터페이스
interface Certificate {
  name: string;
  issuedBy?: string;
  date?: Date;
}

// 경력 인터페이스
interface Experience {
  company: string;
  position: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

// 이력서 인터페이스
interface Resume {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
}

// 사용자 인터페이스
export interface IUser extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  certificates?: Certificate[];
  experiences?: Experience[];
  desiredJob?: string;
  resumes?: Resume[]; // ✅ 이력서 필드 추가
}

// 자격증 스키마
const CertificateSchema = new Schema<Certificate>({
  name: { type: String, required: true },
  issuedBy: { type: String },
  date: { type: Date },
}, { _id: false });

// 경력 스키마
const ExperienceSchema = new Schema<Experience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
}, { _id: false });

// 이력서 스키마
const ResumeSchema = new Schema<Resume>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });


// 메인 사용자 스키마
const UserSchema: Schema = new Schema<IUser>({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  certificates: [CertificateSchema],
  experiences: [ExperienceSchema],
  desiredJob: { type: String },
  resumes: [ResumeSchema], // ✅ 이력서 필드 추가
});

// 모델 생성 및 내보내기
const User = mongoose.model<IUser>("User", UserSchema);

export default User;

