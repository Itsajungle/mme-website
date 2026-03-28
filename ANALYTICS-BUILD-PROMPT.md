# MME Analytics & Brand Portal — Build Prompt for Claude Code

> Paste the section below the line into Claude Code. All permissions enabled.

---

## BUILD THE MME ANALYTICS SYSTEM — Radio Analytics, Social Analytics, Aggregate Dashboard & Brand Portal

This is a major feature addition to the MME website. We are adding a comprehensive analytics system that proves the value of moment marketing across Radio and Social, plus a Brand Portal that gives advertiser clients their own login to monitor performance. This converts MomentMarketingEngine.com from a content creation platform into a full measurement and reporting platform.

Architecture has been proposed by Claude (strategy) and is pending review by Roger (commercial strategy) on HumAIn Comms.

**CRITICAL RULES:**
- Zero references to any third-party service names. Never mention Metricool, ElevenLabs, HeyGen, Canva, Nano Banana, or any other external service anywhere in the code, comments, labels, or placeholder text.
- Use the existing dark/green theme (humaintech.ai palette): `#040810` deep bg, `#0A0F1E` primary bg, `#00FF96` green accent, `#F59E0B` amber accent.
- All data is mock/demo data — no backend API calls. Store everything in TypeScript files.
- Use Recharts for all charts and visualisations.
- Follow the existing Next.js App Router patterns in the codebase.
- Match the existing component quality — clean, professional, animated with Framer Motion.

---

### 1. ANALYTICS DATA LAYER

Create a new file `src/lib/analytics-data.ts` containing rich mock analytics data.

#### 1.1 Radio Analytics Data (per ad / per campaign / per brand)

```typescript
interface RadioAdAnalytics {
  adId: string;
  adName: string;
  campaignId: string;
  brandSlug: string;
  stationSlug: string;
  duration: 15 | 30 | 60; // seconds
  triggerType: TriggerType;
  momentTitle: string;
  popScore: number; // 0-100

  // Delivery metrics
  totalPlays: number;
  fmPlays: number;
  dabPlays: number;
  streamingInsertions: number;

  // Reach & frequency
  estimatedReach: number;
  frequency: number; // avg times heard per listener

  // Time-slot distribution (plays per daypart)
  daypartBreakdown: {
    breakfast: number;  // 06:00-10:00
    daytime: number;    // 10:00-16:00
    drive: number;      // 16:00-19:00
    evening: number;    // 19:00-00:00
    overnight: number;  // 00:00-06:00
  };

  // Response metrics
  callsGenerated: number;
  websiteVisits: number;
  promoCodeRedemptions: number;
  totalResponses: number;
  responseRate: number; // responses / estimated reach
  costPerResponse: number;

  // Dates
  firstAired: string; // ISO date
  lastAired: string;

  // Comparison flag
  isMomentTriggered: boolean; // true = moment-matched, false = traditional scheduled
}

interface RadioCampaignAnalytics {
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

  // Aggregated metrics
  totalPlays: number;
  totalReach: number;
  avgFrequency: number;
  totalResponses: number;
  avgResponseRate: number;
  avgPopScore: number;
  totalCost: number;
  totalAttributedRevenue: number;
  roas: number; // return on ad spend

  // The killer stat
  momentVsScheduledLift: number; // % better performance of moment ads vs scheduled
}
```

#### 1.2 Social Analytics Data (per post / per campaign / per brand)

```typescript
interface SocialPostAnalytics {
  postId: string;
  campaignId: string;
  brandSlug: string;
  stationSlug: string;
  contentType: "quick-post" | "video" | "slideshow" | "blog";
  triggerType: TriggerType;
  momentTitle: string;
  popScore: number;

  // Per-platform metrics
  platforms: {
    platform: "tiktok" | "instagram" | "facebook" | "x" | "linkedin";
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
    engagementRate: number; // (likes+comments+shares+saves) / impressions
    ctr: number; // clicks / impressions
  }[];

  // Aggregate social metrics
  totalImpressions: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalClicks: number;

  // Timing
  momentDetectedAt: string;
  publishedAt: string;
  publishingVelocity: number; // minutes from detection to publish

  isMomentTriggered: boolean;
}

interface SocialCampaignAnalytics {
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

  // Platform breakdown
  platformPerformance: {
    platform: string;
    impressions: number;
    engagement: number;
    engagementRate: number;
  }[];

  momentVsScheduledLift: number;
}
```

#### 1.3 Aggregate / Cross-Media Analytics

```typescript
interface CrossMediaAnalytics {
  brandSlug: string;
  stationSlug: string;
  period: string; // e.g. "2026-Q1"

  // Combined reach
  totalRadioReach: number;
  totalSocialReach: number;
  combinedUniqueReach: number; // deduplicated estimate

  // The headline number
  crossMediaLift: number; // % improvement when both channels fire vs single channel

  // POP Factor
  avgPopScore: number;
  popScoreTrend: { date: string; score: number }[]; // daily trend

  // Moment performance by trigger type
  triggerTypePerformance: {
    triggerType: TriggerType;
    count: number;
    avgPopScore: number;
    avgResponseRate: number;
    avgEngagementRate: number;
  }[];

  // Revenue attribution
  totalCampaignCost: number;
  totalAttributedRevenue: number;
  roas: number;

  // Channel attribution
  radioOnlyConversions: number;
  socialOnlyConversions: number;
  crossMediaConversions: number;

  // Sector benchmarks
  sectorAvgPopScore: number;
  sectorAvgResponseRate: number;
  brandVsSectorPerformance: number; // % above/below sector average

  // Timeline data for charts
  dailyMetrics: {
    date: string;
    radioPlays: number;
    socialImpressions: number;
    responses: number;
    popScore: number;
  }[];

  // Moment heatmap data (calendar-style)
  momentHeatmap: {
    date: string;
    momentCount: number;
    performanceScore: number; // 0-100
  }[];
}
```

#### 1.4 Demo Data Requirements — Tadg Riordan Motors (Hero Brand)

Create rich, realistic mock data for Tadg Riordan Motors covering January–March 2026:

**Radio Ads (12 total):**
- 8 moment-triggered ads (weather: 3, seasonal: 2, traffic: 1, sport: 1, industry: 1)
- 4 traditional scheduled ads (for comparison)
- Moment-triggered ads should show ~35% higher response rate than scheduled
- POP scores ranging from 58–94 to show variation
- Total plays: 2,400+ across all ads
- Estimated reach: 145,000+
- Response data: calls (180+), website visits (920+), promo codes (45+)
- Clear daypart patterns (drive time performing best for motoring)

**Social Posts (24 total):**
- 18 moment-triggered, 6 scheduled
- Spread across all 5 platforms
- Mix of content types (quick post: 10, video: 6, slideshow: 5, blog: 3)
- Total impressions: 380,000+
- Average engagement rate: 4.2% (moment-triggered), 2.1% (scheduled)
- Publishing velocity averaging 12 minutes for moment-triggered

**Cross-Media Highlights:**
- Cross-media lift of 34% (when both radio + social fire on same moment)
- POP score trend showing improvement over the quarter
- Weather triggers perform best for motoring sector
- Drive-time + evening social posting = optimal combo
- ROAS of 4.2x

**4 Supporting Brands (lighter data):**
- Napoli's Kitchen: 4 radio ads, 8 social posts, hospitality patterns
- Green Valley Motors: Minimal (onboarding state)
- Hereford Financial: 3 radio ads, 6 social posts, professional tone
- Wye Valley Tours: 3 radio ads, 10 social posts (seasonal tourism patterns)

#### 1.5 Helper Functions

```typescript
// Getter functions matching existing patterns
getRadioAnalytics(brandSlug: string, stationSlug: string): RadioAdAnalytics[]
getSocialAnalytics(brandSlug: string, stationSlug: string): SocialPostAnalytics[]
getCrossMediaAnalytics(brandSlug: string, stationSlug: string): CrossMediaAnalytics
getStationAnalytics(stationSlug: string): StationAnalyticsSummary
getRadioGroupAnalytics(clientId: string): GroupAnalyticsSummary
getCampaignRadioAnalytics(campaignId: string): RadioCampaignAnalytics
getCampaignSocialAnalytics(campaignId: string): SocialCampaignAnalytics
```

---

### 2. ANALYTICS COMPONENTS

Create reusable chart components in `src/components/analytics/`. Use Recharts for all visualisations. Every component should use the dark theme and green accent colour.

Install Recharts: `npm install recharts`

#### 2.1 Core Chart Components

Create these in `src/components/analytics/charts/`:

**PopScoreGauge.tsx**
- Animated circular gauge (0–100)
- Colour zones: red (<40), amber (40–70), green (>70)
- Large central number with label
- Optional trend arrow (up/down vs previous period)
- Props: `score: number`, `previousScore?: number`, `label?: string`

**PerformanceTimeline.tsx**
- Line chart with dual Y-axes
- Left axis: ad plays or social impressions (bar chart overlay)
- Right axis: response rate or engagement rate (line)
- Moment triggers marked as vertical reference lines with labels
- Date range on X-axis
- Tooltip showing all metrics on hover
- Props: `data: DailyMetric[]`, `mode: "radio" | "social" | "aggregate"`

**MomentHeatmap.tsx**
- Calendar heatmap (GitHub contributions style)
- 90-day grid (13 weeks × 7 days)
- Colour intensity = performance score
- Hover tooltip: date, moment count, performance score
- Props: `data: { date: string; count: number; score: number }[]`

**ChannelSplitChart.tsx**
- Donut chart: Radio vs Social contribution
- Centre text: total combined metric
- Click segments to drill down
- Props: `radioValue: number`, `socialValue: number`, `label: string`

**TriggerTypeRadar.tsx**
- Radar/spider chart with 8 axes (one per trigger type)
- Shows which trigger types perform best for this brand
- Overlay: brand performance vs sector average
- Props: `data: TriggerPerformance[]`, `sectorAverage?: TriggerPerformance[]`

**CrossMediaLiftCard.tsx**
- Bold headline stat (e.g. "+34% Cross-Media Lift")
- Three comparison bars: Radio Only | Social Only | Both
- Animated on scroll into view
- Green accent for the "Both" bar
- Props: `radioOnly: number`, `socialOnly: number`, `combined: number`, `liftPercentage: number`

**TimeSlotHeatmap.tsx**
- 7-day × 24-hour grid (like a weekly calendar)
- Cell colour = number of plays or performance
- Column headers: Mon–Sun
- Row headers: 00:00–23:00 (or grouped dayparts)
- Props: `data: TimeSlotData[]`

**TopPerformersTable.tsx**
- Ranked list with sparkline mini-charts
- Shows: rank, ad/post name, trigger type badge, POP score, key metric, sparkline trend
- Sortable columns
- Props: `items: PerformanceItem[]`, `metric: string`

**PlatformBreakdown.tsx**
- Stacked horizontal bars per platform (TikTok, Instagram, Facebook, X, LinkedIn)
- Shows impressions, engagement, clicks side by side
- Platform icons/colours
- Props: `data: PlatformMetric[]`

**MomentVsScheduledComparison.tsx**
- Side-by-side bar chart comparing moment-triggered vs scheduled ads
- Show 3-4 key metrics: response rate, engagement rate, POP score, cost per response
- Green bars for moment-triggered, grey for scheduled
- "Moment-triggered ads outperform by X%" headline above
- Props: `momentData: ComparisonMetrics`, `scheduledData: ComparisonMetrics`

#### 2.2 Summary Cards

**AnalyticsSummaryCard.tsx**
- Reusable stat card with: icon, label, value, trend indicator (↑↓), sparkline
- Animated number counter on mount
- Props: `icon`, `label`, `value`, `previousValue?`, `trend?`, `sparklineData?`

Create a set of preconfigured summary cards:
- Total Reach card
- Total Responses card
- Average POP Score card
- Active Campaigns card
- Cross-Media Lift card
- ROAS card
- Publishing Velocity card (social)
- Ad Plays card (radio)

---

### 3. ANALYTICS PAGES & INTEGRATION POINTS

#### 3.1 Brand Workspace — New "Analytics" Tab

Add a third tab to the Brand Workspace (alongside Radio and Social):

**Route:** `/dashboard/station/[slug]/brand/[brandSlug]/analytics`

**Layout:**
- Top: Summary cards row (4-6 cards: Total Reach, Responses, POP Score, Cross-Media Lift, ROAS, Active Campaigns)
- Below cards: Three sub-tabs — **Radio** | **Social** | **Aggregate**

**Radio Sub-tab:**
- Performance Timeline (plays + response rate over time)
- Time-Slot Heatmap
- Top Performing Ads table
- Moment vs Scheduled comparison
- Daypart breakdown pie chart
- Campaign selector dropdown to filter

**Social Sub-tab:**
- Performance Timeline (impressions + engagement rate)
- Platform Breakdown chart
- Content Type performance comparison
- Publishing Velocity trend
- Top Performing Posts table
- Moment vs Scheduled comparison

**Aggregate Sub-tab:**
- Cross-Media Lift Card (hero position, large)
- POP Score Gauge (animated)
- Combined Performance Timeline
- Trigger Type Radar chart
- Moment Heatmap (calendar)
- Channel Attribution donut
- Revenue Dashboard (cost, revenue, ROAS)
- Sector Benchmarks comparison

#### 3.2 Station Page — Analytics Summary Panel

Add a new section to the existing Station Detail page (StationDetail.tsx), in the bottom grid area:

**"Station Analytics" panel showing:**
- 4 summary cards: Total brands, Total reach (all brands), Avg POP score, Top sector
- Mini bar chart: performance by sector
- Top 3 performing brands ranked list
- Link to full analytics: "View Full Analytics →"

#### 3.3 Main Dashboard — Group Analytics

Add analytics summary cards to the main Dashboard page:

**Summary row (below the existing stat cards):**
- Network reach (all stations combined)
- Active moment-ads across network
- Average POP score (network-wide)
- Top performing station

#### 3.4 Dedicated Analytics Hub

**Route:** `/dashboard/analytics`

Link from the existing "Analytics" sidebar item.

**Full-screen analytics page with:**
- Date range picker (preset: Last 7 days, 30 days, 90 days, Custom)
- Station filter dropdown (for multi-station clients)
- Brand filter dropdown
- Sector filter dropdown
- Three main tabs: Radio | Social | Aggregate
- All charts from section 2 available here with full filtering
- Export button (mock — show toast "Report downloading...")

---

### 4. BRAND PORTAL — Advertiser Client Login

#### 4.1 Authentication Extension

Extend the existing AuthProvider to support two login types:

```typescript
type UserRole = "station-operator" | "brand-client";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Station operator fields
  clientId?: string;
  // Brand client fields
  brandSlug?: string;
  stationSlug?: string;
  brandName?: string;
}
```

Add demo brand login credentials to the login page:

```
Brand Portal Demo:
tadg@riordanmotors.ie / demo2026  → Tadg Riordan Motors (Sunshine Radio)
```

The login form should detect the role from the email and route accordingly:
- Station operators → `/dashboard` (existing flow)
- Brand clients → `/portal/[brandSlug]` (new flow)

#### 4.2 Brand Portal Routes

Create new routes under `/portal/`:

**`/portal/[brandSlug]`** — Brand Portal Dashboard
- Brand name header with logo line
- Station attribution: "Advertising on Sunshine Radio"
- Summary cards: Active campaigns, Total reach, POP score, Next scheduled ad
- Recent campaign performance list
- Recent moment triggers that activated for this brand

**`/portal/[brandSlug]/analytics`** — Brand Analytics (same as brand workspace analytics but read-only, no station nav)

**`/portal/[brandSlug]/campaigns`** — Campaign List
- All campaigns for this brand with status and performance summary
- Click to expand: see individual ad/post performance

**`/portal/[brandSlug]/library`** — Ad & Content Library
- Radio Ads tab: list of all generated radio ads with mock audio players
- Social Posts tab: list of all social content with preview thumbnails
- Each item shows: date, trigger type, POP score, key metrics

**`/portal/[brandSlug]/brand-kit`** — Audio Brand Kit (read-only view)
- Same info as the brand workspace Audio Brand Kit but no edit controls
- Voice details, brand music description, SFX list, logo line

**`/portal/[brandSlug]/request`** — Request New Campaign
- Simple form: campaign name, description, preferred dates, budget range, notes
- Submit button shows success toast: "Request submitted to Sunshine Radio"
- No actual submission — just UI demo

#### 4.3 Brand Portal Layout

Create a new layout for `/portal/` routes:

- Simplified sidebar: Brand name + logo line, nav links (Dashboard, Analytics, Campaigns, Library, Brand Kit, Request Campaign)
- No station navigation — brand clients only see their own brand
- Same dark/green theme but with a subtle visual distinction (e.g. slightly different sidebar header) to differentiate from the station operator view
- "Powered by MME" footer badge
- Log out button

#### 4.4 Protected Routes

- `/portal/*` routes require `role === "brand-client"` authentication
- `/dashboard/*` routes require `role === "station-operator"` authentication
- Redirect to `/login` if not authenticated
- Redirect to correct area if logged in with wrong role

---

### 5. COMPONENT STRUCTURE

```
src/
├── app/
│   ├── dashboard/
│   │   ├── analytics/
│   │   │   └── page.tsx                    ← Full analytics hub
│   │   ├── station/
│   │   │   └── [slug]/
│   │   │       └── brand/
│   │   │           └── [brandSlug]/
│   │   │               └── analytics/
│   │   │                   └── page.tsx    ← Brand analytics tab
│   └── portal/
│       ├── layout.tsx                       ← Brand portal layout
│       └── [brandSlug]/
│           ├── page.tsx                     ← Portal dashboard
│           ├── analytics/
│           │   └── page.tsx                 ← Portal analytics
│           ├── campaigns/
│           │   └── page.tsx                 ← Campaign list
│           ├── library/
│           │   └── page.tsx                 ← Ad/content library
│           ├── brand-kit/
│           │   └── page.tsx                 ← Read-only brand kit
│           └── request/
│               └── page.tsx                 ← Campaign request form
├── components/
│   ├── analytics/
│   │   ├── charts/
│   │   │   ├── PopScoreGauge.tsx
│   │   │   ├── PerformanceTimeline.tsx
│   │   │   ├── MomentHeatmap.tsx
│   │   │   ├── ChannelSplitChart.tsx
│   │   │   ├── TriggerTypeRadar.tsx
│   │   │   ├── CrossMediaLiftCard.tsx
│   │   │   ├── TimeSlotHeatmap.tsx
│   │   │   ├── TopPerformersTable.tsx
│   │   │   ├── PlatformBreakdown.tsx
│   │   │   └── MomentVsScheduledComparison.tsx
│   │   ├── AnalyticsSummaryCard.tsx
│   │   ├── RadioAnalyticsView.tsx           ← Radio tab content
│   │   ├── SocialAnalyticsView.tsx          ← Social tab content
│   │   ├── AggregateAnalyticsView.tsx       ← Aggregate tab content
│   │   ├── StationAnalyticsPanel.tsx        ← For station detail page
│   │   └── DashboardAnalyticsSummary.tsx    ← For main dashboard
│   └── portal/
│       ├── PortalSidebar.tsx
│       ├── PortalDashboard.tsx
│       ├── PortalCampaignList.tsx
│       ├── PortalAdLibrary.tsx
│       ├── PortalBrandKit.tsx
│       └── PortalCampaignRequest.tsx
├── lib/
│   └── analytics-data.ts                    ← All mock analytics data
```

---

### 6. DESIGN SPECIFICATIONS

**Theme:** Use existing CSS variables from the codebase. Key values:
- Background: `#0A0F1E` (primary), `#040810` (deep)
- Cards: `#0F1528` with `border: 1px solid rgba(0, 255, 150, 0.1)`
- Green accent: `#00FF96`
- Amber accent: `#F59E0B`
- Text: `#F3F4F6` (primary), `#9CA3AF` (secondary)
- Charts: Use green (#00FF96) as primary, amber (#F59E0B) as secondary, with opacity variants

**Chart colour palette:**
- Primary: `#00FF96` (green)
- Secondary: `#F59E0B` (amber)
- Tertiary: `#3B82F6` (blue)
- Quaternary: `#8B5CF6` (purple)
- Comparison/baseline: `#4B5563` (grey)
- Danger: `#EF4444` (red)

**Animations:**
- Use Framer Motion for enter animations on all analytics panels
- Animated number counters on summary cards (count up from 0)
- Smooth transitions when switching between Radio/Social/Aggregate tabs
- Chart animations on mount (lines drawing, bars growing, gauge filling)

**Responsive:**
- Summary cards: 4-column on desktop, 2-column on tablet, 1-column on mobile
- Charts: full-width on mobile, 2-column grid on desktop
- Tables: horizontal scroll on mobile

---

### 7. NAVIGATION UPDATES

**Sidebar (DashboardSidebar.tsx):**
- Update the "Analytics" link to point to `/dashboard/analytics` instead of `#analytics`

**Brand Workspace (BrandWorkspace.tsx):**
- Add "Analytics" as a third tab alongside "Radio" and "Social"
- Use a chart icon (BarChart3 from lucide-react)

**Station Detail (StationDetail.tsx):**
- Add the StationAnalyticsPanel component in the bottom grid

---

### 8. IMPORTANT NOTES

1. **No third-party service names anywhere.** Not in code, not in comments, not in labels, not in placeholder text. This is an absolute rule.

2. **POP Factor is the hero metric.** Every analytics view should prominently feature the POP score. This is Peter Stone's signature concept and the key differentiator.

3. **Cross-media lift is the sales pitch.** The aggregate view showing radio + social together outperforming either alone — this is the data that sells the platform.

4. **Mock data must tell a clear story.** The numbers should clearly demonstrate that moment-triggered content outperforms traditional scheduled content. This isn't random data — it's a carefully crafted demo narrative.

5. **The Brand Portal is a revenue feature.** It creates an upsell path: stations pay more to give their advertisers portal access. Keep it polished but clearly scoped as read-only.

6. **Match existing code quality.** The current codebase uses clean TypeScript, proper component composition, Framer Motion animations, and the dark/green theme consistently. Match this standard.

7. **Install Recharts** (`npm install recharts`) — this is the only new dependency needed.

8. **Read the Next.js docs** at `node_modules/next/dist/docs/` before writing any page routes — this version has breaking changes from what you may expect.
