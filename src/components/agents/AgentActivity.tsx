"use client";

import { motion } from "framer-motion";
import { Crown, Users, Bot, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  agentName: string;
  agentTier: 1 | 2 | 3;
  action: string;
  timestamp: string;
  brandSlug?: string;
}

const SIMULATED_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    agentName: "ComProd Director",
    agentTier: 1,
    action: "Reviewed and scored 3 radio ads across motoring and hospitality",
    timestamp: "2 min ago",
  },
  {
    id: "act-2",
    agentName: "Motoring EP",
    agentTier: 2,
    action: "Generated new 30s script for Tadg Riordan Motors spring campaign",
    timestamp: "8 min ago",
    brandSlug: "tadg-riordan-motors",
  },
  {
    id: "act-3",
    agentName: "Hospitality EP",
    agentTier: 2,
    action: "Optimised weekend brunch promo copy for Halo Bistro",
    timestamp: "14 min ago",
    brandSlug: "halo-bistro",
  },
  {
    id: "act-4",
    agentName: "Tadg Riordan Motors Agent",
    agentTier: 3,
    action: "Updated brand voice profile with new seasonal messaging guidelines",
    timestamp: "22 min ago",
    brandSlug: "tadg-riordan-motors",
  },
  {
    id: "act-5",
    agentName: "Property EP",
    agentTier: 2,
    action: "Drafted 2 new listings-focused ad variants for Greenway Homes",
    timestamp: "31 min ago",
    brandSlug: "greenway-homes",
  },
  {
    id: "act-6",
    agentName: "ComProd Director",
    agentTier: 1,
    action: "Flagged low-scoring ad for Retail EP review — clarity issue",
    timestamp: "45 min ago",
  },
  {
    id: "act-7",
    agentName: "Retail EP",
    agentTier: 2,
    action: "Revised sale event script for Murphy's Furniture to hit quality bar",
    timestamp: "52 min ago",
    brandSlug: "murphys-furniture",
  },
];

function TierIcon({ tier }: { tier: 1 | 2 | 3 }) {
  const config = {
    1: {
      icon: Crown,
      className: "bg-accent/10 text-accent",
    },
    2: {
      icon: Users,
      className: "bg-blue-500/10 text-blue-400",
    },
    3: {
      icon: Bot,
      className: "bg-amber/10 text-amber",
    },
  };
  const { icon: Icon, className } = config[tier];
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

interface AgentActivityProps {
  brandSlug?: string;
}

export default function AgentActivity({ brandSlug }: AgentActivityProps) {
  const filtered = brandSlug
    ? SIMULATED_ACTIVITIES.filter((a) => !a.brandSlug || a.brandSlug === brandSlug)
    : SIMULATED_ACTIVITIES;

  const items = filtered.slice(0, 5);

  return (
    <div className="w-full space-y-1">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
        <Clock className="h-3.5 w-3.5" />
        <span>Recent Agent Activity</span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="group flex items-start gap-3 rounded-xl border border-border bg-bg-card p-3 transition-colors hover:border-border-hover hover:bg-bg-card-hover"
          >
            <TierIcon tier={item.agentTier} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    item.agentTier === 1 && "text-accent",
                    item.agentTier === 2 && "text-blue-400",
                    item.agentTier === 3 && "text-amber"
                  )}
                >
                  {item.agentName}
                </span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider",
                    item.agentTier === 1 &&
                      "bg-accent/10 text-accent",
                    item.agentTier === 2 &&
                      "bg-blue-500/10 text-blue-400",
                    item.agentTier === 3 &&
                      "bg-amber/10 text-amber"
                  )}
                >
                  T{item.agentTier}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                {item.action}
              </p>
            </div>

            <span className="shrink-0 whitespace-nowrap text-[10px] text-text-muted">
              {item.timestamp}
            </span>
          </motion.div>
        ))}
      </div>

      {filtered.length > 5 && (
        <p className="pt-2 text-center text-[10px] text-text-muted">
          +{filtered.length - 5} more actions today
        </p>
      )}
    </div>
  );
}
