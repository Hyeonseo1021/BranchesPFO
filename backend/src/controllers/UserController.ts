import { AuthRequest } from "../middleware/verifyToken";
import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import User from "../models/User";
import { createToken } from "../utils/Token";
import { COOKIE_NAME } from "../utils/Constants";

export const userSignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📝 회원가입 요청 받음:", { nickname: req.body.nickname, email: req.body.email });

    const { nickname, email, password } = req.body;

    if (!nickname || !email || !password) {
      console.log("❌ 필드 누락");
      res.status(400).json({ message: "모든 필드를 입력하세요." });
      return;
    }

    console.log("🔍 중복 체크 중...");
    const [dupNickname, dupEmail] = await Promise.all([
      User.findOne({ nickname }).lean(),
      User.findOne({ email }).lean(),
    ]);

    if (dupNickname) {
      console.log("❌ 중복 닉네임:", nickname);
      res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
      return;
    }
    if (dupEmail) {
      console.log("❌ 중복 이메일:", email);
      res.status(409).json({ message: "이미 등록된 이메일입니다." });
      return;
    }

    console.log("🔐 비밀번호 해싱 중...");
    const hashed = await hash(password, 10);

    console.log("💾 사용자 생성 중...");
    const user = await User.create({ nickname, email, password: hashed });
    console.log("✅ 사용자 생성 성공:", user._id);

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
      secure: process.env.NODE_ENV === "production" || true,
    });

    console.log("✅ 회원가입 완료");
    res.status(201).json({
      message: "회원가입 성공",
      user: { _id: user._id, nickname: user.nickname, email: user.email, createdAt: user.createdAt },
    });
  } catch (error: any) {
    console.error("❌ 회원가입 에러:", error);
    console.error("❌ 에러 메시지:", error.message);
    console.error("❌ 에러 스택:", error.stack);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};


export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "이메일과 비밀번호를 입력하세요." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const ok = await compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
      return;
    }

    const token = createToken(user._id.toString(), user.email, "7d");
    const cookieOptions: any = {
      path: "/",
      httpOnly: true,
      signed: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
      secure: process.env.NODE_ENV === "production" || true,
    };

    // ✅ 로그인 유지 체크하면 7일, 안하면 세션 쿠키
    if (rememberMe) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      cookieOptions.expires = expires;
    }

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(200).json({
      message: "로그인 성공",
      user: { _id: user._id, nickname: user.nickname, email: user.email },
    });
  } catch (error: any) {
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const userLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ 로그인과 동일한 옵션 사용
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      signed: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",  // ✅ 로그인과 동일
      secure: process.env.NODE_ENV === "production" || true,  // ✅ 로그인과 동일
    });

    res.status(200).json({ message: "로그아웃 성공" });
  } catch (error: any) {
    console.error("로그아웃 에러:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const me = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const uid = req.userId; // verifyToken에서 jwt의 uid 주입
    if (!uid) {
      res.status(401).json({ message: "인증이 필요합니다." });
      return;
    }

    const user = await User.findById(uid).select("-password").populate("profile");
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ message: "인증 정보 조회 성공", user });
  } catch (error: any) {
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};


export const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { nickname, email } = req.body;

    const update: any = {};
    if (nickname) update.nickname = nickname;
    if (email) update.email = email;

    if (!Object.keys(update).length) {
      res.status(400).json({ message: "수정할 항목이 없습니다." });
      return;
    }

    // 닉/이메일 중복 체크(자기 자신 제외)
    if (nickname) {
      const dup = await User.findOne({ nickname, _id: { $ne: userId } }).lean();
      if (dup) {
        res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
        return;
      }
    }
    if (email) {
      const dup = await User.findOne({ email, _id: { $ne: userId } }).lean();
      if (dup) {
        res.status(409).json({ message: "이미 등록된 이메일입니다." });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true, select: "-password" });
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ message: "사용자 정보 수정 성공", user });
  } catch (error: any) {
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};


export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "현재/새 비밀번호를 모두 입력하세요." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const ok = await compare(currentPassword, user.password);
    if (!ok) {
      res.status(401).json({ message: "현재 비밀번호가 올바르지 않습니다." });
      return;
    }

    user.password = await hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "비밀번호 변경 성공" });
  } catch (error: any) {
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: "비밀번호를 입력하세요." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const ok = await compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
      return;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "계정 삭제 성공" });
  } catch (error: any) {
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

export const searchAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      res.status(400).json({ message: "검색어를 입력하세요." });
      return;
    }

    // 우체국 우편번호 API 사용
    const apiUrl = `https://api.odcloud.kr/api/15040431/v1/uddi:${encodeURIComponent(keyword as string)}?page=1&perPage=10&serviceKey=YOUR_API_KEY`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json({ 
      message: "주소 검색 성공", 
      addresses: data.data || [] 
    });
  } catch (error: any) {
    console.error("주소 검색 오류:", error);
    res.status(500).json({ message: "주소 검색 실패", error: error.message });
  }
};

// 주소 검색 API (대체 - 공공데이터포털 우편번호 서비스)
export const searchAddressAlternative = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      res.status(400).json({ message: "검색어를 입력하세요." });
      return;
    }

    // 공공데이터포털 우편번호 서비스 API
    const apiUrl = `http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd?ServiceKey=YOUR_API_KEY&searchSe=road&srchwrd=${encodeURIComponent(keyword as string)}&countPerPage=10&currentPage=1`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json({ 
      message: "주소 검색 성공", 
      addresses: data || [] 
    });
  } catch (error: any) {
    console.error("주소 검색 오류:", error);
    res.status(500).json({ message: "주소 검색 실패", error: error.message });
  }
};