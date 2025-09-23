import express from "express";
import {
  userLogin,
  userSignUp,
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

const router = express.Router();

router.post("/register", userSignUp);
router.post("/login", userLogin); 

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