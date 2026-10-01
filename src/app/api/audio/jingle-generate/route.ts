import { generateJingle } from "@/lib/audio-engine/elevenlabs-engine";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.startsWith("sk_your_")) {
    return Response.json({ error: "Jingle engine not configured" }, { status: 503 });
  }
  try {
    const { style, lyrics, durationSeconds } = await request.json();
    if (!style || !lyrics) {
      return Response.json({ error: "Style and lyrics are both needed" }, { status: 400 });
    }
    const result = await generateJingle(String(style), String(lyrics), Number(durationSeconds) || 30);
    return Response.json(result);
  } catch (error) {
    console.error("[jingle-generate]", error);
    return Response.json(
      { error: "Jingle generation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
