"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  MessageSquare,
  Activity,
  TrendingUp,
  DollarSign,
  Megaphone,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AnalyticsSummaryCard } from "@/components/analytics/AnalyticsSummaryCard";
import { RadioAnalyticsView } from "@/components/analytics/RadioAnalyticsView";
import { SocialAnalyticsView } from "@/components/analytics/SocialAnalyticsView";
import { AggregateAnalyticsView } from "@/components/analytics/AggregateAnalyticsView";
import { getCrossMediaAnalytics, getRadioAnalytics } from "@/lib/analytics-data";

type SubTab = "radio" | "social" | "aggregate";

export default function PortalAnalyticsPage() {
  const { brandClient } = useAuth();
  const [subTab, setSubTab] = useState<SubTab>("aggregate");

  const crossMedia = useMemo(
    () =>
      brandClient
        ? getCrossMediaAnalytics(brandClient.brandSlug, brandClient.stationSlug)
        : null,
    [brandClient],
  );
  const radioAds = useMemo(
    () =>
      brandClient
        ? getRadioAnalytics(brandClient.brandSlug, brandClient.stationSlug)
        : [],
    [brandClient],
  );

  if (!brandClient || !crossMedia) return null;

  const totalResponses = radioAds.reduce((s, a) => s + a.totalResponses, 0);

  const subTabs: { key: SubTab; label: string }[] = [
    { key: "radio", label: "Radio" },
    { key: "social", label: "Social" },
    { key: "aggregate", label: "Aggregate" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="font-heading text-2xl font-bold text-text">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AnalyticsSummaryCard icon={Globe} label="Total Reach" value={crossMedia.combinedUniqueReach} />
        <AnalyticsSummaryCard icon={MessageSquare} label="Responses" value={totalResponses} />
        <AnalyticsSummaryCard icon={Activity} label="POP Score" value={crossMedia.avgPopScore} />
        <AnalyticsSummaryCard icon={TrendingUp} label="Cross-Media Lift" value={crossMedia.crossMediaLift} format="percent" />
        <AnalyticsSummaryCard icon={DollarSign} label="ROAS" value={crossMedia.roas} format="decimal" />
        <AnalyticsSummaryCard icon={Megaphone} label="Campaigns" value={2} />
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-border">
        <div className="flex items-center gap-1">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              className="relative px-4 py-3"
            >
              <span className={`text-sm font-medium transition-colors ${subTab === tab.key ? "text-amber-400" : "text-text-muted hover:text-text-secondary"}`}>
                {tab.label}
              </span>
              {subTab === tab.key && (
                <motion.div
                  layoutId="portal-analytics-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {subTab === "radio" && <RadioAnalyticsView brandSlug={brandClient.brandSlug} stationSlug={brandClient.stationSlug} />}
      {subTab === "social" && <SocialAnalyticsView brandSlug={brandClient.brandSlug} stationSlug={brandClient.stationSlug} />}
      {subTab === "aggregate" && <AggregateAnalyticsView brandSlug={brandClient.brandSlug} stationSlug={brandClient.stationSlug} />}
    </motion.div>
  );
}
