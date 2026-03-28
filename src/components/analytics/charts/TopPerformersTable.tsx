'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { PerformanceItem, TriggerType } from '@/lib/analytics-data';

interface TopPerformersTableProps {
  items: PerformanceItem[];
  metric: string;
}

const TRIGGER_COLORS: Record<string, string> = {
  weather: '#3B82F6',
  sport: '#EF4444',
  news: '#8B5CF6',
  culture: '#F59E0B',
  traffic: '#F97316',
  seasonal: '#10B981',
  industry: '#06B6D4',
  breaking: '#EC4899',
};

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 20;
  const w = 50;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#00FF96"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type SortKey = 'popScore' | 'metric';

export const TopPerformersTable: React.FC<TopPerformersTableProps> = ({
  items,
  metric,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('popScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...items].sort((a, b) => {
    const mul = sortDir === 'desc' ? -1 : 1;
    return (a[sortKey] - b[sortKey]) * mul;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown size={12} className="text-gray-600" />;
    return sortDir === 'desc' ? (
      <ChevronDown size={12} className="text-green-400" />
    ) : (
      <ChevronUp size={12} className="text-green-400" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left text-xs text-gray-400 font-normal py-2 pr-3 w-8">#</th>
            <th className="text-left text-xs text-gray-400 font-normal py-2 pr-3">Name</th>
            <th className="text-left text-xs text-gray-400 font-normal py-2 pr-3">Trigger</th>
            <th
              className="text-right text-xs text-gray-400 font-normal py-2 pr-3 cursor-pointer select-none"
              onClick={() => toggleSort('popScore')}
            >
              <span className="inline-flex items-center gap-1">
                POP <SortIcon col="popScore" />
              </span>
            </th>
            <th
              className="text-right text-xs text-gray-400 font-normal py-2 pr-3 cursor-pointer select-none"
              onClick={() => toggleSort('metric')}
            >
              <span className="inline-flex items-center gap-1">
                {metric} <SortIcon col="metric" />
              </span>
            </th>
            <th className="text-right text-xs text-gray-400 font-normal py-2">Trend</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-gray-800 hover:bg-white/[0.02] transition-colors"
            >
              <td className="py-2.5 pr-3 text-gray-500 font-mono text-xs">{index + 1}</td>
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-2">
                  {item.isMomentTriggered && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  )}
                  <span className="text-gray-200 truncate max-w-[200px]">{item.name}</span>
                </div>
              </td>
              <td className="py-2.5 pr-3">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${TRIGGER_COLORS[item.triggerType] ?? '#4B5563'}18`,
                    color: TRIGGER_COLORS[item.triggerType] ?? '#9CA3AF',
                  }}
                >
                  {item.triggerType}
                </span>
              </td>
              <td className="py-2.5 pr-3 text-right">
                <span
                  className={`font-medium ${
                    item.popScore >= 70
                      ? 'text-green-400'
                      : item.popScore >= 40
                        ? 'text-amber-400'
                        : 'text-red-400'
                  }`}
                >
                  {item.popScore}
                </span>
              </td>
              <td className="py-2.5 pr-3 text-right text-gray-300">
                {item.metric.toLocaleString()}
              </td>
              <td className="py-2.5 text-right">
                <div className="flex justify-end">
                  <MiniSparkline data={item.sparkline} />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
