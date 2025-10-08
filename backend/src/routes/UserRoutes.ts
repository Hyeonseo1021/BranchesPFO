import express from "express";
import {
  userLogin,
  userSignUp,
  verifyUser,
  addCertificate,
  addExperience,
  setDesiredJob,
  getUserInfo,
  updateUserInfo,
  changePassword,
  deleteUser,
  searchAddress,
  searchAddressAlternative
} from "../controllers/UserController";
import  authMiddleware  from "../middleware/middleware";

const router = express.Router();

router.post("/register", (req, res, next) => {
  console.log("회원가입 라우트 진입");
  next();
}, userSignUp);
router.post("/login", userLogin); 
// 로그인 상태 확인
router.get("/verify", authMiddleware, verifyUser);

// 사용자 정보 CRUD API
router.get("/profile/:userId", getUserInfo);
router.put("/profile/:userId", updateUserInfo);
router.put("/profile/:userId/password", changePassword);
router.delete("/profile/:userId", deleteUser);

// 주소 검색 API
router.get("/address/search", searchAddress);
router.get("/address/search-alt", searchAddressAlternative);

// 사용자 정보 입력 API
router.post("/profile/certificates", addCertificate);
router.post("/profile/experiences", addExperience);
router.post("/profile/desired-job", setDesiredJob);

export default router;