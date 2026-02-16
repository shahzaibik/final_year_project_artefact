import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectMongoDB();
        const url = new URL(req.url);
        const unreadOnly = url.searchParams.get("unreadOnly") === "true";
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);

        const query = { userId: user._id };
        if (unreadOnly) (query as Record<string, unknown>).read = false;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        const unreadCount = await Notification.countDocuments({ userId: user._id, read: false });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { markAllRead } = body;
        await connectMongoDB();

        if (markAllRead) {
            await Notification.updateMany({ userId: user._id }, { read: true });
            return NextResponse.json({ message: "All notifications marked as read" });
        }

        const { notificationId } = body;
        if (notificationId) {
            const n = await Notification.findOneAndUpdate(
                { _id: notificationId, userId: user._id },
                { read: true },
                { new: true }
            );
            if (!n) return NextResponse.json({ message: "Notification not found" }, { status: 404 });
            return NextResponse.json(n);
        }

        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
