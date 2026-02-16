import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Routes from "@/constants/routes";

const { BASE_URL, SMTP_EMAIL, SMTP_PASSWORD } = process.env;


export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        // connect to database
        await connectMongoDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        //to  generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();
        // for email that sends the reset password link
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD,
            },
        });
        // create reset URL
        const resetURL = `${BASE_URL}/${Routes.RESET_PASSWORD}?token=${resetToken}`;
        await transporter.sendMail({
            from: SMTP_EMAIL,
            to: email,
            subject: "Password Reset Request for Dwella",
            text: `You requested a password reset for Dwella. Click the link to reset your password: ${resetURL}`,
        });

        return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}