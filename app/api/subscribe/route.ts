import connectMongoDB from "@/lib/db";
import BookDemoModel from "@/models/BookDemoModel";

export async function POST(req: Request) {
    try {
        await connectMongoDB();
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return Response.json(
                { message: "Name and email are required" },
                { status: 400 }
            );
        }

        const newEntry = new BookDemoModel({ name, email });

        try {
            await newEntry.save();
            return Response.json(
                { message: "Subscription successful" },
                { status: 201 }
            );
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 11000) {
                return Response.json(
                    { message: "Email already subscribed" },
                    { status: 409 }
                );
            }
            console.error("Database Error:", error);
            return Response.json(
                { message: "Database error occurred" },
                { status: 500 }
            );
        }
    } catch (error) {
        return Response.json(
            { message: "Internal Server Error", error },
            { status: 500 }
        );
    }
}