import express from "express";
import { userLogin } from "../controllers/UserCountroller.js";

const router = express.Router();

// 로그인 라우터
router.post("/login", userLogin);

export default router;
