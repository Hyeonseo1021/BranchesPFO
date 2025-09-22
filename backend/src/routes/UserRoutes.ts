import express from "express";
import {
  userLogin,
  userSignUp,
  addCertificate,
  addExperience,
  setDesiredJob
} from "../controllers/UserController";

const router = express.Router();

// --- 인증 API ---
// POST /register : 회원가입
router.post("/register", userSignUp);
// POST /login : 로그인
router.post("/login", userLogin); 

// --- 사용자 프로필 정보 입력 API ---
// POST /profile/certificates : 자격증 추가
router.post("/profile/certificates", addCertificate);
// POST /profile/experiences : 경력 추가
router.post("/profile/experiences", addExperience);
// POST /profile/desired-job : 희망 직종 설정
router.post("/profile/desired-job", setDesiredJob);

export default router;