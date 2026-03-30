import { NextRequest, NextResponse } from "next/server";

const DIMENSION_MAP: Record<string, { width: number; height: number }> = {
  "9:16": { width: 720, height: 1280 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
};

// ─── Generate speech audio via ElevenLabs ───────────────────────────────────
// We use ElevenLabs for voice generation (Irish voices!) and HeyGen for
// avatar lip-sync only. This gives us full control over voice selection.
async function generateElevenLabsAudio(
  text: string,
  voiceId: string
): Promise<string> {
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

  // Convert audio to base64 data URL for HeyGen
  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");
  return `data:audio/mpeg;base64,${base64}`;
}

// ─── Upload audio to temporary hosting for HeyGen ───────────────────────────
// HeyGen needs a publicly accessible URL. We'll use their asset upload API.
async function uploadAudioToHeygen(
  audioBase64DataUrl: string,
  heygenApiKey: string
): Promise<string> {
  // Extract raw base64 from data URL
  const base64Data = audioBase64DataUrl.replace(/^data:audio\/\w+;base64,/, "");
  const audioBuffer = Buffer.from(base64Data, "base64");

  // Upload via HeyGen's asset upload endpoint
  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
  formData.append("file", blob, "voice.mp3");

  const uploadRes = await fetch("https://api.heygen.com/v1/asset", {
    method: "POST",
    headers: { "X-Api-Key": heygenApiKey },
    body: formData,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    console.error("[generate-presenter] HeyGen asset upload error:", uploadRes.status, errText);
    throw new Error(`Audio upload failed: ${uploadRes.status}`);
  }

  const uploadData = await uploadRes.json();
  const assetUrl = uploadData?.data?.url ?? uploadData?.data?.file_url;
  if (!assetUrl) {
    console.error("[generate-presenter] No URL in upload response:", JSON.stringify(uploadData));
    throw new Error("No audio URL returned from asset upload");
  }

  return assetUrl;
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
    const audioDataUrl = await generateElevenLabsAudio(scriptText, elVoiceId);
    console.log(`[generate-presenter] Step 1 complete. Audio size: ${Math.round(audioDataUrl.length / 1024)}KB`);

    // Step 2: Upload audio to HeyGen assets
    console.log(`[generate-presenter] Step 2: Uploading audio to HeyGen...`);
    const audioUrl = await uploadAudioToHeygen(audioDataUrl, apiKey);
    console.log(`[generate-presenter] Step 2 complete. Audio URL: ${audioUrl.slice(0, 80)}...`);

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
