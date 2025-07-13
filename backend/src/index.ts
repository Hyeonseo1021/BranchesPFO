// src/index.ts 또는 src/app.ts
import express from "express";
import resumeRouter from "./routes/resume";

const app = express();
app.use(express.json());

// 라우터 등록
app.use("/api/resume", resumeRouter);
