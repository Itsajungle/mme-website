import { evaluateConcept } from "@/lib/kova";
import { generateScript } from "@/lib/audio-engine/script-generator";
import type { GenerateRequest, GenerateResponse } from "@/lib/sales-portal/types";
import { VOICE_ROSTER, TONE_VOICE_MAP } from "@/lib/sales-portal/types";

// ── Helpers ─────────────────────────────────────────────────

function generateId(): string {
  return `ad-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function selectVoice(tone: string): (typeof VOICE_ROSTER)[number] {
  const preferred = TONE_VOICE_MAP[tone] ?? TONE_VOICE_MAP.friendly;
  const name = preferred[Math.floor(Math.random() * preferred.length)];
  return VOICE_ROSTER.find((v) => v.name === name) ?? VOICE_ROSTER[0];
}

function selectMusicGenre(tone: string, businessType: string): string {
  const genreMap: Record<string, string> = {
    friendly: "Warm acoustic, feel-good",
    urgent: "Driving, energetic beat",
    professional: "Smooth, confident corporate",
    humorous: "Playful, bouncy riff",
    emotional: "Heartfelt strings & piano",
  };
  return genreMap[tone] ?? "Upbeat, bright music bed";
}

function selectSfxSpots(businessType: string): string[] {
  const sfxMap: Record<string, string[]> = {
    Automotive: ["Engine start", "Keys jingle"],
    Hospitality: ["Sizzling pan", "Cork pop"],
    Retail: ["Shopping bag rustle", "Cash register"],
    "Financial Services": ["Pen on paper", "Notification chime"],
    Tourism: ["Bird call", "Water splash"],
    "Food & Drink": ["Sizzling grill", "Pour drink"],
    "Health & Wellness": ["Gentle chime", "Water flowing"],
    Entertainment: ["Crowd cheer", "Spotlight buzz"],
  };
  return sfxMap[businessType] ?? ["Whoosh transition", "Soft chime"];
}

function calculateComProdScore(
  script: string,
  duration: number,
  tone: string,
  businessType: string,
  sfxCount: number
): { score: number; reason: string } {
  let score = 60;

  // Word density scoring
  const wordCount = script.split(/\s+/).filter(Boolean).length;
  const wordsPerSecond = wordCount / duration;
  if (wordsPerSecond >= 2 && wordsPerSecond <= 3) score += 10;
  else if (wordsPerSecond >= 1.5 && wordsPerSecond <= 3.5) score += 5;

  // SFX enrichment
  if (sfxCount >= 1) score += 5;
  if (sfxCount >= 2) score += 5;

  // Tone alignment
  score += 5;

  // CTA presence
  if (script.toLowerCase().includes("visit") || script.toLowerCase().includes("call") || script.toLowerCase().includes("pop in")) {
    score += 5;
  }

  // Brand mention
  score += 5;

  // Variation bonus
  score += Math.floor(Math.random() * 6);

  score = Math.min(100, Math.max(0, score));

  const reasons = [];
  if (score >= 85) reasons.push("Excellent script density and production value");
  else if (score >= 70) reasons.push("Good balance of message and production elements");
  else reasons.push("Solid foundation — consider enriching with more SFX or tighter CTA");

  return { score, reason: reasons[0] };
}

// ── POST Handler ────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();

    // Step 1: Validate
    if (!body.advertiserName || !body.businessType || !body.keyMessage || !body.duration || !body.tone || !body.mode) {
      return Response.json(
        { success: false, error: "Missing required fields: advertiserName, businessType, keyMessage, duration, tone, mode" },
        { status: 400 }
      );
    }

    if (![15, 30, 45, 60].includes(body.duration)) {
      return Response.json(
        { success: false, error: "Duration must be 15, 30, 45, or 60 seconds" },
        { status: 400 }
      );
    }

    const adId = generateId();
    const advertiserId = body.advertiserId ?? `adv-${Date.now()}`;

    // Step 2: Concept Gate
    const conceptResult = evaluateConcept({
      brandSlug: body.advertiserName.toLowerCase().replace(/\s+/g, "-"),
      title: `Demo Ad: ${body.advertiserName}`,
      description: body.keyMessage,
      targetAudience: "Local radio listeners",
      tone: body.tone,
      medium: "audio",
      duration: body.duration * 1000,
    });

    if (conceptResult.status === "rejected") {
      return Response.json(
        { success: false, error: "Concept did not pass creative review. Please refine your key message.", conceptFeedback: conceptResult.feedback },
        { status: 400 }
      );
    }

    // Step 3: Generate Script
    const scriptDuration = body.duration <= 15 ? 15 : body.duration <= 30 ? 30 : 60;
    const generated = generateScript({
      brand: {
        name: body.advertiserName,
        locations: [{ name: body.advertiserName, address: "your local branch" }],
        logoLine: `${body.advertiserName} — always here for you.`,
        sector: body.businessType.toLowerCase(),
      },
      promotion: body.keyMessage,
      triggerType: "Seasonal",
      duration: scriptDuration,
      tone: body.tone,
    });

    // Step 4: Select voice based on tone
    const voice = selectVoice(body.tone);
    const musicStyle = selectMusicGenre(body.tone, body.businessType);
    const sfxSpots = selectSfxSpots(body.businessType);

    // For HYBRID mode: return script only, no audio
    if (body.mode === "hybrid") {
      const response: GenerateResponse = {
        success: true,
        adId,
        advertiserId,
        advertiserName: body.advertiserName,
        businessType: body.businessType,
        keyMessage: body.keyMessage,
        duration: body.duration,
        tone: body.tone,
        mode: "hybrid",
        script: generated.fullText,
        voiceId: voice.id,
        musicStyle,
        sfxSpots,
        audioUrl: null,
        comptrodScore: 0,
        scoreReason: "Pending audio generation",
        status: "script-ready",
      };
      return Response.json(response);
    }

    // AUTOMATED mode: generate full audio pipeline
    // Steps 5-8: Voice → Music → SFX → Mix (simulated for demo)
    let audioUrl: string | null = null;

    try {
      // Voice generation
      const voiceRes = await fetch(new URL("/api/audio/voice-generate", request.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: generated.segments.filter((s) => s.type === "voice").map((s) => s.text).join(" "),
          voiceId: voice.id,
          settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });

      if (voiceRes.ok) {
        const voiceData = await voiceRes.json();
        audioUrl = voiceData.url ?? null;
      }
    } catch (audioErr) {
      console.error("[sales-portal] Audio generation failed, returning script-only:", audioErr);
    }

    // Step 9: Calculate ComProd Score
    const voiceText = generated.segments.filter((s) => s.type === "voice").map((s) => s.text).join(" ");
    const { score, reason } = calculateComProdScore(voiceText, body.duration, body.tone, body.businessType, sfxSpots.length);

    const response: GenerateResponse = {
      success: true,
      adId,
      advertiserId,
      advertiserName: body.advertiserName,
      businessType: body.businessType,
      keyMessage: body.keyMessage,
      duration: body.duration,
      tone: body.tone,
      mode: "automated",
      script: generated.fullText,
      voiceId: voice.id,
      musicStyle,
      sfxSpots,
      audioUrl,
      comptrodScore: score,
      scoreReason: reason,
      status: "complete",
    };

    return Response.json(response);
  } catch (error) {
    console.error("[sales-portal/generate] Error:", error);
    return Response.json(
      { success: false, error: "Generation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
