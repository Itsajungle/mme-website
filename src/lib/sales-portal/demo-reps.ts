export interface DemoRep {
  id: string;
  name: string;
  initials: string;
  role: string;
  sectorFocus: string;
  avatarColor: string;
  stats: {
    adsGenerated: number;
    avgScore: number;
    topAdvertiser: string;
    conversionRate: number;
  };
}

export const DEMO_REPS: DemoRep[] = [
  {
    id: "rep-sarah-murphy",
    name: "Sarah Murphy",
    initials: "SM",
    role: "Senior Account Executive",
    sectorFocus: "Automotive & Transport",
    avatarColor: "bg-emerald-500",
    stats: { adsGenerated: 47, avgScore: 82, topAdvertiser: "Riordan Motors", conversionRate: 34 },
  },
  {
    id: "rep-declan-obrien",
    name: "Declan O'Brien",
    initials: "DO",
    role: "Account Executive",
    sectorFocus: "Hospitality & Tourism",
    avatarColor: "bg-blue-500",
    stats: { adsGenerated: 38, avgScore: 78, topAdvertiser: "Wicklow Adventure Tours", conversionRate: 28 },
  },
  {
    id: "rep-aoife-brennan",
    name: "Aoife Brennan",
    initials: "AB",
    role: "Senior Account Executive",
    sectorFocus: "Retail & Fashion",
    avatarColor: "bg-purple-500",
    stats: { adsGenerated: 52, avgScore: 85, topAdvertiser: "Grafton Quarter", conversionRate: 37 },
  },
  {
    id: "rep-ciaran-walsh",
    name: "Ciarán Walsh",
    initials: "CW",
    role: "Account Executive",
    sectorFocus: "Financial Services",
    avatarColor: "bg-amber-500",
    stats: { adsGenerated: 29, avgScore: 74, topAdvertiser: "Dublin Credit Union", conversionRate: 22 },
  },
  {
    id: "rep-niamh-kelly",
    name: "Niamh Kelly",
    initials: "NK",
    role: "Account Manager",
    sectorFocus: "Food & Drink",
    avatarColor: "bg-pink-500",
    stats: { adsGenerated: 41, avgScore: 80, topAdvertiser: "Temple Bar Brewing Co", conversionRate: 31 },
  },
  {
    id: "rep-oisin-doyle",
    name: "Oisín Doyle",
    initials: "OD",
    role: "Junior Account Executive",
    sectorFocus: "Property & Education",
    avatarColor: "bg-cyan-500",
    stats: { adsGenerated: 18, avgScore: 71, topAdvertiser: "Ballsbridge Estates", conversionRate: 19 },
  },
  {
    id: "rep-siobhan-gallagher",
    name: "Siobhán Gallagher",
    initials: "SG",
    role: "Senior Account Manager",
    sectorFocus: "Health & Wellness",
    avatarColor: "bg-rose-500",
    stats: { adsGenerated: 44, avgScore: 83, topAdvertiser: "Vhi Health", conversionRate: 33 },
  },
  {
    id: "rep-ronan-fitzgerald",
    name: "Ronan Fitzgerald",
    initials: "RF",
    role: "Account Executive",
    sectorFocus: "Entertainment & Tech",
    avatarColor: "bg-indigo-500",
    stats: { adsGenerated: 35, avgScore: 77, topAdvertiser: "3Arena Events", conversionRate: 26 },
  },
];
