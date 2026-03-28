'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface ChannelSplitChartProps {
  radioValue: number;
  socialValue: number;
  label: string;
}

const COLORS = ['#00FF96', '#F59E0B'];

export const ChannelSplitChart: React.FC<ChannelSplitChartProps> = ({
  radioValue,
  socialValue,
  label,
}) => {
  const total = radioValue + socialValue;
  const data = [
    { name: 'Radio', value: radioValue },
    { name: 'Social', value: socialValue },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-[220px] h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationDuration={1200}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0];
                return (
                  <div className="bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs text-gray-200 font-medium">{item.name}</p>
                    <p className="text-xs" style={{ color: item.payload.fill }}>
                      {Number(item.value).toLocaleString()} ({((Number(item.value) / total) * 100).toFixed(1)}%)
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-white">{total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            <span className="text-sm text-gray-300">{entry.name}</span>
            <span className="text-xs text-gray-500">
              {((entry.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
