'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PerformanceTimeline } from './charts/PerformanceTimeline';
import { TimeSlotHeatmap } from './charts/TimeSlotHeatmap';
import { TopPerformersTable } from './charts/TopPerformersTable';
import { MomentVsScheduledComparison } from './charts/MomentVsScheduledComparison';
import {
  getRadioAnalytics,
  getTimeSlotData,
  getTopPerformingAds,
  getDaypartBreakdown,
  getMomentVsScheduledComparison,
} from '@/lib/analytics-data';

interface RadioAnalyticsViewProps {
  brandSlug: string;
  stationSlug: string;
}

const DAYPART_COLORS = ['#F59E0B', '#3B82F6', '#00FF96', '#8B5CF6', '#4B5563'];

export function RadioAnalyticsView({ brandSlug, stationSlug }: RadioAnalyticsViewProps) {
  const radioAds = useMemo(() => getRadioAnalytics(brandSlug, stationSlug), [brandSlug, stationSlug]);
  const timeSlotData = useMemo(() => getTimeSlotData(brandSlug, stationSlug), [brandSlug, stationSlug]);
  const topAds = useMemo(() => getTopPerformingAds(brandSlug, stationSlug), [brandSlug, stationSlug]);
  const daypartData = useMemo(() => getDaypartBreakdown(brandSlug, stationSlug), [brandSlug, stationSlug]);
  const comparison = useMemo(() => getMomentVsScheduledComparison(brandSlug, stationSlug), [brandSlug, stationSlug]);

  const timelineData = useMemo(() => {
    const sorted = [...radioAds].sort((a, b) => a.firstAired.localeCompare(b.firstAired));
    const dateMap = new Map<string, { plays: number; responses: number; trigger?: string }>();

    for (const ad of sorted) {
      const date = ad.firstAired;
      const existing = dateMap.get(date) ?? { plays: 0, responses: 0 };
      existing.plays += ad.totalPlays;
      existing.responses += ad.totalResponses;
      if (ad.isMomentTriggered && ad.popScore >= 80) {
        existing.trigger = ad.momentTitle.slice(0, 20);
      }
      dateMap.set(date, existing);
    }

    return Array.from(dateMap.entries()).map(([date, d]) => ({
      date: date.slice(5),
      primary: d.plays,
      secondary: +(d.responses / Math.max(d.plays, 1) * 100).toFixed(2),
      momentTrigger: d.trigger,
    }));
  }, [radioAds]);

  if (radioAds.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-bg-deep p-12 text-center">
        <p className="text-text-muted">No radio analytics data available</p>
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
      {/* Performance Timeline */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Performance Timeline</h3>
        <PerformanceTimeline
          data={timelineData}
          primaryLabel="Ad Plays"
          secondaryLabel="Response Rate %"
          mode="radio"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Slot Heatmap */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Plays by Time Slot</h3>
          <TimeSlotHeatmap data={timeSlotData} />
        </div>

        {/* Daypart Breakdown */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Daypart Distribution</h3>
          <div className="flex items-center gap-8">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={daypartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                    animationDuration={1200}
                  >
                    {daypartData.map((_, i) => (
                      <Cell key={i} fill={DAYPART_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-xs text-gray-200">{payload[0].name}: {Number(payload[0].value).toLocaleString()} plays</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {daypartData.map((dp, i) => (
                <div key={dp.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DAYPART_COLORS[i] }} />
                  <span className="text-sm text-gray-300">{dp.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{dp.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Ads */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Top Performing Ads</h3>
        <TopPerformersTable items={topAds} metric="Responses" />
      </div>

      {/* Moment vs Scheduled */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <MomentVsScheduledComparison
          momentData={comparison.moment}
          scheduledData={comparison.scheduled}
        />
      </div>
    </motion.div>
  );
}
