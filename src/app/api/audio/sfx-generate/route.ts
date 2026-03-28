import { generateSoundEffect } from "@/lib/audio-engine/elevenlabs-engine";

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.startsWith("sk_your_")) {
    return Response.json({ error: "Audio engine not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { prompt, durationSeconds } = body;

    if (!prompt) {
      return Response.json({ error: "Missing required field: prompt" }, { status: 400 });
    }

    const duration = Math.min(Math.max(durationSeconds || 3, 0.5), 22);
    const result = await generateSoundEffect(prompt, duration);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: "Sound effect generation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
