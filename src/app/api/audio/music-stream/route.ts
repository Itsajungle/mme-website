import { NextRequest } from "next/server";
import { streamTrack } from "@/lib/audio-engine/jamendo-engine";

export async function GET(request: NextRequest) {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId || clientId.startsWith("your_")) {
    return Response.json({ error: "Music library not configured" }, { status: 503 });
  }

  try {
    const trackId = request.nextUrl.searchParams.get("id");
    if (!trackId) {
      return Response.json({ error: "Missing required parameter: id" }, { status: 400 });
    }

    const streamUrl = await streamTrack(trackId);

    // Proxy the audio stream to avoid CORS issues
    const audioRes = await fetch(streamUrl);
    if (!audioRes.ok) {
      return Response.json({ error: "Failed to stream track" }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Music streaming failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
