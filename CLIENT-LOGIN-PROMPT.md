# Client Login & Station Hierarchy Prompt for Claude Code

> Paste the section below the line into Claude Code.

---

## ADD CLIENT LOGIN AREA WITH STATION HIERARCHIES

Add a client login system and a protected client dashboard area to the MME website. This is a demo/prototype — authentication should use simple local state (no backend auth yet), but the UI and data structure should match the real MME station hierarchy model.

### 1. Login Page — `/login`

Create a login page at `/login` with:
- Email + password form (styled to match the existing dark/green theme)
- "Remember me" checkbox
- "Forgot password?" link (non-functional, just styled)
- MME logo at top
- Demo credentials shown in a subtle info box below the form:
  - `demo@starbroadcasting.com` / `demo2026`
  - `demo@nationradio.com` / `demo2026`

Use React context or a simple auth provider with local state to manage login. Store the logged-in client ID in state. Protect the `/dashboard` routes so they redirect to `/login` if not authenticated.

### 2. Client Dashboard — `/dashboard`

After login, show a client dashboard that displays the station hierarchy for that client. The dashboard should have:
- Left sidebar with client logo/name, nav links (Dashboard, Stations, Campaigns, Audio Brand Kits, Analytics, Settings)
- Main content area showing the station overview
- Top bar with client name, "Log out" button
- Use the existing dark theme but the sidebar should be slightly lighter (`--bg-card` / #0F1528)

### 3. Station Hierarchy Data

Create the following client data in a new file `src/lib/clients.ts`:

#### Client 1: Star Broadcasting Ltd

```
Star Broadcasting Ltd
├── Sunshine Radio (Herefordshire & Worcestershire, 106.8 FM)
│   └── Sectors: Motoring, Hospitality, Financial, Retail, Health & Fitness
├── Classic Hits FM (South East Ireland, 98.9 FM)
│   └── Sectors: Motoring, Hospitality, Retail, Agriculture, Tourism
├── East Coast FM (Co. Wicklow, 94.9-96.2 FM)
│   └── Sectors: Motoring, Retail, Property, Hospitality, Tourism
└── Galway Bay FM (Galway City & County, 95.8 FM)
    └── Sectors: Motoring, Hospitality, Tourism, Retail, Education
```

Contact: Sean Ashmore (Sunshine Radio pilot)
Status: Pilot phase — Sunshine Radio active, others onboarding

#### Client 2: Nation Broadcasting Ltd

```
Nation Broadcasting Ltd
├── NATIONAL & REGIONAL
│   ├── Nation Radio UK (National DAB & Online)
│   ├── Nation Radio Wales (South & West Wales, 106.8 FM)
│   ├── Nation Radio North Wales (DAB+)
│   └── Nation Radio Scotland (National Scotland, DAB & Online)
├── LOCAL FM STATIONS — WALES
│   ├── Bridge FM (Bridgend & Vale of Glamorgan, 106.3 FM)
│   ├── Radio Pembrokeshire (Pembrokeshire, 102.5 FM)
│   ├── Radio Carmarthenshire (Carmarthenshire, 97.1 FM)
│   ├── Swansea Bay Radio (Swansea & Neath Port Talbot, 102.1 FM)
│   └── Dragon Radio (Carmarthenshire/Pembrokeshire)
├── LOCAL FM STATIONS — ENGLAND
│   ├── Nation Radio North East (Sunderland & Wearside, 103.4 FM — formerly Sun FM)
│   ├── Nation Radio Suffolk (Ipswich & Suffolk, 102 FM)
│   ├── Nation Radio South (South Coast)
│   └── Nation Radio Yorkshire (Yorkshire, DAB)
└── DIGITAL THEMATIC SERVICES
    ├── Nation Radio 70s (DAB+ & Online)
    ├── Nation Radio 80s (DAB+ & Online)
    ├── Nation Radio 90s (DAB+ & Online)
    ├── Nation Love Radio (DAB+ & Online)
    └── Nation Dance Radio (DAB+ & Online)
```

Contact: Jason Bryant
Status: Network opportunity — commercial discussion phase

### 4. Station Detail View

When a user clicks a station in the dashboard, show a station detail page at `/dashboard/station/[slug]` with:
- Station name, frequency, broadcast area
- Sector list (each sector expandable)
- "Brands" section (placeholder cards showing "No brands added yet — add your first advertiser")
- "Audio Brand Kits" section (placeholder)
- "Active Campaigns" section (placeholder showing "No active campaigns")
- "Moment Feed" section (placeholder showing recent simulated moment triggers like "Sunny weekend forecast", "Local sports result")
- A status badge showing "Pilot Active" (Sunshine), "Onboarding", or "Coming Soon" depending on the station

### 5. Navigation Updates

- Add a "Client Login" button to the main site Header (top right, outlined green button)
- The login button should link to `/login`
- When logged in, the button should change to "Dashboard" and link to `/dashboard`

### 6. Component Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   └── dashboard/
│       ├── layout.tsx (sidebar + top bar)
│       ├── page.tsx (overview)
│       └── station/
│           └── [slug]/
│               └── page.tsx (station detail)
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   └── dashboard/
│       ├── DashboardSidebar.tsx
│       ├── StationCard.tsx
│       ├── StationDetail.tsx
│       ├── SectorList.tsx
│       └── MomentFeed.tsx
└── lib/
    └── clients.ts (all client + station data)
```

### 7. Design Notes

- The dashboard should feel like a premium SaaS tool — clean, dark, data-focused
- Use lucide-react icons throughout (Radio, Building2, BarChart3, Music, Settings, LogOut, ChevronRight, etc.)
- Station cards should show: station name, frequency, broadcast area, number of sectors, status badge
- Green glow on active/pilot stations, muted for "Coming Soon"
- Framer Motion page transitions matching the rest of the site
- Mobile responsive — sidebar collapses to hamburger menu on mobile

### After implementing:
- Run `npm run build` to verify no errors
- Test both login credentials work
- Navigate through station hierarchy for both clients
- Check that logging out returns to the marketing site
