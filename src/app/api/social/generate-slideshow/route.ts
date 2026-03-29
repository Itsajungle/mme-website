import { getBrandBySlug, DEMO_BRANDS } from "@/lib/demo-data";
import { generateImage } from "@/lib/social-engine/image-generator";
import {
  CAR_DEALER_SLIDESHOW_SYSTEM,
  buildCarDealerSlideshowPrompt,
} from "@/lib/social-engine/content-prompts";
import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

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
  return data?.content?.[0]?.text ?? "{}";
}

// ─── Callout card image generation ───────────────────────────────────────────

async function generateCalloutCard(
  text: string,
  index: number,
): Promise<string> {
  const dir = "/tmp/mme-images";
  await mkdir(dir, { recursive: true });

  // Generate a 1920x1080 SVG callout card with Toyota red background
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#EB0A1E"/>
  <rect x="60" y="60" width="1800" height="960" rx="40" fill="none" stroke="white" stroke-width="4" opacity="0.3"/>
  <text x="960" y="540" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${escapeXml(text)}</text>
</svg>`;

  const filename = `callout-${index}-${randomUUID().slice(0, 8)}.svg`;
  const filepath = path.join(dir, filename);
  await writeFile(filepath, svg, "utf-8");

  return `/api/images/serve?file=${filename}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ─── Logo placeholder generation ────────────────────────────────────────────

async function generateLogoPlaceholder(brandName: string): Promise<string> {
  const dir = "/tmp/mme-images";
  await mkdir(dir, { recursive: true });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#EB0A1E"/>
  <text x="960" y="480" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${escapeXml(brandName)}</text>
  <text x="960" y="600" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">TOYOTA</text>
</svg>`;

  const filename = `logo-placeholder-${randomUUID().slice(0, 8)}.svg`;
  const filepath = path.join(dir, filename);
  await writeFile(filepath, svg, "utf-8");

  return `/api/images/serve?file=${filename}`;
}

// ─── Script JSON parser ─────────────────────────────────────────────────────

interface SlideshowScript {
  intro: string;
  carDescription: string;
  dealPoints: string[];
  cta: string;
  slideOrder: Array<{
    type: "logo" | "avatar_intro" | "car_image" | "callout" | "avatar_cta";
    duration: number;
    narrationKey?: string;
    dealPointIndex?: number;
  }>;
}

function parseScriptJson(raw: string): SlideshowScript {
  // Try to extract JSON object from the response
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in AI response");
  const parsed = JSON.parse(match[0]) as SlideshowScript;
  if (!parsed.intro || !parsed.carDescription || !parsed.dealPoints || !parsed.cta) {
    throw new Error("Missing required script fields");
  }
  return parsed;
}

// ─── POST handler ────────────────────────────────────────────────────────────

interface GenerateSlideshowRequest {
  brandSlug: string;
  carMake: string;
  carModel: string;
  carColour: string;
  dealDetails: string;
  voiceId?: string;
}

export async function POST(request: Request) {
  try {
    const body: GenerateSlideshowRequest = await request.json();
    const { brandSlug, carMake, carModel, carColour, dealDetails, voiceId } = body;

    if (!brandSlug || !carMake || !carModel) {
      return Response.json(
        { error: "Missing required fields: brandSlug, carMake, carModel" },
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // ── Step 1: Generate script via AI ──────────────────────────────────
    const userPrompt = buildCarDealerSlideshowPrompt({
      brandName: brand.name,
      carMake,
      carModel,
      carColour: carColour || "white",
      dealDetails: dealDetails || "Great deals available",
      dealerName: brand.name,
      dealerLocation: brand.locations[0]?.name,
    });

    const raw = await callClaude(CAR_DEALER_SLIDESHOW_SYSTEM, userPrompt);
    const script = parseScriptJson(raw);

    // ── Step 2: Generate car image ──────────────────────────────────────
    const carImagePrompt = `${carColour || "white"} ${carMake} ${carModel} in a modern bright car showroom, professional product photography, clean background, studio lighting`;
    let carImageUrl: string | undefined;
    try {
      const result = await generateImage({
        prompt: carImagePrompt,
        platform: "video",
        brandSlug,
        brandSector: brand.sectorName,
      });
      carImageUrl = result.url;
    } catch (err) {
      console.error("[generate-slideshow] Car image generation failed:", err);
    }

    // ── Step 3: Generate callout card images ────────────────────────────
    const calloutUrls = await Promise.all(
      script.dealPoints.map((point, i) => generateCalloutCard(point, i)),
    );

    // ── Step 4: Generate logo placeholder ───────────────────────────────
    const logoUrl = await generateLogoPlaceholder(brand.name);

    // ── Step 5: Generate voice narration ────────────────────────────────
    const fullNarration = [script.intro, script.carDescription, script.cta].join(" … ");
    let audioUrl: string | null = null;
    const resolvedVoiceId = voiceId ?? brand.audioBrandKit.voiceId;

    if (resolvedVoiceId) {
      try {
        const voiceRes = await fetch(`${baseUrl}/api/audio/voice-generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: fullNarration, voiceId: resolvedVoiceId }),
        });
        if (voiceRes.ok) {
          const voiceData = await voiceRes.json();
          audioUrl = voiceData.audioUrl ?? voiceData.url ?? null;
        } else {
          const errText = await voiceRes.text();
          console.error("[generate-slideshow] Voice generation failed:", errText);
        }
      } catch (err) {
        console.error("[generate-slideshow] Voice generation error:", err);
      }
    }

    // ── Step 6: Build slides array ──────────────────────────────────────
    const slides = script.slideOrder.map((entry) => {
      let imageUrl: string | undefined;
      let narration = "";
      let heading = "";

      switch (entry.type) {
        case "logo":
          imageUrl = logoUrl;
          heading = brand!.name;
          break;
        case "avatar_intro":
          imageUrl = carImageUrl ?? logoUrl;
          narration = script.intro;
          heading = "Welcome";
          break;
        case "car_image":
          imageUrl = carImageUrl;
          narration = script.carDescription;
          heading = `${carMake} ${carModel}`;
          break;
        case "callout":
          imageUrl = calloutUrls[entry.dealPointIndex ?? 0];
          heading = script.dealPoints[entry.dealPointIndex ?? 0] ?? "";
          break;
        case "avatar_cta":
          imageUrl = logoUrl;
          narration = script.cta;
          heading = "Visit Us";
          break;
      }

      return {
        type: entry.type,
        heading,
        narration,
        imageUrl,
        duration: entry.duration,
      };
    });

    const totalDuration = slides.reduce((sum, s) => sum + s.duration, 0);

    return Response.json({
      success: true,
      slides,
      totalDuration,
      audioUrl,
      script: {
        intro: script.intro,
        carDescription: script.carDescription,
        dealPoints: script.dealPoints,
        cta: script.cta,
      },
      carImageUrl,
    });
  } catch (err) {
    console.error("[generate-slideshow] Error:", err);
    return Response.json(
      { error: `Slideshow generation failed: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}
