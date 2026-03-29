// Analytics Data Layer — Rich mock data for Radio, Social, and Cross-Media analytics

export type TriggerType =
  | "weather"
  | "sport"
  | "news"
  | "culture"
  | "traffic"
  | "seasonal"
  | "industry"
  | "breaking";

// ─── Radio Analytics ─────────────────────────────────────────────────────────

export interface RadioAdAnalytics {
  adId: string;
  adName: string;
  campaignId: string;
  brandSlug: string;
  stationSlug: string;
  duration: 15 | 30 | 60;
  triggerType: TriggerType;
  momentTitle: string;
  popScore: number;
  totalPlays: number;
  fmPlays: number;
  dabPlays: number;
  streamingInsertions: number;
  estimatedReach: number;
  frequency: number;
  daypartBreakdown: {
    breakfast: number;
    daytime: number;
    drive: number;
    evening: number;
    overnight: number;
  };
  callsGenerated: number;
  websiteVisits: number;
  promoCodeRedemptions: number;
  totalResponses: number;
  responseRate: number;
  costPerResponse: number;
  firstAired: string;
  lastAired: string;
  isMomentTriggered: boolean;
}

export interface RadioCampaignAnalytics {
  campaignId: string;
  campaignName: string;
  brandSlug: string;
  stationSlug: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "scheduled";
  totalAds: number;
  momentTriggeredAds: number;
  scheduledAds: number;
  totalPlays: number;
  totalReach: number;
  avgFrequency: number;
  totalResponses: number;
  avgResponseRate: number;
  avgPopScore: number;
  totalCost: number;
  totalAttributedRevenue: number;
  roas: number;
  momentVsScheduledLift: number;
}

// ─── Social Analytics ────────────────────────────────────────────────────────

export interface SocialPlatformMetrics {
  platform: "tiktok" | "instagram" | "facebook" | "x" | "linkedin";
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  engagementRate: number;
  ctr: number;
}

export interface SocialPostAnalytics {
  postId: string;
  campaignId: string;
  brandSlug: string;
  stationSlug: string;
  contentType: "quick-post" | "video" | "slideshow" | "blog";
  triggerType: TriggerType;
  momentTitle: string;
  popScore: number;
  platforms: SocialPlatformMetrics[];
  totalImpressions: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalClicks: number;
  momentDetectedAt: string;
  publishedAt: string;
  publishingVelocity: number;
  isMomentTriggered: boolean;
}

export interface SocialCampaignAnalytics {
  campaignId: string;
  campaignName: string;
  brandSlug: string;
  totalPosts: number;
  momentTriggeredPosts: number;
  totalImpressions: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalClicks: number;
  bestPlatform: string;
  bestContentType: string;
  avgPublishingVelocity: number;
  platformPerformance: {
    platform: string;
    impressions: number;
    engagement: number;
    engagementRate: number;
  }[];
  momentVsScheduledLift: number;
}

// ─── Cross-Media Analytics ───────────────────────────────────────────────────

export interface CrossMediaAnalytics {
  brandSlug: string;
  stationSlug: string;
  period: string;
  totalRadioReach: number;
  totalSocialReach: number;
  combinedUniqueReach: number;
  crossMediaLift: number;
  avgPopScore: number;
  popScoreTrend: { date: string; score: number }[];
  triggerTypePerformance: {
    triggerType: TriggerType;
    count: number;
    avgPopScore: number;
    avgResponseRate: number;
    avgEngagementRate: number;
  }[];
  totalCampaignCost: number;
  totalAttributedRevenue: number;
  roas: number;
  radioOnlyConversions: number;
  socialOnlyConversions: number;
  crossMediaConversions: number;
  sectorAvgPopScore: number;
  sectorAvgResponseRate: number;
  brandVsSectorPerformance: number;
  dailyMetrics: {
    date: string;
    radioPlays: number;
    socialImpressions: number;
    responses: number;
    popScore: number;
  }[];
  momentHeatmap: {
    date: string;
    momentCount: number;
    performanceScore: number;
  }[];
}

// ─── Station & Group summaries ───────────────────────────────────────────────

export interface StationAnalyticsSummary {
  stationSlug: string;
  totalBrands: number;
  totalReach: number;
  avgPopScore: number;
  topSector: string;
  sectorPerformance: { sector: string; avgPopScore: number; brandCount: number }[];
  topBrands: { brandSlug: string; brandName: string; popScore: number; reach: number }[];
}

export interface GroupAnalyticsSummary {
  clientId: string;
  networkReach: number;
  activeMomentAds: number;
  avgPopScore: number;
  topStation: string;
}

// ─── Chart helper types ──────────────────────────────────────────────────────

export interface PerformanceItem {
  id: string;
  name: string;
  triggerType: TriggerType;
  popScore: number;
  metric: number;
  metricLabel: string;
  sparkline: number[];
  isMomentTriggered: boolean;
}

export interface ComparisonMetrics {
  responseRate: number;
  engagementRate: number;
  popScore: number;
  costPerResponse: number;
}

export interface TimeSlotData {
  day: number; // 0=Mon ... 6=Sun
  hour: number;
  value: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA — Tadg Riordan Motors (Hero Brand)
// ═══════════════════════════════════════════════════════════════════════════════

const TADG_RADIO_ADS: RadioAdAnalytics[] = [
  // ── Moment-triggered ads (8) ──
  {
    adId: "rad-001",
    adName: "Sunny Weekend Test Drive",
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 30,
    triggerType: "weather",
    momentTitle: "Sunny weekend forecast for Leinster",
    popScore: 91,
    totalPlays: 312,
    fmPlays: 198,
    dabPlays: 72,
    streamingInsertions: 42,
    estimatedReach: 24800,
    frequency: 3.2,
    daypartBreakdown: { breakfast: 48, daytime: 62, drive: 112, evening: 68, overnight: 22 },
    callsGenerated: 34,
    websiteVisits: 156,
    promoCodeRedemptions: 8,
    totalResponses: 198,
    responseRate: 0.008,
    costPerResponse: 2.45,
    firstAired: "2026-01-10",
    lastAired: "2026-03-22",
    isMomentTriggered: true,
  },
  {
    adId: "rad-002",
    adName: "Rain? Perfect Day for Indoor Showroom",
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 30,
    triggerType: "weather",
    momentTitle: "Heavy rain forecast for Meath & Dublin",
    popScore: 78,
    totalPlays: 245,
    fmPlays: 158,
    dabPlays: 56,
    streamingInsertions: 31,
    estimatedReach: 19200,
    frequency: 2.8,
    daypartBreakdown: { breakfast: 42, daytime: 58, drive: 82, evening: 45, overnight: 18 },
    callsGenerated: 22,
    websiteVisits: 98,
    promoCodeRedemptions: 5,
    totalResponses: 125,
    responseRate: 0.0065,
    costPerResponse: 3.12,
    firstAired: "2026-01-18",
    lastAired: "2026-03-15",
    isMomentTriggered: true,
  },
  {
    adId: "rad-003",
    adName: "Spring Clean Your Drive — March Blitz",
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 60,
    triggerType: "weather",
    momentTitle: "First spring sunshine after cold snap",
    popScore: 85,
    totalPlays: 198,
    fmPlays: 128,
    dabPlays: 44,
    streamingInsertions: 26,
    estimatedReach: 16400,
    frequency: 2.5,
    daypartBreakdown: { breakfast: 34, daytime: 48, drive: 68, evening: 36, overnight: 12 },
    callsGenerated: 18,
    websiteVisits: 82,
    promoCodeRedemptions: 4,
    totalResponses: 104,
    responseRate: 0.0063,
    costPerResponse: 3.65,
    firstAired: "2026-03-01",
    lastAired: "2026-03-25",
    isMomentTriggered: true,
  },
  {
    adId: "rad-004",
    adName: "261 Plates — New Year, New Car",
    campaignId: "camp-2",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 60,
    triggerType: "seasonal",
    momentTitle: "New 261 registration plates launch",
    popScore: 94,
    totalPlays: 356,
    fmPlays: 224,
    dabPlays: 82,
    streamingInsertions: 50,
    estimatedReach: 28600,
    frequency: 3.6,
    daypartBreakdown: { breakfast: 58, daytime: 72, drive: 128, evening: 74, overnight: 24 },
    callsGenerated: 42,
    websiteVisits: 192,
    promoCodeRedemptions: 12,
    totalResponses: 246,
    responseRate: 0.0086,
    costPerResponse: 2.15,
    firstAired: "2026-01-02",
    lastAired: "2026-02-28",
    isMomentTriggered: true,
  },
  {
    adId: "rad-005",
    adName: "Valentine's Day — Gift of Freedom",
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 30,
    triggerType: "seasonal",
    momentTitle: "Valentine's Day gifting season",
    popScore: 72,
    totalPlays: 178,
    fmPlays: 112,
    dabPlays: 42,
    streamingInsertions: 24,
    estimatedReach: 14200,
    frequency: 2.4,
    daypartBreakdown: { breakfast: 28, daytime: 38, drive: 62, evening: 38, overnight: 12 },
    callsGenerated: 12,
    websiteVisits: 64,
    promoCodeRedemptions: 3,
    totalResponses: 79,
    responseRate: 0.0056,
    costPerResponse: 4.22,
    firstAired: "2026-02-08",
    lastAired: "2026-02-14",
    isMomentTriggered: true,
  },
  {
    adId: "rad-006",
    adName: "M50 Gridlock — Escape the Commute",
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 15,
    triggerType: "traffic",
    momentTitle: "Dublin traffic congestion M50",
    popScore: 68,
    totalPlays: 142,
    fmPlays: 92,
    dabPlays: 32,
    streamingInsertions: 18,
    estimatedReach: 11800,
    frequency: 2.2,
    daypartBreakdown: { breakfast: 18, daytime: 22, drive: 72, evening: 22, overnight: 8 },
    callsGenerated: 8,
    websiteVisits: 48,
    promoCodeRedemptions: 2,
    totalResponses: 58,
    responseRate: 0.0049,
    costPerResponse: 5.10,
    firstAired: "2026-02-03",
    lastAired: "2026-03-18",
    isMomentTriggered: true,
  },
  {
    adId: "rad-007",
    adName: "Ashbourne GAA Finals — Tadg Backs the Town",
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 30,
    triggerType: "sport",
    momentTitle: "Ashbourne local GAA final",
    popScore: 58,
    totalPlays: 128,
    fmPlays: 82,
    dabPlays: 28,
    streamingInsertions: 18,
    estimatedReach: 10200,
    frequency: 2.1,
    daypartBreakdown: { breakfast: 18, daytime: 28, drive: 42, evening: 32, overnight: 8 },
    callsGenerated: 6,
    websiteVisits: 38,
    promoCodeRedemptions: 1,
    totalResponses: 45,
    responseRate: 0.0044,
    costPerResponse: 6.20,
    firstAired: "2026-03-08",
    lastAired: "2026-03-15",
    isMomentTriggered: true,
  },
  {
    adId: "rad-008",
    adName: "Used Car Market Boom — Trade Up Today",
    campaignId: "camp-2",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 30,
    triggerType: "industry",
    momentTitle: "Used car market surge reported",
    popScore: 82,
    totalPlays: 218,
    fmPlays: 138,
    dabPlays: 52,
    streamingInsertions: 28,
    estimatedReach: 17600,
    frequency: 2.6,
    daypartBreakdown: { breakfast: 38, daytime: 52, drive: 72, evening: 42, overnight: 14 },
    callsGenerated: 24,
    websiteVisits: 108,
    promoCodeRedemptions: 6,
    totalResponses: 138,
    responseRate: 0.0078,
    costPerResponse: 2.88,
    firstAired: "2026-01-20",
    lastAired: "2026-03-10",
    isMomentTriggered: true,
  },
  // ── Scheduled ads (4) — for comparison ──
  {
    adId: "rad-009",
    adName: "January Sale — Standard Spot A",
    campaignId: "camp-2",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 30,
    triggerType: "seasonal",
    momentTitle: "Scheduled campaign spot",
    popScore: 45,
    totalPlays: 280,
    fmPlays: 182,
    dabPlays: 62,
    streamingInsertions: 36,
    estimatedReach: 22400,
    frequency: 3.0,
    daypartBreakdown: { breakfast: 56, daytime: 56, drive: 56, evening: 56, overnight: 56 },
    callsGenerated: 10,
    websiteVisits: 52,
    promoCodeRedemptions: 2,
    totalResponses: 64,
    responseRate: 0.0029,
    costPerResponse: 7.80,
    firstAired: "2026-01-06",
    lastAired: "2026-01-31",
    isMomentTriggered: false,
  },
  {
    adId: "rad-010",
    adName: "February — Standard Spot B",
    campaignId: "camp-2",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 30,
    triggerType: "seasonal",
    momentTitle: "Scheduled campaign spot",
    popScore: 42,
    totalPlays: 260,
    fmPlays: 168,
    dabPlays: 58,
    streamingInsertions: 34,
    estimatedReach: 20800,
    frequency: 2.8,
    daypartBreakdown: { breakfast: 52, daytime: 52, drive: 52, evening: 52, overnight: 52 },
    callsGenerated: 8,
    websiteVisits: 44,
    promoCodeRedemptions: 1,
    totalResponses: 53,
    responseRate: 0.0025,
    costPerResponse: 8.45,
    firstAired: "2026-02-01",
    lastAired: "2026-02-28",
    isMomentTriggered: false,
  },
  {
    adId: "rad-011",
    adName: "March — Standard Spot C",
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 60,
    triggerType: "seasonal",
    momentTitle: "Scheduled campaign spot",
    popScore: 48,
    totalPlays: 240,
    fmPlays: 156,
    dabPlays: 54,
    streamingInsertions: 30,
    estimatedReach: 19200,
    frequency: 2.6,
    daypartBreakdown: { breakfast: 48, daytime: 48, drive: 48, evening: 48, overnight: 48 },
    callsGenerated: 9,
    websiteVisits: 46,
    promoCodeRedemptions: 2,
    totalResponses: 57,
    responseRate: 0.003,
    costPerResponse: 7.15,
    firstAired: "2026-03-01",
    lastAired: "2026-03-28",
    isMomentTriggered: false,
  },
  {
    adId: "rad-012",
    adName: "Evergreen — Tadg Value Promise",
    campaignId: "camp-2",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    duration: 15,
    triggerType: "seasonal",
    momentTitle: "Scheduled campaign spot",
    popScore: 40,
    totalPlays: 220,
    fmPlays: 142,
    dabPlays: 48,
    streamingInsertions: 30,
    estimatedReach: 17600,
    frequency: 2.5,
    daypartBreakdown: { breakfast: 44, daytime: 44, drive: 44, evening: 44, overnight: 44 },
    callsGenerated: 7,
    websiteVisits: 36,
    promoCodeRedemptions: 1,
    totalResponses: 44,
    responseRate: 0.0025,
    costPerResponse: 9.10,
    firstAired: "2026-01-06",
    lastAired: "2026-03-28",
    isMomentTriggered: false,
  },
];

// ─── Tadg Social Posts (24 total) ────────────────────────────────────────────

function makeSocialPost(
  id: string,
  contentType: SocialPostAnalytics["contentType"],
  triggerType: TriggerType,
  momentTitle: string,
  popScore: number,
  isMoment: boolean,
  platforms: SocialPlatformMetrics[],
  publishedAt: string,
  velocity: number,
): SocialPostAnalytics {
  const totalImpressions = platforms.reduce((s, p) => s + p.impressions, 0);
  const totalEngagement = platforms.reduce(
    (s, p) => s + p.likes + p.comments + p.shares + p.saves,
    0,
  );
  const totalClicks = platforms.reduce((s, p) => s + p.clicks, 0);
  const avgEngagementRate =
    platforms.reduce((s, p) => s + p.engagementRate, 0) / platforms.length;

  const detected = new Date(new Date(publishedAt).getTime() - velocity * 60000).toISOString();

  return {
    postId: id,
    campaignId: "camp-1",
    brandSlug: "tadg-riordan-motors",
    stationSlug: "sunshine-radio",
    contentType,
    triggerType,
    momentTitle,
    popScore,
    platforms,
    totalImpressions,
    totalEngagement,
    avgEngagementRate,
    totalClicks,
    momentDetectedAt: detected,
    publishedAt,
    publishingVelocity: velocity,
    isMomentTriggered: isMoment,
  };
}

function plat(
  platform: SocialPlatformMetrics["platform"],
  impressions: number,
  reach: number,
  likes: number,
  comments: number,
  shares: number,
  saves: number,
  clicks: number,
): SocialPlatformMetrics {
  const totalEng = likes + comments + shares + saves;
  return {
    platform,
    impressions,
    reach,
    likes,
    comments,
    shares,
    saves,
    clicks,
    engagementRate: impressions > 0 ? totalEng / impressions : 0,
    ctr: impressions > 0 ? clicks / impressions : 0,
  };
}

const TADG_SOCIAL_POSTS: SocialPostAnalytics[] = [
  // Moment-triggered posts (18)
  makeSocialPost("soc-001", "quick-post", "weather", "Sunny weekend — perfect for test drives", 89, true,
    [plat("instagram", 12400, 9800, 620, 45, 82, 124, 340), plat("facebook", 8600, 6200, 380, 32, 58, 0, 210), plat("x", 5200, 4100, 180, 22, 45, 0, 120)],
    "2026-01-11T09:15:00Z", 8),
  makeSocialPost("soc-002", "video", "weather", "Rain? Showroom comfort awaits", 82, true,
    [plat("tiktok", 28400, 22000, 1420, 86, 320, 280, 580), plat("instagram", 15200, 12000, 780, 52, 140, 190, 380)],
    "2026-01-19T10:30:00Z", 11),
  makeSocialPost("soc-003", "slideshow", "seasonal", "261 plates — New year, new wheels", 94, true,
    [plat("instagram", 18600, 14200, 920, 68, 180, 240, 460), plat("facebook", 12400, 8800, 520, 42, 92, 0, 280), plat("linkedin", 4200, 3200, 120, 18, 32, 48, 92)],
    "2026-01-03T08:00:00Z", 6),
  makeSocialPost("soc-004", "quick-post", "traffic", "Stuck on M50? Your new car is one exit away", 72, true,
    [plat("x", 8400, 6800, 420, 38, 92, 0, 210), plat("facebook", 6200, 4800, 280, 22, 48, 0, 150)],
    "2026-01-15T17:20:00Z", 4),
  makeSocialPost("soc-005", "video", "sport", "GAA finals weekend — Tadg backs Ashbourne", 64, true,
    [plat("tiktok", 18200, 14000, 860, 64, 220, 180, 320), plat("instagram", 9800, 7600, 480, 38, 92, 120, 210)],
    "2026-03-08T14:00:00Z", 15),
  makeSocialPost("soc-006", "quick-post", "industry", "Used car market booming — trade up today", 86, true,
    [plat("facebook", 11200, 8200, 480, 36, 72, 0, 260), plat("linkedin", 6800, 5200, 220, 28, 48, 62, 140), plat("x", 4600, 3600, 160, 18, 38, 0, 98)],
    "2026-01-21T11:00:00Z", 12),
  makeSocialPost("soc-007", "slideshow", "weather", "Spring sunshine — convertible season", 88, true,
    [plat("instagram", 16400, 12800, 820, 58, 160, 210, 420), plat("tiktok", 22000, 17200, 1100, 74, 280, 240, 480)],
    "2026-03-02T09:30:00Z", 9),
  makeSocialPost("soc-008", "quick-post", "seasonal", "Valentine's — the gift of freedom", 74, true,
    [plat("instagram", 14200, 11000, 710, 52, 128, 180, 360), plat("facebook", 8800, 6400, 340, 28, 62, 0, 180)],
    "2026-02-12T10:00:00Z", 14),
  makeSocialPost("soc-009", "video", "weather", "First frost — winter tyre check at Tadg's", 76, true,
    [plat("tiktok", 19800, 15400, 940, 68, 240, 200, 380), plat("instagram", 11400, 8800, 560, 42, 108, 140, 280)],
    "2026-01-28T08:45:00Z", 10),
  makeSocialPost("soc-010", "blog", "industry", "EV surge — what it means for Irish buyers", 80, true,
    [plat("linkedin", 8200, 6400, 320, 48, 82, 96, 220), plat("facebook", 6400, 4800, 240, 32, 52, 0, 160)],
    "2026-02-05T12:00:00Z", 18),
  makeSocialPost("soc-011", "quick-post", "seasonal", "Bank holiday deals — this weekend only", 78, true,
    [plat("instagram", 13600, 10400, 680, 48, 132, 170, 340), plat("facebook", 9200, 6800, 380, 30, 68, 0, 200), plat("x", 4800, 3800, 180, 16, 42, 0, 108)],
    "2026-03-14T09:00:00Z", 7),
  makeSocialPost("soc-012", "slideshow", "traffic", "Beat the commute — reliable runners from €8k", 70, true,
    [plat("instagram", 10800, 8200, 520, 38, 98, 130, 260), plat("facebook", 7400, 5400, 300, 24, 56, 0, 170)],
    "2026-02-18T17:30:00Z", 5),
  makeSocialPost("soc-013", "video", "sport", "Six Nations fever — road trip to the Aviva", 66, true,
    [plat("tiktok", 24600, 19200, 1220, 82, 310, 260, 520), plat("instagram", 12800, 10000, 640, 46, 122, 160, 310)],
    "2026-02-01T15:00:00Z", 13),
  makeSocialPost("soc-014", "quick-post", "weather", "Heatwave coming — AC check before the trip", 84, true,
    [plat("instagram", 11800, 9200, 590, 42, 112, 150, 290), plat("x", 5600, 4400, 210, 18, 48, 0, 130)],
    "2026-03-20T10:15:00Z", 6),
  makeSocialPost("soc-015", "blog", "seasonal", "Spring motoring guide — 5 checks before the road", 72, true,
    [plat("linkedin", 5800, 4400, 180, 32, 48, 62, 140), plat("facebook", 7200, 5200, 280, 26, 52, 0, 160)],
    "2026-03-05T11:30:00Z", 20),
  makeSocialPost("soc-016", "slideshow", "industry", "Best family SUVs 2026 — Tadg's top picks", 82, true,
    [plat("instagram", 15800, 12200, 780, 56, 148, 200, 380), plat("facebook", 10200, 7400, 420, 34, 76, 0, 240)],
    "2026-02-22T09:00:00Z", 16),
  makeSocialPost("soc-017", "quick-post", "culture", "Paddy's Day parade — spot the Tadg float!", 62, true,
    [plat("instagram", 18200, 14400, 920, 72, 210, 280, 420), plat("tiktok", 26400, 20800, 1320, 94, 340, 300, 560), plat("facebook", 9400, 6800, 380, 30, 68, 0, 200)],
    "2026-03-17T10:00:00Z", 3),
  makeSocialPost("soc-018", "video", "seasonal", "March madness — clearance event", 76, true,
    [plat("tiktok", 20200, 15800, 1000, 72, 260, 220, 440), plat("instagram", 13200, 10200, 660, 48, 128, 170, 320)],
    "2026-03-22T08:30:00Z", 11),

  // Scheduled posts (6)
  makeSocialPost("soc-019", "quick-post", "seasonal", "Monthly promo — scheduled", 38, false,
    [plat("instagram", 6200, 4800, 180, 14, 28, 40, 92), plat("facebook", 4800, 3400, 120, 10, 22, 0, 68)],
    "2026-01-15T12:00:00Z", 0),
  makeSocialPost("soc-020", "video", "seasonal", "Brand video — scheduled", 42, false,
    [plat("tiktok", 8400, 6200, 320, 22, 68, 52, 140), plat("instagram", 5600, 4200, 200, 16, 38, 48, 98)],
    "2026-02-01T12:00:00Z", 0),
  makeSocialPost("soc-021", "slideshow", "seasonal", "Product carousel — scheduled", 36, false,
    [plat("instagram", 5400, 4000, 160, 12, 24, 34, 78), plat("facebook", 4200, 3000, 100, 8, 18, 0, 56)],
    "2026-02-15T12:00:00Z", 0),
  makeSocialPost("soc-022", "quick-post", "seasonal", "February offer — scheduled", 40, false,
    [plat("facebook", 5800, 4200, 160, 12, 26, 0, 82), plat("x", 3200, 2400, 80, 8, 16, 0, 42)],
    "2026-02-20T12:00:00Z", 0),
  makeSocialPost("soc-023", "blog", "seasonal", "Monthly roundup — scheduled", 34, false,
    [plat("linkedin", 3400, 2600, 80, 12, 18, 24, 52), plat("facebook", 4000, 2800, 100, 8, 16, 0, 48)],
    "2026-03-01T12:00:00Z", 0),
  makeSocialPost("soc-024", "quick-post", "seasonal", "Spring stock update — scheduled", 44, false,
    [plat("instagram", 6800, 5200, 200, 16, 32, 44, 98), plat("facebook", 5200, 3800, 140, 10, 24, 0, 72)],
    "2026-03-15T12:00:00Z", 0),
];

// ─── Daily metrics for timeline charts (Jan–Mar 2026) ────────────────────────

function generateDailyMetrics(startDate: string, days: number): CrossMediaAnalytics["dailyMetrics"] {
  const result: CrossMediaAnalytics["dailyMetrics"] = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const weekNum = Math.floor(i / 7);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const basePlays = isWeekend ? 18 : 32;
    const baseImpressions = isWeekend ? 2800 : 4200;
    const trendMultiplier = 1 + weekNum * 0.04;

    result.push({
      date: d.toISOString().split("T")[0],
      radioPlays: Math.round((basePlays + Math.random() * 12) * trendMultiplier),
      socialImpressions: Math.round((baseImpressions + Math.random() * 1800) * trendMultiplier),
      responses: Math.round((4 + Math.random() * 8) * trendMultiplier),
      popScore: Math.round(68 + Math.random() * 22 + weekNum * 1.5),
    });
  }
  return result;
}

function generateHeatmap(startDate: string, days: number): CrossMediaAnalytics["momentHeatmap"] {
  const result: CrossMediaAnalytics["momentHeatmap"] = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const hasMoment = Math.random() > 0.35;
    result.push({
      date: d.toISOString().split("T")[0],
      momentCount: hasMoment ? Math.floor(1 + Math.random() * 4) : 0,
      performanceScore: hasMoment ? Math.round(45 + Math.random() * 50) : 0,
    });
  }
  return result;
}

function generatePopTrend(startDate: string, days: number): { date: string; score: number }[] {
  const result: { date: string; score: number }[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const weekNum = Math.floor(i / 7);
    result.push({
      date: d.toISOString().split("T")[0],
      score: Math.round(62 + weekNum * 2.2 + Math.random() * 14),
    });
  }
  return result;
}

const TADG_CROSS_MEDIA: CrossMediaAnalytics = {
  brandSlug: "tadg-riordan-motors",
  stationSlug: "sunshine-radio",
  period: "2026-Q1",
  totalRadioReach: 148200,
  totalSocialReach: 242000,
  combinedUniqueReach: 312400,
  crossMediaLift: 34,
  avgPopScore: 78,
  popScoreTrend: generatePopTrend("2026-01-01", 87),
  triggerTypePerformance: [
    { triggerType: "weather", count: 6, avgPopScore: 84, avgResponseRate: 0.0072, avgEngagementRate: 0.048 },
    { triggerType: "seasonal", count: 8, avgPopScore: 74, avgResponseRate: 0.0058, avgEngagementRate: 0.038 },
    { triggerType: "traffic", count: 3, avgPopScore: 70, avgResponseRate: 0.0049, avgEngagementRate: 0.035 },
    { triggerType: "sport", count: 3, avgPopScore: 63, avgResponseRate: 0.0044, avgEngagementRate: 0.042 },
    { triggerType: "industry", count: 4, avgPopScore: 83, avgResponseRate: 0.0078, avgEngagementRate: 0.044 },
    { triggerType: "culture", count: 1, avgPopScore: 62, avgResponseRate: 0.004, avgEngagementRate: 0.052 },
    { triggerType: "news", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "breaking", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
  ],
  totalCampaignCost: 12400,
  totalAttributedRevenue: 52080,
  roas: 4.2,
  radioOnlyConversions: 218,
  socialOnlyConversions: 342,
  crossMediaConversions: 486,
  sectorAvgPopScore: 64,
  sectorAvgResponseRate: 0.0038,
  brandVsSectorPerformance: 22,
  dailyMetrics: generateDailyMetrics("2026-01-01", 87),
  momentHeatmap: generateHeatmap("2026-01-01", 87),
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORTING BRANDS (lighter data)
// ═══════════════════════════════════════════════════════════════════════════════

const NAPOLI_RADIO_ADS: RadioAdAnalytics[] = [
  {
    adId: "nap-rad-001", adName: "Rainy Night Comfort Food", campaignId: "camp-4",
    brandSlug: "napoli-kitchen", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "weather", momentTitle: "Rain forecast for Dublin evening",
    popScore: 82, totalPlays: 186, fmPlays: 118, dabPlays: 42, streamingInsertions: 26,
    estimatedReach: 14200, frequency: 2.4,
    daypartBreakdown: { breakfast: 12, daytime: 28, drive: 42, evening: 82, overnight: 22 },
    callsGenerated: 28, websiteVisits: 92, promoCodeRedemptions: 12,
    totalResponses: 132, responseRate: 0.0093, costPerResponse: 1.95,
    firstAired: "2026-01-15", lastAired: "2026-03-20", isMomentTriggered: true,
  },
  {
    adId: "nap-rad-002", adName: "Valentine's Dinner Special", campaignId: "camp-4",
    brandSlug: "napoli-kitchen", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "seasonal", momentTitle: "Valentine's Day dining",
    popScore: 88, totalPlays: 142, fmPlays: 92, dabPlays: 32, streamingInsertions: 18,
    estimatedReach: 11400, frequency: 2.2,
    daypartBreakdown: { breakfast: 8, daytime: 22, drive: 38, evening: 62, overnight: 12 },
    callsGenerated: 22, websiteVisits: 68, promoCodeRedemptions: 8,
    totalResponses: 98, responseRate: 0.0086, costPerResponse: 2.20,
    firstAired: "2026-02-08", lastAired: "2026-02-14", isMomentTriggered: true,
  },
  {
    adId: "nap-rad-003", adName: "Weekly Special — Standard", campaignId: "camp-4",
    brandSlug: "napoli-kitchen", stationSlug: "sunshine-radio", duration: 15,
    triggerType: "seasonal", momentTitle: "Scheduled campaign spot",
    popScore: 42, totalPlays: 220, fmPlays: 142, dabPlays: 48, streamingInsertions: 30,
    estimatedReach: 16800, frequency: 2.6,
    daypartBreakdown: { breakfast: 44, daytime: 44, drive: 44, evening: 44, overnight: 44 },
    callsGenerated: 8, websiteVisits: 32, promoCodeRedemptions: 2,
    totalResponses: 42, responseRate: 0.0025, costPerResponse: 6.80,
    firstAired: "2026-01-06", lastAired: "2026-03-28", isMomentTriggered: false,
  },
  {
    adId: "nap-rad-004", adName: "Sunday Lunch — Standard", campaignId: "camp-4",
    brandSlug: "napoli-kitchen", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "seasonal", momentTitle: "Scheduled campaign spot",
    popScore: 38, totalPlays: 180, fmPlays: 116, dabPlays: 40, streamingInsertions: 24,
    estimatedReach: 13800, frequency: 2.3,
    daypartBreakdown: { breakfast: 36, daytime: 36, drive: 36, evening: 36, overnight: 36 },
    callsGenerated: 6, websiteVisits: 28, promoCodeRedemptions: 1,
    totalResponses: 35, responseRate: 0.0025, costPerResponse: 7.40,
    firstAired: "2026-01-06", lastAired: "2026-03-28", isMomentTriggered: false,
  },
];

const NAPOLI_SOCIAL_POSTS: SocialPostAnalytics[] = [
  makeSocialPost("nap-soc-001", "video", "weather", "Cosy Italian evening — rain outside, warmth inside", 84, true,
    [plat("instagram", 9200, 7200, 460, 38, 82, 120, 220), plat("tiktok", 14800, 11400, 720, 52, 180, 160, 320)],
    "2026-01-16T17:00:00Z", 9),
  makeSocialPost("nap-soc-002", "slideshow", "seasonal", "Valentine's menu reveal", 90, true,
    [plat("instagram", 16200, 12600, 810, 62, 148, 200, 380), plat("facebook", 8400, 6200, 340, 28, 62, 0, 180)],
    "2026-02-10T11:00:00Z", 12),
  makeSocialPost("nap-soc-003", "quick-post", "culture", "Paddy's Day — Italian-Irish fusion special", 68, true,
    [plat("instagram", 11800, 9200, 580, 44, 112, 150, 280), plat("facebook", 7200, 5200, 280, 22, 52, 0, 150)],
    "2026-03-17T11:30:00Z", 7),
  makeSocialPost("nap-soc-004", "quick-post", "weather", "Sunny terrace dining is back!", 80, true,
    [plat("instagram", 12400, 9600, 620, 48, 118, 160, 300), plat("facebook", 7800, 5600, 310, 24, 58, 0, 170)],
    "2026-03-18T10:00:00Z", 5),
  makeSocialPost("nap-soc-005", "video", "seasonal", "Monthly special — scheduled", 36, false,
    [plat("instagram", 4800, 3600, 140, 12, 22, 32, 68), plat("facebook", 3800, 2800, 90, 8, 16, 0, 48)],
    "2026-01-20T12:00:00Z", 0),
  makeSocialPost("nap-soc-006", "quick-post", "seasonal", "Sunday roast reminder — scheduled", 34, false,
    [plat("facebook", 4200, 3000, 100, 8, 18, 0, 52), plat("instagram", 3600, 2600, 110, 10, 18, 24, 58)],
    "2026-02-23T12:00:00Z", 0),
  makeSocialPost("nap-soc-007", "slideshow", "seasonal", "New menu launch", 72, true,
    [plat("instagram", 13200, 10200, 660, 48, 128, 170, 320), plat("tiktok", 16800, 13000, 840, 62, 200, 180, 360)],
    "2026-03-01T09:00:00Z", 14),
  makeSocialPost("nap-soc-008", "quick-post", "weather", "Storm warning — delivery deals tonight", 74, true,
    [plat("facebook", 8200, 6000, 340, 26, 58, 0, 180), plat("instagram", 7400, 5600, 360, 28, 68, 90, 190)],
    "2026-02-14T16:00:00Z", 6),
];

// Hereford Financial
const HEREFORD_RADIO_ADS: RadioAdAnalytics[] = [
  {
    adId: "hf-rad-001", adName: "Tax Year End — Plan Now", campaignId: "camp-5",
    brandSlug: "hereford-financial", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "seasonal", momentTitle: "Tax year end approaching",
    popScore: 76, totalPlays: 168, fmPlays: 108, dabPlays: 38, streamingInsertions: 22,
    estimatedReach: 12800, frequency: 2.3,
    daypartBreakdown: { breakfast: 42, daytime: 48, drive: 38, evening: 28, overnight: 12 },
    callsGenerated: 18, websiteVisits: 72, promoCodeRedemptions: 0,
    totalResponses: 90, responseRate: 0.007, costPerResponse: 3.20,
    firstAired: "2026-03-01", lastAired: "2026-03-28", isMomentTriggered: true,
  },
  {
    adId: "hf-rad-002", adName: "Mortgage Rates Drop — Act Fast", campaignId: "camp-5",
    brandSlug: "hereford-financial", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "industry", momentTitle: "Bank rate cut announced",
    popScore: 84, totalPlays: 142, fmPlays: 92, dabPlays: 32, streamingInsertions: 18,
    estimatedReach: 10800, frequency: 2.1,
    daypartBreakdown: { breakfast: 38, daytime: 42, drive: 32, evening: 22, overnight: 8 },
    callsGenerated: 14, websiteVisits: 58, promoCodeRedemptions: 0,
    totalResponses: 72, responseRate: 0.0067, costPerResponse: 3.60,
    firstAired: "2026-02-10", lastAired: "2026-03-15", isMomentTriggered: true,
  },
  {
    adId: "hf-rad-003", adName: "Financial Health Check — Standard", campaignId: "camp-5",
    brandSlug: "hereford-financial", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "seasonal", momentTitle: "Scheduled campaign spot",
    popScore: 44, totalPlays: 198, fmPlays: 128, dabPlays: 44, streamingInsertions: 26,
    estimatedReach: 15200, frequency: 2.5,
    daypartBreakdown: { breakfast: 40, daytime: 40, drive: 40, evening: 40, overnight: 38 },
    callsGenerated: 6, websiteVisits: 28, promoCodeRedemptions: 0,
    totalResponses: 34, responseRate: 0.0022, costPerResponse: 8.20,
    firstAired: "2026-01-06", lastAired: "2026-03-28", isMomentTriggered: false,
  },
];

const HEREFORD_SOCIAL_POSTS: SocialPostAnalytics[] = [
  makeSocialPost("hf-soc-001", "blog", "seasonal", "Tax year end checklist", 78, true,
    [plat("linkedin", 8200, 6400, 280, 42, 68, 92, 220), plat("facebook", 5400, 4000, 180, 18, 32, 0, 120)],
    "2026-03-03T09:00:00Z", 16),
  makeSocialPost("hf-soc-002", "quick-post", "industry", "Rate cut — what it means for your mortgage", 86, true,
    [plat("linkedin", 12400, 9600, 420, 58, 92, 120, 320), plat("facebook", 7800, 5800, 280, 22, 48, 0, 180), plat("x", 4200, 3200, 140, 14, 28, 0, 82)],
    "2026-02-11T10:30:00Z", 8),
  makeSocialPost("hf-soc-003", "slideshow", "seasonal", "Pension review season", 72, true,
    [plat("linkedin", 6800, 5200, 220, 32, 48, 62, 140), plat("facebook", 4600, 3400, 140, 12, 24, 0, 82)],
    "2026-01-15T11:00:00Z", 14),
  makeSocialPost("hf-soc-004", "quick-post", "seasonal", "Monthly tip — scheduled", 38, false,
    [plat("linkedin", 3200, 2400, 80, 10, 16, 22, 48), plat("facebook", 2800, 2000, 60, 6, 10, 0, 32)],
    "2026-02-01T12:00:00Z", 0),
  makeSocialPost("hf-soc-005", "quick-post", "seasonal", "Newsletter promo — scheduled", 36, false,
    [plat("linkedin", 2800, 2100, 70, 8, 14, 18, 40), plat("facebook", 2400, 1700, 50, 4, 8, 0, 28)],
    "2026-03-01T12:00:00Z", 0),
  makeSocialPost("hf-soc-006", "video", "industry", "ISA season — invest wisely", 74, true,
    [plat("linkedin", 9800, 7600, 340, 48, 72, 88, 260), plat("facebook", 6200, 4600, 220, 18, 38, 0, 140)],
    "2026-03-15T09:30:00Z", 10),
];

// Wicklow Adventure Tours
const WYE_RADIO_ADS: RadioAdAnalytics[] = [
  {
    adId: "wye-rad-001", adName: "Sunny Weekend — River Adventure", campaignId: "camp-6",
    brandSlug: "wicklow-adventure-tours", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "weather", momentTitle: "Sunny weekend forecast",
    popScore: 86, totalPlays: 156, fmPlays: 98, dabPlays: 36, streamingInsertions: 22,
    estimatedReach: 12200, frequency: 2.3,
    daypartBreakdown: { breakfast: 22, daytime: 38, drive: 48, evening: 36, overnight: 12 },
    callsGenerated: 16, websiteVisits: 82, promoCodeRedemptions: 6,
    totalResponses: 104, responseRate: 0.0085, costPerResponse: 2.40,
    firstAired: "2026-02-15", lastAired: "2026-03-22", isMomentTriggered: true,
  },
  {
    adId: "wye-rad-002", adName: "Easter Half-Term — Family Fun", campaignId: "camp-6",
    brandSlug: "wicklow-adventure-tours", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "seasonal", momentTitle: "School half-term approaching",
    popScore: 80, totalPlays: 128, fmPlays: 82, dabPlays: 28, streamingInsertions: 18,
    estimatedReach: 10400, frequency: 2.1,
    daypartBreakdown: { breakfast: 18, daytime: 32, drive: 38, evening: 28, overnight: 12 },
    callsGenerated: 12, websiteVisits: 64, promoCodeRedemptions: 4,
    totalResponses: 80, responseRate: 0.0077, costPerResponse: 2.80,
    firstAired: "2026-03-10", lastAired: "2026-03-28", isMomentTriggered: true,
  },
  {
    adId: "wye-rad-003", adName: "Adventure Awaits — Standard", campaignId: "camp-6",
    brandSlug: "wicklow-adventure-tours", stationSlug: "sunshine-radio", duration: 30,
    triggerType: "seasonal", momentTitle: "Scheduled campaign spot",
    popScore: 46, totalPlays: 192, fmPlays: 124, dabPlays: 42, streamingInsertions: 26,
    estimatedReach: 14800, frequency: 2.4,
    daypartBreakdown: { breakfast: 38, daytime: 38, drive: 38, evening: 40, overnight: 38 },
    callsGenerated: 6, websiteVisits: 28, promoCodeRedemptions: 1,
    totalResponses: 35, responseRate: 0.0024, costPerResponse: 7.60,
    firstAired: "2026-01-06", lastAired: "2026-03-28", isMomentTriggered: false,
  },
];

const WYE_SOCIAL_POSTS: SocialPostAnalytics[] = [
  makeSocialPost("wye-soc-001", "video", "weather", "Sun's out — kayaks are ready!", 88, true,
    [plat("tiktok", 22400, 17200, 1120, 78, 280, 240, 480), plat("instagram", 14200, 11000, 710, 52, 138, 180, 340)],
    "2026-02-16T09:00:00Z", 7),
  makeSocialPost("wye-soc-002", "slideshow", "seasonal", "Easter adventure guide", 82, true,
    [plat("instagram", 12800, 9800, 640, 48, 122, 160, 300), plat("facebook", 8200, 6000, 320, 26, 56, 0, 180)],
    "2026-03-12T10:00:00Z", 10),
  makeSocialPost("wye-soc-003", "quick-post", "weather", "Spring walks in the valley", 78, true,
    [plat("instagram", 10400, 8000, 520, 38, 98, 130, 260), plat("facebook", 6800, 5000, 260, 20, 46, 0, 140)],
    "2026-03-05T09:30:00Z", 8),
  makeSocialPost("wye-soc-004", "video", "culture", "Dublin literary festival tie-in", 64, true,
    [plat("tiktok", 16200, 12600, 780, 56, 200, 170, 340), plat("instagram", 9800, 7600, 480, 36, 92, 120, 240)],
    "2026-02-22T14:00:00Z", 15),
  makeSocialPost("wye-soc-005", "quick-post", "sport", "Post-match paddle — burn off the calories!", 60, true,
    [plat("instagram", 8400, 6400, 410, 32, 78, 100, 200), plat("tiktok", 12200, 9400, 580, 42, 148, 120, 260)],
    "2026-01-25T16:00:00Z", 12),
  makeSocialPost("wye-soc-006", "slideshow", "weather", "Autumn colours on the Wye", 84, true,
    [plat("instagram", 15600, 12000, 780, 58, 148, 200, 380), plat("facebook", 9400, 6800, 380, 30, 68, 0, 200)],
    "2026-01-10T10:00:00Z", 9),
  makeSocialPost("wye-soc-007", "quick-post", "seasonal", "Weekend plan — scheduled", 38, false,
    [plat("instagram", 5200, 4000, 160, 12, 26, 36, 78), plat("facebook", 3800, 2800, 90, 8, 16, 0, 48)],
    "2026-02-01T12:00:00Z", 0),
  makeSocialPost("wye-soc-008", "video", "seasonal", "Tour preview — scheduled", 40, false,
    [plat("tiktok", 7200, 5400, 280, 20, 58, 44, 120), plat("instagram", 4600, 3400, 170, 14, 32, 42, 86)],
    "2026-03-01T12:00:00Z", 0),
  makeSocialPost("wye-soc-009", "quick-post", "seasonal", "Book early — scheduled", 36, false,
    [plat("facebook", 4000, 2800, 80, 6, 14, 0, 42), plat("instagram", 3200, 2400, 100, 8, 18, 24, 56)],
    "2026-03-15T12:00:00Z", 0),
  makeSocialPost("wye-soc-010", "blog", "seasonal", "Top 10 Wicklow walks", 70, true,
    [plat("facebook", 8800, 6400, 340, 28, 62, 0, 180), plat("instagram", 7200, 5400, 360, 28, 72, 92, 200)],
    "2026-01-20T11:00:00Z", 18),
];

// Green Valley Motors — minimal (onboarding)
const GREEN_VALLEY_RADIO_ADS: RadioAdAnalytics[] = [];
const GREEN_VALLEY_SOCIAL_POSTS: SocialPostAnalytics[] = [];

// ═══════════════════════════════════════════════════════════════════════════════
// Cross-media for supporting brands
// ═══════════════════════════════════════════════════════════════════════════════

const NAPOLI_CROSS_MEDIA: CrossMediaAnalytics = {
  brandSlug: "napoli-kitchen", stationSlug: "sunshine-radio", period: "2026-Q1",
  totalRadioReach: 56200, totalSocialReach: 98400, combinedUniqueReach: 124600,
  crossMediaLift: 28, avgPopScore: 72,
  popScoreTrend: generatePopTrend("2026-01-01", 87),
  triggerTypePerformance: [
    { triggerType: "weather", count: 4, avgPopScore: 80, avgResponseRate: 0.0082, avgEngagementRate: 0.046 },
    { triggerType: "seasonal", count: 4, avgPopScore: 64, avgResponseRate: 0.004, avgEngagementRate: 0.032 },
    { triggerType: "culture", count: 1, avgPopScore: 68, avgResponseRate: 0.005, avgEngagementRate: 0.04 },
    { triggerType: "sport", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "traffic", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "industry", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "news", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "breaking", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
  ],
  totalCampaignCost: 5200, totalAttributedRevenue: 18720, roas: 3.6,
  radioOnlyConversions: 77, socialOnlyConversions: 148, crossMediaConversions: 212,
  sectorAvgPopScore: 60, sectorAvgResponseRate: 0.0035,
  brandVsSectorPerformance: 20,
  dailyMetrics: generateDailyMetrics("2026-01-01", 87),
  momentHeatmap: generateHeatmap("2026-01-01", 87),
};

const HEREFORD_CROSS_MEDIA: CrossMediaAnalytics = {
  brandSlug: "hereford-financial", stationSlug: "sunshine-radio", period: "2026-Q1",
  totalRadioReach: 38800, totalSocialReach: 62400, combinedUniqueReach: 82200,
  crossMediaLift: 22, avgPopScore: 68,
  popScoreTrend: generatePopTrend("2026-01-01", 87),
  triggerTypePerformance: [
    { triggerType: "seasonal", count: 4, avgPopScore: 62, avgResponseRate: 0.0042, avgEngagementRate: 0.034 },
    { triggerType: "industry", count: 3, avgPopScore: 82, avgResponseRate: 0.0067, avgEngagementRate: 0.046 },
    { triggerType: "weather", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "sport", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "traffic", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "culture", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "news", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "breaking", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
  ],
  totalCampaignCost: 4800, totalAttributedRevenue: 16320, roas: 3.4,
  radioOnlyConversions: 34, socialOnlyConversions: 82, crossMediaConversions: 108,
  sectorAvgPopScore: 58, sectorAvgResponseRate: 0.0032,
  brandVsSectorPerformance: 17,
  dailyMetrics: generateDailyMetrics("2026-01-01", 87),
  momentHeatmap: generateHeatmap("2026-01-01", 87),
};

const WYE_CROSS_MEDIA: CrossMediaAnalytics = {
  brandSlug: "wicklow-adventure-tours", stationSlug: "sunshine-radio", period: "2026-Q1",
  totalRadioReach: 37400, totalSocialReach: 118200, combinedUniqueReach: 128400,
  crossMediaLift: 30, avgPopScore: 70,
  popScoreTrend: generatePopTrend("2026-01-01", 87),
  triggerTypePerformance: [
    { triggerType: "weather", count: 4, avgPopScore: 84, avgResponseRate: 0.008, avgEngagementRate: 0.05 },
    { triggerType: "seasonal", count: 5, avgPopScore: 62, avgResponseRate: 0.004, avgEngagementRate: 0.034 },
    { triggerType: "culture", count: 1, avgPopScore: 64, avgResponseRate: 0.0042, avgEngagementRate: 0.038 },
    { triggerType: "sport", count: 1, avgPopScore: 60, avgResponseRate: 0.0038, avgEngagementRate: 0.04 },
    { triggerType: "traffic", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "industry", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "news", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
    { triggerType: "breaking", count: 0, avgPopScore: 0, avgResponseRate: 0, avgEngagementRate: 0 },
  ],
  totalCampaignCost: 3800, totalAttributedRevenue: 13680, roas: 3.6,
  radioOnlyConversions: 35, socialOnlyConversions: 128, crossMediaConversions: 164,
  sectorAvgPopScore: 56, sectorAvgResponseRate: 0.003,
  brandVsSectorPerformance: 25,
  dailyMetrics: generateDailyMetrics("2026-01-01", 87),
  momentHeatmap: generateHeatmap("2026-01-01", 87),
};

const GREEN_VALLEY_CROSS_MEDIA: CrossMediaAnalytics = {
  brandSlug: "green-valley-motors", stationSlug: "sunshine-radio", period: "2026-Q1",
  totalRadioReach: 0, totalSocialReach: 0, combinedUniqueReach: 0,
  crossMediaLift: 0, avgPopScore: 0,
  popScoreTrend: [], triggerTypePerformance: [],
  totalCampaignCost: 0, totalAttributedRevenue: 0, roas: 0,
  radioOnlyConversions: 0, socialOnlyConversions: 0, crossMediaConversions: 0,
  sectorAvgPopScore: 64, sectorAvgResponseRate: 0.0038,
  brandVsSectorPerformance: 0,
  dailyMetrics: [], momentHeatmap: [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LOOKUP MAPS
// ═══════════════════════════════════════════════════════════════════════════════

const ALL_RADIO_ADS: RadioAdAnalytics[] = [
  ...TADG_RADIO_ADS,
  ...NAPOLI_RADIO_ADS,
  ...HEREFORD_RADIO_ADS,
  ...WYE_RADIO_ADS,
  ...GREEN_VALLEY_RADIO_ADS,
];

const ALL_SOCIAL_POSTS: SocialPostAnalytics[] = [
  ...TADG_SOCIAL_POSTS,
  ...NAPOLI_SOCIAL_POSTS,
  ...HEREFORD_SOCIAL_POSTS,
  ...WYE_SOCIAL_POSTS,
  ...GREEN_VALLEY_SOCIAL_POSTS,
];

const CROSS_MEDIA_MAP: Record<string, CrossMediaAnalytics> = {
  "tadg-riordan-motors": TADG_CROSS_MEDIA,
  "napoli-kitchen": NAPOLI_CROSS_MEDIA,
  "hereford-financial": HEREFORD_CROSS_MEDIA,
  "wicklow-adventure-tours": WYE_CROSS_MEDIA,
  "green-valley-motors": GREEN_VALLEY_CROSS_MEDIA,
};

// ═══════════════════════════════════════════════════════════════════════════════
// GETTER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getRadioAnalytics(brandSlug: string, stationSlug: string): RadioAdAnalytics[] {
  return ALL_RADIO_ADS.filter(
    (a) => a.brandSlug === brandSlug && a.stationSlug === stationSlug,
  );
}

export function getSocialAnalytics(brandSlug: string, stationSlug: string): SocialPostAnalytics[] {
  return ALL_SOCIAL_POSTS.filter(
    (p) => p.brandSlug === brandSlug && p.stationSlug === stationSlug,
  );
}

export function getCrossMediaAnalytics(brandSlug: string, _stationSlug: string): CrossMediaAnalytics {
  return CROSS_MEDIA_MAP[brandSlug] ?? GREEN_VALLEY_CROSS_MEDIA;
}

export function getRadioAnalyticsByStation(stationSlug: string): RadioAdAnalytics[] {
  return ALL_RADIO_ADS.filter((a) => a.stationSlug === stationSlug);
}

export function getSocialAnalyticsByStation(stationSlug: string): SocialPostAnalytics[] {
  return ALL_SOCIAL_POSTS.filter((p) => p.stationSlug === stationSlug);
}

export function getStationAnalytics(stationSlug: string): StationAnalyticsSummary {
  const radioAds = getRadioAnalyticsByStation(stationSlug);
  const brands = [...new Set(radioAds.map((a) => a.brandSlug))];

  const brandSlugsWithData = Object.keys(CROSS_MEDIA_MAP).filter(
    (slug) => CROSS_MEDIA_MAP[slug].stationSlug === stationSlug && CROSS_MEDIA_MAP[slug].totalRadioReach > 0,
  );

  const totalReach = brandSlugsWithData.reduce(
    (sum, slug) => sum + CROSS_MEDIA_MAP[slug].combinedUniqueReach,
    0,
  );
  const avgPop =
    brandSlugsWithData.length > 0
      ? Math.round(
          brandSlugsWithData.reduce((s, slug) => s + CROSS_MEDIA_MAP[slug].avgPopScore, 0) /
            brandSlugsWithData.length,
        )
      : 0;

  const BRAND_NAMES: Record<string, string> = {
    "tadg-riordan-motors": "Tadg Riordan Motors",
    "napoli-kitchen": "Napoli's Kitchen",
    "hereford-financial": "Hereford Financial Advisers",
    "wicklow-adventure-tours": "Wicklow Adventure Tours",
    "green-valley-motors": "Green Valley Motors",
  };

  const BRAND_SECTORS: Record<string, string> = {
    "tadg-riordan-motors": "Motoring",
    "napoli-kitchen": "Hospitality",
    "hereford-financial": "Financial Services",
    "wicklow-adventure-tours": "Tourism & Leisure",
    "green-valley-motors": "Motoring",
  };

  const sectorMap: Record<string, { total: number; count: number }> = {};
  for (const slug of brandSlugsWithData) {
    const sector = BRAND_SECTORS[slug] ?? "General";
    if (!sectorMap[sector]) sectorMap[sector] = { total: 0, count: 0 };
    sectorMap[sector].total += CROSS_MEDIA_MAP[slug].avgPopScore;
    sectorMap[sector].count += 1;
  }

  const sectorPerformance = Object.entries(sectorMap).map(([sector, data]) => ({
    sector,
    avgPopScore: Math.round(data.total / data.count),
    brandCount: data.count,
  }));

  const topBrands = brandSlugsWithData
    .map((slug) => ({
      brandSlug: slug,
      brandName: BRAND_NAMES[slug] ?? slug,
      popScore: CROSS_MEDIA_MAP[slug].avgPopScore,
      reach: CROSS_MEDIA_MAP[slug].combinedUniqueReach,
    }))
    .sort((a, b) => b.popScore - a.popScore)
    .slice(0, 3);

  const topSector =
    sectorPerformance.length > 0
      ? sectorPerformance.sort((a, b) => b.avgPopScore - a.avgPopScore)[0].sector
      : "N/A";

  return {
    stationSlug,
    totalBrands: Math.max(brands.length, brandSlugsWithData.length),
    totalReach,
    avgPopScore: avgPop,
    topSector,
    sectorPerformance,
    topBrands,
  };
}

export function getRadioGroupAnalytics(clientId: string): GroupAnalyticsSummary {
  const stationSlugs =
    clientId === "star-broadcasting"
      ? ["sunshine-radio"]
      : [];

  let networkReach = 0;
  let activeMomentAds = 0;
  let totalPop = 0;
  let popCount = 0;
  let topStation = "";
  let topStationPop = 0;

  for (const slug of stationSlugs) {
    const stationData = getStationAnalytics(slug);
    networkReach += stationData.totalReach;
    activeMomentAds += getRadioAnalyticsByStation(slug).filter((a) => a.isMomentTriggered).length;
    if (stationData.avgPopScore > 0) {
      totalPop += stationData.avgPopScore;
      popCount++;
    }
    if (stationData.avgPopScore > topStationPop) {
      topStationPop = stationData.avgPopScore;
      topStation = slug;
    }
  }

  const STATION_NAMES: Record<string, string> = {
    "sunshine-radio": "Sunshine Radio",
  };

  return {
    clientId,
    networkReach,
    activeMomentAds,
    avgPopScore: popCount > 0 ? Math.round(totalPop / popCount) : 0,
    topStation: STATION_NAMES[topStation] ?? topStation,
  };
}

export function getCampaignRadioAnalytics(campaignId: string): RadioCampaignAnalytics {
  const ads = ALL_RADIO_ADS.filter((a) => a.campaignId === campaignId);
  if (ads.length === 0) {
    return {
      campaignId, campaignName: "Unknown", brandSlug: "", stationSlug: "",
      startDate: "", endDate: "", status: "completed",
      totalAds: 0, momentTriggeredAds: 0, scheduledAds: 0,
      totalPlays: 0, totalReach: 0, avgFrequency: 0,
      totalResponses: 0, avgResponseRate: 0, avgPopScore: 0,
      totalCost: 0, totalAttributedRevenue: 0, roas: 0, momentVsScheduledLift: 0,
    };
  }

  const momentAds = ads.filter((a) => a.isMomentTriggered);
  const scheduledAds = ads.filter((a) => !a.isMomentTriggered);
  const momentAvgRate = momentAds.length > 0
    ? momentAds.reduce((s, a) => s + a.responseRate, 0) / momentAds.length : 0;
  const scheduledAvgRate = scheduledAds.length > 0
    ? scheduledAds.reduce((s, a) => s + a.responseRate, 0) / scheduledAds.length : 0;
  const lift = scheduledAvgRate > 0
    ? Math.round(((momentAvgRate - scheduledAvgRate) / scheduledAvgRate) * 100) : 0;

  const totalPlays = ads.reduce((s, a) => s + a.totalPlays, 0);
  const totalReach = ads.reduce((s, a) => s + a.estimatedReach, 0);
  const totalResponses = ads.reduce((s, a) => s + a.totalResponses, 0);
  const totalCost = totalPlays * 1.8;

  const CAMPAIGN_NAMES: Record<string, string> = {
    "camp-1": "Spring Clean Sale",
    "camp-2": "New 261 Plates",
    "camp-4": "Valentine's Special",
    "camp-5": "Tax Year End Reminder",
    "camp-6": "Easter Adventure",
  };

  return {
    campaignId,
    campaignName: CAMPAIGN_NAMES[campaignId] ?? campaignId,
    brandSlug: ads[0].brandSlug,
    stationSlug: ads[0].stationSlug,
    startDate: ads.reduce((min, a) => (a.firstAired < min ? a.firstAired : min), ads[0].firstAired),
    endDate: ads.reduce((max, a) => (a.lastAired > max ? a.lastAired : max), ads[0].lastAired),
    status: "active",
    totalAds: ads.length,
    momentTriggeredAds: momentAds.length,
    scheduledAds: scheduledAds.length,
    totalPlays,
    totalReach,
    avgFrequency: ads.reduce((s, a) => s + a.frequency, 0) / ads.length,
    totalResponses,
    avgResponseRate: totalReach > 0 ? totalResponses / totalReach : 0,
    avgPopScore: Math.round(ads.reduce((s, a) => s + a.popScore, 0) / ads.length),
    totalCost: Math.round(totalCost),
    totalAttributedRevenue: Math.round(totalCost * 4.2),
    roas: 4.2,
    momentVsScheduledLift: lift,
  };
}

export function getCampaignSocialAnalytics(campaignId: string): SocialCampaignAnalytics {
  const posts = ALL_SOCIAL_POSTS.filter((p) => p.campaignId === campaignId);
  if (posts.length === 0) {
    return {
      campaignId, campaignName: "Unknown", brandSlug: "",
      totalPosts: 0, momentTriggeredPosts: 0,
      totalImpressions: 0, totalEngagement: 0, avgEngagementRate: 0,
      totalClicks: 0, bestPlatform: "N/A", bestContentType: "N/A",
      avgPublishingVelocity: 0, platformPerformance: [], momentVsScheduledLift: 0,
    };
  }

  const momentPosts = posts.filter((p) => p.isMomentTriggered);
  const scheduledPosts = posts.filter((p) => !p.isMomentTriggered);

  const momentAvgEng = momentPosts.length > 0
    ? momentPosts.reduce((s, p) => s + p.avgEngagementRate, 0) / momentPosts.length : 0;
  const scheduledAvgEng = scheduledPosts.length > 0
    ? scheduledPosts.reduce((s, p) => s + p.avgEngagementRate, 0) / scheduledPosts.length : 0;
  const lift = scheduledAvgEng > 0
    ? Math.round(((momentAvgEng - scheduledAvgEng) / scheduledAvgEng) * 100) : 0;

  const platMap: Record<string, { impressions: number; engagement: number }> = {};
  for (const post of posts) {
    for (const pm of post.platforms) {
      if (!platMap[pm.platform]) platMap[pm.platform] = { impressions: 0, engagement: 0 };
      platMap[pm.platform].impressions += pm.impressions;
      platMap[pm.platform].engagement += pm.likes + pm.comments + pm.shares + pm.saves;
    }
  }

  const platformPerformance = Object.entries(platMap).map(([platform, d]) => ({
    platform,
    impressions: d.impressions,
    engagement: d.engagement,
    engagementRate: d.impressions > 0 ? d.engagement / d.impressions : 0,
  }));

  const bestPlat = platformPerformance.sort((a, b) => b.engagementRate - a.engagementRate)[0];

  const typeMap: Record<string, number> = {};
  for (const post of posts) {
    typeMap[post.contentType] = (typeMap[post.contentType] ?? 0) + post.totalEngagement;
  }
  const bestType = Object.entries(typeMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const CAMPAIGN_NAMES: Record<string, string> = {
    "camp-1": "Spring Clean Sale",
    "camp-2": "New 261 Plates",
    "camp-4": "Valentine's Special",
    "camp-5": "Tax Year End Reminder",
    "camp-6": "Easter Adventure",
  };

  return {
    campaignId,
    campaignName: CAMPAIGN_NAMES[campaignId] ?? campaignId,
    brandSlug: posts[0].brandSlug,
    totalPosts: posts.length,
    momentTriggeredPosts: momentPosts.length,
    totalImpressions: posts.reduce((s, p) => s + p.totalImpressions, 0),
    totalEngagement: posts.reduce((s, p) => s + p.totalEngagement, 0),
    avgEngagementRate: posts.reduce((s, p) => s + p.avgEngagementRate, 0) / posts.length,
    totalClicks: posts.reduce((s, p) => s + p.totalClicks, 0),
    bestPlatform: bestPlat?.platform ?? "N/A",
    bestContentType: bestType,
    avgPublishingVelocity:
      momentPosts.length > 0
        ? Math.round(momentPosts.reduce((s, p) => s + p.publishingVelocity, 0) / momentPosts.length)
        : 0,
    platformPerformance,
    momentVsScheduledLift: lift,
  };
}

export function getMomentVsScheduledComparison(brandSlug: string, stationSlug: string): {
  moment: ComparisonMetrics;
  scheduled: ComparisonMetrics;
  liftPercentage: number;
} {
  const radioAds = getRadioAnalytics(brandSlug, stationSlug);
  const socialPosts = getSocialAnalytics(brandSlug, stationSlug);

  const momentRadio = radioAds.filter((a) => a.isMomentTriggered);
  const scheduledRadio = radioAds.filter((a) => !a.isMomentTriggered);
  const momentSocial = socialPosts.filter((p) => p.isMomentTriggered);
  const scheduledSocial = socialPosts.filter((p) => !p.isMomentTriggered);

  const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);

  const moment: ComparisonMetrics = {
    responseRate: avg(momentRadio.map((a) => a.responseRate)),
    engagementRate: avg(momentSocial.map((p) => p.avgEngagementRate)),
    popScore: avg([...momentRadio.map((a) => a.popScore), ...momentSocial.map((p) => p.popScore)]),
    costPerResponse: avg(momentRadio.map((a) => a.costPerResponse)),
  };

  const scheduled: ComparisonMetrics = {
    responseRate: avg(scheduledRadio.map((a) => a.responseRate)),
    engagementRate: avg(scheduledSocial.map((p) => p.avgEngagementRate)),
    popScore: avg([...scheduledRadio.map((a) => a.popScore), ...scheduledSocial.map((p) => p.popScore)]),
    costPerResponse: avg(scheduledRadio.map((a) => a.costPerResponse)),
  };

  const liftPercentage =
    scheduled.responseRate > 0
      ? Math.round(((moment.responseRate - scheduled.responseRate) / scheduled.responseRate) * 100)
      : 0;

  return { moment, scheduled, liftPercentage };
}

export function getTimeSlotData(brandSlug: string, stationSlug: string): TimeSlotData[] {
  const radioAds = getRadioAnalytics(brandSlug, stationSlug);
  const slots: TimeSlotData[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let value = 0;
      for (const ad of radioAds) {
        const dp = ad.daypartBreakdown;
        let daypartPlays = 0;
        if (hour >= 0 && hour < 6) daypartPlays = dp.overnight;
        else if (hour >= 6 && hour < 10) daypartPlays = dp.breakfast;
        else if (hour >= 10 && hour < 16) daypartPlays = dp.daytime;
        else if (hour >= 16 && hour < 19) daypartPlays = dp.drive;
        else daypartPlays = dp.evening;
        const hoursInPart =
          hour < 6 ? 6 : hour < 10 ? 4 : hour < 16 ? 6 : hour < 19 ? 3 : 5;
        value += Math.round(daypartPlays / hoursInPart / 7);
      }
      // Add slight variation per day
      const jitter = 0.8 + Math.sin(day * 3 + hour * 0.5) * 0.4;
      slots.push({ day, hour, value: Math.round(value * jitter) });
    }
  }
  return slots;
}

export function getTopPerformingAds(brandSlug: string, stationSlug: string): PerformanceItem[] {
  return getRadioAnalytics(brandSlug, stationSlug)
    .sort((a, b) => b.popScore - a.popScore)
    .slice(0, 10)
    .map((ad) => ({
      id: ad.adId,
      name: ad.adName,
      triggerType: ad.triggerType,
      popScore: ad.popScore,
      metric: ad.totalResponses,
      metricLabel: 'Responses',
      sparkline: [
        ad.totalResponses * 0.3,
        ad.totalResponses * 0.5,
        ad.totalResponses * 0.65,
        ad.totalResponses * 0.72,
        ad.totalResponses * 0.85,
        ad.totalResponses * 0.92,
        ad.totalResponses,
      ],
      isMomentTriggered: ad.isMomentTriggered,
    }));
}

export function getTopPerformingPosts(brandSlug: string, stationSlug: string): PerformanceItem[] {
  return getSocialAnalytics(brandSlug, stationSlug)
    .sort((a, b) => b.popScore - a.popScore)
    .slice(0, 10)
    .map((post) => ({
      id: post.postId,
      name: post.momentTitle,
      triggerType: post.triggerType,
      popScore: post.popScore,
      metric: post.totalEngagement,
      metricLabel: 'Engagement',
      sparkline: [
        post.totalEngagement * 0.2,
        post.totalEngagement * 0.45,
        post.totalEngagement * 0.6,
        post.totalEngagement * 0.78,
        post.totalEngagement * 0.88,
        post.totalEngagement * 0.95,
        post.totalEngagement,
      ],
      isMomentTriggered: post.isMomentTriggered,
    }));
}

export function getDaypartBreakdown(brandSlug: string, stationSlug: string): { name: string; value: number }[] {
  const ads = getRadioAnalytics(brandSlug, stationSlug);
  const totals = { breakfast: 0, daytime: 0, drive: 0, evening: 0, overnight: 0 };
  for (const ad of ads) {
    totals.breakfast += ad.daypartBreakdown.breakfast;
    totals.daytime += ad.daypartBreakdown.daytime;
    totals.drive += ad.daypartBreakdown.drive;
    totals.evening += ad.daypartBreakdown.evening;
    totals.overnight += ad.daypartBreakdown.overnight;
  }
  return [
    { name: 'Breakfast', value: totals.breakfast },
    { name: 'Daytime', value: totals.daytime },
    { name: 'Drive', value: totals.drive },
    { name: 'Evening', value: totals.evening },
    { name: 'Overnight', value: totals.overnight },
  ];
}

export function getPlatformBreakdown(brandSlug: string, stationSlug: string): { platform: string; impressions: number; engagement: number; engagementRate: number }[] {
  const posts = getSocialAnalytics(brandSlug, stationSlug);
  const map: Record<string, { impressions: number; engagement: number; count: number; totalRate: number }> = {};
  for (const post of posts) {
    for (const p of post.platforms) {
      if (!map[p.platform]) map[p.platform] = { impressions: 0, engagement: 0, count: 0, totalRate: 0 };
      map[p.platform].impressions += p.impressions;
      map[p.platform].engagement += p.likes + p.comments + p.shares + p.saves;
      map[p.platform].count += 1;
      map[p.platform].totalRate += p.engagementRate;
    }
  }
  return Object.entries(map).map(([platform, data]) => ({
    platform,
    impressions: data.impressions,
    engagement: data.engagement,
    engagementRate: data.count > 0 ? data.totalRate / data.count : 0,
  })).sort((a, b) => b.impressions - a.impressions);
}
