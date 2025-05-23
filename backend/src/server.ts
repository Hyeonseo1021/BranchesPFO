import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
    app.listen(3000, () => console.log("🚀 서버 실행 중: http://localhost:3000"));
  })
  .catch((err) => console.error("MongoDB 연결 실패", err));
