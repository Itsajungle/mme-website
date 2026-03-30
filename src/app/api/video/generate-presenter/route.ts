import { NextRequest, NextResponse } from "next/server";

const DIMENSION_MAP: Record<string, { width: number; height: number }> = {
  "9:16": { width: 720, height: 1280 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
};

// ─── Avatar → Presenter Engine Voice ID Mapping ─────────────────────────────
// These are HeyGen-native voice IDs (not ElevenLabs). The client may send
// an ElevenLabs voice ID from the audio voice dropdown — this map lets us
// resolve the correct presenter engine voice for each avatar.
const HEYGEN_VOICE_MAP: Record<string, string> = {
  "Marcus_Suit_Front_public": "9191c82c103a47419df976aaca391adb",
  "fe4364faaff54befa7e0575557dcb7b4": "dd669769e46d4ab29eac28afcbadbbaf",
  "26dfb00ad9244da9bcf6cda5d5c2db88": "cfdd71ff3755430aa80fa7e17779833b",
  "0de4f6e9ab0a430bb67ffde4feed7689": "a11d6e4b0cdd4b0aafdc1195e0b8226c",
  "924dbfd6d7874cc49b74e47b18c18fe4": "152025178ffd474ebad0d7dacacffcdd",
  "8be1f78438f446c29b4fea430a0092b3": "573f6303433b4afcafc5e2ff354256c7",
  "5fe14e11b47e4f6aaf0ee05072c5c9dd": "d103c8b082014fd88de855d9bbda36c9",
  "3c173043b72e4c60a5d4d3466eb55bdd": "6f5aaba473a5435a9c6fba2f3c307ca1",
};

// Default fallback voice (Marcus voice) if no mapping exists
const DEFAULT_HEYGEN_VOICE = "9191c82c103a47419df976aaca391adb";

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

    if (!scriptText || !avatarId) {
      return NextResponse.json(
        { error: "Missing required fields: scriptText, avatarId" },
        { status: 400 }
      );
    }

    // Resolve the correct presenter engine voice ID:
    // 1. If the voiceId is already a 32-char hex (HeyGen format), use it directly
    // 2. Otherwise look up the avatar's mapped HeyGen voice
    // 3. Fall back to default
    const isHeygenVoiceId = /^[a-f0-9]{32}$/.test(voiceId ?? "");
    const resolvedVoiceId = isHeygenVoiceId
      ? voiceId
      : HEYGEN_VOICE_MAP[avatarId] ?? DEFAULT_HEYGEN_VOICE;

    console.log(`[generate-presenter] Avatar: ${avatarId}, Voice resolved: ${resolvedVoiceId} (input was: ${voiceId})`);

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
              voice_id: resolvedVoiceId,
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
