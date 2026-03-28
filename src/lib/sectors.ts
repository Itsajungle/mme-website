import {
  Car,
  UtensilsCrossed,
  ShoppingBag,
  Landmark,
  Palmtree,
  Home,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SectorDefinition {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  examples: string[];
}

export const SECTORS: SectorDefinition[] = [
  {
    id: "motoring",
    name: "Motoring",
    color: "#3B82F6",
    icon: Car,
    examples: ["Car dealers", "Garages", "Tyre shops", "Vehicle finance"],
  },
  {
    id: "hospitality",
    name: "Hospitality",
    color: "#F59E0B",
    icon: UtensilsCrossed,
    examples: ["Restaurants", "Pubs", "Hotels", "Cafes", "Takeaways"],
  },
  {
    id: "retail",
    name: "Retail",
    color: "#8B5CF6",
    icon: ShoppingBag,
    examples: ["Shops", "Department stores", "Garden centres", "Furniture"],
  },
  {
    id: "financial",
    name: "Financial Services",
    color: "#10B981",
    icon: Landmark,
    examples: ["Mortgages", "Insurance", "Accounting", "Financial advisers"],
  },
  {
    id: "tourism",
    name: "Tourism & Leisure",
    color: "#F97316",
    icon: Palmtree,
    examples: ["Attractions", "Tours", "Holiday parks", "Cinemas", "Gyms"],
  },
  {
    id: "property",
    name: "Property",
    color: "#EC4899",
    icon: Home,
    examples: ["Estate agents", "Lettings", "Property developers"],
  },
  {
    id: "education",
    name: "Education & Training",
    color: "#06B6D4",
    icon: GraduationCap,
    examples: ["Colleges", "Courses", "Driving schools", "Tutors"],
  },
  {
    id: "health",
    name: "Health & Wellbeing",
    color: "#EF4444",
    icon: HeartPulse,
    examples: ["Pharmacies", "Dentists", "Opticians", "Clinics", "Wellness"],
  },
  {
    id: "professional",
    name: "Professional Services",
    color: "#6366F1",
    icon: Briefcase,
    examples: ["Solicitors", "Recruitment", "IT services", "Trades"],
  },
  {
    id: "general",
    name: "General",
    color: "#64748B",
    icon: Layers,
    examples: ["Catch-all for anything not covered above"],
  },
];

export function getSectorByName(name: string): SectorDefinition | undefined {
  return SECTORS.find(
    (s) => s.name.toLowerCase() === name.toLowerCase() || s.id === name.toLowerCase()
  );
}

export function getSectorColor(name: string): string {
  return getSectorByName(name)?.color ?? "#64748B";
}
