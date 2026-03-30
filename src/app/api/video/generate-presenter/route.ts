import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const DIMENSION_MAP: Record<string, { width: number; height: number }> = {
  "9:16": { width: 720, height: 1280 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
};

const AUDIO_DIR = "/tmp/mme-audio";

// ─── Generate speech audio via ElevenLabs ───────────────────────────────────
// We use ElevenLabs for voice generation (Irish voices!) and HeyGen for
// avatar lip-sync only. This gives us full control over voice selection.
async function generateElevenLabsAudio(
  text: string,
  voiceId: string
): Promise<Buffer> {
  const elApiKey = process.env.ELEVENLABS_API_KEY;
  if (!elApiKey) throw new Error("Voice engine not configured");

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": elApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_v3",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("[generate-presenter] ElevenLabs error:", response.status, errText);
    throw new Error(`Voice generation failed: ${response.status}`);
  }

  const audioBuffer = await response.arrayBuffer();
  return Buffer.from(audioBuffer);
}

// ─── Save audio locally and return a public URL ─────────────────────────────
// We host the audio on our own server via /api/audio/serve so HeyGen can
// fetch it for lip-sync. This avoids flaky HeyGen asset upload endpoints.
async function saveAudioAndGetUrl(
  audioBuffer: Buffer,
  requestUrl: string
): Promise<string> {
  await mkdir(AUDIO_DIR, { recursive: true });
  const filename = `presenter-${randomUUID()}.mp3`;
  await writeFile(join(AUDIO_DIR, filename), audioBuffer);

  // Build public URL — use APP_URL env var if set (for reverse proxy scenarios),
  // otherwise use production domain (Docker/Coolify proxy makes req.url localhost)
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  let origin: string;
  if (appUrl) {
    origin = appUrl.replace(/\/$/, "");
  } else {
    // Hardcoded fallback for production — req.url is localhost behind reverse proxy
    origin = "https://momentmarketingengine.com";
  }
  console.log(`[generate-presenter] Audio serve origin: ${origin}`);
  return `${origin}/api/audio/serve?file=${filename}`;
}

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

    const dimension = DIMENSION_MAP[aspectRatio] ?? DIMENSION_MAP["9:16"];

    // Default ElevenLabs voice if none provided (Paul - Irish broadcaster)
    const elVoiceId = voiceId || "7nDsTGv9cjBVU2m1OA8F";

    console.log(`[generate-presenter] Avatar: ${avatarId}, ElevenLabs voice: ${elVoiceId}`);
    console.log(`[generate-presenter] Step 1: Generating ElevenLabs audio...`);

    // Step 1: Generate audio via ElevenLabs (Irish voice!)
    const audioBuffer = await generateElevenLabsAudio(scriptText, elVoiceId);
    console.log(`[generate-presenter] Step 1 complete. Audio size: ${Math.round(audioBuffer.length / 1024)}KB`);

    // Step 2: Save audio locally and get a public URL for HeyGen
    console.log(`[generate-presenter] Step 2: Saving audio for presenter engine...`);
    const audioUrl = await saveAudioAndGetUrl(audioBuffer, req.url);
    console.log(`[generate-presenter] Step 2 complete. Audio URL: ${audioUrl}`);

    // Step 3: Generate avatar video with lip-sync to our audio
    console.log(`[generate-presenter] Step 3: Generating avatar video with lip-sync...`);
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
              type: "audio",
              audio_url: audioUrl,
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
