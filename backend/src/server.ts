import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/UserRoutes";
import resumeRouter from "./routes/resume";
import communityRoutes from "./routes/CommunityRoutes"; // 경로에 공백이 없는지 확인

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// --- API 라우터 연결 ---
app.use("/auth", authRoutes);
app.use("/api/resume", resumeRouter);
app.use("/api/community", communityRoutes);

// --- DB 연결 및 서버 실행 ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("✅ MongoDB 연결 성공");
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  });
});