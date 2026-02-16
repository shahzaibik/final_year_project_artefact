import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/db";
import Issue from "@/models/Issue";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";
import "@/models/Handyman";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Next.js route handler signature
export async function GET(_req: Request) {
    try {
        await connectMongoDB();
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const role = String(user.role ?? "").toLowerCase();
        const userId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!userId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }

        if (role === "tenant") {
            const issues = await Issue.find({ tenantId: userId })
                .populate("handymanId", "name email phoneNumber")
                .sort({ createdAt: -1 });
            return NextResponse.json(issues);
        }

        const issues = await Issue.find({ landlordId: userId })
            .populate("tenantId", "name email")
            .populate("handymanId", "name email phoneNumber")
            .sort({ createdAt: -1 });
        return NextResponse.json(issues);
    } catch (error) {
        console.error("[GET /api/issues]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (String(user.role) !== "Tenant") {
            return NextResponse.json({ message: "Only tenants can create issues" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description } = body;
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ message: "Title is required" }, { status: 400 });
        }

        const rawLandlordId = user.landlordId ?? (user as { landlordId?: unknown }).landlordId;
        if (!rawLandlordId) {
            return NextResponse.json({ message: "Tenant has no landlord. Please ask your landlord to add you from their Tenants page." }, { status: 400 });
        }

        const landlordId = mongoose.Types.ObjectId.isValid(String(rawLandlordId))
            ? new mongoose.Types.ObjectId(String(rawLandlordId))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid landlord reference." }, { status: 400 });
        }

        const tenantId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!tenantId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }

        await connectMongoDB();

        const issue = await Issue.create({
            title: title.trim(),
            description: (description || "").trim(),
            tenantId,
            landlordId,
        });

        const tenantName = [user.name, user.lastName].filter(Boolean).join(" ") || "Tenant";
        await Notification.create({
            userId: landlordId,
            type: "issue_request",
            message: `${tenantName} submitted a new issue: ${issue.title}`,
            relatedIssueId: issue._id,
        });

        return NextResponse.json(
            {
                message: "Issue created",
                issue: {
                    _id: issue._id,
                    title: issue.title,
                    description: issue.description,
                    status: issue.status,
                    tenantId: issue.tenantId,
                    landlordId: issue.landlordId,
                    handymanId: issue.handymanId,
                    createdAt: issue.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
