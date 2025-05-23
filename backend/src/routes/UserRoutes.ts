import express from "express";
import { userLogin } from "../controllers/UserController.js";

const router = express.Router();

// 로그인 요청 처리
router.post("/login", userLogin);

export default router;
