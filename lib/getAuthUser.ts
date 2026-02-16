import { cookies } from "next/headers";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
// AuthUser interface
export interface AuthUser {
    _id: unknown;
    name?: string;
    lastName?: string;
    email?: string;
    role?: string;
    [key: string]: unknown;
}
// to get the authenticated user details
export async function getAuthUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    try {
        const { userId } = verifyToken(token);
        await connectMongoDB();
        const user = await User.findById(userId)
            .select("-password -resetPasswordToken -resetPasswordExpire")
            .lean();
        return user as AuthUser | null;
    } catch {
        return null;
    }
}
