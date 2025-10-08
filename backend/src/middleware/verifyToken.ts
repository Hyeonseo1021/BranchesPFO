import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/Constants";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.signedCookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "토큰이 없습니다." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {email: string };
    req.user = { id: decoded.email, email: decoded.email }; // 사용자 정보 설정
    next();
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
