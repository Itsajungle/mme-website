"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Trophy,
  Newspaper,
  Leaf,
  Car,
  Radio,
  Share2,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrossMediaEntry } from "@/lib/social-engine/types";

interface CrossMediaFeedProps {
  brandSlug: string;
  brandName: string;
}

// Trigger icon config (same pattern as MomentCard)
const TRIGGER_CONFIG: Record<
  string,
  { icon: typeof Sun; color: string; bg: string; label: string }
> = {
  weather: { icon: Sun, color: "text-blue-400", bg: "bg-blue-400/10", label: "Weather" },
  sport: { icon: Trophy, color: "text-green-400", bg: "bg-green-400/10", label: "Sport" },
  news: { icon: Newspaper, color: "text-purple-400", bg: "bg-purple-400/10", label: "News" },
  seasonal: { icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Seasonal" },
  traffic: { icon: Car, color: "text-orange-400", bg: "bg-orange-400/10", label: "Traffic" },
};

// Inline demo data
const DEMO_ENTRIES: CrossMediaEntry[] = [
  {
    id: "cme-1",
    momentId: "mom-1",
    momentTitle: "Sunny weekend forecast for Leinster",
    momentTriggerType: "weather",
    brandSlug: "tadg-riordan-motors",
    brandName: "Tadg Riordan Motors",
    timestamp: "2 hours ago",
    channels: ["radio", "social"],
    popScore: 85,
    radioStatus: "published",
    socialStatus: "published",
    crossMediaLift: {
      radioReach: 42000,
      socialReach: 18000,
      combinedReach: 67000,
      liftPercentage: 12,
    },
  },
  {
    id: "cme-2",
    momentId: "mom-6",
    momentTitle: "Rainy evening forecast for Dublin",
    momentTriggerType: "news",
    brandSlug: "napoli-kitchen",
    brandName: "Napoli's Kitchen",
    timestamp: "4 hours ago",
    channels: ["social"],
    popScore: 76,
    socialStatus: "published",
  },
  {
    id: "cme-3",
    momentId: "mom-4",
    momentTitle: "Dublin traffic congestion M50",
    momentTriggerType: "traffic",
    brandSlug: "tadg-riordan-motors",
    brandName: "Tadg Riordan Motors",
    timestamp: "3 hours ago",
    channels: ["radio"],
    popScore: 65,
    radioStatus: "published",
  },
  {
    id: "cme-4",
    momentId: "mom-2",
    momentTitle: "March bank holiday weekend",
    momentTriggerType: "seasonal",
    brandSlug: "tadg-riordan-motors",
    brandName: "Tadg Riordan Motors",
    timestamp: "5 hours ago",
    channels: ["radio", "social"],
    popScore: 72,
    radioStatus: "published",
    socialStatus: "ready",
    crossMediaLift: {
      radioReach: 35000,
      socialReach: 14000,
      combinedReach: 55000,
      liftPercentage: 9,
    },
  },
  {
    id: "cme-5",
    momentId: "mom-5",
    momentTitle: "Ashbourne local GAA final",
    momentTriggerType: "sport",
    brandSlug: "tadg-riordan-motors",
    brandName: "Tadg Riordan Motors",
    timestamp: "6 hours ago",
    channels: ["social"],
    popScore: 58,
    socialStatus: "ready",
  },
];

type TriggerFilter = "all" | string;
type ChannelFilter = "all" | "radio" | "social" | "cross-media";

function PopRing({ score }: { score: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-9 h-9 shrink-0">
      <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
        <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-border" />
        <circle
          cx="16"
          cy="16"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={cn(score >= 80 ? "text-accent" : score >= 60 ? "text-yellow-400" : "text-orange-400")}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text">
        {score}
      </span>
    </div>
  );
}

function ChannelBadges({ channels, radioStatus, socialStatus }: {
  channels: ("radio" | "social")[];
  radioStatus?: CrossMediaEntry["radioStatus"];
  socialStatus?: CrossMediaEntry["socialStatus"];
}) {
  const isCrossMedia = channels.includes("radio") && channels.includes("social");

  if (isCrossMedia) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-mono text-accent">
        <Layers size={9} />
        Radio + Social
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {channels.includes("radio") && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-[10px] font-mono text-purple-400">
          <Radio size={9} />
          Radio
          {radioStatus && (
            <span className={cn(
              "ml-0.5",
              radioStatus === "published" ? "text-accent" : radioStatus === "failed" ? "text-red-400" : "text-text-muted"
            )}>
              {radioStatus === "published" ? "•" : radioStatus === "failed" ? "✗" : "○"}
            </span>
          )}
        </span>
      )}
      {channels.includes("social") && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-[10px] font-mono text-blue-400">
          <Share2 size={9} />
          Social
          {socialStatus && (
            <span className={cn(
              "ml-0.5",
              socialStatus === "published" ? "text-accent" : socialStatus === "failed" ? "text-red-400" : "text-text-muted"
            )}>
              {socialStatus === "published" ? "•" : socialStatus === "failed" ? "✗" : "○"}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

const CHANNEL_FILTERS: { value: ChannelFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "radio", label: "Radio" },
  { value: "social", label: "Social" },
  { value: "cross-media", label: "Cross-Media" },
];

const TRIGGER_FILTERS: { value: TriggerFilter; label: string }[] = [
  { value: "all", label: "All Triggers" },
  { value: "weather", label: "Weather" },
  { value: "sport", label: "Sport" },
  { value: "news", label: "News" },
  { value: "seasonal", label: "Seasonal" },
  { value: "traffic", label: "Traffic" },
];

export function CrossMediaFeed({ brandSlug, brandName }: CrossMediaFeedProps) {
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [triggerFilter, setTriggerFilter] = useState<TriggerFilter>("all");

  // Filter entries relevant to this brand
  const baseEntries = DEMO_ENTRIES.filter((e) => e.brandSlug === brandSlug);

  const filtered = baseEntries.filter((entry) => {
    const matchChannel =
      channelFilter === "all" ||
      (channelFilter === "cross-media"
        ? entry.channels.includes("radio") && entry.channels.includes("social")
        : entry.channels.includes(channelFilter as "radio" | "social") &&
          !(channelFilter === "radio" && entry.channels.includes("social")) &&
          !(channelFilter === "social" && entry.channels.includes("radio")));
    const matchTrigger =
      triggerFilter === "all" || entry.momentTriggerType === triggerFilter;
    return matchChannel && matchTrigger;
  });

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Layers size={15} className="text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-text">Cross-Media Activity</h3>
          <p className="text-[11px] text-text-muted">{brandName}</p>
        </div>
        <span className="text-[10px] font-mono text-text-muted">
          {filtered.length} entr{filtered.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 border-b border-border flex items-center gap-3 flex-wrap">
        <Filter size={12} className="text-text-muted shrink-0" />

        {/* Channel filter */}
        <div className="flex items-center gap-1">
          {CHANNEL_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setChannelFilter(f.value)}
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-mono transition-all",
                channelFilter === f.value
                  ? "bg-accent/20 text-accent"
                  : "text-text-muted hover:text-text"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-border" />

        {/* Trigger filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {TRIGGER_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTriggerFilter(f.value)}
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-mono transition-all",
                triggerFilter === f.value
                  ? "bg-white/10 text-text"
                  : "text-text-muted hover:text-text"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-border">
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-text-muted">
            No entries match the selected filters.
          </div>
        )}

        {filtered.map((entry, i) => {
          const config = TRIGGER_CONFIG[entry.momentTriggerType] ?? TRIGGER_CONFIG.news;
          const Icon = config.icon;
          const isCrossMedia =
            entry.channels.includes("radio") && entry.channels.includes("social");

          return (
            <motion.div
              key={entry.id}
              className={cn(
                "px-5 py-4 flex items-start gap-3 group",
                isCrossMedia && "bg-accent/[0.03]"
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              {/* Trigger icon */}
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg shrink-0 mt-0.5",
                  config.bg
                )}
              >
                <Icon size={16} className={config.color} />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full",
                      config.bg,
                      config.color
                    )}
                  >
                    {config.label}
                  </span>
                  <div className="flex items-center gap-1 text-text-muted">
                    <Clock size={9} />
                    <span className="text-[10px]">{entry.timestamp}</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-text leading-snug">
                  {entry.momentTitle}
                </p>

                {/* Channel badges */}
                <ChannelBadges
                  channels={entry.channels}
                  radioStatus={entry.radioStatus}
                  socialStatus={entry.socialStatus}
                />

                {/* Cross-media lift */}
                {entry.crossMediaLift && (
                  <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20">
                    <CheckCircle2 size={10} className="text-accent" />
                    <span className="text-[10px] font-mono text-accent">
                      +{entry.crossMediaLift.liftPercentage}% lift
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {entry.crossMediaLift.combinedReach.toLocaleString()} combined reach
                    </span>
                  </div>
                )}
              </div>

              {/* POP score */}
              <PopRing score={entry.popScore} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
