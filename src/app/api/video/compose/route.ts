import { NextRequest, NextResponse } from "next/server";

const RENDER_SERVER_URL =
  process.env.RENDER_SERVER_URL ?? "https://render.storygridpro.com";

const APP_URL =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://momentmarketingengine.com";

function makeAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${APP_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { segments, overlays } = body;
    const { platform, aspectRatio } = body;

    if (!segments?.length) {
      return NextResponse.json(
        { error: "Missing required field: segments" },
        { status: 400 }
      );
    }

    // Rewrite relative URLs to absolute so the remote render server can fetch them
    segments = segments.map((seg: any) => {
      if (seg.videoUrl) seg.videoUrl = makeAbsoluteUrl(seg.videoUrl);
      if (seg.props) {
        if (seg.props.logoUrl) seg.props.logoUrl = makeAbsoluteUrl(seg.props.logoUrl);
        if (seg.props.imageUrl) seg.props.imageUrl = makeAbsoluteUrl(seg.props.imageUrl);
      }
      return seg;
    });
    if (overlays) {
      overlays = overlays.map((ov: any) => {
        if (ov.props) {
          if (ov.props.imageUrl) ov.props.imageUrl = makeAbsoluteUrl(ov.props.imageUrl);
          if (ov.props.logoUrl) ov.props.logoUrl = makeAbsoluteUrl(ov.props.logoUrl);
        }
        return ov;
      });
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
