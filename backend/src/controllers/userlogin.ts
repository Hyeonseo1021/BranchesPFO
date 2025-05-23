// src/controllers/authSignUpOnly.ts
// authController.ts에서 회원가입(userSignUp) 기능만 따로 추출한 파일입니다.

import { Request, Response } from "express";
import { hash } from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../utils/Token.js";
import { COOKIE_NAME } from "../utils/Constants.js";

// 회원가입 처리
export const userSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "모든 필드를 입력해주세요." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "ERROR",
                cause: "비밀번호와 비밀번호 확인이 일치하지 않습니다."
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "ERROR",
                cause: "이미 존재하는 이메일입니다."
            });
        }

        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        if (!user._id) {
            return res.status(500).json({ message: "사용자 ID 생성에 실패했습니다." });
        }

        res.cookie(COOKIE_NAME, 'clear_token', {
            path: "/",
            domain: process.env.DOMAIN || "localhost",
            maxAge: 0,
            httpOnly: true,
            signed: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === "production",
        });

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

        return res.status(201).json({
            message: "SUCCESS",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("userSignUp 오류:", error);
        return res.status(500).json({
            message: "ERROR",
            cause: "서버 오류가 발생했습니다.",
        });
    }
};
