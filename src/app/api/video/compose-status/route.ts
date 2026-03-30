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
    const response = await fetch(`${RENDER_SERVER_URL}/render/${renderId}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[compose-status] Render server error:", response.status, text);
      return NextResponse.json(
        { error: `Render server error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[compose-status] Render server status:", JSON.stringify(data));
    return NextResponse.json({
      status: data.status ?? "rendering",
      progress: data.progress ?? 0,
      outputUrl: data.outputUrl ?? data.url ?? null,
      error: data.error ?? null,
    });
  } catch (err) {
    console.error("[compose-status] Error:", err);
    const message = err instanceof Error ? err.message : "Status check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
