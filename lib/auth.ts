import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// JWT payload interface
interface TokenPayload {
    userId: string; // ID of the authenticated user
    iat?: number; // Issued  time stamp
    exp?: number; // Expiration tim
}
// secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// yoken expiration time
const JWT_EXPIRES_IN = "7d";
// to hash password function

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
// to compare password function
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};
// to generate token function
export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
// to verify token function
export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};