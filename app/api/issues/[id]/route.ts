import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/db";
import Issue from "@/models/Issue";
import Notification from "@/models/Notification";
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
            return NextResponse.json({ message: "Only landlord can assign handyman" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const handymanIdRaw = body.handymanId;
        const reject = body.reject === true;

        await connectMongoDB();

        const landlordId = user._id && mongoose.Types.ObjectId.isValid(String(user._id))
            ? new mongoose.Types.ObjectId(String(user._id))
            : null;
        if (!landlordId) {
            return NextResponse.json({ message: "Invalid session." }, { status: 401 });
        }
        const issue = await Issue.findOne({ _id: id, landlordId });
        if (!issue) {
            return NextResponse.json({ message: "Issue not found" }, { status: 404 });
        }

        if (reject) {
            issue.status = "rejected";
            await issue.save();

            await Notification.create({
                userId: issue.tenantId,
                type: "issue_rejected",
                message: `Your issue has been rejected by the landlord: ${issue.title}`,
                relatedIssueId: issue._id,
            });
        } else if (handymanIdRaw && mongoose.Types.ObjectId.isValid(String(handymanIdRaw))) {
            const handymanIdObj = new mongoose.Types.ObjectId(String(handymanIdRaw));
            issue.handymanId = handymanIdObj;
            issue.status = "assigned";
            await issue.save();

            await Notification.create({
                userId: issue.tenantId,
                type: "handyman_assigned",
                message: `A handyman has been assigned to your issue: ${issue.title}`,
                relatedIssueId: issue._id,
            });
        }

        const updated = await Issue.findById(issue._id)
            .populate("tenantId", "name email")
            .populate("handymanId", "name email phoneNumber");

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[PATCH /api/issues/[id]]", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
