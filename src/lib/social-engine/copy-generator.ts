// Copy generator — AI-powered social media copy via language model API
// Falls back to Irish-market templates when API key is not configured

import type { SocialContentParams, GeneratedCopy, PlatformVariant } from "./types";

// ─── Platform constraints ────────────────────────────────────────────────────

const PLATFORM_RULES: Record<string, { maxChars: number; tone: string; hashtagStyle: string }> = {
  instagram: {
    maxChars: 2200,
    tone: "visual-first, emoji-friendly, hashtag-rich, aspirational",
    hashtagStyle: "10-20 relevant hashtags",
  },
  x: {
    maxChars: 280,
    tone: "punchy, direct, witty — every word earns its place",
    hashtagStyle: "1-2 hashtags maximum",
  },
  linkedin: {
    maxChars: 3000,
    tone: "professional, insight-driven, no emoji overload",
    hashtagStyle: "3-5 professional hashtags",
  },
  facebook: {
    maxChars: 1000,
    tone: "conversational, community-focused, approachable",
    hashtagStyle: "2-4 hashtags",
  },
  tiktok: {
    maxChars: 2200,
    tone: "trend-aware, casual, energetic, youth-friendly",
    hashtagStyle: "5-10 trending hashtags",
  },
};

// ─── Gemini API ──────────────────────────────────────────────────────────────

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface GeminiRequest {
  contents: { parts: { text: string }[] }[];
  systemInstruction: { parts: { text: string }[] };
  generationConfig: { temperature: number; responseMimeType: string };
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const body: GeminiRequest = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
  };

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Content generation API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  // Extract text from first candidate
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
}

// ─── Prompt builders ─────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are an expert social media copywriter specialising in Irish local business marketing.
You write platform-native copy that feels authentic, drives engagement, and respects each platform's culture.
You understand Irish idioms, local market nuance, and the Sunshine 106.8 listener demographic.
You always return valid JSON matching the exact schema provided.`;
}

function buildUserPrompt(params: SocialContentParams): string {
  const platformDetails = params.platforms
    .map((p) => {
      const rules = PLATFORM_RULES[p.toLowerCase()] ?? {
        maxChars: 1000,
        tone: "engaging",
        hashtagStyle: "3-5 hashtags",
      };
      return `- ${p}: max ${rules.maxChars} chars, tone: ${rules.tone}, hashtags: ${rules.hashtagStyle}`;
    })
    .join("\n");

  const momentContext = params.momentTitle
    ? `Current moment: "${params.momentTitle}" — ${params.momentDescription ?? ""}${params.momentTriggerType ? ` (trigger type: ${params.momentTriggerType})` : ""}`
    : "No specific moment — generate evergreen content.";

  const radioContext = params.existingRadioScript
    ? `\nAlready running radio ad — social copy should complement this script:\n"${params.existingRadioScript.slice(0, 300)}..."`
    : "";

  return `Generate social media copy for the following brand and moment.

BRAND:
- Name: ${params.brandName}
- Sector: ${params.brandSector}
- Location: ${params.brandLocation}
- Tone: ${params.brandTone}
- Target audience: ${params.brandTargetAudience.join(", ")}
${params.promotion ? `- Current promotion: ${params.promotion}` : ""}
${params.customPrompt ? `- Additional direction: ${params.customPrompt}` : ""}
${params.brandKitContext ?? ""}

MOMENT:
${momentContext}
${radioContext}

PLATFORMS TO GENERATE:
${platformDetails}

Return a JSON object with this exact structure:
{
  "platformVariants": {
    ${params.platforms.map((p) => `"${p.toLowerCase()}": { "text": "...", "hashtags": ["..."], "suggestedImagePrompt": "..." }`).join(",\n    ")}
  },
  "momentRelevanceScore": <0-100 integer>,
  "suggestedPublishTime": "<ISO 8601 or human description like 'Today between 12-2pm'>",
  "toneAnalysis": "<one sentence describing the overall tone approach>"
}

Rules:
- Respect each platform's character limits strictly
- Hashtags array should NOT include the # symbol — add it at render time
- suggestedImagePrompt should describe a vivid scene suitable for AI image generation
- momentRelevanceScore reflects how directly the copy capitalises on the current moment`;
}

// ─── Template fallback ───────────────────────────────────────────────────────

// Irish-market templates for Sunshine 106.8 pilot brands when no API key is set

const IRISH_HASHTAG_BANKS: Record<string, string[]> = {
  motoring: ["IrishMotoring", "CarDeals", "DrivingIreland", "IrishCars", "NewWheels"],
  hospitality: ["IrishFood", "EatLocal", "IrelandFoodie", "DineOut", "IrishRestaurants"],
  retail: ["IrishRetail", "ShopLocal", "IrelandShopping", "SupportLocal", "IrishBusiness"],
  financial: ["IrishFinance", "MoneySmart", "IrelandBusiness", "FinanceTips", "IrishMortgage"],
  tourism: ["VisitIreland", "IrishTourism", "ExploreIreland", "IrelandTravel", "WildAtlanticWay"],
  default: ["IrishBusiness", "SupportLocal", "Ireland", "LocalIreland", "IrishLife"],
};

function getSectorHashtags(sector: string): string[] {
  return HASHTAG_BANKS_BY_SECTOR(sector);
}

function HASHTAG_BANKS_BY_SECTOR(sector: string): string[] {
  const key = sector.toLowerCase();
  return IRISH_HASHTAG_BANKS[key] ?? IRISH_HASHTAG_BANKS.default;
}

function buildImagePrompt(params: SocialContentParams, platform: string): string {
  const aspectHint =
    platform === "instagram" || platform === "tiktok"
      ? "vertical portrait composition"
      : "horizontal landscape composition";
  return `${params.brandSector} business scene in Ireland, ${params.brandTone} aesthetic, warm natural light, ${aspectHint}, photorealistic, no text`;
}

function templateFallback(params: SocialContentParams): GeneratedCopy {
  const promotion = params.promotion ?? `special offer at ${params.brandName}`;
  const momentLine = params.momentTitle ? ` Perfect timing with ${params.momentTitle}.` : "";
  const baseHashtags = getSectorHashtags(params.brandSector);
  const brandHashtag = params.brandName.replace(/\s+/g, "");

  const variants: GeneratedCopy["platformVariants"] = {};

  if (params.platforms.includes("instagram")) {
    variants.instagram = {
      text: `✨ ${promotion}${momentLine}\n\nAt ${params.brandName} in ${params.brandLocation}, we believe every customer deserves the best. Come and see what the buzz is about! 🙌\n\n📍 ${params.brandLocation}`,
      hashtags: [brandHashtag, ...baseHashtags, "Sunshine1068", "IrishLife", "LocalLove"],
      suggestedImagePrompt: buildImagePrompt(params, "instagram"),
    };
  }

  if (params.platforms.includes("x")) {
    const shortText = `${promotion}${momentLine} ${params.brandName}, ${params.brandLocation}.`
      .slice(0, 240)
      .trim();
    variants.x = {
      text: shortText,
      hashtags: [brandHashtag, baseHashtags[0]],
      suggestedImagePrompt: buildImagePrompt(params, "x"),
    };
  }

  if (params.platforms.includes("linkedin")) {
    variants.linkedin = {
      text: `We're excited to share: ${promotion}\n\n${momentLine ? momentLine + "\n\n" : ""}At ${params.brandName}, we're committed to serving the ${params.brandLocation} community with quality and care. We'd love to welcome you in.\n\nVisit us at ${params.brandLocation} — our team is ready to help.`,
      hashtags: [brandHashtag, "IrishBusiness", "SupportLocal", params.brandSector.replace(/\s+/g, "")],
      suggestedImagePrompt: buildImagePrompt(params, "linkedin"),
    };
  }

  if (params.platforms.includes("facebook")) {
    variants.facebook = {
      text: `👋 Hey ${params.brandLocation}! ${promotion}${momentLine}\n\nPop into ${params.brandName} and see for yourself. We'd love to see you! 😊`,
      hashtags: [brandHashtag, ...baseHashtags.slice(0, 3)],
      suggestedImagePrompt: buildImagePrompt(params, "facebook"),
    };
  }

  if (params.platforms.includes("tiktok")) {
    variants.tiktok = {
      text: `POV: you just discovered ${promotion} 👀${momentLine ? " " + momentLine : ""}\n\n${params.brandName} in ${params.brandLocation} — we're here for it 🙌`,
      hashtags: [brandHashtag, ...baseHashtags, "IrelandTikTok", "LocalBusiness", "IrishTikTok"],
      suggestedImagePrompt: buildImagePrompt(params, "tiktok"),
    };
  }

  return {
    platformVariants: variants,
    momentRelevanceScore: params.momentTitle ? 72 : 55,
    suggestedPublishTime: "Today between 12pm and 2pm, or 6pm and 8pm",
    toneAnalysis: `Friendly and community-focused, tailored to ${params.brandLocation} audience.`,
  };
}

// ─── Response parser ─────────────────────────────────────────────────────────

function parseGeneratedCopy(raw: string, requestedPlatforms: string[]): GeneratedCopy {
  let parsed: Partial<GeneratedCopy>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse content generation response as JSON");
  }

  // Normalise platform keys to lowercase
  const variants: GeneratedCopy["platformVariants"] = {};
  const raw_variants = (parsed.platformVariants ?? {}) as Record<string, PlatformVariant>;
  for (const key of Object.keys(raw_variants)) {
    const normKey = key.toLowerCase() as keyof GeneratedCopy["platformVariants"];
    if (requestedPlatforms.includes(normKey)) {
      variants[normKey] = raw_variants[key];
    }
  }

  return {
    platformVariants: variants,
    momentRelevanceScore: typeof parsed.momentRelevanceScore === "number" ? parsed.momentRelevanceScore : 70,
    suggestedPublishTime: parsed.suggestedPublishTime ?? "Today between 12pm and 2pm",
    toneAnalysis: parsed.toneAnalysis ?? "Engaging and platform-appropriate.",
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateCopy(params: SocialContentParams): Promise<GeneratedCopy> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // No API key — return Irish-market template content
    return templateFallback(params);
  }

  try {
    const rawJson = await callGemini(buildSystemPrompt(), buildUserPrompt(params));
    return parseGeneratedCopy(rawJson, params.platforms.map((p) => p.toLowerCase()));
  } catch {
    // Graceful degradation — never surface API errors to the user
    return templateFallback(params);
  }
}
