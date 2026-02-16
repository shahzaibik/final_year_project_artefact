import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
// to reset user password by valid token
export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: "Token and password are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        //to find user with  reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            );
        }
        // hashing new password before saving
        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error },
            { status: 500 }
        );
    }
}