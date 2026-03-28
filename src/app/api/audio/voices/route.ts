import { NextRequest } from "next/server";
import { listVoices } from "@/lib/audio-engine/elevenlabs-engine";

export async function GET(request: NextRequest) {
  const statusOnly = request.nextUrl.searchParams.get("statusOnly") === "true";

  // Check if API key is configured
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const isConfigured = apiKey && !apiKey.startsWith("sk_your_");

  if (statusOnly) {
    return Response.json({
      status: {
        voice: isConfigured ? "live" : "demo",
        music: process.env.JAMENDO_CLIENT_ID && !process.env.JAMENDO_CLIENT_ID.startsWith("your_") ? "live" : "demo",
        sfx: process.env.FREESOUND_API_KEY && !process.env.FREESOUND_API_KEY.startsWith("your_") ? "live" : "demo",
        mixing: "demo",
      },
    });
  }

  if (!isConfigured) {
    return Response.json({
      voices: [],
      status: { voice: "demo", music: "demo", sfx: "demo", mixing: "demo" },
      message: "Audio engine not configured — running in demo mode",
    });
  }

  try {
    const voices = await listVoices();

    // Sort: Irish voices first, then UK, then others
    voices.sort((a, b) => {
      const aIrish = a.tags.includes("irish") ? 0 : a.tags.includes("british") ? 1 : 2;
      const bIrish = b.tags.includes("irish") ? 0 : b.tags.includes("british") ? 1 : 2;
      return aIrish - bIrish;
    });

    return Response.json({
      voices,
      status: {
        voice: "live",
        music: process.env.JAMENDO_CLIENT_ID && !process.env.JAMENDO_CLIENT_ID.startsWith("your_") ? "live" : "demo",
        sfx: process.env.FREESOUND_API_KEY && !process.env.FREESOUND_API_KEY.startsWith("your_") ? "live" : "demo",
        mixing: "demo",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to load voices", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
