import express from "express";
import {
  userLogin,
  userSignUp,
  addCertificate,
  addExperience,
  setDesiredJob
} from "../controllers/UserController";

const router = express.Router();

router.post("/register", userSignUp);
router.post("/login", userLogin); 

// 사용자 정보 입력 API
router.post("/profile/certificates", addCertificate);
router.post("/profile/experiences", addExperience);
router.post("/profile/desired-job", setDesiredJob);

export default router;
