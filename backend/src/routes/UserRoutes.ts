import express from "express";
import {
  userLogin,
  userSignUp,
  addCertificate,
  addExperience,
  setDesiredJob,
  setAddress,
  getAddress,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", userSignUp);
router.post("/login", userLogin); 

// 사용자 정보 입력 API
router.post("/profile/certificates", addCertificate);
router.post("/profile/experiences", addExperience);
router.post("/profile/desired-job", setDesiredJob);

// 주소 API
router.put("/profile/address", setAddress); // 주소 입력/수정
router.get("/:id/address", getAddress);     // 주소 조회

// 사용자 정보 CRUD
router.get("/:id", getUser);         // 조회
router.put("/:id", updateUser);      // 수정
router.delete("/:id", deleteUser);   // 삭제

export default router;

