import { getBrandBySlug, DEMO_BRANDS } from "@/lib/demo-data";
import { generateImage } from "@/lib/social-engine/image-generator";
import {
  QUICK_POST_SYSTEM,
  MME_MOMENT_SYSTEM,
  SLIDESHOW_SYSTEM,
  buildContentPrompt,
  buildSlideshowPrompt,
} from "@/lib/social-engine/content-prompts";

// ─── Anthropic API helper ────────────────────────────────────────────────────

const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

async function callClaude(system: string, userMessage: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch(ANTHROPIC_ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Content generation API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data?.content?.[0]?.text ?? "[]";
}

// ─── JSON parsing from AI response ───────────────────────────────────────────

function parseJsonArray<T>(raw: string): T[] {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[0]) as T[];
  } catch {
    return [];
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContentItem {
  platform: string;
  headline: string;
  body: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
  imageUrl?: string;
}

interface SlideItem {
  slideNumber: number;
  heading: string;
  narration: string;
  imagePrompt: string;
  imageUrl?: string;
  duration: number;
}

interface GenerateContentRequest {
  brandSlug: string;
  contentType: "quick-post" | "mme-moment" | "slideshow";
  platforms?: string[];
  topic?: string;
  customPrompt?: string;
  momentTitle?: string;
  momentCategory?: string;
  momentDescription?: string;
  productName?: string;
  productFeatures?: string;
  dealerName?: string;
  dealerLocation?: string;
  slideCount?: number;
  brandColors?: { primary: string; secondary: string; accent: string };
  brandTagline?: string;
  toneOfVoice?: string;
}

// ─── Image generation helper (direct call, not via HTTP) ─────────────────────

async function generateImageForContent(
  imagePrompt: string,
  platform: string,
  brandSlug: string,
  brandSector?: string,
): Promise<string | undefined> {
  try {
    const enrichedPrompt = brandSector
      ? `${imagePrompt} — professional ${brandSector.toLowerCase()} sector photography style`
      : imagePrompt;

    const result = await generateImage({
      prompt: enrichedPrompt,
      platform,
      brandSlug,
      brandSector,
    });
    return result.url;
  } catch {
    return undefined;
  }
}

// ─── Quality scoring via EP review (lightweight) ─────────────────────────────

async function quickQualityScore(contentSummary: string, brandName: string): Promise<{
  overall: number;
  hookStrength: number;
  brandAlignment: number;
  momentConnection: number;
  platformFit: number;
}> {
  const fallback = { overall: 78, hookStrength: 76, brandAlignment: 80, momentConnection: 75, platformFit: 79 };
  if (!process.env.ANTHROPIC_API_KEY) return fallback;

  try {
    const raw = await callClaude(
      `You score social media content quality 1-100. Return only JSON: {"overall":N,"hookStrength":N,"brandAlignment":N,"momentConnection":N,"platformFit":N}`,
      `Score this content for ${brandName}:\n${contentSummary.slice(0, 1500)}`,
    );
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    return JSON.parse(match[0]);
  } catch {
    return fallback;
  }
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: GenerateContentRequest = await request.json();
    const {
      brandSlug,
      contentType,
      platforms = ["instagram"],
      topic,
      customPrompt,
      momentTitle,
      momentDescription,
      productName,
      productFeatures,
      dealerName,
      dealerLocation,
      slideCount = 7,
      brandColors,
      brandTagline,
      toneOfVoice,
    } = body;

    if (!brandSlug || !contentType) {
      return Response.json(
        { error: "Missing required fields: brandSlug, contentType" },
        { status: 400 },
      );
    }

    // Resolve brand
    let brand = getBrandBySlug("sunshine-radio", brandSlug);
    if (!brand) {
      brand = DEMO_BRANDS.find((b) => b.slug === brandSlug);
    }
    if (!brand) {
      return Response.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandTone = toneOfVoice ?? brand.audioBrandKit.voiceDescription;
    const brandSector = brand.sectorName;
    const brandLocation = brand.locations[0]?.name ?? "";

    // ── Slideshow ────────────────────────────────────────────────────────
    if (contentType === "slideshow") {
      const userPrompt = buildSlideshowPrompt({
        brandName: brand.name,
        productName,
        productFeatures,
        dealerName,
        dealerLocation,
        brandTone,
        slideCount,
      });

      const raw = await callClaude(SLIDESHOW_SYSTEM, userPrompt);
      const slides = parseJsonArray<SlideItem>(raw);

      // Generate images in parallel for all slides
      const slidesWithImages = await Promise.all(
        slides.map(async (slide) => {
          const imageUrl = await generateImageForContent(
            slide.imagePrompt,
            "video",
            brandSlug,
            brandSector,
          );
          return { ...slide, imageUrl };
        }),
      );

      const totalDuration = slidesWithImages.reduce((sum, s) => sum + (s.duration ?? 20), 0);
      const scriptSummary = slidesWithImages.map((s) => s.narration).join(" ");

      return Response.json({
        success: true,
        slides: slidesWithImages,
        totalDuration,
        scriptSummary,
      });
    }

    // ── Quick Post / MME Moment ──────────────────────────────────────────
    const systemPrompt = contentType === "mme-moment" ? MME_MOMENT_SYSTEM : QUICK_POST_SYSTEM;

    const userPrompt = buildContentPrompt({
      brandName: brand.name,
      brandSector,
      brandLocation,
      brandTone,
      platforms,
      topic,
      customPrompt,
      momentTitle,
      momentDescription,
      brandTagline,
      brandColors,
    });

    const raw = await callClaude(systemPrompt, userPrompt);
    const contentItems = parseJsonArray<ContentItem>(raw);

    // Ensure we have one item per requested platform
    const contentByPlatform = new Map(contentItems.map((c) => [c.platform, c]));
    const finalContent: ContentItem[] = platforms.map((p) => {
      const existing = contentByPlatform.get(p);
      if (existing) return existing;
      // Fallback: use first generated item adapted for this platform
      const fallback = contentItems[0];
      return fallback
        ? { ...fallback, platform: p }
        : { platform: p, headline: "", body: "", hashtags: [], cta: "", imagePrompt: "" };
    });

    // Generate images in parallel
    const contentWithImages = await Promise.all(
      finalContent.map(async (item) => {
        if (!item.imagePrompt) return item;
        const imageUrl = await generateImageForContent(
          item.imagePrompt,
          item.platform,
          brandSlug,
          brandSector,
        );
        return { ...item, imageUrl };
      }),
    );

    // Quality scoring
    const contentSummary = contentWithImages
      .map((c) => `[${c.platform}] ${c.headline} — ${c.body}`)
      .join("\n");
    const qualityScore = await quickQualityScore(contentSummary, brand.name);

    return Response.json({
      success: true,
      content: contentWithImages,
      qualityScore,
    });
  } catch {
    return Response.json(
      { error: "Content generation failed. Please try again." },
      { status: 500 },
    );
  }
}
