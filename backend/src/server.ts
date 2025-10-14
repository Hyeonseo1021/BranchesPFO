import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; // cors 추가
import cookieParser from "cookie-parser";
import authRoutes from "./routes/UserRoutes";
import resumeRoutes from "./routes/ResumeRoutes";
import communityRoutes from "./routes/CommunityRoutes"; // 경로에 공백이 없는지 확인
import chatRoutes from "./routes/ChatRoutes"; // 추가
import profileRoutes from "./routes/ProfileRoutes";

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));


// connect api
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/chat", chatRoutes); 
app.use("/api/profile", profileRoutes);

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
