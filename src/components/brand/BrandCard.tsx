"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Megaphone, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import { getSectorColor } from "@/lib/sectors";
import { EXECUTIVE_PRODUCERS } from "@/lib/agents";

const statusConfig = {
  active: { label: "Active", bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
  onboarding: { label: "Onboarding", bg: "bg-amber/10", text: "text-amber", dot: "bg-amber" },
  paused: { label: "Paused", bg: "bg-text-muted/10", text: "text-text-muted", dot: "bg-text-muted" },
};

export default function BrandCard({ brand }: { brand: Brand }) {
  const status = statusConfig[brand.status];
  const sectorColor = getSectorColor(brand.sectorId);
  const ep = EXECUTIVE_PRODUCERS.find((e) => e.id === brand.epAgentId);
  const activeCampaigns = brand.campaigns.filter((c) => c.status === "active").length;

  return (
    <Link href={`/dashboard/station/${brand.stationSlug}/brand/${brand.slug}`}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative rounded-[var(--radius-lg)] border border-border bg-bg-card p-5",
          "hover:border-border-hover hover:bg-bg-card-hover transition-colors duration-200",
          "cursor-pointer"
        )}
      >
        {/* Header: Name + Sector badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-heading text-lg font-semibold text-text leading-tight">
            {brand.name}
          </h3>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${sectorColor}18`,
              color: sectorColor,
            }}
          >
            {brand.sectorName}
          </span>
        </div>

        {/* EP Agent */}
        {ep && (
          <p className="text-xs text-text-muted mb-3">
            EP: <span className="text-text-secondary">{ep.name}</span>
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Megaphone className="h-3.5 w-3.5 text-text-muted" />
            <span>
              {activeCampaigns} active campaign{activeCampaigns !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Calendar className="h-3.5 w-3.5 text-text-muted" />
            <span>{brand.lastActivity}</span>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              status.bg,
              status.text
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        </div>

        {/* Logo line */}
        <div className="flex items-start gap-2 rounded-[var(--radius)] bg-bg-primary/60 px-3 py-2">
          <Quote className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent/50" />
          <p className="text-sm italic text-text-secondary leading-snug">
            {brand.logoLine}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
