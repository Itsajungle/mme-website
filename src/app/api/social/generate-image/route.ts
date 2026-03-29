import { getBrandBySlug, DEMO_BRANDS } from "@/lib/demo-data";
import { generateImage } from "@/lib/social-engine/image-generator";
import type { ImageGenerationRequest } from "@/lib/social-engine/types";

export async function POST(request: Request) {
  try {
    const body: ImageGenerationRequest = await request.json();
    const { prompt, platform, brandSlug, aspectRatio } = body;

    if (!prompt || !platform || !brandSlug) {
      return Response.json(
        { error: "Missing required fields: prompt, platform, brandSlug" },
        { status: 400 }
      );
    }

    // Resolve brand for visual context only — never inject audio/voice
    // descriptions into image prompts as they confuse the image model
    let brand = getBrandBySlug("sunshine-radio", brandSlug);
    if (!brand) {
      brand = DEMO_BRANDS.find((b) => b.slug === brandSlug);
    }

    // Only use sector name for visual style hints — keep prompt clean
    const enrichedPrompt = brand
      ? `${prompt} — professional ${brand.sectorName.toLowerCase()} sector photography style`
      : prompt;

    const result = await generateImage({
      prompt: enrichedPrompt,
      platform,
      brandSlug,
      aspectRatio,
      brandSector: brand?.sectorName,
    });

    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Image generation failed. Please try again." },
      { status: 500 }
    );
  }
}
