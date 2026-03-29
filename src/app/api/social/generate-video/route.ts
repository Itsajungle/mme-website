import { getBrandBySlug, DEMO_BRANDS } from "@/lib/demo-data";
import type { VideoGenerationRequest } from "@/lib/social-engine/types";

// V2 approach: static image + voiceover as a "talking head" video placeholder
// Supports single-take mode: when slides[] is provided, the full script is sent
// as one continuous request to produce a single video — not separate segments.
export async function POST(request: Request) {
  try {
    const body: VideoGenerationRequest = await request.json();
    const { script, brandSlug, voiceId, format, imagePrompt, slides } = body;

    if (!script || !brandSlug || !format) {
      return Response.json(
        { error: "Missing required fields: script, brandSlug, format" },
        { status: 400 }
      );
    }

    let brand = getBrandBySlug("sunshine-radio", brandSlug);
    if (!brand) {
      brand = DEMO_BRANDS.find((b) => b.slug === brandSlug);
    }

    const resolvedVoiceId = voiceId ?? brand?.audioBrandKit.voiceId;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Use the first slide image if available, otherwise generate one
    let imageUrl: string | null = slides?.[0]?.imageUrl ?? null;
    if (!imageUrl) {
      try {
        const imageRes = await fetch(`${baseUrl}/api/social/generate-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: imagePrompt ?? `Promotional visual for ${brand?.name ?? brandSlug}`,
            platform: "video",
            brandSlug,
            aspectRatio: format === "9:16" ? "portrait" : format === "16:9" ? "landscape" : "square",
          }),
        });
        if (imageRes.ok) {
          const imageData = await imageRes.json();
          imageUrl = imageData.url ?? null;
        }
      } catch {
        // Image generation not critical — continue
      }
    }

    // Generate voiceover for the FULL script (single take)
    let audioUrl: string | null = null;
    if (resolvedVoiceId) {
      try {
        const voiceRes = await fetch(`${baseUrl}/api/audio/voice-generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: script, voiceId: resolvedVoiceId }),
        });
        if (voiceRes.ok) {
          const voiceData = await voiceRes.json();
          audioUrl = voiceData.audioUrl ?? voiceData.url ?? null;
        }
      } catch {
        // Voice generation not critical — continue
      }
    }

    // Use slide durations if available, otherwise estimate from word count
    const duration = slides
      ? slides.reduce((sum, s) => sum + (s.duration ?? 20), 0)
      : Math.max(5, Math.round((script.split(/\s+/).length / 130) * 60));

    if (!imageUrl && !audioUrl) {
      return Response.json({
        videoUrl: "/api/audio/demo-tone?type=music&variant=upbeat",
        audioUrl: "/api/audio/demo-tone?type=voice&variant=default",
        thumbnailUrl: null,
        duration,
        status: "demo",
        message: "Video generation not configured. Showing demo preview.",
        slideCount: slides?.length ?? 0,
      });
    }

    return Response.json({
      videoUrl: imageUrl,
      audioUrl,
      thumbnailUrl: imageUrl,
      duration,
      status: "ready",
      slideCount: slides?.length ?? 0,
    });
  } catch {
    return Response.json(
      { error: "Video generation failed. Please try again." },
      { status: 500 }
    );
  }
}
