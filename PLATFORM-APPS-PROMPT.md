# Platform Apps & Agentic Architecture Prompt for Claude Code

> Paste the section below the line into Claude Code.

---

## BUILD THE MME PLATFORM — Apps, Agentic Hierarchy & Brand Workspace

This is a major feature addition to the MME website. We are building the actual platform tools that station staff and brand managers use to create, manage, and distribute moment-driven radio ads and social content. This converts MomentMarketingEngine.com from a marketing site into a functioning SaaS platform prototype.

Architecture has been reviewed and endorsed by Roger (commercial strategy) and Isabel (content/UX) on HumAIn Comms.

---

### 1. AGENTIC HIERARCHY

The platform uses a 3-tier AI agent structure, modelled on the CTE (Car Traders Edition) architecture but broadened for all sectors. This hierarchy should be represented in the UI as a visual system and should influence how each app operates.

#### Tier 1: ComProd Director (1 agent — platform-wide)
- The master creative intelligence, embedded with Peter Stone's 25+ years of creative radio advertising expertise
- Oversees all content quality, enforces the 4 Elements of radio copywriting
- Scores and critiques every AI-generated radio ad before it goes to air
- Sets brand voice consistency standards across all sectors
- Think of this as the Creative Director sitting above everything

#### Tier 2: Executive Producers (10 sector specialists)
Each EP agent has deep knowledge of their sector's audience, buying behaviour, seasonal patterns, and creative conventions:

1. **Motoring** — car dealers, garages, tyre shops, vehicle finance
2. **Hospitality** — restaurants, pubs, hotels, cafes, takeaways
3. **Retail** — shops, department stores, garden centres, furniture
4. **Financial Services** — mortgages, insurance, accounting, financial advisers
5. **Tourism & Leisure** — attractions, tours, holiday parks, cinemas, gyms
6. **Property** — estate agents, lettings, property developers
7. **Education & Training** — colleges, courses, driving schools, tutors
8. **Health & Wellbeing** — pharmacies, dentists, opticians, clinics, wellness
9. **Professional Services** — solicitors, recruitment, IT services, trades
10. **General** — catch-all for anything not covered above (with clear creative guidelines to maintain quality — per Isabel's recommendation)

#### Tier 3: Brand Agents (1 per advertiser)
- Auto-created when a new brand is added to a station
- Learns the brand's voice, history, offers, peak times, and audience
- Generates content suggestions specific to that brand
- Remembers what worked and what didn't from previous campaigns

#### UI Representation
- Show the agent hierarchy as a visual tree/org chart in the dashboard (optional panel)
- Each brand workspace should show which EP and Brand Agent are assigned
- Agent activity indicators (e.g. "ComProd Director reviewed 3 ads today")

---

### 2. BRAND WORKSPACE — The Core Experience

When a user navigates from Station → Sector → Brand, they arrive at the **Brand Workspace**. This is the main working area, split into two tabs:

#### Tab 1: RADIO
Contains everything for radio ad creation and management:

- **Brand Overview** — Business profile, peak times, revenue model, target audience, notes
- **Campaign History** — Previous campaigns with performance scores (placeholder data for demo)
- **Audio Brand Kit** — 
  - Voice: Cloned brand voice (show ElevenLabs voice ID field + "Clone Voice" button placeholder)
  - Brand Music: Upload/select jingle or music bed
  - Additional Music: Mood beds for different triggers
  - SFX: Brand-specific sound effects library
  - Logo Line: e.g. "Tell them Tadg sent you" — the sign-off
- **Radio Ad Generator** (the app) — Port the CTE Radio Ad Generator concept:
  - User describes the promotion/offer + selects trigger type
  - AI writes radio ad script (scored by ComProd Director)
  - Select voice from Audio Brand Kit
  - Select music bed + SFX
  - Generate audio via ElevenLabs TTS
  - Preview with waveform player
  - Production timeline showing voice + music + SFX layers
  - Ad Library showing previously generated ads
  - Duration selector: 15s / 30s / 60s
  - Readability score, CTA strength indicator
  - For demo: use placeholder audio generation (show the UI, mock the API calls)

#### Tab 2: SOCIAL
Contains everything for social content creation:

- **Social Studio** — Port the IAJ Social Studio concept:
  - Quick Post mode (text + image generation)
  - Video Post mode (HeyGen-style avatar presenter)
  - Slideshow mode (narrated image slideshow)
  - Blog Post mode
  - Platform selector (TikTok, Instagram, Facebook, X, LinkedIn)
  - Content preview per platform
  - Pipeline: Draft → Review → Schedule → Published
  - For demo: show full UI, mock API calls

- **MME / Moment Marketing** — Port the CTE Moment Marketing concept:
  - Real-time moment feed (simulated for demo)
  - Moment cards with trigger type, relevance score, suggested action
  - "Generate Content" button per moment
  - Cross-media toggle: generate for Radio, Social, or Both
  - Moment types: Weather, Sport, News, Culture, Traffic, Seasonal, Breaking
  - POP Score indicator on each moment
  - For demo: pre-populate with realistic moments for Tadg Riordan Motors

- **Production Composer** — Port the CTE Production Composer concept:
  - Prompt-based video generation
  - Script composition with clip planning
  - Avatar/presenter selection
  - Multi-clip generation with progress tracking
  - Final video composition
  - For demo: show full UI, mock API calls

---

### 3. NAVIGATION & FILTERING

From the station dashboard, users need powerful filtering to find brands:

- **Search bar** — Search brands by name (real-time autocomplete)
- **Sector filter** — Dropdown or chip selector to filter by sector
- **Status filter** — Active / Onboarding / Paused
- **Sort by** — Name, last activity, campaign count
- **Grid/List toggle** — Card view or compact list view

Brand cards in the station view should show:
- Brand name + logo placeholder
- Sector badge (coloured by sector)
- Assigned EP agent name
- Active campaign count
- Last activity date
- Status badge (Active / Onboarding)

---

### 4. DEMO DATA — Tadg Riordan Motors

Create a fully populated demo brand under Sunshine Radio > Motoring sector:

```
Brand: Tadg Riordan Motors
Sector: Motoring
EP Agent: Motoring Executive Producer
Logo Line: "Tell them Tadg sent you"

Locations:
├── Ashbourne Garage (Main Street, Ashbourne, Co. Meath)
└── Tallaght Garage (The Square, Tallaght, Dublin 24)

Brand Overview:
- Family-run motor dealer, 30+ years in business
- Sells new and used cars (multi-brand)
- Peak times: New plate months (Jan, Jul), sunny weekends, bank holidays
- Target: Families, first-time buyers, trade-ins
- Revenue model: Vehicle sales + servicing + parts

Audio Brand Kit:
- Voice: "Tadg" (warm, friendly, Irish male — ElevenLabs ID: placeholder)
- Brand Music: Upbeat, feel-good jingle (placeholder)
- SFX: Car engine start, door close, keys jingle
- Logo Line: "Tell them Tadg sent you"

Campaign History (placeholder):
- "Spring Clean Sale" — March 2026, 30s ad, POP Score: 87
- "New 261 Plates" — January 2026, 60s ad, POP Score: 92
- "Summer Roadtrip" — June 2025, 30s ad, POP Score: 78

Moment Feed (pre-populated):
- "Sunny weekend forecast for Leinster" — Weather trigger, POP: 85
- "March bank holiday Monday" — Seasonal trigger, POP: 72
- "New 262 plates launching July" — Industry trigger, POP: 94
- "Dublin traffic congestion M50" — Traffic trigger, POP: 65
- "Ashbourne local GAA final" — Sport trigger, POP: 58
```

---

### 5. COMPONENT STRUCTURE

```
src/
├── app/
│   └── dashboard/
│       ├── station/
│       │   └── [slug]/
│       │       ├── page.tsx (station view with brand filtering)
│       │       └── brand/
│       │           └── [brandSlug]/
│       │               ├── page.tsx (brand workspace — redirects to radio tab)
│       │               ├── radio/
│       │               │   └── page.tsx
│       │               └── social/
│       │                   └── page.tsx
├── components/
│   ├── brand/
│   │   ├── BrandWorkspace.tsx (tab container: Radio | Social)
│   │   ├── BrandOverview.tsx
│   │   ├── BrandCard.tsx (for station grid view)
│   │   ├── BrandFilter.tsx (search + sector + status filters)
│   │   └── CampaignHistory.tsx
│   ├── radio/
│   │   ├── RadioAdGenerator.tsx (main app)
│   │   ├── AudioBrandKitEditor.tsx
│   │   ├── ScriptEditor.tsx
│   │   ├── AudioPreview.tsx (waveform player)
│   │   ├── AdLibrary.tsx
│   │   └── ProductionTimeline.tsx
│   ├── social/
│   │   ├── SocialStudioApp.tsx (main Social Studio app)
│   │   ├── MomentMarketingApp.tsx (MME moment feed + generation)
│   │   ├── ProductionComposerApp.tsx (video production)
│   │   ├── MomentCard.tsx
│   │   ├── ContentPreview.tsx
│   │   └── PipelineStatus.tsx
│   └── agents/
│       ├── AgentHierarchy.tsx (visual org chart)
│       ├── AgentBadge.tsx (shows EP assignment)
│       └── AgentActivity.tsx (activity feed)
├── lib/
│   ├── clients.ts (existing — extend with brands data)
│   ├── agents.ts (agent hierarchy definitions)
│   ├── sectors.ts (sector definitions with colours and icons)
│   └── demo-data.ts (Tadg Riordan Motors full demo data)
```

---

### 6. DESIGN NOTES

- All apps should match the dark green-accented theme (humaintech.ai palette)
- Radio area should feel like a professional broadcast production tool
- Social area should feel like a modern content creation platform
- Use lucide-react icons throughout
- Framer Motion transitions between sections
- Responsive — works on desktop and tablet (mobile can be simplified)
- Each app should have a clear header showing: Brand name > App name > Current state
- Use tabs (not separate pages) for Radio/Social split within a brand
- Mock all API calls — show the UI and workflow, with realistic placeholder responses
- Agent badges should appear in the top-right of each app showing which agents are active

### 7. SECTOR COLOUR PALETTE

Each sector should have a distinct colour for badges and accents:
- Motoring: #3B82F6 (blue)
- Hospitality: #F59E0B (amber)
- Retail: #8B5CF6 (purple)
- Financial: #10B981 (emerald)
- Tourism: #F97316 (orange)
- Property: #EC4899 (pink)
- Education: #06B6D4 (cyan)
- Health: #EF4444 (red)
- Professional: #6366F1 (indigo)
- General: #64748B (slate)

### After implementing:
- Run `npm run build` to verify no errors
- Navigate the full path: Login → Dashboard → Sunshine Radio → Motoring sector → Tadg Riordan Motors → Radio tab → Social tab
- Verify all apps render with placeholder content
- Check agent badges appear correctly
- Test brand filtering (search + sector filter)
