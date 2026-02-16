import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
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
        const { name, lastName, email, phoneNumber, ssn, address, profession, emergencyContact, profileImage, agreement } = body;

        await connectMongoDB();

        const landlordId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }
        const tenant = await User.findOne({ _id: id, landlordId, role: "Tenant" });
        if (!tenant) {
            return NextResponse.json({ message: "Tenant not found" }, { status: 404 });
        }

        const update: Record<string, string | null> = {};
        if (typeof name === "string" && name.trim()) update.name = name.trim();
        if (typeof lastName === "string") update.lastName = lastName.trim();
        if (typeof email === "string" && email.trim()) {
            const newEmail = email.trim().toLowerCase();
            const existing = await User.findOne({ email: newEmail, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ message: "Email already in use" }, { status: 409 });
            }
            update.email = newEmail;
        }
        if (typeof phoneNumber === "string") update.phoneNumber = phoneNumber.trim();
        if (typeof ssn === "string") update.ssn = ssn.trim();
        if (typeof address === "string") update.address = address.trim();
        if (typeof profession === "string") update.profession = profession.trim();
        if (typeof emergencyContact === "string") update.emergencyContact = emergencyContact.trim();
        if (profileImage !== undefined) {
            if (profileImage === null) update.profileImage = null;
            else if (typeof profileImage === "string") update.profileImage = profileImage.trim();
        }
        if (agreement !== undefined) {
            if (agreement === null) update.agreement = null;
            else if (typeof agreement === "string") update.agreement = agreement.trim();
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        ).select("-password -resetPasswordToken -resetPasswordExpire");

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
        const tenant = await User.findOne({ _id: id, landlordId, role: "Tenant" });
        if (!tenant) {
            return NextResponse.json({ message: "Tenant not found" }, { status: 404 });
        }

        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: "Tenant deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
