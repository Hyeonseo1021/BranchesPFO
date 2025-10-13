import { AuthRequest } from "../middleware/verifyToken";
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
  console.log("회원가입 API호출, 요청 바디:", req.body); // 요청 데이터 로깅
  try {
    const { id, name, email, password } = req.body;

    if (!id || !name || !email || !password) {
      console.log("입력값 부족");
      res.status(400).json({ message: "모든 필드를 입력하세요." });
      return;
    }

    // 중복 확인 로그 추가 가능
    const existingId = await User.findOne({ id });
    console.log("중복 아이디 확인:", existingId);
    if (existingId) {
      res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
      return;
    }

    const existingEmail = await User.findOne({ email });
    console.log("중복 이메일 확인:", existingEmail);
    if (existingEmail) {
      res.status(409).json({ message: "이미 등록된 이메일입니다." });
      return;
    }

    // 사용자 생성 및 토큰 발행 전 로그
    const hashedPassword = await hash(password, 10);
    const user = new User({ id, name, email, password: hashedPassword });
    await user.save();
    console.log("사용자 생성 완료:", user);

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production'
    });
    console.log("쿠키 설정 완료");

    // 응답 전 로그
    console.log("회원가입 성공 응답 전송");
    res.status(201).json({
      message: "회원가입 성공",
      user: {name: user.name, email: user.email },
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
      //domain: process.env.DOMAIN || "localhost",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // 성공 응답
    res.status(200).json({ message: "로그인 성공", name: user.name, email: user.email });
  } catch (error: any) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 사용자 인증 확인
export const verifyUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(401).json({ message: "사용자 인증에 실패했습니다." });
      return; // 여기 return은 함수 종료용으로만 사용 (res 반환 X)
    }

    res.status(200).json({ 
      message: "인증 성공",
      id: user.id,
      name: user.name, 
      email: user.email 
    });
  } catch (error) {
    console.error("사용자 확인 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
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

// 사용자 정보 조회
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ id: userId }).select('-password');
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ 
      message: "사용자 정보 조회 성공", 
      user 
    });
  } catch (error: any) {
    console.error("사용자 정보 조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 사용자 정보 수정
export const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, phone, address } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findOneAndUpdate(
      { id: userId },
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ 
      message: "사용자 정보 수정 성공", 
      user 
    });
  } catch (error: any) {
    console.error("사용자 정보 수정 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 사용자 비밀번호 변경
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "현재 비밀번호와 새 비밀번호를 입력하세요." });
      return;
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      res.status(401).json({ message: "현재 비밀번호가 올바르지 않습니다." });
      return;
    }

    // 새 비밀번호 해시화 및 저장
    const hashedNewPassword = await hash(newPassword, 10);
    await User.findOneAndUpdate(
      { id: userId },
      { password: hashedNewPassword }
    );

    res.status(200).json({ message: "비밀번호 변경 성공" });
  } catch (error: any) {
    console.error("비밀번호 변경 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 사용자 계정 삭제
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: "비밀번호를 입력하세요." });
      return;
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    // 비밀번호 확인
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
      return;
    }

    // 사용자 삭제
    await User.findOneAndDelete({ id: userId });

    res.status(200).json({ message: "계정 삭제 성공" });
  } catch (error: any) {
    console.error("계정 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", cause: error.message });
  }
};

// 주소 검색 API (우편번호 서비스)
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