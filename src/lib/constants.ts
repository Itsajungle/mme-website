export const NAV_LINKS = [
  { label: "Radio", href: "/radio" },
  { label: "Social", href: "/social" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "About", href: "/about" },
] as const;

export const HERO = {
  headline: "Your Content. The Right Moment. Every Screen.",
  subline:
    "MME detects real-world moments — weather, sport, news, culture — and instantly generates matched radio ads and social content. One platform, two channels, zero wasted impressions.",
  cta1: "See How It Works",
  cta2: "Book a Demo",
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

export const SITE_METADATA = {
  title: "MME — Moment Marketing Engine",
  description:
    "AI-powered moment marketing for radio and social media. Detect real-world moments, generate matched content, and distribute across FM/DAB broadcast and social platforms in real-time.",
  url: "https://momentmarketingengine.com",
};
