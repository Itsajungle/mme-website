import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Missing required parameter: videoId" },
      { status: 400 }
    );
  }

  // Demo mode
  if (videoId.startsWith("demo-")) {
    return NextResponse.json({
      status: "completed",
      video_url: "",
      source: "demo",
    });
  }

  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Presenter engine not configured" },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      { headers: { "X-Api-Key": apiKey } }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("[presenter-status] API error:", response.status, text);
      return NextResponse.json(
        { error: `Status check error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const statusData = data?.data;

    return NextResponse.json({
      status: statusData?.status ?? "processing",
      video_url: statusData?.video_url ?? null,
      error: statusData?.error ?? null,
      source: "live",
    });
  } catch (err) {
    console.error("[presenter-status] Error:", err);
    const message = err instanceof Error ? err.message : "Status check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
