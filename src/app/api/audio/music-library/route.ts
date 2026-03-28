import { NextRequest } from "next/server";
import { searchMusic } from "@/lib/audio-engine/jamendo-engine";

export async function GET(request: NextRequest) {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId || clientId.startsWith("your_")) {
    return Response.json({
      results: [],
      status: "demo",
      message: "Music library not configured — running in demo mode",
    });
  }

  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q") || "";
    const mood = searchParams.get("mood") || undefined;
    const sector = searchParams.get("sector") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");

    const results = await searchMusic(query, mood, sector, limit);
    return Response.json({ results, status: "live" });
  } catch (error) {
    return Response.json(
      { error: "Music search failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
