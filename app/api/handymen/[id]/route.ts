import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/db";
import Handyman from "@/models/Handyman";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const role = String((user as { role?: string }).role ?? "").toLowerCase();
        if (role === "tenant") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, email, phoneNumber, address, profession, profileImage } = body;

        await connectMongoDB();

        const landlordId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }
        const handyman = await Handyman.findOne({ _id: id, landlordId });
        if (!handyman) {
            return NextResponse.json({ message: "Handyman not found" }, { status: 404 });
        }

        const update: Record<string, string | null> = {};
        if (typeof name === "string" && name.trim()) update.name = name.trim();
        if (typeof email === "string" && email.trim()) update.email = email.trim().toLowerCase();
        if (typeof phoneNumber === "string") update.phoneNumber = phoneNumber.trim();
        if (typeof address === "string") update.address = address.trim();
        if (typeof profession === "string") update.profession = profession.trim();
        if (profileImage !== undefined) {
            if (profileImage === null) update.profileImage = null;
            else if (typeof profileImage === "string") update.profileImage = profileImage.trim();
        }

        const updated = await Handyman.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        );
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const role = String((user as { role?: string }).role ?? "").toLowerCase();
        if (role === "tenant") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        await connectMongoDB();

        const landlordId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }
        const handyman = await Handyman.findOne({ _id: id, landlordId });
        if (!handyman) {
            return NextResponse.json({ message: "Handyman not found" }, { status: 404 });
        }

        await Handyman.findByIdAndDelete(id);
        return NextResponse.json({ message: "Handyman deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
