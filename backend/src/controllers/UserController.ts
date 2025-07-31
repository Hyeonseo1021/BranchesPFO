import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import User from "../models/User";
import { createToken } from "../utils/Token";
import { COOKIE_NAME } from "../utils/Constants";

// 회원가입
export const userSignUp = async (req: Request, res: Response): Promise<void> => {

  try {
    const { id, name, email, password } = req.body;

    if (!id || !name || !email || !password) {
      res.status(400).json({ message: "모든 필드를 입력하세요." });
      return;
    }

    const existingId = await User.findOne({ id });
    if (existingId) {
      res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(409).json({ message: "이미 등록된 이메일입니다." });
      return;
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ id, name, email, password: hashedPassword });
    await user.save();

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: process.env.DOMAIN || "localhost",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "회원가입 성공",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 로그인
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    // 비밀번호 확인 (compare로 변경)
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
      return;
    }

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: process.env.DOMAIN || "localhost",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "로그인 성공", name: user.name, id: user.id });
  } catch (error: any) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 자격증 추가
export const addCertificate = async (req: Request, res: Response): Promise<void> => {
  const { userId, certificate } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { id: userId },
      { $push: { certificates: certificate } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "사용자 없음" });
      return;
    }
    res.status(200).json({ message: "자격증 추가 완료", user });
  } catch (err) {
    res.status(500).json({ message: "자격증 추가 실패" });
  }
};

// 경력 추가
export const addExperience = async (req: Request, res: Response): Promise<void> => {
  const { userId, experience } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { id: userId },
      { $push: { experiences: experience } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "사용자 없음" });
      return;
    }
    res.status(200).json({ message: "경력 추가 완료", user });
  } catch (err) {
    res.status(500).json({ message: "경력 추가 실패" });
  }
};

// 희망 직종 설정
export const setDesiredJob = async (req: Request, res: Response): Promise<void> => {
  const { userId, desiredJob } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { id: userId },
      { desiredJob },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "사용자 없음" });
      return;
    }
    res.status(200).json({ message: "희망 직종 설정 완료", user });
  } catch (err) {
    res.status(500).json({ message: "희망 직종 설정 실패" });
  }
};

// 잡코리아 API 호출 (예시용)
export const getJobList = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      res.status(400).json({ message: "검색어를 입력하세요." });
      return;
    }

    const apiUrl = ``;

    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "잡코리아 API 호출 실패", error: error.message });
  }
};