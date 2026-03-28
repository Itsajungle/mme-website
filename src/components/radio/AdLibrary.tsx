"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Library,
  Play,
  Calendar,
  Clock,
  TrendingUp,
  Filter,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/demo-data";

const FILTER_OPTIONS = ["all", "active", "completed", "scheduled"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "text-accent bg-accent/10"
      : score >= 70
        ? "text-amber bg-amber/10"
        : "text-text-muted bg-white/5";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
        color
      )}
    >
      <TrendingUp size={10} />
      {score}
    </span>
  );
}

function StatusDot({ status }: { status: Campaign["status"] }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        status === "active" && "bg-accent",
        status === "completed" && "bg-text-muted",
        status === "scheduled" && "bg-amber"
      )}
    />
  );
}

export function AdLibrary({
  campaigns,
  brandName,
}: {
  campaigns: Campaign[];
  brandName: string;
}) {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filtered =
    filter === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === filter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Library size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-text">
              Ad Library
            </h2>
            <p className="text-sm text-text-muted">
              {brandName} &middot; {campaigns.length} ad
              {campaigns.length !== 1 && "s"}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-text-muted" />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize",
              filter === opt
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-4 rounded-xl border border-border bg-bg-card p-4 hover:border-border-hover transition-colors"
            >
              {/* Play Button */}
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-bg-deep text-text-muted group-hover:border-accent group-hover:text-accent transition-colors">
                <Play size={16} className="ml-0.5" />
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <StatusDot status={campaign.status} />
                  <h4 className="text-sm font-medium text-text truncate">
                    {campaign.name}
                  </h4>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={10} />
                    {campaign.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={10} />
                    {campaign.duration}
                  </span>
                </div>
              </div>

              {/* Score */}
              <ScoreBadge score={campaign.popScore} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border border-dashed bg-bg-card/50 p-12">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg-deep">
              <Radio size={24} className="text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">
                No ads generated yet
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {filter !== "all"
                  ? `No ${filter} ads found. Try a different filter.`
                  : "Create your first ad using the Radio Ad Generator."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
