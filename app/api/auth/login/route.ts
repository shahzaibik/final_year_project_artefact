import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";

const NODE_ENV = process.env.NODE_ENV

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        // to  connect  database
        await connectMongoDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
        //to  validate password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
        //to generate JWT token
        const token = generateToken(user._id);

        const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
        //to  set auth cookie for 7 day
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}