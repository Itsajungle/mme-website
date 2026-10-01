import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are a top commercial radio jingle writer working for an Irish/UK radio production house.
From a short brief you write a sung jingle: catchy, singable lyrics plus a precise musical style description.

LYRICS RULES
- Write for singing, not speaking: strong rhymes, steady metre, short lines, a hook that repeats.
- Always sing the advertiser's name in the hook, and the location if one is given.
- Use the voices the brief asks for. Mark every section with a tag naming the singers, e.g.
  [Verse 1 - male group], [Verse 2 - female solo], [Chorus - everyone]. Add [Intro: ...] / [Outro: ...] cues where useful.
- Puns and humour are welcome when the brief asks for them. Keep them clean and family-friendly.
- Length must fit the requested duration: ~15s = 4 lines; ~30s = 8–12 lines; ~60s = 16–20 lines.
- Never invent prices, discounts, awards, opening hours or factual claims that are not in the brief.
  Light-hearted puffery ("the finest around") is fine; specific claims are not.
- Irish/British English spelling and idiom.

STYLE RULES
- Describe the SOUND only: genre, era, tempo/feel (e.g. "6/8 jig"), instruments, vocal arrangement, energy, production.
- Never name real artists, bands, songs or record labels. No brand names of software.
- 25–60 words, comma-separated descriptors.

Return ONLY valid JSON:
{"title": "...", "style": "...", "lyrics": "...", "durationSeconds": 30, "notes": "one short line on the idea"}`;

export async function POST(request: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "Writer not configured" }, { status: 503 });
  try {
    const { brief, durationSeconds, brandName } = await request.json();
    if (!brief || String(brief).trim().length < 10) {
      return Response.json({ error: "Tell me a bit more about the jingle" }, { status: 400 });
    }
    const secs = [15, 30, 60].includes(Number(durationSeconds)) ? Number(durationSeconds) : 30;
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 1500,
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Advertiser: ${brandName || "(see brief)"}\nTarget length: ${secs} seconds\n\nBrief:\n${String(brief).slice(0, 2000)}`,
      }],
    });
    const text = msg.content.map((c) => ("text" in c ? c.text : "")).join("");
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    if (!json.lyrics || !json.style) throw new Error("Incomplete draft");
    return Response.json({
      title: String(json.title || brandName || "Jingle").slice(0, 80),
      style: String(json.style).slice(0, 1000),
      lyrics: String(json.lyrics).slice(0, 3000),
      durationSeconds: secs,
      notes: String(json.notes || "").slice(0, 200),
    });
  } catch (error) {
    console.error("[jingle-write]", error);
    return Response.json({ error: "Couldn't write the jingle — try again" }, { status: 500 });
  }
}
