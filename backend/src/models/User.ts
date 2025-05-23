// src/models/User.ts
// 사용자 정보를 저장하는 Mongoose 모델입니다.

import mongoose, { Schema, Document } from "mongoose";

// 사용자 스키마에 해당하는 인터페이스 정의
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

// Mongoose 스키마 정의
const UserSchema: Schema = new Schema<IUser>({
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
});

// 모델 생성 및 내보내기
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
