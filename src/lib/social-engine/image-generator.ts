// Image generator — AI image generation with primary and fallback providers
// Primary: Flux 2 via fal.ai. Fallback: DALL-E 3 via OpenAI.

import fs from "fs";
import path from "path";
import type { ImageGenerationRequest, GeneratedImage } from "./types";

// ─── Platform aspect ratios ───────────────────────────────────────────────────

type FalImageSize = "landscape_16_9" | "square" | "portrait_4_3";
type DallESize = "1024x1024" | "1024x1792" | "1792x1024";

interface PlatformSizeConfig {
  fal: FalImageSize;
  dalle: DallESize;
}

const PLATFORM_SIZES: Record<string, PlatformSizeConfig> = {
  // Instagram feed — square or portrait
  "instagram-feed": { fal: "square", dalle: "1024x1024" },
  // Instagram Stories / Reels — portrait 9:16
  "instagram-stories": { fal: "portrait_4_3", dalle: "1024x1792" },
  "instagram-reels": { fal: "portrait_4_3", dalle: "1024x1792" },
  instagram: { fal: "square", dalle: "1024x1024" },
  // LinkedIn — landscape or square
  linkedin: { fal: "landscape_16_9", dalle: "1792x1024" },
  // X/Twitter — landscape or square
  x: { fal: "landscape_16_9", dalle: "1792x1024" },
  twitter: { fal: "landscape_16_9", dalle: "1792x1024" },
  // Facebook — landscape or square
  facebook: { fal: "landscape_16_9", dalle: "1792x1024" },
  // TikTok — portrait
  tiktok: { fal: "portrait_4_3", dalle: "1024x1792" },
};

function getSizeConfig(platform: string): PlatformSizeConfig {
  const key = platform.toLowerCase();
  return PLATFORM_SIZES[key] ?? { fal: "landscape_16_9", dalle: "1792x1024" };
}

// ─── Prompt enhancement ───────────────────────────────────────────────────────

function enhancePrompt(prompt: string, brandSector?: string, brandTone?: string): string {
  const sector = brandSector ?? "business";
  const tone = brandTone ?? "professional";
  return `${prompt}. Professional quality, clean composition, suitable for ${sector} business, ${tone} aesthetic. No text overlays unless specified.`;
}

// ─── Primary: Flux 2 via fal.ai ───────────────────────────────────────────────

const FAL_ENDPOINT = "https://fal.run/fal-ai/flux-pro/v1.1-ultra";

interface FalRequest {
  prompt: string;
  image_size: FalImageSize;
  num_images: 1;
  safety_tolerance: "2";
}

interface FalResponse {
  images: { url: string; content_type: string }[];
}

async function generateWithFal(
  prompt: string,
  sizeConfig: PlatformSizeConfig
): Promise<string> {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) throw new Error("FAL_API_KEY not configured");

  const body: FalRequest = {
    prompt,
    image_size: sizeConfig.fal,
    num_images: 1,
    safety_tolerance: "2",
  };

  const res = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image generation API error ${res.status}: ${text}`);
  }

  const data: FalResponse = await res.json();
  const imageUrl = data?.images?.[0]?.url;
  if (!imageUrl) throw new Error("No image URL in response");
  return imageUrl;
}

// ─── Fallback: DALL-E 3 via OpenAI ───────────────────────────────────────────

const DALLE_ENDPOINT = "https://api.openai.com/v1/images/generations";

interface DallERequest {
  model: "dall-e-3";
  prompt: string;
  size: DallESize;
  quality: "hd";
  n: 1;
}

interface DallEResponse {
  data: { url: string }[];
}

async function generateWithDallE(
  prompt: string,
  sizeConfig: PlatformSizeConfig
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const body: DallERequest = {
    model: "dall-e-3",
    prompt,
    size: sizeConfig.dalle,
    quality: "hd",
    n: 1,
  };

  const res = await fetch(DALLE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image generation fallback API error ${res.status}: ${text}`);
  }

  const data: DallEResponse = await res.json();
  const imageUrl = data?.data?.[0]?.url;
  if (!imageUrl) throw new Error("No image URL in fallback response");
  return imageUrl;
}

// ─── Image download and save ──────────────────────────────────────────────────

const GENERATED_DIR = path.join(process.cwd(), "public", "images", "generated");

function ensureGeneratedDir(): void {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
}

async function downloadAndSave(imageUrl: string, brandSlug: string, platform: string): Promise<string> {
  ensureGeneratedDir();

  const timestamp = Date.now();
  const filename = `${brandSlug}-${platform}-${timestamp}.jpg`;
  const localPath = path.join(GENERATED_DIR, filename);
  const publicPath = `/images/generated/${filename}`;

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to download generated image: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(localPath, buffer);

  return publicPath;
}

// ─── Placeholder path ─────────────────────────────────────────────────────────

function getPlaceholderPath(platform: string): string {
  return `/images/placeholders/social-${platform.toLowerCase()}.jpg`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateImage(
  params: ImageGenerationRequest & { brandSector?: string; brandTone?: string }
): Promise<GeneratedImage> {
  const enhancedPrompt = enhancePrompt(params.prompt, params.brandSector, params.brandTone);
  const sizeConfig = getSizeConfig(params.platform);

  // Determine available providers
  const hasFal = !!process.env.FAL_API_KEY;
  const hasDallE = !!process.env.OPENAI_API_KEY;

  if (!hasFal && !hasDallE) {
    // No image API configured — return placeholder
    return {
      url: getPlaceholderPath(params.platform),
      localPath: getPlaceholderPath(params.platform),
      prompt: enhancedPrompt,
      // provider label kept abstract — no service name in user-visible output
      provider: "placeholder",
    };
  }

  // Try primary provider first, then fallback
  if (hasFal) {
    try {
      const remoteUrl = await generateWithFal(enhancedPrompt, sizeConfig);
      const localPath = await downloadAndSave(remoteUrl, params.brandSlug, params.platform);
      return {
        url: localPath,
        localPath,
        prompt: enhancedPrompt,
        provider: "primary",
      };
    } catch {
      // Primary failed — fall through to secondary
    }
  }

  if (hasDallE) {
    try {
      const remoteUrl = await generateWithDallE(enhancedPrompt, sizeConfig);
      const localPath = await downloadAndSave(remoteUrl, params.brandSlug, params.platform);
      return {
        url: localPath,
        localPath,
        prompt: enhancedPrompt,
        provider: "secondary",
      };
    } catch {
      // Secondary also failed — return placeholder silently
    }
  }

  return {
    url: getPlaceholderPath(params.platform),
    localPath: getPlaceholderPath(params.platform),
    prompt: enhancedPrompt,
    provider: "placeholder",
  };
}
