export type StationStatus = "pilot-active" | "onboarding" | "coming-soon";

export interface Station {
  slug: string;
  name: string;
  frequency?: string;
  broadcastArea: string;
  sectors: string[];
  status: StationStatus;
  group?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  password: string;
  contact: string;
  contactRole: string;
  phase: string;
  stations: Station[];
}

export const CLIENTS: Client[] = [
  {
    id: "star-broadcasting",
    name: "Star Broadcasting Ltd",
    email: "demo@starbroadcasting.com",
    password: "demo2026",
    contact: "Sean Ashmore",
    contactRole: "Sunshine Radio pilot",
    phase: "Pilot phase — Sunshine Radio active, others onboarding",
    stations: [
      {
        slug: "sunshine-radio",
        name: "Sunshine Radio",
        frequency: "106.8 FM",
        broadcastArea: "Herefordshire & Worcestershire",
        sectors: ["Motoring", "Hospitality", "Financial", "Retail", "Health & Fitness"],
        status: "pilot-active",
      },
      {
        slug: "classic-hits-fm",
        name: "Classic Hits FM",
        frequency: "98.9 FM",
        broadcastArea: "South East Ireland",
        sectors: ["Motoring", "Hospitality", "Retail", "Agriculture", "Tourism"],
        status: "onboarding",
      },
      {
        slug: "east-coast-fm",
        name: "East Coast FM",
        frequency: "94.9-96.2 FM",
        broadcastArea: "Co. Wicklow",
        sectors: ["Motoring", "Retail", "Property", "Hospitality", "Tourism"],
        status: "onboarding",
      },
      {
        slug: "galway-bay-fm",
        name: "Galway Bay FM",
        frequency: "95.8 FM",
        broadcastArea: "Galway City & County",
        sectors: ["Motoring", "Hospitality", "Tourism", "Retail", "Education"],
        status: "onboarding",
      },
    ],
  },
  {
    id: "nation-broadcasting",
    name: "Nation Broadcasting Ltd",
    email: "demo@nationradio.com",
    password: "demo2026",
    contact: "Jason Bryant",
    contactRole: "Radio Industry Executive",
    phase: "Network opportunity — commercial discussion phase",
    stations: [
      // NATIONAL & REGIONAL
      {
        slug: "nation-radio-uk",
        name: "Nation Radio UK",
        frequency: "National DAB & Online",
        broadcastArea: "United Kingdom",
        sectors: ["Motoring", "Retail", "Financial", "Entertainment", "Travel"],
        status: "coming-soon",
        group: "National & Regional",
      },
      {
        slug: "nation-radio-wales",
        name: "Nation Radio Wales",
        frequency: "106.8 FM",
        broadcastArea: "South & West Wales",
        sectors: ["Motoring", "Retail", "Hospitality", "Tourism", "Agriculture"],
        status: "coming-soon",
        group: "National & Regional",
      },
      {
        slug: "nation-radio-north-wales",
        name: "Nation Radio North Wales",
        frequency: "DAB+",
        broadcastArea: "North Wales",
        sectors: ["Motoring", "Tourism", "Retail", "Agriculture", "Education"],
        status: "coming-soon",
        group: "National & Regional",
      },
      {
        slug: "nation-radio-scotland",
        name: "Nation Radio Scotland",
        frequency: "DAB & Online",
        broadcastArea: "National Scotland",
        sectors: ["Motoring", "Retail", "Financial", "Tourism", "Entertainment"],
        status: "coming-soon",
        group: "National & Regional",
      },
      // LOCAL FM — WALES
      {
        slug: "bridge-fm",
        name: "Bridge FM",
        frequency: "106.3 FM",
        broadcastArea: "Bridgend & Vale of Glamorgan",
        sectors: ["Motoring", "Retail", "Hospitality", "Property", "Health & Fitness"],
        status: "coming-soon",
        group: "Local FM — Wales",
      },
      {
        slug: "radio-pembrokeshire",
        name: "Radio Pembrokeshire",
        frequency: "102.5 FM",
        broadcastArea: "Pembrokeshire",
        sectors: ["Tourism", "Agriculture", "Retail", "Hospitality", "Motoring"],
        status: "coming-soon",
        group: "Local FM — Wales",
      },
      {
        slug: "radio-carmarthenshire",
        name: "Radio Carmarthenshire",
        frequency: "97.1 FM",
        broadcastArea: "Carmarthenshire",
        sectors: ["Agriculture", "Retail", "Tourism", "Motoring", "Education"],
        status: "coming-soon",
        group: "Local FM — Wales",
      },
      {
        slug: "swansea-bay-radio",
        name: "Swansea Bay Radio",
        frequency: "102.1 FM",
        broadcastArea: "Swansea & Neath Port Talbot",
        sectors: ["Motoring", "Retail", "Hospitality", "Entertainment", "Health & Fitness"],
        status: "coming-soon",
        group: "Local FM — Wales",
      },
      {
        slug: "dragon-radio",
        name: "Dragon Radio",
        broadcastArea: "Carmarthenshire / Pembrokeshire",
        sectors: ["Tourism", "Retail", "Agriculture", "Hospitality", "Motoring"],
        status: "coming-soon",
        group: "Local FM — Wales",
      },
      // LOCAL FM — ENGLAND
      {
        slug: "nation-radio-north-east",
        name: "Nation Radio North East",
        frequency: "103.4 FM",
        broadcastArea: "Sunderland & Wearside",
        sectors: ["Motoring", "Retail", "Hospitality", "Entertainment", "Financial"],
        status: "coming-soon",
        group: "Local FM — England",
      },
      {
        slug: "nation-radio-suffolk",
        name: "Nation Radio Suffolk",
        frequency: "102 FM",
        broadcastArea: "Ipswich & Suffolk",
        sectors: ["Motoring", "Retail", "Agriculture", "Property", "Tourism"],
        status: "coming-soon",
        group: "Local FM — England",
      },
      {
        slug: "nation-radio-south",
        name: "Nation Radio South",
        broadcastArea: "South Coast",
        sectors: ["Tourism", "Retail", "Motoring", "Hospitality", "Property"],
        status: "coming-soon",
        group: "Local FM — England",
      },
      {
        slug: "nation-radio-yorkshire",
        name: "Nation Radio Yorkshire",
        frequency: "DAB",
        broadcastArea: "Yorkshire",
        sectors: ["Motoring", "Retail", "Hospitality", "Entertainment", "Financial"],
        status: "coming-soon",
        group: "Local FM — England",
      },
      // DIGITAL THEMATIC
      {
        slug: "nation-radio-70s",
        name: "Nation Radio 70s",
        frequency: "DAB+ & Online",
        broadcastArea: "National",
        sectors: ["Retail", "Entertainment", "Nostalgia", "Motoring", "Financial"],
        status: "coming-soon",
        group: "Digital Thematic",
      },
      {
        slug: "nation-radio-80s",
        name: "Nation Radio 80s",
        frequency: "DAB+ & Online",
        broadcastArea: "National",
        sectors: ["Retail", "Entertainment", "Nostalgia", "Motoring", "Financial"],
        status: "coming-soon",
        group: "Digital Thematic",
      },
      {
        slug: "nation-radio-90s",
        name: "Nation Radio 90s",
        frequency: "DAB+ & Online",
        broadcastArea: "National",
        sectors: ["Retail", "Entertainment", "Nostalgia", "Motoring", "Financial"],
        status: "coming-soon",
        group: "Digital Thematic",
      },
      {
        slug: "nation-love-radio",
        name: "Nation Love Radio",
        frequency: "DAB+ & Online",
        broadcastArea: "National",
        sectors: ["Retail", "Entertainment", "Hospitality", "Health & Fitness", "Financial"],
        status: "coming-soon",
        group: "Digital Thematic",
      },
      {
        slug: "nation-dance-radio",
        name: "Nation Dance Radio",
        frequency: "DAB+ & Online",
        broadcastArea: "National",
        sectors: ["Entertainment", "Retail", "Hospitality", "Health & Fitness", "Events"],
        status: "coming-soon",
        group: "Digital Thematic",
      },
    ],
  },
];

export function getClientByEmail(email: string): Client | undefined {
  return CLIENTS.find((c) => c.email === email);
}

export function getClientById(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function getStationBySlug(clientId: string, slug: string): Station | undefined {
  const client = getClientById(clientId);
  return client?.stations.find((s) => s.slug === slug);
}

export function getStationGroups(stations: Station[]): Record<string, Station[]> {
  const groups: Record<string, Station[]> = {};
  for (const station of stations) {
    const group = station.group || "Stations";
    if (!groups[group]) groups[group] = [];
    groups[group].push(station);
  }
  return groups;
}

export const STATUS_CONFIG: Record<StationStatus, { label: string; color: string; glow: boolean }> = {
  "pilot-active": { label: "Pilot Active", color: "text-accent", glow: true },
  onboarding: { label: "Onboarding", color: "text-amber-400", glow: false },
  "coming-soon": { label: "Coming Soon", color: "text-text-muted", glow: false },
};
