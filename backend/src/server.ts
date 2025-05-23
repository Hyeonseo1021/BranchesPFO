import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js";

// .env 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// JSON 요청 본문 파싱
app.use(express.json());

// 쿠키 파싱 (서명된 쿠키용)
app.use(cookieParser(process.env.COOKIE_SECRET));

// 사용자 관련 라우터 등록
app.use("/api/user", userRoutes);

// MongoDB 연결 및 서버 시작
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
    app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB 연결 실패", err));
