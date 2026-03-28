'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PopScoreGaugeProps {
  score: number;
  previousScore?: number;
  label?: string;
  size?: number;
}

export const PopScoreGauge: React.FC<PopScoreGaugeProps> = ({
  score,
  previousScore,
  label = 'POP Score',
  size = 240,
}) => {
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color based on score
  let arcColor = '#EF4444'; // red
  if (score >= 40 && score < 70) {
    arcColor = '#F59E0B'; // amber
  } else if (score >= 70) {
    arcColor = '#00FF96'; // green
  }

  // Calculate trend
  const trend = previousScore !== undefined ? score - previousScore : null;
  const trendPercentage = trend !== null ? ((trend / previousScore!) * 100).toFixed(1) : null;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1F2937"
            strokeWidth="12"
          />

          {/* Animated arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-5xl font-bold text-white">{score}</div>
            <div className="text-sm text-gray-400 mt-1">/{100}</div>
          </motion.div>

          {/* Trend indicator */}
          {trend !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`flex items-center gap-1 mt-3 text-sm font-medium ${
                trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {trend > 0 ? (
                <ArrowUp size={16} />
              ) : trend < 0 ? (
                <ArrowDown size={16} />
              ) : null}
              {trend > 0 ? '+' : ''}
              {trend}
              {trendPercentage !== null && ` (${trendPercentage}%)`}
            </motion.div>
          )}
        </div>
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-gray-300 text-lg font-medium mt-6"
      >
        {label}
      </motion.p>
    </div>
  );
};
