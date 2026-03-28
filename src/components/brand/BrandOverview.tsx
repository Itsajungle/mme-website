"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Users, DollarSign, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";

function StatSection({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-text-muted">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      {children}
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-border bg-bg-primary/60 px-2.5 py-1 text-xs text-text-secondary"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function BrandOverview({ brand }: { brand: Brand }) {
  const { overview } = brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-bg-card p-6",
        "space-y-6"
      )}
    >
      <h2 className="font-heading text-lg font-semibold text-text">
        Business Profile
      </h2>

      {/* Description */}
      <p className="text-sm leading-relaxed text-text-secondary">
        {overview.description}
      </p>

      <div className="h-px bg-border" />

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Years in business */}
        <StatSection icon={Building2} label="Years in Business">
          <p className="text-2xl font-heading font-bold text-text">
            {overview.yearsInBusiness}
            <span className="ml-1.5 text-sm font-normal text-text-muted">years</span>
          </p>
        </StatSection>

        {/* Locations */}
        <StatSection icon={MapPin} label="Locations">
          <div className="space-y-2">
            {brand.locations.map((loc) => (
              <div key={loc.name} className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/60" />
                <div>
                  <p className="text-sm font-medium text-text">{loc.name}</p>
                  <p className="text-xs text-text-muted">{loc.address}</p>
                </div>
              </div>
            ))}
          </div>
        </StatSection>

        {/* Peak times */}
        <StatSection icon={Clock} label="Peak Times">
          <BadgeList items={overview.peakTimes} />
        </StatSection>

        {/* Target audience */}
        <StatSection icon={Users} label="Target Audience">
          <BadgeList items={overview.targetAudience} />
        </StatSection>

        {/* Revenue model */}
        <StatSection icon={DollarSign} label="Revenue Model">
          <BadgeList items={overview.revenueModel} />
        </StatSection>
      </div>
    </motion.div>
  );
}
