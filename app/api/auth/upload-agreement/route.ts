import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyToken } from "@/lib/auth";

const PDF_MIME = "application/pdf";
// to upload agreement PDF
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        verifyToken(token);
// extract file from form data
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        if (file.type !== PDF_MIME) {
            return NextResponse.json(
                { message: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
// ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "agreements");
        await mkdir(uploadDir, { recursive: true });
// to validate file extension
        const ext = path.extname(file.name)?.toLowerCase() || ".pdf";
        if (ext !== ".pdf") {
            return NextResponse.json(
                { message: "Only PDF files are allowed" },
                { status: 400 }
            );
        }
        const filename = `agreement-${Date.now()}${ext}`;
        const filepath = path.join(uploadDir, filename);
// save file to disk
        await writeFile(filepath, buffer);

        const agreementUrl = `/agreements/${filename}`;
        return NextResponse.json({ agreementUrl });
    } catch {
        return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }
}
