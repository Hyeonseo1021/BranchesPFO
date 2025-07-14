import jwt from "jsonwebtoken";

// 토큰 만료 형식 타입 (예: 7d, 1h)
type ExpiresIn = `${number}d` | `${number}h` | `${number}m` | `${number}s`;

// JWT 토큰 생성 함수
export const createToken = (id: string, loginId: string, expiresIn: ExpiresIn) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET 환경변수가 없습니다.");
  return jwt.sign({ id, loginId }, process.env.JWT_SECRET, { expiresIn });
};

