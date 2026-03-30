import { NextRequest, NextResponse } from "next/server";

const RENDER_SERVER_URL =
  process.env.RENDER_SERVER_URL ?? "https://render.storygridpro.com";

export async function GET(req: NextRequest) {
  const renderId = req.nextUrl.searchParams.get("renderId");

  if (!renderId) {
    return NextResponse.json(
      { error: "Missing required parameter: renderId" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${RENDER_SERVER_URL}/render/${renderId}/download`,
      { signal: AbortSignal.timeout(300000) }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Download failed: ${response.status}` },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="production-${renderId}.mp4"`,
        "Content-Length": String(buffer.byteLength),
      },
    });
  } catch (err) {
    console.error("[compose-download] Error:", err);
    const message = err instanceof Error ? err.message : "Download failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
