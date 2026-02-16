import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { hashPassword } from "@/lib/auth";
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
        const tenants = await User.find({ landlordId, role: "Tenant" })
            .select("_id name lastName email role profileImage landlordId phoneNumber ssn address profession emergencyContact agreement createdAt")
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(tenants);
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
        const name = body.name;
        const lastName = body.lastName;
        const email = body.email;
        const password = body.password;
        const confirmPassword = body.confirmPassword;
        const phoneNumber = body.phoneNumber;
        const ssn = body.ssn != null ? String(body.ssn).trim() : "";
        const address = body.address;
        const profession = body.profession;
        const emergencyContact = body.emergencyContact;
        const profileImage = body.profileImage ?? null;
        const agreement = body.agreement ?? null;

        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { message: "Name, email, password and confirm password are required" },
                { status: 400 }
            );
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character." },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email already registered" }, { status: 409 });
        }

        const landlordId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid session. Please log in again as landlord." }, { status: 401 });
        }

        const hashedPassword = await hashPassword(password);
        const newTenant = new User({
            name: String(name || "").trim(),
            lastName: String(lastName || "").trim(),
            email: String(email || "").trim().toLowerCase(),
            password: hashedPassword,
            role: "Tenant",
            landlordId,
            profileImage: profileImage ? String(profileImage).trim() : null,
            phoneNumber: String(phoneNumber || "").trim(),
            ssn,
            address: String(address || "").trim(),
            profession: String(profession || "").trim(),
            emergencyContact: String(emergencyContact || "").trim(),
            agreement: agreement ? String(agreement).trim() : null,
        });
        await newTenant.save();

        await Notification.create({
            userId: user._id,
            type: "tenant_added",
            message: `You added tenant ${newTenant.name} (${newTenant.email}).`,
        });

        return NextResponse.json(
            {
                message: "Tenant created successfully",
                tenant: {
                    _id: newTenant._id,
                    name: newTenant.name,
                    lastName: newTenant.lastName,
                    email: newTenant.email,
                    role: newTenant.role,
                    landlordId: newTenant.landlordId,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
