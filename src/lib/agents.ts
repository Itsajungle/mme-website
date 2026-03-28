export interface AgentTier1 {
  id: string;
  name: string;
  role: string;
  description: string;
  tier: 1;
}

export interface AgentTier2 {
  id: string;
  name: string;
  sectorId: string;
  role: string;
  description: string;
  tier: 2;
}

export interface AgentTier3 {
  id: string;
  name: string;
  brandSlug: string;
  role: string;
  description: string;
  tier: 3;
  epAgentId: string;
}

export type Agent = AgentTier1 | AgentTier2 | AgentTier3;

export const COMPROD_DIRECTOR: AgentTier1 = {
  id: "comprod-director",
  name: "ComProd Director",
  role: "Master Creative Intelligence",
  description:
    "Oversees all content quality, enforces the 4 Elements of radio copywriting. Scores and critiques every AI-generated radio ad before it goes to air. Sets brand voice consistency standards across all sectors.",
  tier: 1,
};

export const EXECUTIVE_PRODUCERS: AgentTier2[] = [
  {
    id: "ep-motoring",
    name: "Motoring EP",
    sectorId: "motoring",
    role: "Motoring Executive Producer",
    description:
      "Deep knowledge of motoring audience, buying behaviour, seasonal patterns (new plate months, bank holidays), and creative conventions for car dealers, garages, and vehicle finance.",
    tier: 2,
  },
  {
    id: "ep-hospitality",
    name: "Hospitality EP",
    sectorId: "hospitality",
    role: "Hospitality Executive Producer",
    description:
      "Specialist in restaurant, pub, hotel, and cafe advertising. Understands seasonal dining patterns, event-driven promotions, and food-driven creative.",
    tier: 2,
  },
  {
    id: "ep-retail",
    name: "Retail EP",
    sectorId: "retail",
    role: "Retail Executive Producer",
    description:
      "Expert in retail advertising for shops, department stores, garden centres, and furniture. Understands sale cycles, footfall patterns, and promotional urgency.",
    tier: 2,
  },
  {
    id: "ep-financial",
    name: "Financial Services EP",
    sectorId: "financial",
    role: "Financial Services Executive Producer",
    description:
      "Specialist in financial services advertising including mortgages, insurance, accounting. Navigates compliance requirements and trust-building creative.",
    tier: 2,
  },
  {
    id: "ep-tourism",
    name: "Tourism & Leisure EP",
    sectorId: "tourism",
    role: "Tourism & Leisure Executive Producer",
    description:
      "Expert in attractions, tours, holiday parks, cinemas, and gyms. Understands seasonal tourism peaks and experience-driven storytelling.",
    tier: 2,
  },
  {
    id: "ep-property",
    name: "Property EP",
    sectorId: "property",
    role: "Property Executive Producer",
    description:
      "Specialist in estate agents, lettings, and property developers. Understands housing market cycles and location-driven creative.",
    tier: 2,
  },
  {
    id: "ep-education",
    name: "Education EP",
    sectorId: "education",
    role: "Education & Training Executive Producer",
    description:
      "Expert in colleges, courses, driving schools, and tutors. Understands enrolment cycles and aspiration-driven messaging.",
    tier: 2,
  },
  {
    id: "ep-health",
    name: "Health & Wellbeing EP",
    sectorId: "health",
    role: "Health & Wellbeing Executive Producer",
    description:
      "Specialist in pharmacies, dentists, opticians, clinics, and wellness. Balances health messaging with approachable creative.",
    tier: 2,
  },
  {
    id: "ep-professional",
    name: "Professional Services EP",
    sectorId: "professional",
    role: "Professional Services Executive Producer",
    description:
      "Expert in solicitors, recruitment, IT services, and trades. Understands B2B and professional trust-building messaging.",
    tier: 2,
  },
  {
    id: "ep-general",
    name: "General EP",
    sectorId: "general",
    role: "General Executive Producer",
    description:
      "Catch-all EP for brands that don't fit neatly into other sectors. Maintains high creative standards with clear guidelines.",
    tier: 2,
  },
];

export function getEPBySector(sectorId: string): AgentTier2 | undefined {
  return EXECUTIVE_PRODUCERS.find((ep) => ep.sectorId === sectorId);
}

export function getEPBySectorName(sectorName: string): AgentTier2 | undefined {
  const normalized = sectorName.toLowerCase();
  return EXECUTIVE_PRODUCERS.find(
    (ep) =>
      ep.sectorId === normalized ||
      ep.role.toLowerCase().includes(normalized)
  );
}
