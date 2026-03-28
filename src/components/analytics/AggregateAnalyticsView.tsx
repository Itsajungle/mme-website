'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { PopScoreGauge } from './charts/PopScoreGauge';
import { CrossMediaLiftCard } from './charts/CrossMediaLiftCard';
import { PerformanceTimeline } from './charts/PerformanceTimeline';
import { TriggerTypeRadar } from './charts/TriggerTypeRadar';
import { MomentHeatmap } from './charts/MomentHeatmap';
import { ChannelSplitChart } from './charts/ChannelSplitChart';
import { getCrossMediaAnalytics } from '@/lib/analytics-data';

interface AggregateAnalyticsViewProps {
  brandSlug: string;
  stationSlug: string;
}

export function AggregateAnalyticsView({ brandSlug, stationSlug }: AggregateAnalyticsViewProps) {
  const crossMedia = useMemo(
    () => getCrossMediaAnalytics(brandSlug, stationSlug),
    [brandSlug, stationSlug],
  );

  const timelineData = useMemo(
    () =>
      crossMedia.dailyMetrics.slice(0, 30).map((d) => ({
        date: d.date.slice(5),
        primary: d.radioPlays + Math.round(d.socialImpressions / 100),
        secondary: d.popScore,
        momentTrigger: d.responses > 15 ? undefined : undefined,
      })),
    [crossMedia],
  );

  const sectorAvgTriggers = useMemo(
    () =>
      crossMedia.triggerTypePerformance.map((t) => ({
        ...t,
        avgPopScore: crossMedia.sectorAvgPopScore,
      })),
    [crossMedia],
  );

  if (crossMedia.combinedUniqueReach === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-bg-deep p-12 text-center">
        <p className="text-text-muted">No aggregate analytics data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Cross-Media Lift (hero) */}
      <CrossMediaLiftCard
        radioOnly={crossMedia.radioOnlyConversions}
        socialOnly={crossMedia.socialOnlyConversions}
        combined={crossMedia.crossMediaConversions}
        liftPercentage={crossMedia.crossMediaLift}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POP Score Gauge */}
        <div className="rounded-xl border border-border bg-bg-card p-6 flex items-center justify-center">
          <PopScoreGauge
            score={crossMedia.avgPopScore}
            previousScore={crossMedia.avgPopScore - 6}
            label="Average POP Score"
          />
        </div>

        {/* Channel Attribution */}
        <div className="rounded-xl border border-border bg-bg-card p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-text mb-4">Channel Attribution</h3>
          <ChannelSplitChart
            radioValue={crossMedia.totalRadioReach}
            socialValue={crossMedia.totalSocialReach}
            label="Combined Reach"
          />
        </div>
      </div>

      {/* Combined Performance Timeline */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Combined Performance</h3>
        <PerformanceTimeline
          data={timelineData}
          primaryLabel="Activity Index"
          secondaryLabel="POP Score"
          mode="aggregate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trigger Type Radar */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Trigger Type Performance</h3>
          <TriggerTypeRadar
            data={crossMedia.triggerTypePerformance}
            sectorAverage={sectorAvgTriggers}
          />
        </div>

        {/* Moment Heatmap */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Moment Activity</h3>
          <MomentHeatmap
            data={crossMedia.momentHeatmap.map((m) => ({
              date: m.date,
              count: m.momentCount,
              score: m.performanceScore,
            }))}
          />
        </div>
      </div>

      {/* Revenue Dashboard */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Revenue Attribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-lg border border-border bg-bg-deep p-5 text-center">
            <DollarSign className="mx-auto mb-2 text-text-muted" size={20} />
            <p className="text-sm text-text-muted mb-1">Campaign Cost</p>
            <p className="text-2xl font-bold text-text">
              €{crossMedia.totalCampaignCost.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg-deep p-5 text-center">
            <DollarSign className="mx-auto mb-2 text-green-400" size={20} />
            <p className="text-sm text-text-muted mb-1">Attributed Revenue</p>
            <p className="text-2xl font-bold text-green-400">
              €{crossMedia.totalAttributedRevenue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg-deep p-5 text-center">
            <DollarSign className="mx-auto mb-2 text-amber-400" size={20} />
            <p className="text-sm text-text-muted mb-1">ROAS</p>
            <p className="text-2xl font-bold text-amber-400">{crossMedia.roas}x</p>
          </div>
        </div>
      </div>

      {/* Sector Benchmarks */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Sector Benchmarks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-bg-deep p-4">
            <p className="text-xs text-text-muted mb-1">Brand POP Score</p>
            <p className="text-xl font-bold text-green-400">{crossMedia.avgPopScore}</p>
            <p className="text-xs text-text-muted">Sector avg: {crossMedia.sectorAvgPopScore}</p>
          </div>
          <div className="rounded-lg border border-border bg-bg-deep p-4">
            <p className="text-xs text-text-muted mb-1">vs Sector Average</p>
            <p className="text-xl font-bold text-green-400">
              +{crossMedia.brandVsSectorPerformance}%
            </p>
            <p className="text-xs text-text-muted">above benchmark</p>
          </div>
          <div className="rounded-lg border border-border bg-bg-deep p-4">
            <p className="text-xs text-text-muted mb-1">Sector Avg Response</p>
            <p className="text-xl font-bold text-text">
              {(crossMedia.sectorAvgResponseRate * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-text-muted">industry baseline</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
