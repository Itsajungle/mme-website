export const NAV_LINKS = [
  { label: "Radio", href: "/radio" },
  { label: "Social", href: "/social" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "About", href: "/about" },
] as const;

export const HERO = {
  headline: "It starts with a post. It becomes a community.",
  subline:
    "MME turns the right moment into content that shows up everywhere — then keeps your members talking, connecting and coming back. The post is the trigger. The community is the product.",
  cta1: "See it run",
  cta2: "Book a demo",
};

export const PROBLEM = {
  headline: "Traditional Advertising Is Broken",
  subline:
    "Campaigns are planned months in advance, scheduled to slots, and broadcast to everyone regardless of context. There's no relevance, no responsiveness, and no proof it works.",
  columns: [
    {
      title: "Traditional Radio",
      items: [
        "Calendar-scheduled campaigns",
        "No audience targeting",
        "No performance tracking",
        "Weeks of production lead time",
        "One-size-fits-all creative",
      ],
      verdict: "Slow & blind",
    },
    {
      title: "Digital Advertising",
      items: [
        "Targeted but intrusive",
        "Ad fatigue & banner blindness",
        "Cookie deprecation killing targeting",
        "No audio/broadcast reach",
        "Siloed from radio budgets",
      ],
      verdict: "Fragmented",
    },
    {
      title: "MME",
      items: [
        "Moment-triggered in real-time",
        "AI-matched to context & mood",
        "Full performance tracking",
        "Generated in seconds, not weeks",
        "Radio + Social from one platform",
      ],
      verdict: "Intelligent & unified",
      highlighted: true,
    },
  ],
};

export const PIPELINE_STEPS = [
  {
    key: "detect",
    title: "Detect",
    description:
      "Real-time monitoring of weather events, sports results, breaking news, cultural trends, and traffic patterns across the UK.",
    icon: "Radar",
  },
  {
    key: "match",
    title: "Match",
    description:
      "AI engine scores every moment against brand inventory — matching mood, relevance, territory, and audience fit in milliseconds.",
    icon: "Brain",
  },
  {
    key: "generate",
    title: "Generate",
    description:
      "Auto-create broadcast-ready radio ads with cloned brand voices, custom music, and SFX — plus platform-optimised social content.",
    icon: "Sparkles",
  },
  {
    key: "distribute",
    title: "Distribute",
    description:
      "Push to radio playout systems for FM/DAB broadcast and simultaneously publish across social platforms — all in real-time.",
    icon: "Send",
  },
] as const;

export const VERTICALS = {
  radio: {
    title: "MME Radio",
    description:
      "AI-generated moment-ads for FM, DAB, and streaming radio. From moment detection to broadcast in seconds — with full brand voice cloning, music, and SFX.",
    features: [
      "Broadcast-ready AI ad generation",
      "Brand voice cloning & audio kits",
      "FM/DAB playout system integration",
      "Streaming radio distribution",
      "Per-ad performance tracking",
    ],
    href: "/radio",
  },
  social: {
    title: "MME Social",
    description:
      "Moment-matched social content atomised for every platform. Video, image, carousel, and stories — generated and published while the moment still matters.",
    features: [
      "Multi-platform content generation",
      "TikTok, Reels, Stories, Carousel",
      "Moment-matched creative AI",
      "Automated publishing & scheduling",
      "Cross-media with MME Radio",
    ],
    href: "/social",
  },
};

export const STATS = [
  { value: 747, suffix: "m", prefix: "£", label: "UK radio advertising market" },
  { value: 50, suffix: "m", prefix: "", label: "Weekly UK radio listeners" },
  { value: 36, suffix: "m", prefix: "", label: "UK social media users" },
  { value: 0, suffix: "", prefix: "", label: "Competitors bridging radio + social AI" },
] as const;

export const USE_CASES = [
  {
    brand: "Tadg Riordan Motors",
    station: "Sunshine Radio",
    trigger: "Sunny weekend forecast across Dublin",
    response: "AI generates convertible promotion ad with dealer voice clone and upbeat music bed",
    result: "3 test drive bookings within 2 hours of broadcast",
    category: "weather",
  },
  {
    brand: "ELLA Dealer Network",
    station: "Nation Radio",
    trigger: "Wales win Six Nations match",
    response: "Celebratory car deals ad with Welsh-themed SFX, pushed to radio + social simultaneously",
    result: "47% uplift in showroom visits following Monday broadcast",
    category: "sport",
  },
  {
    brand: "Napoli's Kitchen",
    station: "Signal Radio",
    trigger: "Heavy rain forecast for Friday evening",
    response: "Cosy night in with delivery promotion — warm voiceover, rain ambience SFX",
    result: "2x delivery orders vs. previous rainy Friday",
    category: "weather",
  },
  {
    brand: "Anthem Music Publishing",
    station: "Social Only",
    trigger: "Artist trending on TikTok with 500k+ views",
    response: "Atomised content across Reels, TikTok, and Stories featuring catalogue tracks",
    result: "12,000 new Spotify streams within 48 hours",
    category: "culture",
  },
  {
    brand: "Preston Motors",
    station: "Rock FM",
    trigger: "M6 traffic congestion alerts during morning commute",
    response: "\"Stuck in traffic? Book a test drive nearby\" ad with location-aware dealer info",
    result: "8 test drive bookings attributed to moment-ad campaign",
    category: "traffic",
  },
  {
    brand: "Yorkshire Building Society",
    station: "Greatest Hits Radio",
    trigger: "Bank of England interest rate announcement",
    response: "Mortgage moment-ad with reassuring tone, updated rates, and local branch info",
    result: "34% increase in mortgage enquiry calls within 24 hours",
    category: "news",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "MME is the most exciting thing to happen to radio advertising in 20 years. It finally gives us the data and agility that digital has always had.",
    name: "Neil Fox",
    title: "Broadcaster & Media Personality",
  },
  {
    quote:
      "The ability to react to live moments and have a broadcast-ready ad within seconds — that changes everything for local radio.",
    name: "Jason Bryant",
    title: "Radio Industry Executive",
  },
  {
    quote:
      "Cross-media moment marketing is the future. MME makes it possible today.",
    name: "Sean Ashmore",
    title: "Digital Marketing Strategist",
  },
];

export const RADIO_FEATURES = {
  stationHierarchy: [
    { level: "Station", description: "Your radio station brand and broadcast territory" },
    { level: "Commercial Production", description: "AI-powered ad creation with brand voice kits" },
    { level: "Sector", description: "Automotive, dining, finance, retail — organised by vertical" },
    { level: "Brand", description: "Individual advertisers with their own audio brand kits" },
  ],
  audioBrandKit: [
    { name: "Voice", description: "Cloned brand voice from just 30 seconds of audio" },
    { name: "Music", description: "Custom music beds that match brand personality" },
    { name: "SFX", description: "Sound effects library tailored to brand and sector" },
    { name: "Logo Line", description: "Signature audio tag played at every ad close" },
  ],
  pricing: [
    {
      tier: "Platform",
      price: "SaaS Fee",
      description: "Access to MME Radio platform, AI tools, and moment detection engine",
      features: ["Station dashboard", "Brand management", "Moment feed", "Audio Brand Kit builder", "Analytics"],
    },
    {
      tier: "Campaign",
      price: "Per Campaign",
      description: "Pay per moment-ad campaign activated for your advertisers",
      features: ["AI ad generation", "Voice cloning", "Music production", "Multi-format output", "A/B testing"],
    },
    {
      tier: "Success",
      price: "Performance Fee",
      description: "Revenue share on trackable outcomes driven by moment-ads",
      features: ["Attribution tracking", "Call tracking", "Footfall measurement", "Online conversion", "Revenue reporting"],
    },
  ],
};

export const SOCIAL_FEATURES = {
  contentTypes: [
    { type: "Short Video", platforms: "TikTok, Reels, Shorts", description: "15-60s moment-matched video content" },
    { type: "Image Posts", platforms: "Instagram, Facebook, X", description: "Static and animated graphics" },
    { type: "Carousel", platforms: "Instagram, LinkedIn", description: "Multi-slide storytelling formats" },
    { type: "Stories", platforms: "Instagram, Facebook", description: "24-hour ephemeral moment content" },
  ],
  verticals: [
    "Music & Entertainment",
    "Automotive",
    "Publishing & Media",
    "Photography & Visual Arts",
    "Education & Training",
    "Food & Hospitality",
  ],
};

export const ABOUT = {
  headline: "Built by a Broadcaster. Powered by AI.",
  story: [
    "MME was born from 25 years of broadcast experience. Founder Peter Stone spent his career at the heart of UK radio — as Creative Director at Capital Radio Group, he produced thousands of ads and saw firsthand how powerful radio could be when the right message hit at the right moment.",
    "He called it the POP Factor — Proximity to Opportunity to Purchase. A driver hears an ad near a store and changes direction. That moment of relevance, that split-second decision, is worth more than a thousand generic impressions.",
    "But radio was stuck. Calendar campaigns. Slot-based scheduling. No data. No targeting. No way to prove it worked. Meanwhile, digital advertising raced ahead with real-time bidding, personalisation, and attribution — but lost the emotional power of audio.",
    "MME bridges that gap. It brings the intelligence of digital to the emotional impact of radio, and extends it across social media. One moment, two channels, measurable results.",
    "Through Go Create Academy, Peter has trained the next generation of creative professionals. Now, with MME, he's building the platform that brings AI-powered creativity to every radio station and every brand in the UK.",
  ],
  credentials: [
    "Creative Director, Capital Radio Group",
    "Founder, Go Create Academy",
    "25+ years in broadcast media",
    "Award-winning radio commercial producer",
    "AI & creative technology innovator",
  ],
};

// ── Community re-spine (homepage) ───────────────────────────────────────────
// Content → Community → Connection. No third-party tool names anywhere.

export const SHIFT = {
  headline: "Posting isn't a strategy.",
  body:
    "Most tools stop at “we’ll make you content.” But content with nobody around it is just noise — scheduled, broadcast, forgotten. The businesses that win don’t just publish. They build something people come back to.",
  columns: [
    {
      title: "Content alone",
      detail: "Posts go out, get a glance, disappear.",
      stage: "Content",
      highlighted: false,
    },
    {
      title: "Content + community",
      detail: "Posts start conversations members return for.",
      stage: "Community",
      highlighted: false,
    },
    {
      title: "Community + connection",
      detail: "Members meet, help each other, stay.",
      stage: "Connection",
      highlighted: true,
    },
  ],
} as const;

export const ENGINE = {
  headline: "One moment, carried all the way through.",
  body:
    "MME spots a moment worth talking about, makes the content, has a team of agents check it, publishes it, sparks the engagement — then learns what worked and feeds it back in. It runs on its own; you stay in control.",
  // The pipeline the animation lights up in sequence (copy-doc §3).
  stages: [
    {
      key: "detect",
      num: "01",
      icon: "Radar",
      title: "Detect",
      blurb: "Always-on agents scan for moments worth posting.",
      caption: "It spots a moment worth talking about.",
    },
    {
      key: "produce",
      num: "02",
      icon: "Sparkles",
      title: "Produce",
      blurb: "The moment becomes posts, images and video, in your voice.",
      caption: "It turns the moment into posts, images and video — in your voice.",
    },
    {
      key: "check",
      num: "03",
      icon: "ShieldCheck",
      title: "Check",
      blurb: "A team of role-based agents reviews every piece.",
      caption: "A team of agents checks every piece: on-brand, good, sounds like you.",
    },
    {
      key: "distribute",
      num: "04",
      icon: "Send",
      title: "Distribute",
      blurb: "Published to the right channel at the right time.",
      caption: "It publishes to the right channels at the right time.",
    },
    {
      key: "engage",
      num: "05",
      icon: "MessagesSquare",
      title: "Engage",
      blurb: "Replies, introductions, community momentum.",
      caption: "It sparks replies and connects your members.",
    },
    {
      key: "learn",
      num: "06",
      icon: "TrendingUp",
      title: "Learn",
      blurb: "What worked feeds straight back into Detect.",
      caption: "It learns what worked and feeds it back in — so the next one is sharper.",
    },
  ],
  loopLabel: "What worked feeds straight back into Detect",
  kpis: [
    { key: "scanned", label: "Trends scanned today", value: 1280, delta: "always on" },
    { key: "produced", label: "Content produced", value: 74, delta: "this week" },
    { key: "checks", label: "Agent checks passed", value: 312, delta: "live" },
    { key: "reach", label: "People reached", value: 48000, delta: "climbing" },
    { key: "insights", label: "Insights fed back", value: 63, delta: "it learns" },
  ],
  agents: [
    { key: "scout", icon: "Search", title: "Trend Scout", role: "picks the moment" },
    { key: "sentry", icon: "ShieldCheck", title: "Brand Sentry", role: "on-brand & safe" },
    { key: "quality", icon: "CheckCircle2", title: "Quality Review", role: "checks the craft" },
    { key: "voice", icon: "Mic", title: "Voice Match", role: "sounds like you" },
    { key: "publisher", icon: "Send", title: "Publisher", role: "ships it out" },
  ],
  topics: [
    "the heatwave",
    "a local festival",
    "a community milestone",
    "a wellbeing tip going round",
    "the bank-holiday weekend",
    "a member success story",
    "back-to-school season",
  ],
} as const;

export const COMMUNITY_LAYER = {
  headline: "Where content becomes connection.",
  body:
    "This is the part most “AI content” tools don’t have. MME doesn’t just post for you — it runs the community around the post.",
  blocks: [
    {
      icon: "CalendarHeart",
      title: "Keep members showing up",
      detail:
        "Daily prompts, member questions and spotlights that give people a reason to come back.",
    },
    {
      icon: "Users",
      title: "Introduce the right people",
      detail:
        "MME spots members who should know each other and offers to connect them. Connection is the product; content is the trigger.",
    },
    {
      icon: "PartyPopper",
      title: "Celebrate the community",
      detail: "Milestones, streaks and wins surfaced and shared automatically.",
    },
  ],
} as const;

export const AGENT_TEAM = {
  headline: "Every piece, checked by a team before it goes out.",
  body:
    "MME isn’t one black box. It’s a team of role-based agents, each with a job — so nothing off-brand, low-quality or off-voice ever ships.",
  roles: [
    { icon: "Search", title: "Trend Scout", role: "picks the moment" },
    { icon: "ShieldCheck", title: "Brand Sentry", role: "on-brand & safe" },
    { icon: "CheckCircle2", title: "Quality Review", role: "checks the craft" },
    { icon: "Mic", title: "Voice Match", role: "sounds like you" },
    { icon: "Send", title: "Publisher", role: "ships it out" },
  ],
} as const;

export const PROOF_VERTICALS = {
  headline: "One engine, many communities.",
  subtitle:
    "The same machine runs behind every one of these — a post becomes a community becomes connection.",
  cards: [
    {
      icon: "HeartPulse",
      title: "Wellbeing communities",
      detail:
        "Members engaged daily, connected weekly, posts that never tip into medical advice.",
      href: null,
    },
    {
      icon: "Store",
      title: "Local & multi-branch business",
      detail: "Consistent local presence without the owner lifting a finger.",
      href: null,
    },
    {
      icon: "Network",
      title: "Membership networks",
      detail:
        "A whole network of member businesses, each running their own community from one engine.",
      href: null,
    },
    {
      icon: "Radio",
      title: "Radio & moment-ads",
      detail:
        "Real-world moments turned into broadcast-ready ads in seconds. The original proof point — see the full radio story.",
      href: "/radio",
    },
  ],
} as const;

export const WHO_ITS_FOR = {
  headline: "Built for the people who run communities.",
  body:
    "Owner-led local businesses that need to show up without the time to do it — and the networks, boards and franchises that sit on top of dozens of them. One engine; every member gets their own living community.",
} as const;

export const PLANS = {
  headline: "Start with content. Grow into connection.",
  body:
    "The journey is built into the product. You start where you are and climb as your community grows.",
  tiers: [
    { name: "Social", note: "Content out the door", phase: "Content", highlighted: false },
    { name: "Social+", note: "More reach, more formats", phase: "Content", highlighted: false },
    { name: "Studio", note: "Full production, your voice", phase: "Content", highlighted: false },
    { name: "Engage", note: "The community comes alive", phase: "Community", highlighted: true },
    { name: "Connect", note: "Members meet members", phase: "Connection", highlighted: true },
  ],
} as const;

export const FINAL_CTA = {
  headline: "See your community run itself.",
  cta1: "Book a demo",
  cta2: "See it run",
} as const;

export const SITE_METADATA = {
  title: "MME — Moment Marketing Engine",
  description:
    "AI-powered moment marketing for radio and social media. Detect real-world moments, generate matched content, and distribute across FM/DAB broadcast and social platforms in real-time.",
  url: "https://momentmarketingengine.com",
};
