import { NextRequest, NextResponse } from "next/server";

const DIMENSION_MAP: Record<string, { width: number; height: number }> = {
  "9:16": { width: 720, height: 1280 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.HEYGEN_API_KEY;

  if (!apiKey) {
    // Demo mode: return a mock video ID
    return NextResponse.json({
      video_id: `demo-${Date.now()}`,
      source: "demo",
    });
  }

  try {
    const body = await req.json();
    const { scriptText, avatarId, voiceId, aspectRatio = "9:16" } = body;

    if (!scriptText || !avatarId || !voiceId) {
      return NextResponse.json(
        { error: "Missing required fields: scriptText, avatarId, voiceId" },
        { status: 400 }
      );
    }

    const dimension = DIMENSION_MAP[aspectRatio] ?? DIMENSION_MAP["9:16"];

    const response = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: avatarId,
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: scriptText,
              voice_id: voiceId,
            },
          },
        ],
        dimension,
        aspect_ratio: null,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[generate-presenter] API error:", response.status, text);
      return NextResponse.json(
        { error: `Presenter generation error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const videoId = data?.data?.video_id;

    if (!videoId) {
      return NextResponse.json(
        { error: "No video ID returned from presenter engine" },
        { status: 502 }
      );
    }

    return NextResponse.json({ video_id: videoId, source: "live" });
  } catch (err) {
    console.error("[generate-presenter] Error:", err);
    const message = err instanceof Error ? err.message : "Presenter generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
