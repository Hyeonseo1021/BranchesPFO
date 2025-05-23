import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./Constants.js";

type ExpiresIn = `${number}d` | `${number}h` | `${number}m` | `${number}s`;

export const createToken = (id: string, email: string, expiresIn: ExpiresIn) => {
  const payload = { id, email };

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  return token;
};
