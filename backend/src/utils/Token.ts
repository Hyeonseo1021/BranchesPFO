import jwt from "jsonwebtoken";

export const createToken = (userId: string, email: string, expiresIn: string): string => {
    const secretKey = process.env.JWT_SECRET || "default_secret";
    return jwt.sign({ userId, email }, secretKey, { expiresIn });
};