import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
// to update the authenticated user profile
export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { userId } = verifyToken(token);
        // Connect to database
        await connectMongoDB();

        const body = await req.json();
        const { name, lastName, email, profileImage } = body;

        const update: Record<string, string | null> = {};
        if (typeof name === "string" && name.trim()) update.name = name.trim();
        if (typeof lastName === "string") update.lastName = lastName.trim();
        //to check email uniqueness before updating
        if (typeof email === "string" && email.trim()) {
            const newEmail = email.trim();
            const existing = await User.findOne({ email: newEmail, _id: { $ne: userId } });
            if (existing) {
                return NextResponse.json({ message: "Email already in use" }, { status: 409 });
            }
            update.email = newEmail;
        }
        // profile image update or removal
        if (profileImage !== undefined) {
            update.profileImage = typeof profileImage === "string" && profileImage.trim() ? profileImage.trim() : null;
        }
        // update user and return updated document
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: update },
            { new: true }
        ).select("-password -resetPasswordToken -resetPasswordExpire");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        });
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}
