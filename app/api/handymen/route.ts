import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/db";
import Handyman from "@/models/Handyman";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const role = String((user as { role?: string }).role ?? "").toLowerCase();
        if (role === "tenant") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        await connectMongoDB();
        const landlordId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }
        const handymen = await Handyman.find({ landlordId }).sort({ createdAt: -1 });
        return NextResponse.json(handymen);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const role = String((user as { role?: string }).role ?? "").toLowerCase();
        if (role === "tenant") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, phoneNumber, address, profession, profileImage } = body;
        if (!name || !email) {
            return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
        }

        await connectMongoDB();

        const landlordId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }

        const handyman = await Handyman.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phoneNumber: (phoneNumber || "").trim(),
            address: (address || "").trim(),
            profession: (profession || "").trim(),
            profileImage: profileImage ? String(profileImage).trim() : null,
            landlordId,
        });

        await Notification.create({
            userId: user._id,
            type: "handyman_added",
            message: `You added handyman ${handyman.name} (${handyman.email}).`,
        });

        return NextResponse.json(
            { message: "Handyman added", handyman },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
