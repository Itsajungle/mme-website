'use client';

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';

interface TimelineData {
  date: string;
  primary: number;
  secondary: number;
  momentTrigger?: string;
}

interface PerformanceTimelineProps {
  data: TimelineData[];
  primaryLabel?: string;
  secondaryLabel?: string;
  mode?: 'radio' | 'social' | 'aggregate';
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F1528] border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-200 text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-xs mt-1">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({
  data,
  primaryLabel = 'Ad Plays',
  secondaryLabel = 'Response Rate',
  mode = 'aggregate',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            yAxisId="left"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            label={{ value: primaryLabel, angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            label={{ value: secondaryLabel, angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Reference lines for moment triggers */}
          {data.map((item, index) =>
            item.momentTrigger ? (
              <ReferenceLine
                key={index}
                x={item.date}
                stroke="#F59E0B"
                strokeDasharray="5 5"
                label={{ value: item.momentTrigger, position: 'top', fill: '#F59E0B', fontSize: 12 }}
              />
            ) : null
          )}

          {/* Primary bars */}
          <Bar
            yAxisId="left"
            dataKey="primary"
            fill="rgba(0, 255, 150, 0.3)"
            stroke="#00FF96"
            strokeWidth={1}
            radius={[4, 4, 0, 0]}
            name={primaryLabel}
          />

          {/* Secondary line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="secondary"
            stroke="#00FF96"
            strokeWidth={3}
            dot={{ fill: '#00FF96', r: 4 }}
            activeDot={{ r: 6 }}
            name={secondaryLabel}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
