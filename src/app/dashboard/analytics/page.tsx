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
  Download,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AnalyticsSummaryCard } from "@/components/analytics/AnalyticsSummaryCard";
import { RadioAnalyticsView } from "@/components/analytics/RadioAnalyticsView";
import { SocialAnalyticsView } from "@/components/analytics/SocialAnalyticsView";
import { AggregateAnalyticsView } from "@/components/analytics/AggregateAnalyticsView";
import { getCrossMediaAnalytics, getRadioAnalytics, getSocialAnalytics } from "@/lib/analytics-data";
import { getBrandsByStation } from "@/lib/demo-data";

type MainTab = "radio" | "social" | "aggregate";
type DateRange = "7d" | "30d" | "90d";

export default function AnalyticsHubPage() {
  const { client } = useAuth();
  const [tab, setTab] = useState<MainTab>("aggregate");
  const [dateRange, setDateRange] = useState<DateRange>("90d");
  const [selectedStation, setSelectedStation] = useState<string>("sunshine-radio");
  const [selectedBrand, setSelectedBrand] = useState<string>("tadg-riordan-motors");
  const [exportToast, setExportToast] = useState(false);

  const stations = client?.stations ?? [];
  const brands = useMemo(
    () => getBrandsByStation(selectedStation),
    [selectedStation],
  );

  const crossMedia = useMemo(
    () => getCrossMediaAnalytics(selectedBrand, selectedStation),
    [selectedBrand, selectedStation],
  );
  const radioAds = useMemo(
    () => getRadioAnalytics(selectedBrand, selectedStation),
    [selectedBrand, selectedStation],
  );
  const totalResponses = radioAds.reduce((s, a) => s + a.totalResponses, 0);

  if (!client) return null;

  const tabs: { key: MainTab; label: string }[] = [
    { key: "radio", label: "Radio" },
    { key: "social", label: "Social" },
    { key: "aggregate", label: "Aggregate" },
  ];

  const dateRanges: { key: DateRange; label: string }[] = [
    { key: "7d", label: "Last 7 days" },
    { key: "30d", label: "Last 30 days" },
    { key: "90d", label: "Last 90 days" },
  ];

  function handleExport() {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text">Analytics Hub</h1>
          <p className="text-sm text-text-secondary">
            Performance insights across your network
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text hover:border-border-hover transition-colors"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date range */}
        <div className="flex items-center rounded-lg border border-border overflow-hidden">
          {dateRanges.map((dr) => (
            <button
              key={dr.key}
              onClick={() => setDateRange(dr.key)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                dateRange === dr.key
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {dr.label}
            </button>
          ))}
        </div>

        {/* Station filter */}
        <select
          value={selectedStation}
          onChange={(e) => {
            setSelectedStation(e.target.value);
            const stationBrands = getBrandsByStation(e.target.value);
            if (stationBrands.length > 0) setSelectedBrand(stationBrands[0].slug);
          }}
          className="rounded-lg border border-border bg-bg-card px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-accent/40"
        >
          {stations.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Brand filter */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="rounded-lg border border-border bg-bg-card px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-accent/40"
        >
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

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
          value={2}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="relative px-4 py-3"
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "text-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {t.label}
              </span>
              {tab === t.key && (
                <motion.div
                  layoutId="analytics-hub-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "radio" && (
        <RadioAnalyticsView brandSlug={selectedBrand} stationSlug={selectedStation} />
      )}
      {tab === "social" && (
        <SocialAnalyticsView brandSlug={selectedBrand} stationSlug={selectedStation} />
      )}
      {tab === "aggregate" && (
        <AggregateAnalyticsView brandSlug={selectedBrand} stationSlug={selectedStation} />
      )}

      {/* Export toast */}
      {exportToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-bg shadow-lg z-50"
        >
          Report downloading...
        </motion.div>
      )}
    </motion.div>
  );
}
