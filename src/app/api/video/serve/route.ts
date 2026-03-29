import { NextRequest } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const VIDEOS_DIR = "/tmp/mme-videos";

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");

  if (!file || file.includes("..") || file.includes("/")) {
    return Response.json({ error: "Invalid file parameter" }, { status: 400 });
  }

  const filePath = path.join(VIDEOS_DIR, file);

  try {
    await stat(filePath);
  } catch {
    return Response.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = await readFile(filePath);
  const ext = path.extname(file).toLowerCase();
  const contentType =
    ext === ".webm"
      ? "video/webm"
      : ext === ".mov"
      ? "video/quicktime"
      : "video/mp4";

  const body = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
