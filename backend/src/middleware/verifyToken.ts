import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../utils/Constants';

export interface AuthRequest extends Request {
  userId?: string;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    
    // ✅ signedCookies와 일반 cookies 모두 확인
    const token = req.signedCookies[COOKIE_NAME] || req.cookies[COOKIE_NAME];

    if (!token) {
      console.error('❌ 토큰 없음');
      res.status(401).json({ message: '인증되지 않았습니다. 로그인이 필요합니다.' });
      return; 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    
    console.log('✅ 토큰 디코딩 성공:', decoded);
    
    // ✅ 두 곳 모두에 저장 (호환성)
    req.userId = decoded.id;
    res.locals.jwtData = { id: decoded.id, email: decoded.email };
    
    console.log('✅ req.userId 설정:', req.userId);
    console.log('✅ res.locals.jwtData 설정:', res.locals.jwtData);
    console.log('======================');
    
    next();
  } catch (error: any) {
    console.error('❌ 토큰 검증 실패:', error.message);
    res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

export default verifyToken;