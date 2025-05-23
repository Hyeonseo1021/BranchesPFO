import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../utils/Token.js";
import { COOKIE_NAME } from "../utils/Constants.js";

// 로그인 처리 함수 
export const userLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id, password } = req.body; 

		// 아이디로 사용자 조회
		const user = await User.findOne({ id });

		// 사용자가 존재하지 않는 경우
		if (!user) {
			res.status(409).json({
				message: "ERROR",
				cause: "해당 아이디로 등록된 계정을 찾을 수 없습니다.",
			});
			return;
		}

		// 비밀번호 일치 여부 확인
		const isPasswordCorrect = await compare(password, user.password);
		if (!isPasswordCorrect) {
			res.status(403).json({ message: "ERROR", cause: "비밀번호가 일치하지 않습니다." });
			return;
		}

		// 기존 토큰 제거
		res.cookie(COOKIE_NAME, 'clear_token', {
			path: "/",
			domain: process.env.DOMAIN,
			maxAge: 0,
			httpOnly: true,
			signed: true,
			sameSite: 'lax',
			secure: true,
		});

		// JWT 토큰 발급 (아이디 기반)
		const token = createToken(user._id.toString(), user.id, "7d");

		// 쿠키 만료 시간 설정
		const expires = new Date();
		expires.setDate(expires.getDate() + 7);

		// 토큰을 쿠키에 저장
		res.cookie(COOKIE_NAME, token, {
			path: "/",
			domain: process.env.DOMAIN,
			expires,
			httpOnly: true,
			signed: true,
			sameSite: 'lax',
			secure: true,
		});

		// 로그인 성공 응답
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
