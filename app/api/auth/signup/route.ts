import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
// register new landlord user
export async function POST(req: Request) {
    try {
        const { name, lastName, email, password } = await req.json();
 // connect to database
        await connectMongoDB();

        //to check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email already registered" }, { status: 409 });
        }
// to hash password before saving
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            lastName: lastName || "",
            email,
            password: hashedPassword,
            role: "Landlord",
        });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}