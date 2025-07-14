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

//  사용자 스키마에 해당하는 인터페이스 정의
export interface IUser extends Document {
  _id: Types.ObjectId;  // 🔥 여기가 핵심 추가 부분
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  certificates?: Certificate[];
  experiences?: Experience[];
  desiredJob?: string;
}

//  자격증 스키마
const CertificateSchema = new Schema<Certificate>({
  name: { type: String, required: true },
  issuedBy: { type: String },
  date: { type: Date },
}, { _id: false });

//   경력 스키마
const ExperienceSchema = new Schema<Experience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
}, { _id: false });

//  메인 사용자 스키마
const UserSchema: Schema = new Schema<IUser>({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
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
  certificates: [CertificateSchema],  //자격증 정보
  experiences: [ExperienceSchema], //경력 정보
  desiredJob: { type: String },   //희망 직종, 직무
});

// 모델 생성 및 내보내기
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
