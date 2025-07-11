import express from "express";
import {
  userLogin,
  addCertificate,
  addExperience,
  setDesiredJob
} from "../controllers/UserController.js";

const router = express.Router();

// 로그인 요청 처리
router.post("/login", userLogin);

// 사용자 정보 입력 API
router.post("/profile/certificates", addCertificate);
router.post("/profile/experiences", addExperience);
router.post("/profile/desired-job", setDesiredJob);

export default router;
