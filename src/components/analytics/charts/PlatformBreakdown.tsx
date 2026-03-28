'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlatformMetric {
  platform: string;
  impressions: number;
  engagement: number;
  engagementRate: number;
}

interface PlatformBreakdownProps {
  data: PlatformMetric[];
}

const PLATFORM_CONFIG: Record<string, { color: string; label: string }> = {
  tiktok: { color: '#00F2EA', label: 'TikTok' },
  instagram: { color: '#E1306C', label: 'Instagram' },
  facebook: { color: '#1877F2', label: 'Facebook' },
  x: { color: '#9CA3AF', label: 'X' },
  linkedin: { color: '#0A66C2', label: 'LinkedIn' },
};

export const PlatformBreakdown: React.FC<PlatformBreakdownProps> = ({ data }) => {
  const maxImpressions = Math.max(...data.map((d) => d.impressions), 1);
  const maxEngagement = Math.max(...data.map((d) => d.engagement), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-5"
    >
      {data.map((platform, index) => {
        const config = PLATFORM_CONFIG[platform.platform] ?? {
          color: '#6B7280',
          label: platform.platform,
        };

        return (
          <motion.div
            key={platform.platform}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm font-medium text-gray-200">{config.label}</span>
              </div>
              <span className="text-xs text-gray-400">
                {platform.engagementRate.toFixed(1)}% engagement
              </span>
            </div>

            {/* Impressions bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>Impressions</span>
                <span>{platform.impressions.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: config.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(platform.impressions / maxImpressions) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.08 }}
                />
              </div>
            </div>

            {/* Engagement bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>Engagement</span>
                <span>{platform.engagement.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: config.color, opacity: 0.6 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(platform.engagement / maxEngagement) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.08 }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
