import { NextResponse } from "next/server";
import { getCurrentUser, createAdminClient } from "@/lib/supabaseServer";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to download the ebook." },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("ebook_purchased")
      .eq("id", user.id)
      .single();

    if (!profile?.ebook_purchased) {
      return NextResponse.json(
        { error: "You haven't purchased the ebook yet." },
        { status: 403 }
      );
    }

    // Resolve the ebook file path
    const ebookPath = path.join(process.cwd(), "private", "ebook.docx");

    if (!fs.existsSync(ebookPath)) {
      console.error("Ebook file not found at:", ebookPath);
      return NextResponse.json(
        { error: "Ebook file not found. Please contact support." },
        { status: 500 }
      );
    }

    const fileBuffer = fs.readFileSync(ebookPath);
    const fileName = "Success-Bridge-B1-Ebook.docx";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Download ebook error:", error);
    return NextResponse.json(
      { error: "Failed to download ebook." },
      { status: 500 }
    );
  }
}
