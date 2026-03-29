import { generateSpeech } from "@/lib/audio-engine/elevenlabs-engine";

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.startsWith("sk_your_")) {
    return Response.json({ error: "Audio engine not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { text, voiceId, settings } = body;

    if (!text || !voiceId) {
      return Response.json({ error: "Missing required fields: text, voiceId" }, { status: 400 });
    }

    if (text.length > 5000) {
      return Response.json({ error: "Text too long (max 5000 characters)" }, { status: 400 });
    }

    const result = await generateSpeech(text, voiceId, settings);
    return Response.json(result);
  } catch (error) {
    console.error("[voice-generate] FULL ERROR:", error);
    console.error("[voice-generate] Error type:", typeof error, error instanceof Error ? error.message : String(error));
    return Response.json(
      { error: "Voice generation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
