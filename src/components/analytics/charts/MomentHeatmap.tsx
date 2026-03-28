'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface HeatmapData {
  date: string;
  count: number;
  score: number;
}

interface MomentHeatmapProps {
  data: HeatmapData[];
}

function getColor(score: number): string {
  if (score === 0) return 'rgba(255,255,255,0.04)';
  if (score < 30) return 'rgba(0, 255, 150, 0.15)';
  if (score < 50) return 'rgba(0, 255, 150, 0.3)';
  if (score < 70) return 'rgba(0, 255, 150, 0.5)';
  if (score < 85) return 'rgba(0, 255, 150, 0.7)';
  return 'rgba(0, 255, 150, 0.9)';
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MomentHeatmap: React.FC<MomentHeatmapProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: HeatmapData;
  } | null>(null);

  const grid = useMemo(() => {
    const map = new Map(data.map((d) => [d.date, d]));
    const weeks: (HeatmapData | null)[][] = [];
    if (data.length === 0) return weeks;

    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
    const start = new Date(sorted[0].date);
    const end = new Date(sorted[sorted.length - 1].date);

    const startDay = start.getDay();
    const alignedStart = new Date(start);
    alignedStart.setDate(alignedStart.getDate() - ((startDay + 6) % 7));

    const current = new Date(alignedStart);
    let week: (HeatmapData | null)[] = [];

    while (current <= end || week.length > 0) {
      const dateStr = current.toISOString().split('T')[0];
      const entry = map.get(dateStr) ?? null;
      week.push(entry);

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }

      current.setDate(current.getDate() + 1);
      if (current > end && week.length === 0) break;
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    return weeks;
  }, [data]);

  const monthLabels = useMemo(() => {
    if (grid.length === 0) return [];
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    grid.forEach((week, weekIndex) => {
      for (const cell of week) {
        if (cell) {
          const d = new Date(cell.date);
          if (d.getMonth() !== lastMonth) {
            lastMonth = d.getMonth();
            labels.push({ label: MONTHS[lastMonth], weekIndex });
          }
          break;
        }
      }
    });

    return labels;
  }, [grid]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Month labels */}
      <div className="flex ml-8 mb-1 text-xs text-gray-400 gap-0">
        {monthLabels.map((m, i) => (
          <span
            key={i}
            style={{ marginLeft: i === 0 ? `${m.weekIndex * 16}px` : `${(m.weekIndex - (monthLabels[i - 1]?.weekIndex ?? 0) - 1) * 16}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5">
        <div className="flex flex-col gap-0.5 mr-1 pt-0.5">
          {DAYS.map((day, i) => (
            <div key={day} className="text-[10px] text-gray-500 h-[14px] flex items-center">
              {i % 2 === 0 ? day : ''}
            </div>
          ))}
        </div>

        <div className="flex gap-0.5">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className="w-[14px] h-[14px] rounded-[3px] cursor-pointer"
                  style={{
                    backgroundColor: cell ? getColor(cell.score) : 'rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    if (cell) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ x: rect.left, y: rect.top - 60, data: cell });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 ml-8">
        <span className="text-[10px] text-gray-500">Less</span>
        {[0, 25, 45, 65, 85].map((score) => (
          <div
            key={score}
            className="w-[14px] h-[14px] rounded-[3px]"
            style={{ backgroundColor: getColor(score) }}
          />
        ))}
        <span className="text-[10px] text-gray-500">More</span>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-xs text-gray-200 font-medium">{tooltip.data.date}</p>
          <p className="text-xs text-gray-400">
            {tooltip.data.count} moment{tooltip.data.count !== 1 ? 's' : ''} · Score: {tooltip.data.score}
          </p>
        </div>
      )}
    </motion.div>
  );
};
