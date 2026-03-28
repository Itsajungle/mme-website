'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PerformanceTimeline } from './charts/PerformanceTimeline';
import { PlatformBreakdown } from './charts/PlatformBreakdown';
import { TopPerformersTable } from './charts/TopPerformersTable';
import { MomentVsScheduledComparison } from './charts/MomentVsScheduledComparison';
import {
  getSocialAnalytics,
  getTopPerformingPosts,
  getPlatformBreakdown,
  getMomentVsScheduledComparison,
} from '@/lib/analytics-data';

interface SocialAnalyticsViewProps {
  brandSlug: string;
  stationSlug: string;
}

const CONTENT_TYPE_COLORS: Record<string, string> = {
  'quick-post': '#00FF96',
  video: '#F59E0B',
  slideshow: '#3B82F6',
  blog: '#8B5CF6',
};

export function SocialAnalyticsView({ brandSlug, stationSlug }: SocialAnalyticsViewProps) {
  const posts = useMemo(() => getSocialAnalytics(brandSlug, stationSlug), [brandSlug, stationSlug]);
  const topPosts = useMemo(() => getTopPerformingPosts(brandSlug, stationSlug), [brandSlug, stationSlug]);
  const platformData = useMemo(() => getPlatformBreakdown(brandSlug, stationSlug), [brandSlug, stationSlug]);
  const comparison = useMemo(() => getMomentVsScheduledComparison(brandSlug, stationSlug), [brandSlug, stationSlug]);

  const timelineData = useMemo(() => {
    const sorted = [...posts].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    return sorted.slice(0, 20).map((post) => ({
      date: post.publishedAt.slice(5, 10),
      primary: post.totalImpressions,
      secondary: +(post.avgEngagementRate * 100).toFixed(2),
      momentTrigger: post.isMomentTriggered && post.popScore >= 80 ? post.momentTitle.slice(0, 18) : undefined,
    }));
  }, [posts]);

  const contentTypeData = useMemo(() => {
    const map: Record<string, { count: number; impressions: number; engagement: number }> = {};
    for (const post of posts) {
      if (!map[post.contentType]) map[post.contentType] = { count: 0, impressions: 0, engagement: 0 };
      map[post.contentType].count += 1;
      map[post.contentType].impressions += post.totalImpressions;
      map[post.contentType].engagement += post.totalEngagement;
    }
    return Object.entries(map).map(([type, data]) => ({
      type,
      impressions: data.impressions,
      engagement: data.engagement,
      avgEngagement: data.count > 0 ? Math.round(data.engagement / data.count) : 0,
    }));
  }, [posts]);

  const velocityData = useMemo(() => {
    const momentPosts = posts.filter((p) => p.isMomentTriggered);
    return momentPosts.slice(0, 12).map((p, i) => ({
      label: `#${i + 1}`,
      velocity: p.publishingVelocity,
    }));
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-bg-deep p-12 text-center">
        <p className="text-text-muted">No social analytics data available</p>
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
        <h3 className="text-lg font-semibold text-text mb-4">Impressions & Engagement</h3>
        <PerformanceTimeline
          data={timelineData}
          primaryLabel="Impressions"
          secondaryLabel="Engagement Rate %"
          mode="social"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Platform Performance</h3>
          <PlatformBreakdown data={platformData} />
        </div>

        {/* Content Type Performance */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Content Type Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={contentTypeData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="type" stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#9CA3AF' }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-xs text-gray-200 font-medium mb-1">{label}</p>
                      {payload.map((e: any, i: number) => (
                        <p key={i} className="text-xs" style={{ color: e.fill }}>
                          {e.name}: {Number(e.value).toLocaleString()}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Bar dataKey="impressions" fill="#00FF96" radius={[4, 4, 0, 0]} name="Impressions" animationDuration={1200} />
              <Bar dataKey="engagement" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Engagement" animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Publishing Velocity */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text mb-2">Publishing Velocity</h3>
        <p className="text-sm text-text-muted mb-4">Minutes from moment detection to publish</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={velocityData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="label" stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#9CA3AF' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#9CA3AF' }} unit="m" />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs text-green-400">{payload[0].value}m to publish</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="velocity" fill="#00FF96" radius={[4, 4, 0, 0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Posts */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Top Performing Posts</h3>
        <TopPerformersTable items={topPosts} metric="Engagement" />
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
