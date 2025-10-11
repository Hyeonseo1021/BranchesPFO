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
import  verifyToken  from "../middleware/verifyToken";

const router = express.Router();

router.post("/register", (req, res, next) => {
  console.log("회원가입 라우트 진입");
  next();
}, userSignUp);
router.post("/login", userLogin); 

router.get("/verify", verifyToken, verifyUser);

// 사용자 정보 CRUD API
router.get("/profile/:userId", verifyToken, getUserInfo);
router.put("/profile/:userId", verifyToken, updateUserInfo);
router.put("/profile/:userId/password", verifyToken, changePassword);
router.delete("/profile/:userId", verifyToken, deleteUser);

// 주소 검색 API
router.get("/address/search", verifyToken, searchAddress);
router.get("/address/search-alt", verifyToken, searchAddressAlternative);

// 사용자 정보 입력 API
router.post("/profile/certificates", verifyToken, addCertificate);
router.post("/profile/experiences", verifyToken, addExperience);
router.post("/profile/desired-job", verifyToken, setDesiredJob);

export default router;