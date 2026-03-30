// Image generator — AI image generation with primary and fallback providers
// Primary: Gemini 3 Pro Image Preview. Fallback: DALL-E 3 via OpenAI.

import fs from "fs";
import path from "path";
import type { ImageGenerationRequest, GeneratedImage } from "./types";

// ─── Platform aspect ratios ─────────────────────────────────────────────────
type GeminiAspectRatio = "1:1" | "4:5" | "16:9" | "9:16";
type DallESize = "1024x1024" | "1024x1792" | "1792x1024";

interface PlatformSizeConfig {
  gemini: GeminiAspectRatio;
  dalle: DallESize;
}

const PLATFORM_SIZES: Record<string, PlatformSizeConfig> = {
  "instagram-feed": { gemini: "1:1", dalle: "1024x1024" },
  "instagram-stories": { gemini: "9:16", dalle: "1024x1792" },
  "instagram-reels": { gemini: "9:16", dalle: "1024x1792" },
  instagram: { gemini: "1:1", dalle: "1024x1024" },
  linkedin: { gemini: "16:9", dalle: "1792x1024" },
  x: { gemini: "16:9", dalle: "1792x1024" },
  twitter: { gemini: "16:9", dalle: "1792x1024" },
  facebook: { gemini: "16:9", dalle: "1792x1024" },
  tiktok: { gemini: "9:16", dalle: "1024x1792" },
};

function getSizeConfig(platform: string): PlatformSizeConfig {
  const key = platform.toLowerCase();
  return PLATFORM_SIZES[key] ?? { gemini: "16:9", dalle: "1792x1024" };
}

// ─── Prompt enhancement ───────────────────────────────────────────────────────
function enhancePrompt(prompt: string, brandSector?: string, brandTone?: string): string {
  const sector = brandSector ?? "business";
  const tone = brandTone ?? "professional";
  return `${prompt}. Photorealistic, high quality, professional photography, clean composition, suitable for ${sector} business, ${tone} aesthetic.`;
}

// ─── Image download and save ─────────────────────────────────────────────
const GENERATED_DIR = "/tmp/mme-images";

function ensureGeneratedDir(): void {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
}

// ─── Primary: Gemini 3 Pro Image Preview ─────────────────────────────────────
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent";

interface GeminiImageResponse {
  candidates?: {
    content?: {
      parts?: { inlineData?: { mimeType: string; data: string }; text?: string }[];
    };
  }[];
}

async function generateWithGemini(
  prompt: string,
  sizeConfig: PlatformSizeConfig
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: sizeConfig.gemini,
        imageSize: "2K",
      },
    },
  };

  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image generation API error ${res.status}: ${text}`);
  }

  const data: GeminiImageResponse = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData) throw new Error("No image data in response");

  const { mimeType, data: b64Data } = imagePart.inlineData;
  const buffer = Buffer.from(b64Data, "base64");

  ensureGeneratedDir();
  const timestamp = Date.now();
  const ext = mimeType.includes("png") ? "png" : "jpg";
  const filename = `gen-${timestamp}.${ext}`;
  const localPath = path.join(GENERATED_DIR, filename);
  fs.writeFileSync(localPath, buffer);

  return `/api/images/serve?file=${filename}`;
}

// ─── Fallback: DALL-E 3 via OpenAI ───────────────────────────────────────
const DALLE_ENDPOINT = "https://api.openai.com/v1/images/generations";

interface DallEResponse {
  data: { url: string }[];
}

async function generateWithDallE(
  prompt: string,
  sizeConfig: PlatformSizeConfig
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const body = {
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

async function downloadAndSave(imageUrl: string, brandSlug: string, platform: string): Promise<string> {
  ensureGeneratedDir();
  const timestamp = Date.now();
  const filename = `${brandSlug}-${platform}-${timestamp}.jpg`;
  const localPath = path.join(GENERATED_DIR, filename);

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to download generated image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(localPath, buffer);

  return `/api/images/serve?file=${filename}`;
}

// ─── Placeholder path ───────────────────────────────────────────────────
function getPlaceholderPath(platform: string): string {
  const colors: Record<string, string> = {
    instagram: "%23e1306c",
    facebook: "%231877f2",
    linkedin: "%230077b5",
    x: "%23999999",
    tiktok: "%23ff0050",
    video: "%2300FF96",
  };
  const color = colors[platform.toLowerCase()] ?? "%2300FF96";
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect fill='${color}' width='800' height='800' opacity='0.15'/><text x='400' y='400' text-anchor='middle' dominant-baseline='middle' fill='${color}' font-size='32' font-family='sans-serif'>MME · ${platform}</text></svg>`;
}

// ─── Public API ────────────────────────────────────────────────────────
export async function generateImage(
  params: ImageGenerationRequest & { brandSector?: string; brandTone?: string }
): Promise<GeneratedImage> {
  const enhancedPrompt = enhancePrompt(params.prompt, params.brandSector, params.brandTone);
  const sizeConfig = getSizeConfig(params.platform);

  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasDallE = !!process.env.OPENAI_API_KEY;

  if (!hasGemini && !hasDallE) {
    return {
      url: getPlaceholderPath(params.platform),
      localPath: getPlaceholderPath(params.platform),
      prompt: enhancedPrompt,
      provider: "placeholder",
    };
  }

  if (hasGemini) {
    try {
      const localUrl = await generateWithGemini(enhancedPrompt, sizeConfig);
      return {
        url: localUrl,
        localPath: localUrl,
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
