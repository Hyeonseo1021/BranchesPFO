import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"; // cors 추가
import authRoutes from "./routes/UserRoutes";
import resumeRouter from "./routes/resume";
import testRouter from "./routes/test";
import chatRouter from "./routes/ChatRoutes"; // 추가

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors()); // cors 미들웨어 추가

// 인증 및 사용자 관련 API
app.use("/auth", authRoutes);


// 이력서 API
app.use("/api/resume", resumeRouter);

// 챗봇 API
app.use("/api", chatRouter); // 추가
app.use("/test", testRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: "myDatabase",
    });
    console.log(" MongoDB 연결 성공");
  } catch (error) {
    console.error(" MongoDB 연결 실패:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
