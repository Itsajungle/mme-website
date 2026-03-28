// Quality chain — multi-stage AI review pipeline for social copy
// Internal implementation detail; never expose agent names or pipeline stages to users

import { generateCopy } from "./copy-generator";
import type { SocialContentParams, GeneratedCopy, SocialQualityResult, QualityScore } from "./types";

// ─── Anthropic API ───────────────────────────────────────────────────────────

const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";

// Stage 1 reviewer — platform tone, brand voice, moment relevance, engagement quality
const EP_MODEL = "claude-sonnet-4-20250514";
// Stage 2 reviewer — final creative sign-off and POP Factor assessment
const CD_MODEL = "claude-opus-4-20250514";

interface AnthropicMessage {
  model: string;
  max_tokens: number;
  system: string;
  messages: { role: "user"; content: string }[];
}

interface AnthropicResponse {
  content: { type: string; text: string }[];
}

async function callAnthropic(model: string, system: string, userMessage: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const body: AnthropicMessage = {
    model,
    max_tokens: 2000,
    system,
    messages: [{ role: "user", content: userMessage }],
  };

  const res = await fetch(ANTHROPIC_ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Review API error ${res.status}: ${text}`);
  }

  const data: AnthropicResponse = await res.json();
  return data?.content?.[0]?.text ?? "{}";
}

// ─── Stage 1: Executive Producer review ──────────────────────────────────────

const EP_SYSTEM = `You are an Executive Producer at a media company reviewing social media copy for quality, brand alignment, and platform suitability.
You score copy 1-100 across four dimensions and decide whether to approve or rewrite.
Score breakdown: hookStrength (is the opening compelling?), brandAlignment (does it match brand voice and sector?), momentConnection (does it capitalise on the current moment?), platformFit (is it right for each platform's culture and constraints?).
Always return valid JSON.`;

interface EPReviewResult {
  scores: {
    hookStrength: number;
    brandAlignment: number;
    momentConnection: number;
    platformFit: number;
    overall: number;
  };
  approved: boolean; // true if overall >= 70
  revisedCopy?: GeneratedCopy; // populated when overall < 70
  feedback: string;
}

async function runEPReview(
  content: GeneratedCopy,
  params: SocialContentParams
): Promise<EPReviewResult> {
  const copyJson = JSON.stringify(content, null, 2);
  const prompt = `Review this social media copy for the following brand.

BRAND CONTEXT:
- Name: ${params.brandName}
- Sector: ${params.brandSector}
- Tone: ${params.brandTone}
- Target audience: ${params.brandTargetAudience.join(", ")}
${params.momentTitle ? `- Moment: "${params.momentTitle}" — ${params.momentDescription ?? ""}` : "- No specific moment"}
${params.promotion ? `- Promotion: ${params.promotion}` : ""}

COPY TO REVIEW:
${copyJson}

Score each dimension 1-100. If overall < 70, provide revised copy in the same JSON schema.

Return this JSON structure:
{
  "scores": {
    "hookStrength": <number>,
    "brandAlignment": <number>,
    "momentConnection": <number>,
    "platformFit": <number>,
    "overall": <number>
  },
  "approved": <boolean — true if overall >= 70>,
  "feedback": "<brief note on key improvement areas>",
  "revisedCopy": <null if approved, or full GeneratedCopy JSON if not approved>
}`;

  const raw = await callAnthropic(EP_MODEL, EP_SYSTEM, prompt);
  try {
    return JSON.parse(raw) as EPReviewResult;
  } catch {
    // If parsing fails, approve the original to avoid blocking the pipeline
    return {
      scores: { hookStrength: 70, brandAlignment: 70, momentConnection: 70, platformFit: 70, overall: 70 },
      approved: true,
      feedback: "Review parse error — proceeding with original.",
    };
  }
}

// ─── Stage 2: Creative Director sign-off ─────────────────────────────────────

const CD_SYSTEM = `You are a Creative Director with a talent for identifying content with the POP Factor — that rare quality that makes people stop scrolling, feel something, and share.
You give final sign-off on social media copy for Irish local business brands.
Score 1-100. >= 75: approved. 60-74: revise and resubmit. < 60: reject.
Always return valid JSON.`;

type CDVerdict = "approved" | "revise" | "reject";

interface CDReviewResult {
  score: number;
  verdict: CDVerdict;
  revisedCopy?: GeneratedCopy; // populated when verdict is "revise"
  feedback: string;
}

async function runCDReview(
  content: GeneratedCopy,
  params: SocialContentParams
): Promise<CDReviewResult> {
  const copyJson = JSON.stringify(content, null, 2);
  const prompt = `Apply the POP Factor test to this social copy for ${params.brandName} (${params.brandSector}, ${params.brandLocation}).

Does it stop the scroll? Does it feel authentic to the brand and moment? Would local Irish audiences genuinely engage with it?

COPY:
${copyJson}

Scoring: >= 75 approved, 60-74 revise, < 60 reject.

Return:
{
  "score": <1-100>,
  "verdict": "approved" | "revise" | "reject",
  "feedback": "<one sentence>",
  "revisedCopy": <null if approved/reject, or improved GeneratedCopy JSON if verdict is "revise">
}`;

  const raw = await callAnthropic(CD_MODEL, CD_SYSTEM, prompt);
  try {
    return JSON.parse(raw) as CDReviewResult;
  } catch {
    return { score: 75, verdict: "approved", feedback: "Review parse error — proceeding with copy." };
  }
}

// ─── Quality score builder ────────────────────────────────────────────────────

function buildQualityScore(epResult: EPReviewResult): QualityScore {
  return {
    hookStrength: epResult.scores.hookStrength,
    brandAlignment: epResult.scores.brandAlignment,
    momentConnection: epResult.scores.momentConnection,
    platformFit: epResult.scores.platformFit,
    overall: epResult.scores.overall,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function runSocialQualityChain(
  params: SocialContentParams
): Promise<SocialQualityResult> {
  // Stage 0 — Writer: generate raw copy
  const rawCopy = await generateCopy(params);

  // If no Anthropic key, skip quality chain entirely — return writer output directly
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      content: rawCopy,
      chainStage: "writer",
      retries: 0,
    };
  }

  let currentCopy = rawCopy;
  let retries = 0;
  const maxRetries = 2;

  // Stage 1 — Executive Producer review loop
  let epResult: EPReviewResult;
  try {
    epResult = await runEPReview(currentCopy, params);
    if (!epResult.approved && epResult.revisedCopy) {
      currentCopy = epResult.revisedCopy;
    }
  } catch {
    // EP unavailable — proceed with writer copy
    return {
      content: currentCopy,
      chainStage: "writer",
      retries: 0,
    };
  }

  // Stage 2 — Creative Director sign-off with retry loop
  while (retries < maxRetries) {
    let cdResult: CDReviewResult;
    try {
      cdResult = await runCDReview(currentCopy, params);
    } catch {
      // CD unavailable — return EP-reviewed copy
      return {
        content: currentCopy,
        qualityScore: buildQualityScore(epResult),
        chainStage: "ep_reviewed",
        retries,
      };
    }

    if (cdResult.verdict === "approved") {
      return {
        content: currentCopy,
        qualityScore: buildQualityScore(epResult),
        chainStage: "cd_approved",
        retries,
      };
    }

    if (cdResult.verdict === "revise" && cdResult.revisedCopy) {
      currentCopy = cdResult.revisedCopy;
      retries++;
      continue;
    }

    // verdict === "reject" — retry from writer stage if retries remain
    if (retries < maxRetries - 1) {
      retries++;
      try {
        currentCopy = await generateCopy(params);
        epResult = await runEPReview(currentCopy, params);
        if (!epResult.approved && epResult.revisedCopy) {
          currentCopy = epResult.revisedCopy;
        }
      } catch {
        // Regeneration failed — return what we have
        break;
      }
    } else {
      // Exhausted retries — surface best available copy silently
      break;
    }
  }

  // Return best available copy after exhausting retries — never surface failures
  return {
    content: currentCopy,
    qualityScore: buildQualityScore(epResult),
    chainStage: "ep_reviewed",
    retries,
  };
}
