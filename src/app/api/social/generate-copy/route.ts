import { getBrandBySlug, DEMO_BRANDS } from "@/lib/demo-data";
import { runSocialQualityChain } from "@/lib/social-engine/quality-chain";
import type { CopyGenerationRequest } from "@/lib/social-engine/types";

export async function POST(request: Request) {
  try {
    const body: CopyGenerationRequest = await request.json();
    const { brandSlug, momentId, momentContext, promotion, platforms, contentType, customPrompt } = body;

    if (!brandSlug || !platforms || !contentType) {
      return Response.json(
        { error: "Missing required fields: brandSlug, platforms, contentType" },
        { status: 400 }
      );
    }

    // Try stationSlug "sunshine-radio" first, then fall back to scanning all brands
    let brand = getBrandBySlug("sunshine-radio", brandSlug);
    if (!brand) {
      brand = DEMO_BRANDS.find((b) => b.slug === brandSlug);
    }

    if (!brand) {
      return Response.json({ error: "Brand not found" }, { status: 404 });
    }

    // Find moment context if momentId is provided
    let resolvedMomentContext = momentContext;
    if (momentId && !resolvedMomentContext) {
      const moment = brand.moments.find((m) => m.id === momentId);
      if (moment) {
        resolvedMomentContext = `${moment.title}: ${moment.description}`;
      }
    }

    const result = await runSocialQualityChain({
      brandName: brand.name,
      brandSector: brand.sectorName,
      brandLocation: brand.locations[0]?.name ?? "",
      brandTone: brand.audioBrandKit.voiceDescription,
      brandTargetAudience: brand.overview.targetAudience,
      momentTitle: momentId
        ? brand.moments.find((m) => m.id === momentId)?.title
        : undefined,
      momentDescription: resolvedMomentContext,
      promotion,
      platforms,
      contentType,
      customPrompt,
    });

    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Content generation failed. Please try again." },
      { status: 500 }
    );
  }
}
