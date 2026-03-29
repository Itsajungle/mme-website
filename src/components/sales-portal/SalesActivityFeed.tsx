"use client";

import { motion } from "framer-motion";
import { Clock, Play, CheckCircle2, Loader2, XCircle, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoAdActivity } from "@/lib/sales-portal/types";

interface SalesActivityFeedProps {
  activities: DemoAdActivity[];
  onPlayAudio?: (audioUrl: string) => void;
}

const STATUS_CONFIG = {
  complete: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", label: "Complete" },
  "script-ready": { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Script Ready" },
  generating: { icon: Loader2, color: "text-blue-400", bg: "bg-blue-400/10", label: "Generating" },
  failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Failed" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function scoreColor(score: number): string {
  if (score >= 85) return "text-green-400";
  if (score >= 70) return "text-accent";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export function SalesActivityFeed({ activities, onPlayAudio }: SalesActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-6 text-center">
        <p className="text-sm text-text-muted">No demo ads generated yet</p>
        <p className="text-xs text-text-muted mt-1">Fill in the brief and hit Generate to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {activities.map((activity, i) => {
          const config = STATUS_CONFIG[activity.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={cn("mt-0.5 flex h-6 w-6 items-center justify-center rounded-md", config.bg)}>
                    <StatusIcon
                      size={13}
                      className={cn(config.color, activity.status === "generating" && "animate-spin")}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">{activity.advertiserName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-text-muted">{activity.businessType}</span>
                      <span className="text-[10px] text-text-muted">·</span>
                      <span className="text-[10px] text-text-muted">{activity.duration}s</span>
                      <span className="text-[10px] text-text-muted">·</span>
                      <span className="text-[10px] text-text-muted capitalize">{activity.tone}</span>
                      <span className="text-[10px] text-text-muted">·</span>
                      <span className="text-[10px] text-text-muted capitalize">{activity.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activity.comptrodScore > 0 && (
                    <span className={cn("text-xs font-mono font-bold", scoreColor(activity.comptrodScore))}>
                      {activity.comptrodScore}
                    </span>
                  )}
                  {activity.audioUrl && onPlayAudio && (
                    <button
                      onClick={() => onPlayAudio(activity.audioUrl!)}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                    >
                      <Play size={10} />
                    </button>
                  )}
                  <span className="text-[10px] text-text-muted whitespace-nowrap">{timeAgo(activity.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
