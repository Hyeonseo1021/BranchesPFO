import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../utils/Constants';

export interface AuthRequest extends Request {
  userId?: string;  // ✅ me 함수에서 userId를 읽음
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    console.log('=== verifyToken 시작 ===');
    console.log('🔍 COOKIE_NAME:', COOKIE_NAME);
    console.log('🔍 signedCookies:', req.signedCookies);
    
    const token = req.signedCookies[COOKIE_NAME];

    if (!token) {
      console.error('❌ 토큰 없음');
      res.status(401).json({ message: '인증되지 않았습니다. 로그인이 필요합니다.' });
      return; 
    }

    // ✅ createToken에서 id로 생성했으므로 id로 읽기
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    
    console.log('✅ 토큰 디코딩 성공:', decoded);
    
    // ✅ decoded.id를 req.userId에 저장
    req.userId = decoded.id;
    
    console.log('✅ req.userId 설정:', req.userId);
    console.log('======================');
    
    next();
  } catch (error: any) {
    console.error('❌ 토큰 검증 실패:', error.message);
    res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

export default verifyToken;