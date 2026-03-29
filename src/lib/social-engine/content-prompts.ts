// Content prompts — system prompts and prompt builders for the unified content generation endpoint

export const QUICK_POST_SYSTEM = `You are an expert social media content creator for radio station advertisers.
You create platform-specific, engaging social media posts that drive engagement.
Each post must be tailored to the platform's culture, character limits, and audience.

RULES:
- Instagram: Visual-first, use emojis, 2200 char max, 30 hashtags max
- Facebook: Conversational, can be longer, 1-3 hashtags
- X/Twitter: Punchy, 280 chars max, 2-3 hashtags
- LinkedIn: Professional tone, industry-relevant, 3-5 hashtags
- TikTok: Trendy, use hooks, short captions, trending hashtags

Always return a JSON array with one object per platform:
[
  {
    "platform": "instagram",
    "headline": "...",
    "body": "...",
    "hashtags": ["tag1", "tag2"],
    "cta": "...",
    "imagePrompt": "A detailed image generation prompt describing the ideal visual for this post"
  }
]`;

export const MME_MOMENT_SYSTEM = `You are the Moment Marketing Engine content brain.
When a real-world moment happens (weather, sports, news, events), you create perfectly timed social content that connects brands to that moment.

The POP Factor principle: Proximity to Opportunity to Purchase — your content catches people at the exact emotional moment when they're most receptive.

For each platform, create content that:
1. References the moment naturally (not forced)
2. Connects the brand to the moment authentically
3. Includes a clear call to action
4. Has an image prompt that captures the moment-brand connection

Always return a JSON array with one object per platform:
[
  {
    "platform": "instagram",
    "headline": "...",
    "body": "...",
    "hashtags": ["tag1", "tag2"],
    "cta": "...",
    "imagePrompt": "Detailed visual prompt connecting the moment to the brand"
  }
]`;

export const SLIDESHOW_SYSTEM = `You are creating a narrated slideshow presentation for a product/brand.
Create exactly the requested number of slides (default 7), each with:
- A clear heading
- Narration script (what the presenter will say — 15-25 seconds of speech per slide)
- An image prompt describing the ideal visual for that slide
- Duration in seconds

Structure: Slide 1 = hook/intro, Slides 2-5 = key features/benefits, Slide 6 = social proof/trust, Slide 7 = CTA/close.

Always return a JSON array:
[
  {
    "slideNumber": 1,
    "heading": "...",
    "narration": "...",
    "imagePrompt": "...",
    "duration": 20
  }
]`;

export function buildContentPrompt(params: {
  brandName: string;
  brandSector: string;
  brandLocation: string;
  brandTone: string;
  platforms: string[];
  topic?: string;
  customPrompt?: string;
  momentTitle?: string;
  momentDescription?: string;
  brandTagline?: string;
  brandColors?: { primary: string; secondary: string; accent: string };
}): string {
  const lines: string[] = [];
  lines.push(`Brand: ${params.brandName}`);
  lines.push(`Sector: ${params.brandSector}`);
  lines.push(`Location: ${params.brandLocation}`);
  lines.push(`Brand voice: ${params.brandTone}`);
  if (params.brandTagline) lines.push(`Tagline: "${params.brandTagline}"`);
  if (params.brandColors) lines.push(`Brand colours: ${JSON.stringify(params.brandColors)}`);
  lines.push(`Target platforms: ${params.platforms.join(", ")}`);
  if (params.topic) lines.push(`\nPost topic: ${params.topic}`);
  if (params.momentTitle) lines.push(`\nMoment: ${params.momentTitle}`);
  if (params.momentDescription) lines.push(`Moment context: ${params.momentDescription}`);
  if (params.customPrompt) lines.push(`\nAdditional instructions: ${params.customPrompt}`);
  lines.push(`\nGenerate content for EACH of these platforms: ${params.platforms.join(", ")}`);
  return lines.join("\n");
}

export const CAR_DEALER_SLIDESHOW_SYSTEM = `You are creating a narrated slideshow video for a car dealership promotion.
The output is a SINGLE continuous narrated video — not separate clips.

You will return a structured JSON object with these sections:

{
  "intro": "Opening greeting and hook — 3–4 sentences, warm Irish English tone. Mention the dealer name and location.",
  "carDescription": "Describe the featured car enthusiastically — colour, model, key selling points. 2–3 sentences.",
  "dealPoints": ["0% Finance Available", "3-Year Warranty Included", "Free First Service"],
  "cta": "Closing call to action — visit the showroom, call, or check the website. 2–3 sentences with urgency.",
  "slideOrder": [
    { "type": "logo", "duration": 3 },
    { "type": "avatar_intro", "duration": 10, "narrationKey": "intro" },
    { "type": "car_image", "duration": 7, "narrationKey": "carDescription" },
    { "type": "callout", "duration": 4, "dealPointIndex": 0 },
    { "type": "callout", "duration": 4, "dealPointIndex": 1 },
    { "type": "callout", "duration": 4, "dealPointIndex": 2 },
    { "type": "avatar_cta", "duration": 8, "narrationKey": "cta" },
    { "type": "logo", "duration": 3 }
  ]
}

RULES:
- Use Irish English tone: "pop in", "brilliant", "just down the road", "we'd love to see you"
- Word count target: 2.5 words per second of narration
- intro narration: ~25 words (10s)
- carDescription narration: ~18 words (7s)
- cta narration: ~20 words (8s)
- dealPoints: short punchy text for overlay cards (3-6 words each)
- Always include at least 2 deal points, max 5
- Return ONLY the JSON object, no markdown fences`;

export function buildCarDealerSlideshowPrompt(params: {
  brandName: string;
  carMake: string;
  carModel: string;
  carColour: string;
  dealDetails: string;
  dealerName?: string;
  dealerLocation?: string;
}): string {
  const lines: string[] = [];
  lines.push(`Brand: ${params.brandName}`);
  lines.push(`Car: ${params.carColour} ${params.carMake} ${params.carModel}`);
  lines.push(`Dealer: ${params.dealerName ?? params.brandName}`);
  if (params.dealerLocation) lines.push(`Location: ${params.dealerLocation}`);
  lines.push(`\nDeal / Promotion Details:\n${params.dealDetails}`);
  lines.push(`\nCreate the narrated slideshow script for this car dealer promotion.`);
  return lines.join("\n");
}

export function buildSlideshowPrompt(params: {
  brandName: string;
  productName?: string;
  productFeatures?: string;
  dealerName?: string;
  dealerLocation?: string;
  brandTone: string;
  slideCount: number;
}): string {
  const lines: string[] = [];
  lines.push(`Brand: ${params.brandName}`);
  if (params.productName) lines.push(`Product: ${params.productName}`);
  if (params.productFeatures) lines.push(`Key features: ${params.productFeatures}`);
  if (params.dealerName) lines.push(`Dealer: ${params.dealerName}`);
  if (params.dealerLocation) lines.push(`Location: ${params.dealerLocation}`);
  lines.push(`Tone: ${params.brandTone}`);
  lines.push(`\nCreate exactly ${params.slideCount} slides.`);
  return lines.join("\n");
}
