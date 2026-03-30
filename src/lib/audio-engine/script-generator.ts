// Script generator — AI-based script generation with template fallback
// Primary: calls /api/radio/generate-script (Claude AI)
// Fallback: uses intelligent templates with brand context

export interface ScriptSegment {
  type: "music" | "voice" | "sfx";
  text: string;
  duration: number;
  direction?: string;
}

export interface GeneratedScript {
  fullText: string;
  segments: ScriptSegment[];
  directions: string;
  wordCount: number;
  estimatedDuration: number;
}

export interface ScriptInput {
  brand: {
    name: string;
    locations: { name: string; address: string }[];
    logoLine: string;
    sector: string;
    voiceName?: string;
    voiceDescription?: string;
  };
  promotion: string;
  triggerType: string;
  triggerContext?: string;
  duration: number; // 15, 30, or 60
  tone: "friendly" | "urgent" | "professional" | "humorous" | "emotional";
}

// AI-based script generation — calls the API route
export async function generateScriptAI(input: ScriptInput): Promise<GeneratedScript> {
  const res = await fetch("/api/radio/generate-script", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      promotion: input.promotion,
      duration: input.duration,
      tone: input.tone,
      triggerType: input.triggerType,
      brandName: input.brand.name,
      businessType: input.brand.sector,
      locations: input.brand.locations,
      logoLine: input.brand.logoLine,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "API error" }));
    throw new Error(err.error || `Script generation failed (${res.status})`);
  }

  const data = await res.json();
  const { segments: aiSegments, wordCount, estimatedDuration } = data;

  // Convert AI response segments to our ScriptSegment format
  const segments: ScriptSegment[] = aiSegments.map(
    (seg: { type: string; text?: string; direction?: string }) => {
      if (seg.type === "voice") {
        const words = (seg.text || "").split(/\s+/).filter(Boolean).length;
        return {
          type: "voice" as const,
          text: seg.text || "",
          duration: words / 2.5,
        };
      }
      // Music / SFX — parse duration from direction if possible
      const durMatch = (seg.direction || "").match(/(\d+(?:\.\d+)?)s/);
      const dur = durMatch ? parseFloat(durMatch[1]) : 2;
      return {
        type: seg.type as "music" | "sfx",
        text: "",
        duration: dur,
        direction: seg.direction || "",
      };
    }
  );

  // Build fullText and directions
  let fullText = "";
  let directions = "";
  for (const seg of segments) {
    if (seg.direction) {
      fullText += seg.direction + "\n\n";
      directions += seg.direction + "\n";
    }
    if (seg.type === "voice" && seg.text) {
      const voiceLabel = input.brand.voiceName
        ? `VOICE (${input.brand.voiceName} — ${input.brand.voiceDescription || ""})`
        : "VOICE";
      fullText += `${voiceLabel}:\n"${seg.text}"\n\n`;
    }
  }

  return {
    fullText: fullText.trim(),
    segments,
    directions: directions.trim(),
    wordCount,
    estimatedDuration,
  };
}

// Word count targets at 2.5 words/sec
const WORD_TARGETS: Record<number, number> = {
  15: 30,
  30: 65,
  60: 140,
};

// Irish English phrasing
const IRISH_PHRASES = {
  friendly: ["pop into", "sure look it", "grand", "brilliant", "just down the road", "call in to us", "you won't be stuck"],
  urgent: ["this weekend only", "don't miss out", "last chance", "hurry in", "limited time"],
  professional: ["we're pleased to offer", "established since", "trusted by", "you're in safe hands"],
  humorous: ["sure, why wouldn't you?", "tell your neighbours", "you'd be mad not to", "go on, treat yourself"],
  emotional: ["there's nothing quite like", "for the people of", "your community", "because you deserve"],
};

// Template sets per duration
const TEMPLATES_15: ((input: ScriptInput) => ScriptSegment[])[] = [
  // Template 1: Hook + Offer + CTA
  (input) => [
    { type: "music", text: "", duration: 2, direction: `[MUSIC BED: ${getMusicDesc(input)} — 2s intro]` },
    { type: "voice", text: `${getHook(input)} ${getOffer(input)} ${getCTA(input)} ${input.brand.logoLine}.`, duration: 11 },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Jingle resolve — 2s]" },
  ],
  // Template 2: Question + Answer + CTA
  (input) => [
    { type: "music", text: "", duration: 2, direction: `[MUSIC BED: ${getMusicDesc(input)} — 2s]` },
    { type: "voice", text: `${getQuestion(input)} ${getAnswer(input)} ${input.brand.logoLine}.`, duration: 11 },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Tag — 2s]" },
  ],
  // Template 3: Statement + CTA
  (input) => [
    { type: "sfx", text: "", duration: 1.5, direction: `[SFX: ${getSFXCue(input)} — 1.5s]` },
    { type: "voice", text: `${getStatement(input)} ${getCTA(input)} ${input.brand.logoLine}.`, duration: 11.5 },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Resolve — 2s]" },
  ],
  // Template 4: Trigger + Offer
  (input) => [
    { type: "music", text: "", duration: 2, direction: `[MUSIC BED: ${getMusicDesc(input)} — 2s]` },
    { type: "voice", text: `${getTriggerHook(input)} ${getOffer(input)} ${input.brand.logoLine}.`, duration: 11 },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Out — 2s]" },
  ],
  // Template 5: Quick announcement
  (input) => [
    { type: "music", text: "", duration: 1.5, direction: `[MUSIC: Stinger — 1.5s]` },
    { type: "voice", text: `Attention, ${getAudienceAddress(input)}! ${getOffer(input)} at ${input.brand.name}. ${getCTA(input)} ${input.brand.logoLine}.`, duration: 12 },
    { type: "music", text: "", duration: 1.5, direction: "[MUSIC: Tag — 1.5s]" },
  ],
];

const TEMPLATES_30: ((input: ScriptInput) => ScriptSegment[])[] = [
  // Template 1: Full narrative
  (input) => [
    { type: "music", text: "", duration: 3, direction: `[MUSIC BED: ${getMusicDesc(input)} — 3s intro]` },
    { type: "voice", text: `${getHook(input)}\n\n${getBody(input)}\n\n${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 22 },
    { type: "sfx", text: "", duration: 1, direction: `[SFX: ${getSFXCue(input)} — 1s]` },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Jingle out — 2s]" },
  ],
  // Template 2: Trigger-led
  (input) => [
    { type: "music", text: "", duration: 3, direction: `[MUSIC BED: ${getMusicDesc(input)} — fades under]` },
    { type: "voice", text: `${getTriggerHook(input)}\n\nWell here's some good news. ${getBody(input)}\n\n${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 22 },
    { type: "sfx", text: "", duration: 1, direction: `[SFX: ${getSFXCue(input)}]` },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Resolve — 2s]" },
  ],
  // Template 3: Conversational
  (input) => [
    { type: "music", text: "", duration: 2, direction: `[MUSIC BED: ${getMusicDesc(input)} — 2s intro, ducked]` },
    { type: "voice", text: `Hey there! ${getConversational(input)}\n\n${getOffer(input)}\n\n${getLocation(input)} ${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 24 },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Full — 2s out]" },
  ],
  // Template 4: Story-led
  (input) => [
    { type: "sfx", text: "", duration: 2, direction: `[SFX: ${getSFXCue(input)} — scene-setter]` },
    { type: "music", text: "", duration: 1, direction: `[MUSIC: ${getMusicDesc(input)} — fades under]` },
    { type: "voice", text: `${getStoryOpener(input)}\n\n${getBody(input)}\n\n${getCTA(input)} ${input.brand.logoLine}.`, duration: 23 },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Tag — 2s]" },
  ],
  // Template 5: Dual voice feel (single voice, two tones)
  (input) => [
    { type: "music", text: "", duration: 3, direction: `[MUSIC BED: ${getMusicDesc(input)} — 3s, bright]` },
    { type: "voice", text: `${getHook(input)} ${getOffer(input)}\n\nAt ${input.brand.name}, ${getValueProp(input)}.\n\n${getLocation(input)} ${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 22 },
    { type: "sfx", text: "", duration: 1, direction: `[SFX: ${getSFXCue(input)}]` },
    { type: "music", text: "", duration: 2, direction: "[MUSIC: Out — 2s]" },
  ],
];

const TEMPLATES_60: ((input: ScriptInput) => ScriptSegment[])[] = [
  // Template 1: Full production
  (input) => [
    { type: "music", text: "", duration: 3, direction: `[MUSIC BED: ${getMusicDesc(input)} — 3s intro]` },
    { type: "voice", text: `${getSceneSetter(input)}\n\n${getProblem(input)}\n\n${getSolution(input)}\n\n${getDetails(input)}\n\n${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 50 },
    { type: "sfx", text: "", duration: 2, direction: `[SFX: ${getSFXCue(input)} — accent]` },
    { type: "music", text: "", duration: 3, direction: "[MUSIC: Full resolve — 3s out]" },
  ],
  // Template 2: Storytelling
  (input) => [
    { type: "sfx", text: "", duration: 2, direction: `[SFX: ${getSFXCue(input)} — opening scene]` },
    { type: "music", text: "", duration: 2, direction: `[MUSIC: ${getMusicDesc(input)} — fades under]` },
    { type: "voice", text: `${getStoryOpener(input)}\n\n${getStoryMiddle(input)}\n\n${getStoryTurn(input)}\n\n${getOffer(input)}\n\n${getLocation(input)} ${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 49 },
    { type: "sfx", text: "", duration: 1, direction: `[SFX: ${getSFXCue(input)}]` },
    { type: "music", text: "", duration: 3, direction: "[MUSIC: Resolve — 3s]" },
  ],
  // Template 3: Testimonial style
  (input) => [
    { type: "music", text: "", duration: 3, direction: `[MUSIC BED: ${getMusicDesc(input)} — warm, 3s]` },
    { type: "voice", text: `${getTestimonialOpen(input)}\n\n${getTestimonialBody(input)}\n\n${getOffer(input)}\n\n${getDetails(input)}\n\n${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 50 },
    { type: "sfx", text: "", duration: 1, direction: `[SFX: ${getSFXCue(input)}]` },
    { type: "music", text: "", duration: 3, direction: "[MUSIC: Out — 3s]" },
  ],
  // Template 4: Magazine style
  (input) => [
    { type: "music", text: "", duration: 3, direction: `[MUSIC: ${getMusicDesc(input)} — magazine open]` },
    { type: "voice", text: `${getTriggerHook(input)}\n\nAnd speaking of great timing, ${getBody(input)}\n\n${getDetails(input)}\n\nSo whether you're ${getAudienceActivity(input)}, ${input.brand.name} has you covered.\n\n${getLocation(input)} ${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 50 },
    { type: "sfx", text: "", duration: 1, direction: `[SFX: ${getSFXCue(input)}]` },
    { type: "music", text: "", duration: 3, direction: "[MUSIC: Close — 3s]" },
  ],
  // Template 5: Direct address
  (input) => [
    { type: "music", text: "", duration: 2, direction: `[MUSIC BED: ${getMusicDesc(input)} — 2s]` },
    { type: "voice", text: `Good ${getTimeOfDay()}, ${getAudienceAddress(input)}!\n\n${getHook(input)}\n\n${getBody(input)}\n\n${getDetails(input)}\n\nDon't let this one pass you by. ${getCTA(input)}\n\n${input.brand.logoLine}.`, duration: 51 },
    { type: "sfx", text: "", duration: 1, direction: `[SFX: ${getSFXCue(input)}]` },
    { type: "music", text: "", duration: 3, direction: "[MUSIC: Resolve — 3s]" },
  ],
];

// Helper functions to build script fragments

function getHook(input: ScriptInput): string {
  const hooks: Record<string, string[]> = {
    friendly: [
      `Looking for a ${getSectorNoun(input.brand.sector)}? Sure, ${input.brand.name} have you covered!`,
      `Here's brilliant news from ${input.brand.name}!`,
      `Pop the kettle on and listen to this — ${input.brand.name} have something special for you.`,
    ],
    urgent: [
      `This is it — ${input.brand.name}'s biggest event of the season!`,
      `Time is running out! Don't miss ${input.brand.name}'s special offer.`,
      `Breaking news for ${getSectorAudience(input.brand.sector)} — this won't last!`,
    ],
    professional: [
      `${input.brand.name} are proud to announce a special opportunity.`,
      `For over ${getYearsPhrase()}, ${input.brand.name} have been the trusted name in ${input.brand.sector.toLowerCase()}.`,
    ],
    humorous: [
      `You know what's better than a ${getSectorJoke(input.brand.sector)}? The offers at ${input.brand.name}!`,
      `Sure, why wouldn't you? ${input.brand.name} have gone and outdone themselves again.`,
    ],
    emotional: [
      `There's nothing quite like that feeling — and ${input.brand.name} want to make it yours.`,
      `For the people of ${getLocalArea(input)}, ${input.brand.name} have always been there.`,
    ],
  };
  const toneHooks = hooks[input.tone] || hooks.friendly;
  return toneHooks[Math.floor(Math.random() * toneHooks.length)];
}

function getTriggerHook(input: ScriptInput): string {
  const hooks: Record<string, string[]> = {
    Weather: [
      `The sun is shining across ${getLocalArea(input)} this weekend!`,
      `With the grand weather coming, it's the perfect time to get out and about.`,
      `Rain or shine, ${input.brand.name} have you sorted.`,
    ],
    Sport: [
      `What a result! The buzz is still going — and so are the deals at ${input.brand.name}.`,
      `Match day energy? ${input.brand.name} are bringing it off the pitch too.`,
    ],
    Seasonal: [
      `It's that time of year again!`,
      `The season is upon us, and ${input.brand.name} are ready.`,
    ],
    Traffic: [
      `Sitting in traffic? Here's something to brighten your commute.`,
      `On the road? ${input.brand.name} are just around the corner.`,
    ],
    News: [`You've heard the news — now hear the deal from ${input.brand.name}.`],
    Culture: [`Celebrating the best of local culture? ${input.brand.name} are joining the party.`],
    Industry: [`Big changes in the ${input.brand.sector.toLowerCase()} world — and ${input.brand.name} are leading the way.`],
    Breaking: [`Just in — ${input.brand.name} have an announcement you'll want to hear.`],
  };
  const triggerHooks = hooks[input.triggerType] || hooks.Seasonal;
  return triggerHooks[Math.floor(Math.random() * triggerHooks.length)];
}

function getOffer(input: ScriptInput): string {
  return input.promotion || `${input.brand.name} have something special waiting for you`;
}

function getBody(input: ScriptInput): string {
  const bodies = [
    `${input.promotion}. At ${input.brand.name}, we believe in giving you the best value without the fuss.`,
    `${input.promotion}. Whether you're a regular or visiting for the first time, you'll find something to love.`,
    `${input.promotion}. It's what ${input.brand.name} do best — making sure every customer walks away happy.`,
  ];
  return bodies[Math.floor(Math.random() * bodies.length)];
}

function getCTA(input: ScriptInput): string {
  const location = input.brand.locations[0];
  const locationRef = location ? `at ${location.address}` : `at ${input.brand.name}`;
  const ctas = [
    `Pop in to see us ${locationRef}.`,
    `Call in to ${input.brand.name} ${locationRef} — we'd love to see you.`,
    `Visit us ${locationRef} today.`,
    `Drop into ${input.brand.name} ${locationRef} — you won't be disappointed.`,
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
}

function getQuestion(input: ScriptInput): string {
  const questions: Record<string, string> = {
    motoring: "Looking for your next set of wheels?",
    hospitality: "Fancy a meal that'll make your week?",
    retail: "After a bargain you'll actually love?",
    financial: "Is your money working as hard as you are?",
    tourism: "Ready for your next adventure?",
  };
  return questions[input.brand.sector.toLowerCase()] || `Looking for something special from ${input.brand.name}?`;
}

function getAnswer(input: ScriptInput): string {
  return `${input.brand.name} have just the thing. ${input.promotion}.`;
}

function getStatement(input: ScriptInput): string {
  return `${input.brand.name} — ${input.promotion}.`;
}

function getConversational(input: ScriptInput): string {
  return `Have you heard what's happening at ${input.brand.name}? ${input.promotion}.`;
}

function getStoryOpener(input: ScriptInput): string {
  const openers = [
    `Picture this — it's a beautiful ${getTimeOfDay()} in ${getLocalArea(input)}.`,
    `You know that feeling when everything just clicks? That's what ${input.brand.name} deliver.`,
    `Let me tell you about something brilliant happening in ${getLocalArea(input)}.`,
  ];
  return openers[Math.floor(Math.random() * openers.length)];
}

function getStoryMiddle(input: ScriptInput): string {
  return `${input.promotion}. And the best part? It's right here on your doorstep.`;
}

function getStoryTurn(input: ScriptInput): string {
  return `So this is your chance to be part of something special at ${input.brand.name}.`;
}

function getSceneSetter(input: ScriptInput): string {
  return `It's a grand ${getTimeOfDay()} in ${getLocalArea(input)}, and there's something in the air — the buzz of a great deal from ${input.brand.name}.`;
}

function getProblem(input: ScriptInput): string {
  const problems: Record<string, string> = {
    motoring: "We know finding the right car can feel like a marathon.",
    hospitality: "Finding somewhere that truly delivers on flavour and atmosphere isn't always easy.",
    financial: "Navigating your finances shouldn't keep you up at night.",
    retail: "You deserve quality without breaking the bank.",
    tourism: "Life's too short for boring weekends.",
  };
  return problems[input.brand.sector.toLowerCase()] || "We know you've been waiting for something like this.";
}

function getSolution(input: ScriptInput): string {
  return `That's where ${input.brand.name} come in. ${input.promotion}.`;
}

function getDetails(input: ScriptInput): string {
  const location = input.brand.locations[0];
  return location
    ? `You'll find us at ${location.name}, ${location.address}. We're open seven days, and there's always a warm welcome waiting.`
    : `Get in touch with ${input.brand.name} today and see the difference for yourself.`;
}

function getValueProp(input: ScriptInput): string {
  return `we've been serving the community with honest value and a friendly face`;
}

function getTestimonialOpen(input: ScriptInput): string {
  return `Let me tell you why people love ${input.brand.name}.`;
}

function getTestimonialBody(input: ScriptInput): string {
  return `For years, families across ${getLocalArea(input)} have trusted ${input.brand.name} for quality, service, and that personal touch you just don't get elsewhere.`;
}

function getAudienceActivity(input: ScriptInput): string {
  const activities: Record<string, string> = {
    motoring: "looking to upgrade, shopping for the family, or treating yourself",
    hospitality: "planning a date night, a family meal, or a catch-up with friends",
    financial: "buying your first home, planning for retirement, or growing your savings",
    retail: "shopping for yourself, picking up a gift, or just browsing",
    tourism: "planning a family day out, an adventure with friends, or a quiet escape",
  };
  return activities[input.brand.sector.toLowerCase()] || "looking for something special";
}

function getLocation(input: ScriptInput): string {
  const loc = input.brand.locations[0];
  return loc ? `Find us at ${loc.name}, ${loc.address}.` : "";
}

function getLocalArea(input: ScriptInput): string {
  const loc = input.brand.locations[0];
  if (!loc) return "your area";
  // Extract area from address
  const parts = loc.address.split(",");
  return parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
}

function getSectorNoun(sector: string): string {
  const nouns: Record<string, string> = {
    motoring: "new set of wheels",
    hospitality: "great meal out",
    financial: "financial advisor you can trust",
    retail: "spot of retail therapy",
    tourism: "day out to remember",
  };
  return nouns[sector.toLowerCase()] || "treat";
}

function getSectorAudience(sector: string): string {
  const audiences: Record<string, string> = {
    motoring: "drivers of Meath",
    hospitality: "foodies",
    financial: "homeowners and savers",
    retail: "shoppers",
    tourism: "adventurers",
  };
  return audiences[sector.toLowerCase()] || "everyone";
}

function getSectorJoke(sector: string): string {
  const jokes: Record<string, string> = {
    motoring: "full tank of petrol on a Monday morning",
    hospitality: "table by the window on a Friday night",
    financial: "surprise bonus in your payslip",
    retail: "50% off sign in the window",
    tourism: "sunny weekend in Ireland",
  };
  return jokes[sector.toLowerCase()] || "great bargain";
}

function getYearsPhrase(): string {
  const years = [10, 15, 20, 25, 30];
  return `${years[Math.floor(Math.random() * years.length)]} years`;
}

function getAudienceAddress(input: ScriptInput): string {
  const loc = input.brand.locations[0];
  if (!loc) return "listeners";
  const area = getLocalArea(input);
  return `${area} listeners`;
}

function getMusicDesc(input: ScriptInput): string {
  const descs: Record<string, Record<string, string>> = {
    motoring: { friendly: "Upbeat, feel-good rock", urgent: "Driving, energetic beat", professional: "Smooth, confident groove", humorous: "Fun, bouncy riff", emotional: "Warm, heartfelt melody" },
    hospitality: { friendly: "Warm acoustic guitar", urgent: "Lively kitchen groove", professional: "Elegant piano", humorous: "Playful Italian-inspired", emotional: "Romantic strings" },
    financial: { friendly: "Reassuring piano", urgent: "Confident, forward-moving", professional: "Corporate trust theme", humorous: "Light, clever melody", emotional: "Hopeful strings" },
  };
  return descs[input.brand.sector.toLowerCase()]?.[input.tone] || "Upbeat, bright music bed";
}

function getSFXCue(input: ScriptInput): string {
  const cues: Record<string, string[]> = {
    motoring: ["Car engine start", "Keys jingle", "Door close", "Horn beep"],
    hospitality: ["Sizzling pan", "Cork pop", "Plates clinking", "Happy diners"],
    financial: ["Pen on paper", "Notification chime", "Cash register"],
    retail: ["Shopping bag", "Door bell", "Cash register ding"],
    tourism: ["Water splash", "Bird call", "Wind through trees"],
  };
  const sectorCues = cues[input.brand.sector.toLowerCase()] || ["Whoosh transition"];
  return sectorCues[Math.floor(Math.random() * sectorCues.length)];
}

function getTimeOfDay(): string {
  const times = ["morning", "afternoon", "evening"];
  return times[Math.floor(Math.random() * times.length)];
}

// Main generation function
export function generateScript(input: ScriptInput): GeneratedScript {
  // Select template set based on duration
  let templates: ((input: ScriptInput) => ScriptSegment[])[];
  if (input.duration <= 15) {
    templates = TEMPLATES_15;
  } else if (input.duration <= 30) {
    templates = TEMPLATES_30;
  } else {
    templates = TEMPLATES_60;
  }

  // Randomly pick a template
  const template = templates[Math.floor(Math.random() * templates.length)];
  const segments = template(input);

  // Count words in voice segments only
  const voiceWords = (seg: ScriptSegment) =>
    seg.text.split(/\s+/).filter(Boolean);
  let wordCount = segments
    .filter((s) => s.type === "voice")
    .flatMap(voiceWords).length;

  // Enforce word count targets — trim if more than 10% over
  const target = WORD_TARGETS[input.duration];
  let trimmed = false;
  if (target && wordCount > target * 1.1) {
    // Find the longest voice segment (but preserve the logo line at the end)
    const voiceSegments = segments.filter((s) => s.type === "voice");
    const longest = voiceSegments.reduce((a, b) =>
      a.text.length > b.text.length ? a : b
    );

    // Split into sentences, keeping the logo line (last sentence) intact
    const sentences = longest.text.split(/(?<=\.)\s+/);
    const logoLine = sentences[sentences.length - 1];
    let trimSentences = sentences.slice(0, -1);

    // Remove sentences from the end until we're within target
    while (trimSentences.length > 0) {
      const candidateText = [...trimSentences, logoLine].join(" ");
      const otherVoiceWords = segments
        .filter((s) => s.type === "voice" && s !== longest)
        .flatMap(voiceWords).length;
      const candidateWords = candidateText.split(/\s+/).filter(Boolean).length;
      if (otherVoiceWords + candidateWords <= target) break;
      trimSentences.pop();
    }

    const newText = [...trimSentences, logoLine].join(" ");
    if (newText !== longest.text) {
      longest.text = newText;
      trimmed = true;
      // Recalculate word count
      wordCount = segments
        .filter((s) => s.type === "voice")
        .flatMap(voiceWords).length;
    }
  }

  const nonVoiceDuration = segments
    .filter((s) => s.type !== "voice")
    .reduce((sum, s) => sum + s.duration, 0);
  const estimatedDuration = wordCount / 2.5 + nonVoiceDuration;

  // Rebuild fullText and directions after potential trimming
  let fullText = "";
  let directions = "";

  for (const seg of segments) {
    if (seg.direction) {
      fullText += seg.direction + "\n\n";
      directions += seg.direction + "\n";
    }
    if (seg.type === "voice" && seg.text) {
      const voiceLabel = input.brand.voiceName
        ? `VOICE (${input.brand.voiceName} — ${input.brand.voiceDescription || ""})`
        : "VOICE";
      fullText += `${voiceLabel}:\n"${seg.text}"\n\n`;
    }
  }

  if (trimmed) {
    const trimNote = `[Script trimmed to fit ${input.duration}s — ${wordCount} words at 2.5 wps]`;
    directions += "\n" + trimNote;
  }

  return {
    fullText: fullText.trim(),
    segments,
    directions: directions.trim(),
    wordCount,
    estimatedDuration: Math.round(estimatedDuration * 10) / 10,
  };
}
