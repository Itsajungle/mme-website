import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const WORD_TARGETS: Record<string, { min: number; max: number; label: string }> = {
  "15": { min: 35, max: 40, label: "15-second stinger" },
  "30": { min: 70, max: 80, label: "30-second spot" },
  "60": { min: 140, max: 160, label: "60-second feature" },
};

const SYSTEM_PROMPT = `You are a senior radio copywriter specialising in UK and Irish broadcast advertising. You create broadcast-ready radio scripts that comply with Ofcom Broadcasting Code, ASA/CAP regulations, and BCAP standards.

CRITICAL — WORD COUNT DISCIPLINE:
You MUST hit the exact word count target given. Speaking rate is 2.5 words per second for natural radio delivery.
- 15-second ad: 35–40 words of spoken copy (voice lines only)
- 30-second ad: 70–80 words of spoken copy (voice lines only)
- 60-second ad: 140–160 words of spoken copy (voice lines only)
Count ONLY the spoken words (voice lines). Music cues, SFX cues, and production directions are NOT counted.

THE 4 ELEMENTS OF CREATIVE RADIO:
1. Theatre of the Mind — paint pictures with sound, let the listener's imagination do the work
2. Emotion — connect on a human level, make the listener feel something
3. Simplicity — one clear message, one clear offer, one clear call to action
4. Call to Action — tell the listener exactly what to do next

SCRIPT STRUCTURE:
Hook (first 3 seconds grab attention) → Problem/Desire → Solution → Offer/Value → CTA with location/contact → Logo line sign-off

COMPLIANCE (UK/Irish broadcast):
- No speed/acceleration claims
- Finance: MUST include representative APR, total amount payable, deposit
- "From £X/month" needs representative example
- Safety claims must be substantiated
- Environmental claims must be specific and verifiable
- No misleading availability claims ("limited stock" only if genuinely limited)
- Include dealer/brand name, location, and contact method

STYLE:
- Write in natural, conversational Irish/British English
- Use warm, authentic phrasing — not American ad-speak
- The logo line provided MUST appear at the END of the voice copy, exactly as given

OUTPUT FORMAT:
Return ONLY valid JSON with this structure:
{
  "segments": [
    { "type": "music", "direction": "[MUSIC BED: description — Xs]" },
    { "type": "voice", "text": "The spoken copy here." },
    { "type": "sfx", "direction": "[SFX: description — Xs]" },
    { "type": "voice", "text": "More spoken copy." },
    { "type": "music", "direction": "[MUSIC: resolve — Xs]" }
  ],
  "wordCount": 75,
  "estimatedDuration": 30
}

Rules for segments:
- "voice" segments have "text" (the spoken words) — these are what get counted
- "music" and "sfx" segments have "direction" (production cue) — NOT counted in word count
- wordCount must be the EXACT count of words across all voice segments
- estimatedDuration = wordCount / 2.5 + total non-voice segment durations`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      promotion,
      duration,
      tone,
      triggerType,
      brandName,
      businessType,
      locations,
      logoLine,
    } = body;

    const durationStr = String(duration).replace("s", "");
    const target = WORD_TARGETS[durationStr];
    if (!target) {
      return NextResponse.json(
        { error: "Invalid duration. Use 15, 30, or 60." },
        { status: 400 }
      );
    }

    const locationText = locations?.length
      ? locations.map((l: { name: string; address: string }) => `${l.name}, ${l.address}`).join("; ")
      : "";

    const userPrompt = `Write a ${target.label} radio ad script.

BRAND: ${brandName}
BUSINESS TYPE: ${businessType || "general"}
LOCATION(S): ${locationText || "not specified"}
LOGO LINE (must appear at end of voice copy): "${logoLine || brandName}"
PROMOTION/OFFER: ${promotion}
TRIGGER/OCCASION: ${triggerType || "general"}
TONE: ${tone || "friendly"}

WORD COUNT TARGET: ${target.min}–${target.max} words of spoken copy (voice segments only).
This is a ${durationStr}-second ad. You MUST land within ${target.min}–${target.max} words. Count carefully before responding.`;

    const client = new Anthropic();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI did not return valid JSON" },
        { status: 502 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    const { segments, wordCount } = result;

    // Validate word count — re-prompt once if out of range
    if (wordCount < target.min || wordCount > target.max) {
      const retryPrompt = `Your script had ${wordCount} words but the target is ${target.min}–${target.max} words. ${
        wordCount < target.min
          ? "Add more detail, description, or expand the offer."
          : "Cut unnecessary words. Be more concise."
      } Return the corrected script in the same JSON format. Count words carefully.`;

      const retryResponse = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: userPrompt },
          { role: "assistant", content: text },
          { role: "user", content: retryPrompt },
        ],
      });

      const retryText = retryResponse.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");

      const retryMatch = retryText.match(/\{[\s\S]*\}/);
      if (retryMatch) {
        const retryResult = JSON.parse(retryMatch[0]);
        return NextResponse.json(retryResult);
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[generate-script] Error:", err);
    const message = err instanceof Error ? err.message : "Script generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
// rebuild trigger
