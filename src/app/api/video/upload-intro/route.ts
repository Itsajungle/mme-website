import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const VIDEO_DIR = "/tmp/mme-video";

export async function POST(request: NextRequest) {
  try {
    await mkdir(VIDEO_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get("video") as File | null;
    if (!file) {
      return Response.json({ error: "No video file provided" }, { status: 400 });
    }

    const ext = file.name?.split(".").pop()?.toLowerCase() || "webm";
    const filename = `intro-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(VIDEO_DIR, filename), buffer);

    // Return a URL the render server can access
    const serveUrl = `/api/video/serve-intro?file=${filename}`;
    return Response.json({ success: true, filename, serveUrl, size: buffer.length });
  } catch (err) {
    console.error("[upload-intro] Error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
