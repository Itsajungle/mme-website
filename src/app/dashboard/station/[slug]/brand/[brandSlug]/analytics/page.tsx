"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { getBrandBySlug } from "@/lib/demo-data";
import BrandWorkspace from "@/components/brand/BrandWorkspace";
import { AnalyticsSummaryCard } from "@/components/analytics/AnalyticsSummaryCard";
import { RadioAnalyticsView } from "@/components/analytics/RadioAnalyticsView";
import { SocialAnalyticsView } from "@/components/analytics/SocialAnalyticsView";
import { AggregateAnalyticsView } from "@/components/analytics/AggregateAnalyticsView";
import { getCrossMediaAnalytics, getRadioAnalytics, getSocialAnalytics } from "@/lib/analytics-data";

type SubTab = "radio" | "social" | "aggregate";

export default function BrandAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string; brandSlug: string }>;
}) {
  const { slug, brandSlug } = use(params);
  const { client } = useAuth();
  const router = useRouter();
  const [subTab, setSubTab] = useState<SubTab>("aggregate");

  const brand = client ? getBrandBySlug(slug, brandSlug) : null;
  const crossMedia = useMemo(
    () => getCrossMediaAnalytics(brandSlug, slug),
    [brandSlug, slug],
  );
  const radioAds = useMemo(
    () => getRadioAnalytics(brandSlug, slug),
    [brandSlug, slug],
  );
  const socialPosts = useMemo(
    () => getSocialAnalytics(brandSlug, slug),
    [brandSlug, slug],
  );

  if (!client) return null;

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-secondary mb-4">Brand not found</p>
        <button
          onClick={() => router.push(`/dashboard/station/${slug}`)}
          className="text-accent hover:text-accent-hover text-sm"
        >
          Back to Station
        </button>
      </div>
    );
  }

  const totalResponses = radioAds.reduce((s, a) => s + a.totalResponses, 0);
  const activeCampaigns = brand.campaigns.filter((c) => c.status === "active").length;

  const subTabs: { key: SubTab; label: string }[] = [
    { key: "radio", label: "Radio" },
    { key: "social", label: "Social" },
    { key: "aggregate", label: "Aggregate" },
  ];

  return (
    <BrandWorkspace brand={brand} activeTab="analytics">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <AnalyticsSummaryCard
            icon={Globe}
            label="Total Reach"
            value={crossMedia.combinedUniqueReach}
            previousValue={Math.round(crossMedia.combinedUniqueReach * 0.87)}
          />
          <AnalyticsSummaryCard
            icon={MessageSquare}
            label="Total Responses"
            value={totalResponses}
            previousValue={Math.round(totalResponses * 0.82)}
          />
          <AnalyticsSummaryCard
            icon={Activity}
            label="POP Score"
            value={crossMedia.avgPopScore}
            previousValue={crossMedia.avgPopScore - 6}
          />
          <AnalyticsSummaryCard
            icon={TrendingUp}
            label="Cross-Media Lift"
            value={crossMedia.crossMediaLift}
            format="percent"
          />
          <AnalyticsSummaryCard
            icon={DollarSign}
            label="ROAS"
            value={crossMedia.roas}
            format="decimal"
          />
          <AnalyticsSummaryCard
            icon={Megaphone}
            label="Active Campaigns"
            value={activeCampaigns}
          />
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
                <span
                  className={`text-sm font-medium transition-colors ${
                    subTab === tab.key
                      ? "text-accent"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {tab.label}
                </span>
                {subTab === tab.key && (
                  <motion.div
                    layoutId="analytics-sub-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-tab content */}
        {subTab === "radio" && (
          <RadioAnalyticsView brandSlug={brandSlug} stationSlug={slug} />
        )}
        {subTab === "social" && (
          <SocialAnalyticsView brandSlug={brandSlug} stationSlug={slug} />
        )}
        {subTab === "aggregate" && (
          <AggregateAnalyticsView brandSlug={brandSlug} stationSlug={slug} />
        )}
      </motion.div>
    </BrandWorkspace>
  );
}
