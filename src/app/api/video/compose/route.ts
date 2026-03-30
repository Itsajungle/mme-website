import { NextRequest, NextResponse } from "next/server";

const RENDER_SERVER_URL =
  process.env.RENDER_SERVER_URL ?? "https://render.storygridpro.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { segments, overlays, platform, aspectRatio } = body;

    if (!segments?.length) {
      return NextResponse.json(
        { error: "Missing required field: segments" },
        { status: 400 }
      );
    }

    const payload = { segments, overlays, platform, aspectRatio };
    console.log("[compose] Sending to render server:", JSON.stringify(payload).slice(0, 2000));

    const response = await fetch(`${RENDER_SERVER_URL}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[compose] Render server error:", response.status, text);
      return NextResponse.json(
        { error: `Render server error (${response.status}): ${text.slice(0, 500)}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[compose] Render server response:", JSON.stringify(data));
    return NextResponse.json({
      renderId: data.renderId ?? data.id,
      status: "rendering",
    });
  } catch (err) {
    console.error("[compose] Error:", err);
    const message = err instanceof Error ? err.message : "Composition failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
