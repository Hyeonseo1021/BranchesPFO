import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../utils/Constants';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.signedCookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: '인증되지 않았습니다. 로그인이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

export default authMiddleware;