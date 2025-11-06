import { Request, Response } from "express";
import Profile from "../models/Profile";
import User from "../models/User";
import mongoose from "mongoose";

const ensureObjectId = (id: string) => new mongoose.Types.ObjectId(id);

// ✅ 헬퍼 함수: 프로필이 없으면 자동 생성
const getOrCreateProfile = async (userId: string) => {
  let profile = await Profile.findOne({ user: userId });
  
  if (!profile) {
    console.log('📝 프로필이 없습니다. 새로 생성합니다.');
    
    // ✅ 빈 값을 명시하지 않고 필수 필드만 생성
    profile = await Profile.create({
      user: userId
      // name, birth 등은 스키마 기본값 사용 (undefined)
      // 배열들도 스키마에서 기본값 처리됨
    });
    
    console.log('✅ 프로필 생성 완료:', profile._id);
  }
  
  return profile;
};

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);
    
    // populate와 함께 다시 조회
    const profile = await Profile.findOne({ user: userId })
      .populate("user", "nickname email _id");

    res.status(200).json(profile);
  } catch (error: any) {
    console.error("❌ 프로필 조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const updateBasicInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const allowed = [
      "name", "birth", "phone", "address", "avatar",
      "introductionKeywords",  // ✅ introduction 대신 introductionKeywords
      "education", "experiences", "certificates", "skills", "tools", "projects"
    ] as const;

    const updateData: Record<string, any> = {};
    for (const k of allowed) {
      if (k in req.body) updateData[k] = req.body[k];
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "업데이트할 필드가 없습니다." });
      return;
    }

    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("기본 정보 업데이트 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const setAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { avatar } = req.body;

    if (typeof avatar !== "string") {
      res.status(400).json({ message: "avatar는 문자열 URL이어야 합니다." });
      return;
    }

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { avatar } },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("아바타 업데이트 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const addEducation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { school, major, degree, period } = req.body;

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          education: { _id: new mongoose.Types.ObjectId(), school, major, degree, period }
        }
      },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(201).json(updated);
  } catch (error: any) {
    console.error("학력 추가 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { userId, eduId } = req.params;
    const allowed = ["school", "major", "degree", "period"] as const;

    const setObj: Record<string, any> = {};
    for (const k of allowed) {
      if (k in req.body) setObj[`education.$.${k}`] = req.body[k];
    }
    if (Object.keys(setObj).length === 0) {
      res.status(400).json({ message: "업데이트할 필드가 없습니다." });
      return;
    }

    const updated = await Profile.findOneAndUpdate(
      { user: userId, "education._id": ensureObjectId(eduId) },
      { $set: setObj },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "해당 학력 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("학력 수정 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const removeEducation = async (req: Request, res: Response) => {
  try {
    const { userId, eduId } = req.params;

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { education: { _id: ensureObjectId(eduId) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "프로필 또는 학력 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("학력 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

/** ---------------------------
 * 경력(experiences) 항목 단위 CRUD
 * -------------------------- */
export const addExperience = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { company, position, period, description } = req.body;

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          experiences: {
            _id: new mongoose.Types.ObjectId(),
            company, position, period, description
          }
        }
      },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(201).json(updated);
  } catch (error: any) {
    console.error("경력 추가 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { userId, expId } = req.params;
    const allowed = ["company", "position", "period", "description"] as const;

    const setObj: Record<string, any> = {};
    for (const k of allowed) {
      if (k in req.body) setObj[`experiences.$.${k}`] = req.body[k];
    }
    if (Object.keys(setObj).length === 0) {
      res.status(400).json({ message: "업데이트할 필드가 없습니다." });
      return;
    }

    const updated = await Profile.findOneAndUpdate(
      { user: userId, "experiences._id": ensureObjectId(expId) },
      { $set: setObj },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "해당 경력 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("경력 수정 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const removeExperience = async (req: Request, res: Response) => {
  try {
    const { userId, expId } = req.params;

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { experiences: { _id: ensureObjectId(expId) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "프로필 또는 경력 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("경력 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

/** ---------------------------
 * 자격증(certificates) 항목 단위 CRUD
 * -------------------------- */
export const addCertificate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, issuedBy, date } = req.body;

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          certificates: {
            _id: new mongoose.Types.ObjectId(),
            name, issuedBy, date
          }
        }
      },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(201).json(updated);
  } catch (error: any) {
    console.error("자격증 추가 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { userId, certId } = req.params;
    const allowed = ["name", "issuedBy", "date"] as const;

    const setObj: Record<string, any> = {};
    for (const k of allowed) {
      if (k in req.body) setObj[`certificates.$.${k}`] = req.body[k];
    }
    if (Object.keys(setObj).length === 0) {
      res.status(400).json({ message: "업데이트할 필드가 없습니다." });
      return;
    }

    const updated = await Profile.findOneAndUpdate(
      { user: userId, "certificates._id": ensureObjectId(certId) },
      { $set: setObj },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "해당 자격증 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("자격증 수정 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const removeCertificate = async (req: Request, res: Response) => {
  try {
    const { userId, certId } = req.params;

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { certificates: { _id: ensureObjectId(certId) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "프로필 또는 자격증 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("자격증 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

/** ---------------------------
 * 프로젝트(projects) 항목 단위 CRUD
 * -------------------------- */
export const addProject = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, description, role, techStack, period, link } = req.body;

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          projects: {
            _id: new mongoose.Types.ObjectId(),
            title, description, role,
            techStack: Array.isArray(techStack) ? techStack : [],
            period, link
          }
        }
      },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(201).json(updated);
  } catch (error: any) {
    console.error("프로젝트 추가 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = req.params;
    const allowed = ["title", "description", "role", "techStack", "period", "link"] as const;

    const setObj: Record<string, any> = {};
    for (const k of allowed) {
      if (k in req.body) {
        // techStack은 배열 보존
        if (k === "techStack" && !Array.isArray(req.body[k])) continue;
        setObj[`projects.$.${k}`] = req.body[k];
      }
    }
    if (Object.keys(setObj).length === 0) {
      res.status(400).json({ message: "업데이트할 필드가 없습니다." });
      return;
    }

    const updated = await Profile.findOneAndUpdate(
      { user: userId, "projects._id": ensureObjectId(projectId) },
      { $set: setObj },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "해당 프로젝트 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("프로젝트 수정 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const removeProject = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = req.params;

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { projects: { _id: ensureObjectId(projectId) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "프로필 또는 프로젝트 항목을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("프로젝트 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const addSkills = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const skills = Array.isArray(req.body.skills) ? req.body.skills : [req.body.skills];

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $addToSet: { skills: { $each: skills.filter(Boolean) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("스킬 추가 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const removeSkills = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const skills = Array.isArray(req.body.skills) ? req.body.skills : [req.body.skills];

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { skills: { $in: skills.filter(Boolean) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("스킬 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const replaceSkills = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const skills = Array.isArray(req.body.skills) ? req.body.skills : [];

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { skills } },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("스킬 교체 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const addTools = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tools = Array.isArray(req.body.tools) ? req.body.tools : [req.body.tools];

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $addToSet: { tools: { $each: tools.filter(Boolean) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("툴 추가 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const removeTools = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tools = Array.isArray(req.body.tools) ? req.body.tools : [req.body.tools];

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { tools: { $in: tools.filter(Boolean) } } },
      { new: true }
    ).populate("user", "nickname email _id");

    if (!updated) {
      res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("툴 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const replaceTools = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tools = Array.isArray(req.body.tools) ? req.body.tools : [];

    // ✅ 프로필 없으면 자동 생성
    await getOrCreateProfile(userId);

    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { tools } },
      { new: true }
    ).populate("user", "nickname email _id");

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("툴 교체 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};