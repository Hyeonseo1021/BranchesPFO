import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../utils/Token.js";
import { COOKIE_NAME } from "../utils/Constants.js";

// 로그인 처리
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, password } = req.body;

    const user = await User.findOne({ id });
    if (!user) {
      res.status(409).json({ message: "ERROR", cause: "해당 아이디로 등록된 계정이 없습니다." });
      return;
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(403).json({ message: "ERROR", cause: "비밀번호가 일치하지 않습니다." });
      return;
    }

    const token = createToken(user.id.toString(), user.id, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: process.env.DOMAIN,
      expires,
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: true,
    });

    res.status(200).json({ message: "OK", name: user.name, id: user.id });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ message: "ERROR", cause: error.message });
    } else {
      res.status(500).json({ message: "ERROR", cause: String(error) });
    }
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
    res.status(200).json({ message: "OK", user });
  } catch (err) {
    res.status(500).json({ message: "ERROR", cause: "자격증 추가 실패" });
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
    res.status(200).json({ message: "OK", user });
  } catch (err) {
    res.status(500).json({ message: "ERROR", cause: "경력 추가 실패" });
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
    res.status(200).json({ message: "OK", user });
  } catch (err) {
    res.status(500).json({ message: "ERROR", cause: "희망 직종 설정 실패" });
  }
};
