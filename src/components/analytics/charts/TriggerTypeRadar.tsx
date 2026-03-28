'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';

interface TriggerPerformance {
  triggerType: string;
  avgPopScore: number;
  avgResponseRate: number;
  avgEngagementRate: number;
  count: number;
}

interface TriggerTypeRadarProps {
  data: TriggerPerformance[];
  sectorAverage?: TriggerPerformance[];
}

const TRIGGER_LABELS: Record<string, string> = {
  weather: 'Weather',
  sport: 'Sport',
  news: 'News',
  culture: 'Culture',
  traffic: 'Traffic',
  seasonal: 'Seasonal',
  industry: 'Industry',
  breaking: 'Breaking',
};

export const TriggerTypeRadar: React.FC<TriggerTypeRadarProps> = ({
  data,
  sectorAverage,
}) => {
  const chartData = data.map((d) => {
    const sectorItem = sectorAverage?.find((s) => s.triggerType === d.triggerType);
    return {
      trigger: TRIGGER_LABELS[d.triggerType] ?? d.triggerType,
      score: d.avgPopScore,
      sector: sectorItem?.avgPopScore ?? 0,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#1F2937" />
          <PolarAngleAxis
            dataKey="trigger"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            axisLine={false}
          />
          {sectorAverage && (
            <Radar
              name="Sector Average"
              dataKey="sector"
              stroke="#4B5563"
              fill="#4B5563"
              fillOpacity={0.15}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          )}
          <Radar
            name="Brand"
            dataKey="score"
            stroke="#00FF96"
            fill="#00FF96"
            fillOpacity={0.2}
            strokeWidth={2}
            animationDuration={1200}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                  <p className="text-xs text-gray-200 font-medium mb-1">{label}</p>
                  {payload.map((entry: any, i: number) => (
                    <p key={i} className="text-xs" style={{ color: entry.color }}>
                      {entry.name}: {entry.value}
                    </p>
                  ))}
                </div>
              );
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      {sectorAverage && (
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#00FF96]" />
            <span className="text-xs text-gray-400">Brand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-500 border-dashed" style={{ borderTop: '2px dashed #4B5563', height: 0 }} />
            <span className="text-xs text-gray-400">Sector Average</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
