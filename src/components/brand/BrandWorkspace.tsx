"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Radio, Share2, BarChart3, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import { EXECUTIVE_PRODUCERS } from "@/lib/agents";
import { getSectorColor } from "@/lib/sectors";
import type { ReactNode } from "react";

const statusConfig = {
  active: { label: "Active", bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
  onboarding: { label: "Onboarding", bg: "bg-amber/10", text: "text-amber", dot: "bg-amber" },
  paused: { label: "Paused", bg: "bg-text-muted/10", text: "text-text-muted", dot: "bg-text-muted" },
};

interface BrandWorkspaceProps {
  brand: Brand;
  activeTab: "radio" | "social" | "analytics";
  children?: ReactNode;
}

export default function BrandWorkspace({ brand, activeTab, children }: BrandWorkspaceProps) {
  const status = statusConfig[brand.status];
  const sectorColor = getSectorColor(brand.sectorId);
  const ep = EXECUTIVE_PRODUCERS.find((e) => e.id === brand.epAgentId);
  const basePath = `/dashboard/station/${brand.stationSlug}/brand/${brand.slug}`;

  const tabs = [
    { key: "radio" as const, label: "Radio", icon: Radio, href: `${basePath}/radio` },
    { key: "social" as const, label: "Social", icon: Share2, href: `${basePath}/social` },
    { key: "analytics" as const, label: "Analytics", icon: BarChart3, href: `${basePath}/analytics` },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-text-muted">
        <Link
          href={`/dashboard/station/${brand.stationSlug}`}
          className="hover:text-text-secondary transition-colors"
        >
          Station
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span style={{ color: sectorColor }}>{brand.sectorName}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text">{brand.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-text">
              {brand.name}
            </h1>
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
          <p className="text-sm italic text-text-muted">
            &ldquo;{brand.logoLine}&rdquo;
          </p>
        </div>

        {/* Agent badges */}
        <div className="flex items-center gap-2 shrink-0">
          {ep && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">
              <Bot className="h-3.5 w-3.5 text-accent" />
              {ep.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">
            <Bot className="h-3.5 w-3.5 text-amber" />
            Brand Agent
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-border">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Link key={tab.key} href={tab.href}>
                <div className="relative px-4 py-3">
                  <span
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      isActive ? "text-accent" : "text-text-muted hover:text-text-secondary"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="brand-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div>{children}</div>
    </div>
  );
}
