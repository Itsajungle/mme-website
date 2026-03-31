import { NextRequest } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";

const VIDEO_DIR = "/tmp/mme-video";

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get("file");
  if (!filename) {
    return Response.json({ error: "Missing file parameter" }, { status: 400 });
  }

  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  if (sanitized !== filename || filename.includes("..")) {
    return Response.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = join(VIDEO_DIR, sanitized);
  try {
    const fileStat = await stat(filepath);
    if (!fileStat.isFile()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    const buffer = await readFile(filepath);
    const ext = filename.split(".").pop()?.toLowerCase();
    const contentType = ext === "mp4" ? "video/mp4" : "video/webm";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=3600",
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return Response.json({ error: "Video file not found" }, { status: 404 });
  }
}
