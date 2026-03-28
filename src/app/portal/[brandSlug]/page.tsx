"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Megaphone, Globe, Activity, Calendar, Zap } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AnalyticsSummaryCard } from "@/components/analytics/AnalyticsSummaryCard";
import {
  getCrossMediaAnalytics,
  getRadioAnalytics,
  getSocialAnalytics,
} from "@/lib/analytics-data";
import { getBrandBySlug, type Brand } from "@/lib/demo-data";

export default function PortalDashboardPage() {
  const { brandClient } = useAuth();

  const brand = brandClient
    ? getBrandBySlug(brandClient.stationSlug, brandClient.brandSlug)
    : null;
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

  if (!brandClient || !brand || !crossMedia) return null;

  const activeCampaigns = brand.campaigns.filter((c) => c.status === "active");
  const scheduledCampaigns = brand.campaigns.filter((c) => c.status === "scheduled");
  const totalResponses = radioAds.reduce((s, a) => s + a.totalResponses, 0);
  const recentMoments = brand.moments.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary italic">
          &ldquo;{brand.logoLine}&rdquo;
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsSummaryCard
          icon={Megaphone}
          label="Active Campaigns"
          value={activeCampaigns.length}
        />
        <AnalyticsSummaryCard
          icon={Globe}
          label="Total Reach"
          value={crossMedia.combinedUniqueReach}
          previousValue={Math.round(crossMedia.combinedUniqueReach * 0.87)}
        />
        <AnalyticsSummaryCard
          icon={Activity}
          label="POP Score"
          value={crossMedia.avgPopScore}
          previousValue={crossMedia.avgPopScore - 6}
        />
        <AnalyticsSummaryCard
          icon={Calendar}
          label="Next Scheduled"
          value={scheduledCampaigns.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent campaigns */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-text mb-4">
            Campaign Performance
          </h2>
          <div className="space-y-3">
            {brand.campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-lg border border-border bg-bg-deep px-4 py-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-text">{campaign.name}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      campaign.status === "active"
                        ? "bg-accent/10 text-accent"
                        : campaign.status === "completed"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{campaign.date}</span>
                  <span>{campaign.duration}</span>
                  <span
                    className={`font-medium ${
                      campaign.popScore >= 70
                        ? "text-green-400"
                        : campaign.popScore >= 40
                          ? "text-amber-400"
                          : "text-red-400"
                    }`}
                  >
                    POP {campaign.popScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent moment triggers */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-text mb-4">
            Recent Moment Triggers
          </h2>
          <div className="space-y-3">
            {recentMoments.map((moment) => (
              <div
                key={moment.id}
                className="rounded-lg border border-border bg-bg-deep px-4 py-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-amber-400" />
                  <p className="text-sm font-medium text-text">{moment.title}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-accent/10 text-accent"
                  >
                    {moment.triggerType}
                  </span>
                  <span>POP {moment.popScore}</span>
                  <span>{moment.timestamp}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">{moment.suggestedAction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
