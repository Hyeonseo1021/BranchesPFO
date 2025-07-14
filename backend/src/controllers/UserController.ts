import { Request, Response } from "express";
import { hash } from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../utils/Token.js";
import { COOKIE_NAME } from "../utils/Constants.js";

// 회원가입 기능
export const userSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, email, password } = req.body;

        if (!id || !name || !email || !password) {
            return res.status(400).json({ message: "모든 필드를 입력하세요." });
        }

        const existingId = await User.findOne({ id });
        if (existingId) {
            return res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: "이미 등록된 이메일입니다." });
        }

        const hashedPassword = await hash(password, 10);
        const user = new User({ id, name, email, password: hashedPassword }) as InstanceType<typeof User>;
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
            sameSite: 'lax',
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
        console.error("회원가입 서버 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", cause: error.message });
    }
};

// 로그인 기능
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 이메일로 사용자 검색
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호 확인
    const isPasswordValid = await hash(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
    }

    // JWT 토큰 생성
    const token = createToken(user._id.toString(), user.email, "7d");
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
      domain: process.env.DOMAIN || "localhost",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "로그인 성공",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("로그인 서버 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 잡코리아 API 호출 기능 
export const getJobList = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      res.status(400).json({ message: "검색어를 입력하세요." });
      return;
    }

    const apiUrl = `https://api.jobkorea.co.kr/v1/jobs?query=${encodeURIComponent(keyword)}&apiKey=${process.env.JOBKOREA_API_KEY}`;

    const response = await fetch(apiUrl);  // ✅ 내장 fetch 사용
    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    console.error("잡코리아 호출 오류:", error);
    res.status(500).json({ message: "잡코리아 API 호출 실패", error: error.message });
  }
};
