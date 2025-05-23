import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 5000;

// 환경 설정
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// 라우팅
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
