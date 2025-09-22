import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import User from "../models/User";
import { createToken } from "../utils/Token";
import { COOKIE_NAME } from "../utils/Constants";

/**
 * POST /register
 * 사용자 회원가입을 처리합니다.
 */
export const userSignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, email, password } = req.body;

    // 입력 값 유효성 검사
    if (!id || !name || !email || !password) {
      res.status(400).json({ message: "모든 필드를 입력하세요." });
      return;
    }

    // 아이디 및 이메일 중복 확인
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

    // 비밀번호 암호화
    const hashedPassword = await hash(password, 10);
    const user = new User({ id, name, email, password: hashedPassword });
    await user.save();

    // 토큰 생성 및 쿠키 설정
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

    // 성공 응답
    res.status(201).json({
      message: "회원가입 성공",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

/**
 * POST /login
 * 사용자 로그인을 처리합니다.
 */
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    // 암호화된 비밀번호 비교
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
      return;
    }

    // 토큰 생성 및 쿠키 설정
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

    // 성공 응답
    res.status(200).json({ message: "로그인 성공", name: user.name, id: user.id });
  } catch (error: any) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

/**
 * POST /profile/certificates
 * 사용자의 자격증 정보를 추가합니다.
 */
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

/**
 * POST /profile/experiences
 * 사용자의 경력 정보를 추가합니다.
 */
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

/**
 * POST /profile/desired-job
 * 사용자의 희망 직종을 설정합니다.
 */
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

/*
// 잡코리아 API 호출 (API URL이 없어 현재는 미사용)
export const getJobList = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      res.status(400).json({ message: "검색어를 입력하세요." });
      return;
    }

    // apiUrl을 실제 잡코리아 API 주소로 채워야 합니다.
    const apiUrl = ``; 

    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "잡코리아 API 호출 실패", error: error.message });
  }
};
*/