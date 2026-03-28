export type BrandStatus = "active" | "onboarding" | "paused";

export interface BrandLocation {
  name: string;
  address: string;
}

export interface AudioBrandKit {
  voiceName: string;
  voiceDescription: string;
  voiceId: string;
  brandMusic: string;
  additionalMusic: string[];
  sfx: string[];
  logoLine: string;
}

export interface Campaign {
  id: string;
  name: string;
  date: string;
  duration: string;
  popScore: number;
  status: "completed" | "active" | "scheduled";
}

export interface MomentItem {
  id: string;
  title: string;
  triggerType: "weather" | "sport" | "news" | "culture" | "traffic" | "seasonal" | "industry" | "breaking";
  popScore: number;
  timestamp: string;
  description: string;
  suggestedAction: string;
}

export interface Brand {
  slug: string;
  name: string;
  sectorId: string;
  sectorName: string;
  stationSlug: string;
  status: BrandStatus;
  epAgentId: string;
  brandAgentId: string;
  logoLine: string;
  locations: BrandLocation[];
  overview: {
    description: string;
    yearsInBusiness: number;
    peakTimes: string[];
    targetAudience: string[];
    revenueModel: string[];
  };
  audioBrandKit: AudioBrandKit;
  campaigns: Campaign[];
  moments: MomentItem[];
  lastActivity: string;
}

export const DEMO_BRANDS: Brand[] = [
  {
    slug: "tadg-riordan-motors",
    name: "Tadg Riordan Motors",
    sectorId: "motoring",
    sectorName: "Motoring",
    stationSlug: "sunshine-radio",
    status: "active",
    epAgentId: "ep-motoring",
    brandAgentId: "brand-tadg-riordan",
    logoLine: "Tell them Tadg sent you",
    locations: [
      { name: "Ashbourne Garage", address: "Main Street, Ashbourne, Co. Meath" },
      { name: "Tallaght Garage", address: "The Square, Tallaght, Dublin 24" },
    ],
    overview: {
      description:
        "Family-run motor dealer with 30+ years in business. Sells new and used cars (multi-brand) with a reputation for honest dealing and after-sales service.",
      yearsInBusiness: 30,
      peakTimes: ["New plate months (Jan, Jul)", "Sunny weekends", "Bank holidays"],
      targetAudience: ["Families", "First-time buyers", "Trade-ins"],
      revenueModel: ["Vehicle sales", "Servicing", "Parts"],
    },
    audioBrandKit: {
      voiceName: "Tadg",
      voiceDescription: "Warm, friendly, Irish male voice",
      voiceId: "mme_voice_tadg_001",
      brandMusic: "Upbeat, feel-good jingle",
      additionalMusic: ["Sunny day mood bed", "Urgency/sale bed", "Evening cruiser bed"],
      sfx: ["Car engine start", "Door close", "Keys jingle", "Crowd cheer"],
      logoLine: "Tell them Tadg sent you",
    },
    campaigns: [
      {
        id: "camp-1",
        name: "Spring Clean Sale",
        date: "March 2026",
        duration: "30s",
        popScore: 87,
        status: "active",
      },
      {
        id: "camp-2",
        name: "New 261 Plates",
        date: "January 2026",
        duration: "60s",
        popScore: 92,
        status: "completed",
      },
      {
        id: "camp-3",
        name: "Summer Roadtrip",
        date: "June 2025",
        duration: "30s",
        popScore: 78,
        status: "completed",
      },
    ],
    moments: [
      {
        id: "mom-1",
        title: "Sunny weekend forecast for Leinster",
        triggerType: "weather",
        popScore: 85,
        timestamp: "2 hours ago",
        description: "Met Éireann forecasts sunshine across Leinster this weekend with temperatures reaching 18°C.",
        suggestedAction: "Generate weekend test drive promotion highlighting convertibles and SUVs",
      },
      {
        id: "mom-2",
        title: "March bank holiday Monday",
        triggerType: "seasonal",
        popScore: 72,
        timestamp: "5 hours ago",
        description: "Bank holiday weekend approaching — historically strong for showroom footfall.",
        suggestedAction: "Run bank holiday sale event ad with special finance offers",
      },
      {
        id: "mom-3",
        title: "New 262 plates launching July",
        triggerType: "industry",
        popScore: 94,
        timestamp: "1 day ago",
        description: "New registration plates launching in July — peak buying period for new vehicles.",
        suggestedAction: "Launch early-bird 262 plate reservation campaign with deposit offers",
      },
      {
        id: "mom-4",
        title: "Dublin traffic congestion M50",
        triggerType: "traffic",
        popScore: 65,
        timestamp: "3 hours ago",
        description: "Heavy congestion reported on M50 southbound near Tallaght — Tadg's garage is nearby.",
        suggestedAction: "Geo-targeted ad: 'Stuck in traffic? Your next car is just off the next exit'",
      },
      {
        id: "mom-5",
        title: "Ashbourne local GAA final",
        triggerType: "sport",
        popScore: 58,
        timestamp: "6 hours ago",
        description: "Ashbourne GAA club final this weekend — high local engagement expected.",
        suggestedAction: "Community-focused sponsorship mention in local radio ad",
      },
    ],
    lastActivity: "2026-03-27",
  },
  {
    slug: "napoli-kitchen",
    name: "Napoli's Kitchen",
    sectorId: "hospitality",
    sectorName: "Hospitality",
    stationSlug: "sunshine-radio",
    status: "active",
    epAgentId: "ep-hospitality",
    brandAgentId: "brand-napoli-kitchen",
    logoLine: "Taste the real Napoli",
    locations: [
      { name: "Napoli's Kitchen Hereford", address: "High Street, Hereford, HR1 2AA" },
    ],
    overview: {
      description:
        "Authentic Italian restaurant and takeaway serving Herefordshire for 15 years. Known for wood-fired pizza and fresh pasta.",
      yearsInBusiness: 15,
      peakTimes: ["Friday & Saturday evenings", "Sunday lunch", "Valentine's Day", "Mother's Day"],
      targetAudience: ["Couples", "Families", "Food enthusiasts"],
      revenueModel: ["Dine-in", "Takeaway", "Catering"],
    },
    audioBrandKit: {
      voiceName: "Marco",
      voiceDescription: "Warm Italian-accented male voice",
      voiceId: "mme_voice_marco_001",
      brandMusic: "Italian-inspired acoustic guitar melody",
      additionalMusic: ["Evening ambience bed", "Upbeat lunch rush bed"],
      sfx: ["Pizza oven crackle", "Cork pop", "Plate set down"],
      logoLine: "Taste the real Napoli",
    },
    campaigns: [
      {
        id: "camp-4",
        name: "Valentine's Special",
        date: "February 2026",
        duration: "30s",
        popScore: 82,
        status: "completed",
      },
    ],
    moments: [
      {
        id: "mom-6",
        title: "Rainy evening forecast for Herefordshire",
        triggerType: "weather",
        popScore: 76,
        timestamp: "4 hours ago",
        description: "Rain expected this evening — ideal for cosy restaurant dining.",
        suggestedAction: "Promote warm Italian dining experience for a rainy evening",
      },
    ],
    lastActivity: "2026-03-25",
  },
  {
    slug: "green-valley-motors",
    name: "Green Valley Motors",
    sectorId: "motoring",
    sectorName: "Motoring",
    stationSlug: "sunshine-radio",
    status: "onboarding",
    epAgentId: "ep-motoring",
    brandAgentId: "brand-green-valley",
    logoLine: "Drive home happy",
    locations: [
      { name: "Green Valley Motors", address: "Ross Road, Hereford, HR2 7RL" },
    ],
    overview: {
      description: "Independent used car dealer specialising in affordable family vehicles.",
      yearsInBusiness: 12,
      peakTimes: ["Tax refund season", "School holidays"],
      targetAudience: ["Budget buyers", "Young families"],
      revenueModel: ["Vehicle sales", "Finance packages"],
    },
    audioBrandKit: {
      voiceName: "Dave",
      voiceDescription: "Friendly, down-to-earth English male",
      voiceId: "mme_voice_dave_001",
      brandMusic: "Light rock guitar riff",
      additionalMusic: [],
      sfx: ["Car horn honk"],
      logoLine: "Drive home happy",
    },
    campaigns: [],
    moments: [],
    lastActivity: "2026-03-20",
  },
  {
    slug: "hereford-financial",
    name: "Hereford Financial Advisers",
    sectorId: "financial",
    sectorName: "Financial Services",
    stationSlug: "sunshine-radio",
    status: "active",
    epAgentId: "ep-financial",
    brandAgentId: "brand-hereford-financial",
    logoLine: "Your money, our expertise",
    locations: [
      { name: "Hereford Financial", address: "Bridge Street, Hereford, HR4 9DG" },
    ],
    overview: {
      description: "Independent financial advisory firm providing mortgage, pension, and investment advice.",
      yearsInBusiness: 20,
      peakTimes: ["Tax year end (April)", "Mortgage season (Spring/Autumn)"],
      targetAudience: ["Homebuyers", "Retirees", "Small business owners"],
      revenueModel: ["Advisory fees", "Commission"],
    },
    audioBrandKit: {
      voiceName: "Sarah",
      voiceDescription: "Calm, trustworthy, professional female voice",
      voiceId: "mme_voice_sarah_001",
      brandMusic: "Reassuring piano melody",
      additionalMusic: [],
      sfx: ["Pen on paper", "Keyboard typing"],
      logoLine: "Your money, our expertise",
    },
    campaigns: [
      {
        id: "camp-5",
        name: "Tax Year End Reminder",
        date: "March 2026",
        duration: "30s",
        popScore: 74,
        status: "active",
      },
    ],
    moments: [],
    lastActivity: "2026-03-26",
  },
  {
    slug: "wye-valley-tours",
    name: "Wye Valley Tours",
    sectorId: "tourism",
    sectorName: "Tourism & Leisure",
    stationSlug: "sunshine-radio",
    status: "active",
    epAgentId: "ep-tourism",
    brandAgentId: "brand-wye-valley",
    logoLine: "Discover the Wye Valley",
    locations: [
      { name: "Wye Valley Tours HQ", address: "Symonds Yat, Ross-on-Wye, HR9 6JL" },
    ],
    overview: {
      description: "Adventure tourism company offering kayaking, canoeing, and guided walks in the Wye Valley.",
      yearsInBusiness: 8,
      peakTimes: ["Easter to October", "School holidays", "Sunny weekends"],
      targetAudience: ["Families", "Adventure seekers", "Tourists"],
      revenueModel: ["Tour bookings", "Equipment hire", "Group packages"],
    },
    audioBrandKit: {
      voiceName: "Tom",
      voiceDescription: "Energetic, outdoorsy male voice",
      voiceId: "mme_voice_tom_001",
      brandMusic: "Adventure folk guitar",
      additionalMusic: ["Calm river ambience"],
      sfx: ["Water splash", "Bird call", "Paddle stroke"],
      logoLine: "Discover the Wye Valley",
    },
    campaigns: [
      {
        id: "camp-6",
        name: "Easter Adventure",
        date: "April 2026",
        duration: "30s",
        popScore: 80,
        status: "scheduled",
      },
    ],
    moments: [],
    lastActivity: "2026-03-24",
  },
];

export function getBrandsByStation(stationSlug: string): Brand[] {
  return DEMO_BRANDS.filter((b) => b.stationSlug === stationSlug);
}

export function getBrandBySlug(stationSlug: string, brandSlug: string): Brand | undefined {
  return DEMO_BRANDS.find((b) => b.stationSlug === stationSlug && b.slug === brandSlug);
}

export function getBrandsBySector(stationSlug: string, sectorName: string): Brand[] {
  return DEMO_BRANDS.filter(
    (b) => b.stationSlug === stationSlug && b.sectorName === sectorName
  );
}
