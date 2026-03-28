'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Globe, Activity, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getStationAnalytics } from '@/lib/analytics-data';

interface StationAnalyticsPanelProps {
  stationSlug: string;
}

export function StationAnalyticsPanel({ stationSlug }: StationAnalyticsPanelProps) {
  const analytics = useMemo(() => getStationAnalytics(stationSlug), [stationSlug]);

  const summaryCards = [
    { label: 'Active Brands', value: analytics.totalBrands, icon: Users },
    {
      label: 'Total Reach',
      value: analytics.totalReach >= 1000 ? `${(analytics.totalReach / 1000).toFixed(1)}k` : analytics.totalReach,
      icon: Globe,
    },
    { label: 'Avg POP Score', value: analytics.avgPopScore, icon: Activity },
    { label: 'Top Sector', value: analytics.topSector || 'N/A', icon: Trophy, isText: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-border bg-bg-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-lg font-semibold text-text">Station Analytics</h2>
        <Link
          href="/dashboard/analytics"
          className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
        >
          View Full Analytics <ArrowRight size={12} />
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-border bg-bg-deep p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className="text-accent" />
                <span className="text-[10px] text-text-muted">{card.label}</span>
              </div>
              <p className="text-lg font-bold text-text">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sector performance mini chart */}
      {analytics.sectorPerformance.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-text-muted mb-2">Performance by Sector</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={analytics.sectorPerformance} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="sector" stroke="#9CA3AF" style={{ fontSize: '9px' }} tick={{ fill: '#9CA3AF' }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-[#0F1528] border border-gray-700 rounded-lg px-2 py-1 shadow-lg">
                      <p className="text-[10px] text-gray-200">
                        POP: {payload[0].value} · {(payload[0].payload as any).brandCount} brands
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="avgPopScore" fill="#00FF96" radius={[3, 3, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top brands */}
      {analytics.topBrands.length > 0 && (
        <div>
          <p className="text-xs text-text-muted mb-2">Top Performing Brands</p>
          <div className="space-y-2">
            {analytics.topBrands.map((brand, i) => (
              <div key={brand.brandSlug} className="flex items-center justify-between rounded-lg border border-border bg-bg-deep px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted font-mono">#{i + 1}</span>
                  <span className="text-sm text-text">{brand.brandName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${brand.popScore >= 70 ? 'text-green-400' : 'text-amber-400'}`}>
                    POP {brand.popScore}
                  </span>
                  <span className="text-xs text-text-muted">
                    {(brand.reach / 1000).toFixed(0)}k reach
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
