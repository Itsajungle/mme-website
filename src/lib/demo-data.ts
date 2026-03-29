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
  socialProfile?: {
    tone: string;
    hashtags: string[];
    imageStyle: string;
    bestPlatforms: string[];
  };
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
      voiceName: "Paul",
      voiceDescription: "Irish broadcaster, confident DJ-style delivery",
      voiceId: "7nDsTGv9cjBVU2m1OA8F",
      brandMusic: "Upbeat, feel-good jingle",
      additionalMusic: ["Sunny day mood bed", "Urgency/sale bed", "Evening cruiser bed"],
      sfx: ["Car engine start", "Door close", "Keys jingle", "Crowd cheer"],
      logoLine: "Tell them Tadg sent you",
    },
    socialProfile: {
      tone: "Friendly, local, trustworthy",
      hashtags: ["#TadgRiordan", "#Ashbourne", "#Meath", "#UsedCars", "#ZeroDeposit"],
      imageStyle: "Cars in scenic Irish locations, friendly staff, showroom",
      bestPlatforms: ["instagram", "facebook", "x"],
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
      {
        id: "mom-7",
        title: "Heavy rain expected — indoor activity surge predicted",
        triggerType: "weather",
        popScore: 68,
        timestamp: "1 hour ago",
        description: "Heavy rainfall forecast across Co. Meath for the weekend — people looking for indoor activities and deals.",
        suggestedAction: "Promote indoor showroom experience and test drives — 'stay dry and find your next car'",
      },
      {
        id: "mom-8",
        title: "First proper spring day — 18°C across the east coast",
        triggerType: "weather",
        popScore: 82,
        timestamp: "3 hours ago",
        description: "First warm spring day of the year with 18°C temperatures expected across the east coast of Ireland.",
        suggestedAction: "Launch spring test drive campaign — get people into convertibles and SUVs while the sun shines",
      },
      {
        id: "mom-9",
        title: "Meath GAA Senior Football Championship draw announced",
        triggerType: "sport",
        popScore: 71,
        timestamp: "4 hours ago",
        description: "The Meath GAA Senior Football Championship draw has been announced, generating significant local excitement.",
        suggestedAction: "Sponsor local GAA content and run community-focused ad tying Tadg Riordan to Meath pride",
      },
      {
        id: "mom-10",
        title: "Bank Holiday Monday approaching — long weekend ahead",
        triggerType: "seasonal",
        popScore: 79,
        timestamp: "2 hours ago",
        description: "Bank holiday weekend coming up — families planning activities and outings across the region.",
        suggestedAction: "Run long weekend showroom event ad with extended opening hours and special finance offers",
      },
      {
        id: "mom-11",
        title: "Ashbourne food festival this weekend",
        triggerType: "culture",
        popScore: 63,
        timestamp: "5 hours ago",
        description: "Ashbourne food festival bringing high foot traffic to the town centre this weekend.",
        suggestedAction: "Partner with festival for branded presence and run localised radio ad welcoming visitors to the area",
      },
      {
        id: "mom-12",
        title: "New M3 motorway junction opening — showroom 2 mins off exit",
        triggerType: "news",
        popScore: 88,
        timestamp: "30 minutes ago",
        description: "New M3 motorway junction opening announced — Tadg Riordan's Ashbourne showroom is just 2 minutes from the exit.",
        suggestedAction: "Run targeted radio and social ads highlighting proximity to the new junction — 'We're just off the M3'",
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
    logoLine: "Where every meal is a moment",
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
      voiceName: "Flynn",
      voiceDescription: "Natural, crisp neutral Irish accent",
      voiceId: "2WvAXMgrakBkapSmnlv7",
      brandMusic: "Italian-inspired acoustic guitar melody",
      additionalMusic: ["Evening ambience bed", "Upbeat lunch rush bed"],
      sfx: ["Pizza oven crackle", "Cork pop", "Plate set down"],
      logoLine: "Where every meal is a moment",
    },
    socialProfile: {
      tone: "Warm, inviting, passionate about food",
      hashtags: ["#NapolisKitchen", "#ItalianFood", "#Meath", "#FoodLovers"],
      imageStyle: "Food photography, restaurant ambiance, family dining",
      bestPlatforms: ["instagram", "facebook", "tiktok"],
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
      {
        id: "mom-13",
        title: "Six Nations weekend — Ireland vs England buildup",
        triggerType: "sport",
        popScore: 77,
        timestamp: "2 hours ago",
        description: "Six Nations rugby fever building ahead of the Ireland vs England clash — massive pub and restaurant footfall expected.",
        suggestedAction: "Run match-day dining promotion — 'watch the game, enjoy the food' with special pre-match menu",
      },
      {
        id: "mom-14",
        title: "Ashbourne food festival this weekend",
        triggerType: "culture",
        popScore: 91,
        timestamp: "1 hour ago",
        description: "Ashbourne food festival this weekend — huge opportunity for food businesses to reach engaged audiences.",
        suggestedAction: "Feature Napoli's Kitchen at the festival and run social and radio content celebrating local food culture",
      },
      {
        id: "mom-15",
        title: "Bank Holiday Monday — families looking for dining options",
        triggerType: "seasonal",
        popScore: 84,
        timestamp: "3 hours ago",
        description: "Bank holiday weekend coming up — families and couples searching for dining out options.",
        suggestedAction: "Promote Sunday lunch and Monday specials with family-friendly offers and booking incentives",
      },
      {
        id: "mom-16",
        title: "Local business awards — broadcasting live",
        triggerType: "news",
        popScore: 69,
        timestamp: "6 hours ago",
        description: "Local business awards being broadcast live — Napoli's Kitchen nominated in the hospitality category.",
        suggestedAction: "Leverage awards buzz with pride-themed social content and radio mention — 'voted by the community'",
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
      voiceName: "Michael",
      voiceDescription: "Soft Irish male, melodic & soothing",
      voiceId: "8SNzJpKT62Cqqqe8Injx",
      brandMusic: "Light rock guitar riff",
      additionalMusic: [],
      sfx: ["Car horn honk"],
      logoLine: "Drive home happy",
    },
    socialProfile: {
      tone: "Honest, straightforward, value-focused",
      hashtags: ["#GreenValleyMotors", "#Hereford", "#UsedCars", "#DriveHomeHappy", "#AffordableCars"],
      imageStyle: "Clean car photography, welcoming forecourt, family-friendly imagery",
      bestPlatforms: ["facebook", "instagram", "x"],
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
    logoLine: "Your future, secured",
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
      voiceName: "Frances",
      voiceDescription: "Soft, warm, calm Irish accent",
      voiceId: "mFgXOmlOfXfr6suoQkRH",
      brandMusic: "Reassuring piano melody",
      additionalMusic: [],
      sfx: ["Pen on paper", "Keyboard typing"],
      logoLine: "Your future, secured",
    },
    socialProfile: {
      tone: "Professional, authoritative, reassuring",
      hashtags: ["#HerefordFinancial", "#FinancialPlanning", "#YourFutureSecured"],
      imageStyle: "Professional, clean, trust-building",
      bestPlatforms: ["linkedin", "facebook", "x"],
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
    moments: [
      {
        id: "mom-17",
        title: "Tax year end approaching — April deadline",
        triggerType: "seasonal",
        popScore: 86,
        timestamp: "1 hour ago",
        description: "UK tax year end on 5th April fast approaching — high interest in ISA and pension top-ups.",
        suggestedAction: "Run urgent tax year end campaign highlighting ISA allowances and pension contributions before the deadline",
      },
      {
        id: "mom-18",
        title: "Interest rates announcement expected this week",
        triggerType: "industry",
        popScore: 90,
        timestamp: "2 hours ago",
        description: "Bank of England interest rate decision expected this week — significant impact on mortgage rates and savings.",
        suggestedAction: "Position Hereford Financial as the expert guide through rate changes — 'whatever they decide, we'll find you the best deal'",
      },
      {
        id: "mom-19",
        title: "First-time buyer scheme changes announced",
        triggerType: "news",
        popScore: 83,
        timestamp: "3 hours ago",
        description: "Government announces changes to first-time buyer mortgage guarantee scheme — major impact on the housing market.",
        suggestedAction: "Launch first-time buyer campaign explaining the new scheme with a clear call-to-action to book a consultation",
      },
      {
        id: "mom-20",
        title: "Back to school season — education fund planning",
        triggerType: "seasonal",
        popScore: 72,
        timestamp: "1 day ago",
        description: "Back to school season prompting parents to think about long-term education fund planning and savings.",
        suggestedAction: "Promote education savings plans and junior ISAs — 'invest in their future today'",
      },
    ],
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
      voiceName: "Darren",
      voiceDescription: "Calm masculine Irish narrator, cinematic",
      voiceId: "9TYDukkUVpJPDSIuv3ir",
      brandMusic: "Adventure folk guitar",
      additionalMusic: ["Calm river ambience"],
      sfx: ["Water splash", "Bird call", "Paddle stroke"],
      logoLine: "Discover the Wye Valley",
    },
    socialProfile: {
      tone: "Adventurous, inspiring, nature-loving",
      hashtags: ["#WyeValleyTours", "#WyeValley", "#AdventureWaits", "#KayakLife", "#VisitHerefordshire"],
      imageStyle: "Action shots on water, stunning valley landscapes, happy groups outdoors",
      bestPlatforms: ["instagram", "tiktok", "facebook"],
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
    moments: [
      {
        id: "mom-21",
        title: "Sunny weekend forecast — outdoor activities surge",
        triggerType: "weather",
        popScore: 92,
        timestamp: "1 hour ago",
        description: "Sunny weekend forecast with clear skies across the Wye Valley — peak conditions for kayaking and guided walks.",
        suggestedAction: "Launch urgent weekend availability campaign — 'perfect conditions this weekend, book now before spots fill'",
      },
      {
        id: "mom-22",
        title: "Bank holiday approaching — adventure bookings spike",
        triggerType: "seasonal",
        popScore: 85,
        timestamp: "2 hours ago",
        description: "Bank holiday weekend approaching — historically the biggest booking period for outdoor adventure activities.",
        suggestedAction: "Run bank holiday adventure package campaign with group discounts and family bundle offers",
      },
      {
        id: "mom-23",
        title: "Local tourism awards nominations open",
        triggerType: "industry",
        popScore: 67,
        timestamp: "5 hours ago",
        description: "Local tourism awards nominations are now open — opportunity to build reputation and community engagement.",
        suggestedAction: "Run social campaign asking customers to nominate Wye Valley Tours — 'we love what we do, tell them why'",
      },
    ],
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
