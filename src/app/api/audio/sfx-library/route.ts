import { NextRequest } from "next/server";
import { searchSFX } from "@/lib/audio-engine/freesound-engine";

export async function GET(request: NextRequest) {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey || apiKey.startsWith("your_")) {
    return Response.json({
      results: [],
      status: "demo",
      message: "SFX library not configured — running in demo mode",
    });
  }

  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");

    const results = await searchSFX(query, limit, category);
    return Response.json({ results, status: "live" });
  } catch (error) {
    return Response.json(
      { error: "SFX search failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
