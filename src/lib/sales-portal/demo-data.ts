// ── Mock data for Sales Portal demo ────────────────────────────

export type Temperature = "hot" | "warm" | "cool" | "landed";

export type PipelineStageId =
  | "first-contact"
  | "discovery-call"
  | "demo-booked"
  | "proposal-sent"
  | "negotiating"
  | "closed";

export interface PipelineStage {
  id: PipelineStageId;
  label: string;
  icon: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "first-contact", label: "First Contact", icon: "📋" },
  { id: "discovery-call", label: "Discovery Call", icon: "💬" },
  { id: "demo-booked", label: "Demo Booked", icon: "🎯" },
  { id: "proposal-sent", label: "Proposal Sent", icon: "⚡" },
  { id: "negotiating", label: "Negotiating", icon: "🔥" },
  { id: "closed", label: "CLOSED!", icon: "🥅" },
];

export interface CampaignRecord {
  name: string;
  date: string;
  spend: number;
}

export interface MockClient {
  id: string;
  name: string;
  sector: string;
  annualValue: number;
  temperature: Temperature;
  assignedRep: string;
  pipelineStage: PipelineStageId;
  lastContact: string;
  nextAction: string;
  campaignHistory: CampaignRecord[];
  daysInStage: number;
}

export const MOCK_CLIENTS: MockClient[] = [
  {
    id: "client-01",
    name: "Tadg Riordan Motors",
    sector: "Automotive",
    annualValue: 12000,
    temperature: "hot",
    assignedRep: "rep-ciara-murphy",
    pipelineStage: "negotiating",
    lastContact: "2026-03-27",
    nextAction: "Final contract review — Thursday",
    daysInStage: 4,
    campaignHistory: [
      { name: "Spring Sale 2026", date: "2026-02-15", spend: 3200 },
      { name: "New 242 Launch", date: "2025-07-01", spend: 4800 },
    ],
  },
  {
    id: "client-02",
    name: "Murphy's Pub Ashbourne",
    sector: "Hospitality",
    annualValue: 3600,
    temperature: "warm",
    assignedRep: "rep-aoife-kelly",
    pipelineStage: "proposal-sent",
    lastContact: "2026-03-25",
    nextAction: "Follow up on package renewal quote",
    daysInStage: 6,
    campaignHistory: [
      { name: "Live Music Fridays", date: "2026-01-10", spend: 900 },
    ],
  },
  {
    id: "client-03",
    name: "Ashbourne Dental Care",
    sector: "Health & Wellness",
    annualValue: 2400,
    temperature: "cool",
    assignedRep: "rep-declan-obrien",
    pipelineStage: "discovery-call",
    lastContact: "2026-03-24",
    nextAction: "Send rate card & demo link",
    daysInStage: 8,
    campaignHistory: [],
  },
  {
    id: "client-04",
    name: "Meath County Hotel",
    sector: "Hospitality",
    annualValue: 6000,
    temperature: "warm",
    assignedRep: "rep-ciara-murphy",
    pipelineStage: "demo-booked",
    lastContact: "2026-03-26",
    nextAction: "Demo call — Wednesday 2pm",
    daysInStage: 3,
    campaignHistory: [
      { name: "Wedding Season 2025", date: "2025-05-01", spend: 2400 },
    ],
  },
  {
    id: "client-05",
    name: "Dunboyne Castle Hotel",
    sector: "Hospitality",
    annualValue: 8000,
    temperature: "hot",
    assignedRep: "rep-ciara-murphy",
    pipelineStage: "closed",
    lastContact: "2026-03-20",
    nextAction: "Invoice sent — awaiting PO",
    daysInStage: 0,
    campaignHistory: [
      { name: "Christmas Party Packages", date: "2025-11-15", spend: 3600 },
      { name: "Spa Weekend Promo", date: "2026-01-20", spend: 2000 },
    ],
  },
  {
    id: "client-06",
    name: "Fairyhouse Racecourse",
    sector: "Entertainment",
    annualValue: 4800,
    temperature: "warm",
    assignedRep: "rep-ciara-murphy",
    pipelineStage: "proposal-sent",
    lastContact: "2026-03-26",
    nextAction: "Spring racing package follow-up",
    daysInStage: 5,
    campaignHistory: [
      { name: "Easter Festival 2025", date: "2025-04-01", spend: 2400 },
    ],
  },
  {
    id: "client-07",
    name: "Trim Castle Tours",
    sector: "Tourism",
    annualValue: 2000,
    temperature: "cool",
    assignedRep: "rep-ronan-walsh",
    pipelineStage: "first-contact",
    lastContact: "2026-03-28",
    nextAction: "Initial intro email sent",
    daysInStage: 2,
    campaignHistory: [],
  },
  {
    id: "client-08",
    name: "Navan Shopping Centre",
    sector: "Retail",
    annualValue: 5000,
    temperature: "hot",
    assignedRep: "rep-declan-obrien",
    pipelineStage: "negotiating",
    lastContact: "2026-03-27",
    nextAction: "Summer campaign brief sign-off",
    daysInStage: 3,
    campaignHistory: [
      { name: "Back to School 2025", date: "2025-08-20", spend: 2000 },
      { name: "Black Friday 2025", date: "2025-11-25", spend: 1800 },
    ],
  },
  {
    id: "client-09",
    name: "Ratoath Credit Union",
    sector: "Financial Services",
    annualValue: 3000,
    temperature: "warm",
    assignedRep: "rep-declan-obrien",
    pipelineStage: "demo-booked",
    lastContact: "2026-03-25",
    nextAction: "MME platform demo — next week",
    daysInStage: 5,
    campaignHistory: [
      { name: "Savings Week 2025", date: "2025-10-01", spend: 1200 },
    ],
  },
  {
    id: "client-10",
    name: "Dunshaughlin Motors",
    sector: "Automotive",
    annualValue: 4000,
    temperature: "cool",
    assignedRep: "rep-aoife-kelly",
    pipelineStage: "discovery-call",
    lastContact: "2026-03-22",
    nextAction: "Schedule needs assessment call",
    daysInStage: 10,
    campaignHistory: [],
  },
  {
    id: "client-11",
    name: "Ashbourne Retail Park",
    sector: "Retail",
    annualValue: 6000,
    temperature: "hot",
    assignedRep: "rep-ciara-murphy",
    pipelineStage: "closed",
    lastContact: "2026-03-18",
    nextAction: "Campaign live — Q2 review in May",
    daysInStage: 0,
    campaignHistory: [
      { name: "Grand Opening 2025", date: "2025-03-01", spend: 4000 },
      { name: "Summer Sales 2025", date: "2025-06-15", spend: 2800 },
    ],
  },
  {
    id: "client-12",
    name: "Pillo Hotel Ashbourne",
    sector: "Hospitality",
    annualValue: 4200,
    temperature: "warm",
    assignedRep: "rep-declan-obrien",
    pipelineStage: "proposal-sent",
    lastContact: "2026-03-24",
    nextAction: "Awaiting GM approval on quote",
    daysInStage: 7,
    campaignHistory: [
      { name: "Midweek Breaks", date: "2025-09-01", spend: 1800 },
    ],
  },
  {
    id: "client-13",
    name: "Killeen Castle Golf",
    sector: "Entertainment",
    annualValue: 3600,
    temperature: "cool",
    assignedRep: "rep-ronan-walsh",
    pipelineStage: "first-contact",
    lastContact: "2026-03-27",
    nextAction: "Cold call follow-up",
    daysInStage: 3,
    campaignHistory: [],
  },
  {
    id: "client-14",
    name: "O'Brien's Off-Licence",
    sector: "Retail",
    annualValue: 2400,
    temperature: "warm",
    assignedRep: "rep-aoife-kelly",
    pipelineStage: "demo-booked",
    lastContact: "2026-03-26",
    nextAction: "Demo booked — Friday 11am",
    daysInStage: 4,
    campaignHistory: [
      { name: "Christmas Hampers 2025", date: "2025-12-01", spend: 800 },
    ],
  },
  {
    id: "client-15",
    name: "South County Motors",
    sector: "Automotive",
    annualValue: 5000,
    temperature: "hot",
    assignedRep: "rep-ciara-murphy",
    pipelineStage: "closed",
    lastContact: "2026-03-15",
    nextAction: "Q2 renewal call scheduled",
    daysInStage: 0,
    campaignHistory: [
      { name: "January Clearance", date: "2026-01-05", spend: 2200 },
      { name: "Spring Launch 2026", date: "2026-03-01", spend: 2800 },
    ],
  },
];

// ── Sales Reps (updated for Sunshine 106.8 demo) ─────────────

export interface SalesRep {
  id: string;
  name: string;
  initials: string;
  role: string;
  sectorFocus: string;
  avatarColor: string;
  calendarColor: string;
  stats: {
    adsGenerated: number;
    avgScore: number;
    topAdvertiser: string;
    conversionRate: number;
    callsThisWeek: number;
    demosBooked: number;
    dealsClosedThisMonth: number;
    pipelineTotal: number;
    activeLeads: number;
    target: number;
    achieved: number;
  };
}

export const SALES_REPS: SalesRep[] = [
  {
    id: "rep-ciara-murphy",
    name: "Ciara Murphy",
    initials: "CM",
    role: "Senior Account Executive",
    sectorFocus: "Automotive & Hospitality",
    avatarColor: "bg-emerald-500",
    calendarColor: "#00FF96",
    stats: {
      adsGenerated: 47,
      avgScore: 84,
      topAdvertiser: "Tadg Riordan Motors",
      conversionRate: 38,
      callsThisWeek: 14,
      demosBooked: 3,
      dealsClosedThisMonth: 4,
      pipelineTotal: 45000,
      activeLeads: 12,
      target: 50000,
      achieved: 41800,
    },
  },
  {
    id: "rep-declan-obrien",
    name: "Declan O'Brien",
    initials: "DO",
    role: "Account Executive",
    sectorFocus: "Hospitality & Financial",
    avatarColor: "bg-blue-500",
    calendarColor: "#3B82F6",
    stats: {
      adsGenerated: 38,
      avgScore: 78,
      topAdvertiser: "Navan Shopping Centre",
      conversionRate: 28,
      callsThisWeek: 11,
      demosBooked: 2,
      dealsClosedThisMonth: 2,
      pipelineTotal: 28000,
      activeLeads: 8,
      target: 35000,
      achieved: 22400,
    },
  },
  {
    id: "rep-aoife-kelly",
    name: "Aoife Kelly",
    initials: "AK",
    role: "Junior Account Executive",
    sectorFocus: "Retail & Food",
    avatarColor: "bg-purple-500",
    calendarColor: "#A855F7",
    stats: {
      adsGenerated: 22,
      avgScore: 76,
      topAdvertiser: "Murphy's Pub Ashbourne",
      conversionRate: 24,
      callsThisWeek: 8,
      demosBooked: 2,
      dealsClosedThisMonth: 1,
      pipelineTotal: 15000,
      activeLeads: 5,
      target: 20000,
      achieved: 12000,
    },
  },
  {
    id: "rep-ronan-walsh",
    name: "Ronan Walsh",
    initials: "RW",
    role: "New Starter",
    sectorFocus: "Tourism & Entertainment",
    avatarColor: "bg-amber-500",
    calendarColor: "#F59E0B",
    stats: {
      adsGenerated: 8,
      avgScore: 72,
      topAdvertiser: "Trim Castle Tours",
      conversionRate: 18,
      callsThisWeek: 6,
      demosBooked: 1,
      dealsClosedThisMonth: 0,
      pipelineTotal: 8000,
      activeLeads: 3,
      target: 12000,
      achieved: 5600,
    },
  },
];

// ── Calendar Appointments ────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  repId: string;
  repName: string;
  type: "meeting" | "call" | "demo" | "internal";
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "evt-01",
    title: "Neil Fox — Nation Radio intro",
    date: "2026-03-31",
    time: "10:00",
    duration: 60,
    repId: "rep-ciara-murphy",
    repName: "Ciara",
    type: "meeting",
  },
  {
    id: "evt-02",
    title: "Tadg Riordan — Campaign review",
    date: "2026-03-31",
    time: "14:00",
    duration: 45,
    repId: "rep-ciara-murphy",
    repName: "Ciara",
    type: "call",
  },
  {
    id: "evt-03",
    title: "Ashbourne Dental — New brief",
    date: "2026-04-01",
    time: "09:30",
    duration: 30,
    repId: "rep-declan-obrien",
    repName: "Declan",
    type: "call",
  },
  {
    id: "evt-04",
    title: "Sean Ashmore — MME demo",
    date: "2026-04-02",
    time: "11:00",
    duration: 60,
    repId: "rep-ciara-murphy",
    repName: "Ciara",
    type: "demo",
  },
  {
    id: "evt-05",
    title: "Murphy's Pub — Package renewal",
    date: "2026-04-02",
    time: "15:00",
    duration: 30,
    repId: "rep-aoife-kelly",
    repName: "Aoife",
    type: "call",
  },
  {
    id: "evt-06",
    title: "Navan Shopping Centre — Summer campaign",
    date: "2026-04-03",
    time: "10:00",
    duration: 60,
    repId: "rep-declan-obrien",
    repName: "Declan",
    type: "meeting",
  },
  {
    id: "evt-07",
    title: "Dunboyne Castle — Event promo",
    date: "2026-04-03",
    time: "14:00",
    duration: 45,
    repId: "rep-ronan-walsh",
    repName: "Ronan",
    type: "meeting",
  },
  {
    id: "evt-08",
    title: "Fairyhouse — Spring racing",
    date: "2026-04-04",
    time: "11:00",
    duration: 60,
    repId: "rep-ciara-murphy",
    repName: "Ciara",
    type: "call",
  },
  {
    id: "evt-09",
    title: "Team — Weekly pipeline review",
    date: "2026-04-04",
    time: "15:00",
    duration: 60,
    repId: "all",
    repName: "All",
    type: "internal",
  },
];

// Helper: get rep colour for calendar
export function getRepCalendarColor(repId: string): string {
  return SALES_REPS.find((r) => r.id === repId)?.calendarColor ?? "#64748B";
}
