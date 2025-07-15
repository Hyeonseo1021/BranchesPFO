import express from "express";
import {
  userLogin,
  userSignUp,
  addCertificate,
  addExperience,
  setDesiredJob
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", userSignUp);
router.post("/login", userLogin); 

// 사용자 정보 입력 API
router.post("certificates", addCertificate);
router.post("experiences", addExperience);
router.post("desired-job", setDesiredJob);

export default router;
