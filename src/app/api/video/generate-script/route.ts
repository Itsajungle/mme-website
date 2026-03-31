import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a senior video ad scriptwriter specialising in Irish and UK social media advertising. You create structured 5-clip video ad scripts for broadcast-quality social video ads.

SCRIPT STRUCTURE — 5 CLIPS:
1. BRAND INTRO (Remotion animation) — 3 seconds, logo reveal
2. PRESENTER — 15-25 seconds, avatar delivers the ENTIRE ad in one continuous take. Introduces the brand, describes the offer, delivers the call to action, ends with the logo line.
3. PRODUCT SHOWCASE (image overlay) — 5 seconds, appears as overlay on the presenter video
4. OFFER CARD (Remotion animation) — 5 seconds, appears as overlay on the presenter video
5. BRAND OUTRO (Remotion animation) — 3 seconds, logo outro

CRITICAL RULES:
- Write in natural, conversational Irish English — NOT American ad-speak
- The brand's logo line MUST appear at the end of clip 2's script
- Clip 2 is ONE single continuous script — the presenter delivers everything in one take
- Speaking rate: ~2.5 words per second for natural delivery
- Word count for clip 2: duration × 2.5 words (e.g. 20s = ~50 words)
- No competitor mentions, no misleading claims
- Clip 3 needs an imagePrompt for AI image generation (photorealistic, cinematic)
- Clip 4 needs structured offerData with headline, price, finance, terms

OUTPUT FORMAT:
Return ONLY valid JSON matching this structure:
{
  "clips": [
    { "clipNumber": 1, "type": "remotion_intro", "duration": 3, "notes": "Logo reveal animation" },
    { "clipNumber": 2, "type": "presenter", "duration": 20, "script": "...", "direction": "Warm, enthusiastic, building to energetic CTA" },
    { "clipNumber": 3, "type": "image_overlay", "duration": 5, "imagePrompt": "Photorealistic...", "notes": "Overlay on presenter" },
    { "clipNumber": 4, "type": "remotion_offer", "duration": 5, "offerData": { "headline": "...", "price": "...", "finance": "...", "terms": "..." }, "notes": "Overlay on presenter" },
    { "clipNumber": 5, "type": "remotion_outro", "duration": 3, "notes": "Logo outro animation" }
  ],
  "totalDuration": 36,
  "voiceTone": "Warm Irish, conversational, trustworthy",
  "targetAudience": "..."
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      concept,
      carMake,
      carModel,
      carYear,
      dealDetails,
      location,
      brandName,
      brandSlug,
      logoLine,
      locations,
      sectorName,
    } = body;

    if (!concept) {
      return NextResponse.json(
        { error: "Missing required field: concept" },
        { status: 400 }
      );
    }

    const locationText = location || (locations?.length
      ? locations.map((l: { name: string; address: string }) => `${l.name}, ${l.address}`).join("; ")
      : "not specified");

    const carDetails = [carMake, carModel, carYear].filter(Boolean).join(" ");

    const userPrompt = `Write a 5-clip video ad script for a social media video ad.

BRAND: ${brandName || brandSlug}
SECTOR: ${sectorName || "general"}
LOCATION(S): ${locationText}
LOGO LINE (must appear at end of clip 6): "${logoLine || brandName}"

CAMPAIGN CONCEPT: ${concept}
${carDetails ? `CAR DETAILS: ${carDetails}` : ""}
${dealDetails ? `DEAL DETAILS: ${dealDetails}` : ""}

Generate all 5 clips following the exact structure. Make the script feel natural, warm, and Irish. Clip 2 is the single presenter clip — one continuous take delivering the entire ad.`;

    const client = new Anthropic();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
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
    return NextResponse.json(result);
  } catch (err) {
    console.error("[video/generate-script] Error:", err);
    const message = err instanceof Error ? err.message : "Script generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
