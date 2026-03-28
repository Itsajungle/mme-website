'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import type { ComparisonMetrics } from '@/lib/analytics-data';

interface MomentVsScheduledComparisonProps {
  momentData: ComparisonMetrics;
  scheduledData: ComparisonMetrics;
}

export const MomentVsScheduledComparison: React.FC<MomentVsScheduledComparisonProps> = ({
  momentData,
  scheduledData,
}) => {
  const liftPercent = scheduledData.responseRate > 0
    ? Math.round(((momentData.responseRate - scheduledData.responseRate) / scheduledData.responseRate) * 100)
    : 0;

  const chartData = [
    {
      metric: 'Response Rate',
      Moment: +(momentData.responseRate * 100).toFixed(2),
      Scheduled: +(scheduledData.responseRate * 100).toFixed(2),
    },
    {
      metric: 'Engagement Rate',
      Moment: +(momentData.engagementRate * 100).toFixed(2),
      Scheduled: +(scheduledData.engagementRate * 100).toFixed(2),
    },
    {
      metric: 'POP Score',
      Moment: momentData.popScore,
      Scheduled: scheduledData.popScore,
    },
    {
      metric: 'Cost/Response',
      Moment: momentData.costPerResponse,
      Scheduled: scheduledData.costPerResponse,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Headline */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Moment vs Scheduled Performance</p>
        <p className="text-2xl font-bold text-green-400">
          Moment-triggered ads outperform by {liftPercent}%
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="metric"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tick={{ fill: '#9CA3AF' }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                  <p className="text-xs text-gray-200 font-medium mb-1">{label}</p>
                  {payload.map((entry: any, i: number) => (
                    <p key={i} className="text-xs" style={{ color: entry.fill }}>
                      {entry.name}: {entry.value}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value: string) => (
              <span className="text-gray-300">{value}</span>
            )}
          />
          <Bar
            dataKey="Moment"
            fill="#00FF96"
            radius={[4, 4, 0, 0]}
            animationDuration={1200}
          />
          <Bar
            dataKey="Scheduled"
            fill="#4B5563"
            radius={[4, 4, 0, 0]}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
