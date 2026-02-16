import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
// to get the authenticated user details
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { userId } = verifyToken(token);
        await connectMongoDB();

        const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpire");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            _id: user._id,
            name: user.name,
            lastName: user.lastName ?? "",
            email: user.email,
            role: user.role ?? "Landlord",
            profileImage: user.profileImage ?? null,
        });
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}
