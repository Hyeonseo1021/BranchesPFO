import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/UserRoutes";
import jobkoreaRoutes from "./routes/UserRoutes"; 
import resumeRouter from "./routes/resume";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// 기존 회원가입 라우터
app.use("/user", userRoutes);

// 잡코리아 API 라우터
app.use("/jobkorea", jobkoreaRoutes);

app.use("/api/resume", resumeRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: "myDatabase",
    });
    console.log("✅ MongoDB 연결 성공");
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
