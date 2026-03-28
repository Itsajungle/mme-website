"use client";

import { motion } from "framer-motion";
import { Clock, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/demo-data";

const campaignStatusConfig = {
  completed: { label: "Completed", bg: "bg-accent/10", text: "text-accent" },
  active: { label: "Active", bg: "bg-amber/10", text: "text-amber" },
  scheduled: { label: "Scheduled", bg: "bg-[#6366F1]/10", text: "text-[#6366F1]" },
};

function getScoreColor(score: number): string {
  if (score >= 90) return "text-accent";
  if (score >= 70) return "text-amber";
  return "text-[#EF4444]";
}

function getScoreBg(score: number): string {
  if (score >= 90) return "bg-accent/10";
  if (score >= 70) return "bg-amber/10";
  return "bg-[#EF4444]/10";
}

export default function CampaignHistory({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "rounded-[var(--radius-lg)] border border-border bg-bg-card p-8",
          "flex flex-col items-center justify-center text-center"
        )}
      >
        <div className="mb-4 rounded-full bg-bg-primary p-4">
          <Inbox className="h-8 w-8 text-text-muted" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-text mb-1">
          No campaigns yet
        </h3>
        <p className="text-sm text-text-muted max-w-sm">
          Campaigns will appear here once they have been created for this brand.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[var(--radius-lg)] border border-border bg-bg-card overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-heading text-lg font-semibold text-text">
          Campaign History
        </h2>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-border text-xs font-medium uppercase tracking-wider text-text-muted">
        <span>Campaign</span>
        <span className="w-24 text-center">Date</span>
        <span className="w-20 text-center">Duration</span>
        <span className="w-24 text-center">POP Score</span>
        <span className="w-24 text-center">Status</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {campaigns.map((campaign, index) => {
          const status = campaignStatusConfig[campaign.status];
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "px-6 py-4 transition-colors hover:bg-bg-card-hover",
                "sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center sm:gap-4",
                "flex flex-col gap-3"
              )}
            >
              {/* Campaign name */}
              <div>
                <p className="text-sm font-medium text-text">{campaign.name}</p>
              </div>

              {/* Date */}
              <div className="w-24 text-center">
                <span className="text-sm text-text-secondary">{campaign.date}</span>
              </div>

              {/* Duration */}
              <div className="w-20 flex justify-center">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-primary/60 px-2.5 py-0.5 text-xs text-text-secondary">
                  <Clock className="h-3 w-3 text-text-muted" />
                  {campaign.duration}
                </span>
              </div>

              {/* POP Score */}
              <div className="w-24 flex justify-center">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                    getScoreBg(campaign.popScore),
                    getScoreColor(campaign.popScore)
                  )}
                >
                  {campaign.popScore}
                </span>
              </div>

              {/* Status */}
              <div className="w-24 flex justify-center">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    status.bg,
                    status.text
                  )}
                >
                  {status.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
