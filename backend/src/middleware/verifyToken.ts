import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/Constants";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.signedCookies[COOKIE_NAME];
		if (!token) return res.status(401).json({ message: "ERROR", cause: "토큰이 없습니다." });

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
		if (!decoded) return res.status(401).json({ message: "ERROR", cause: "유효하지 않은 토큰" });

		res.locals.jwtData = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "ERROR", cause: "토큰 오류" });
	}
};
