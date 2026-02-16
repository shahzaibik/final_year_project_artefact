import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyToken } from "@/lib/auth";
// to upload profile image 
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        verifyToken(token);
        // get file from form data
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // to ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "profile-images");
        await mkdir(uploadDir, { recursive: true });

        const ext = path.extname(file.name) || ".jpg";
        const filename = `profile-${Date.now()}${ext}`;
        const filepath = path.join(uploadDir, filename);
        // to save file to disk
        await writeFile(filepath, buffer);

        const profileImageUrl = `/profile-images/${filename}`;
        return NextResponse.json({ profileImageUrl });
    } catch {
        return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }
}
