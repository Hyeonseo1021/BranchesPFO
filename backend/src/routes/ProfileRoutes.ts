import { Router } from "express";
import {
  getMyProfile,
  updateBasicInfo, setAvatar,
  addEducation, updateEducation, removeEducation,
  addExperience, updateExperience, removeExperience,
  addCertificate, updateCertificate, removeCertificate,
  addProject, updateProject, removeProject,
  addSkills, removeSkills, replaceSkills,
  addTools, removeTools, replaceTools
} from "../controllers/ProfileController";
import verifyToken from "../middleware/verifyToken";

const ProfileRoutes = Router();

// 조회
ProfileRoutes.get("/:userId", verifyToken, getMyProfile);

// 기본정보/소개/아바타
ProfileRoutes.patch("/:userId/basic", verifyToken, updateBasicInfo);
ProfileRoutes.patch("/:userId/avatar", verifyToken, setAvatar);

// 학력
ProfileRoutes.post("/:userId/education", verifyToken, addEducation);
ProfileRoutes.patch("/:userId/education/:eduId", verifyToken, updateEducation);
ProfileRoutes.delete("/:userId/education/:eduId", verifyToken, removeEducation);

// 경력
ProfileRoutes.post("/:userId/experiences", verifyToken, addExperience);
ProfileRoutes.patch("/:userId/experiences/:expId", verifyToken, updateExperience);
ProfileRoutes.delete("/:userId/experiences/:expId", verifyToken, removeExperience);

// 자격증
ProfileRoutes.post("/:userId/certificates", verifyToken, addCertificate);
ProfileRoutes.patch("/:userId/certificates/:certId", verifyToken, updateCertificate);
ProfileRoutes.delete("/:userId/certificates/:certId", verifyToken, removeCertificate);

// 프로젝트
ProfileRoutes.post("/:userId/projects", verifyToken, addProject);
ProfileRoutes.patch("/:userId/projects/:projectId", verifyToken, updateProject);
ProfileRoutes.delete("/:userId/projects/:projectId", verifyToken, removeProject);

// 스킬/툴
ProfileRoutes.post("/:userId/skills", verifyToken, addSkills);
ProfileRoutes.delete("/:userId/skills", verifyToken, removeSkills);
ProfileRoutes.put("/:userId/skills", verifyToken, replaceSkills);

ProfileRoutes.post("/:userId/tools", verifyToken, addTools);
ProfileRoutes.delete("/:userId/tools", verifyToken, removeTools);
ProfileRoutes.put("/:userId/tools", verifyToken, replaceTools);

export default ProfileRoutes;
