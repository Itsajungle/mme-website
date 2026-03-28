'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { TimeSlotData } from '@/lib/analytics-data';

interface TimeSlotHeatmapProps {
  data: TimeSlotData[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYPARTS = [
  { label: 'Overnight', hours: [0, 1, 2, 3, 4, 5] },
  { label: 'Breakfast', hours: [6, 7, 8, 9] },
  { label: 'Daytime', hours: [10, 11, 12, 13, 14, 15] },
  { label: 'Drive', hours: [16, 17, 18] },
  { label: 'Evening', hours: [19, 20, 21, 22, 23] },
];

function getCellColor(value: number, max: number): string {
  if (value === 0 || max === 0) return 'rgba(255,255,255,0.04)';
  const intensity = value / max;
  if (intensity < 0.2) return 'rgba(0, 255, 150, 0.1)';
  if (intensity < 0.4) return 'rgba(0, 255, 150, 0.25)';
  if (intensity < 0.6) return 'rgba(0, 255, 150, 0.4)';
  if (intensity < 0.8) return 'rgba(0, 255, 150, 0.6)';
  return 'rgba(0, 255, 150, 0.85)';
}

export const TimeSlotHeatmap: React.FC<TimeSlotHeatmapProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{
    day: number;
    hour: number;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const dataMap = new Map(data.map((d) => [`${d.day}-${d.hour}`, d.value]));
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-x-auto"
    >
      <table className="border-separate border-spacing-0.5">
        <thead>
          <tr>
            <th />
            {DAYS.map((day) => (
              <th key={day} className="text-[10px] text-gray-500 font-normal px-1 pb-1">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYPARTS.map((part) => (
            <React.Fragment key={part.label}>
              {part.hours.map((hour, hi) => (
                <tr key={hour}>
                  {hi === 0 && (
                    <td
                      rowSpan={part.hours.length}
                      className="text-[10px] text-gray-500 font-normal pr-2 align-middle whitespace-nowrap"
                    >
                      {part.label}
                    </td>
                  )}
                  {DAYS.map((_, dayIndex) => {
                    const value = dataMap.get(`${dayIndex}-${hour}`) ?? 0;
                    return (
                      <td key={dayIndex} className="p-0">
                        <div
                          className="w-8 h-4 rounded-sm cursor-pointer transition-colors"
                          style={{ backgroundColor: getCellColor(value, maxValue) }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              day: dayIndex,
                              hour,
                              value,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 50,
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {tooltip && (
        <div
          className="fixed z-50 bg-[#0F1528] border border-gray-700 rounded-lg px-3 py-2 shadow-lg pointer-events-none transform -translate-x-1/2"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-xs text-gray-200 font-medium">
            {DAYS[tooltip.day]} {String(tooltip.hour).padStart(2, '0')}:00
          </p>
          <p className="text-xs text-green-400">{tooltip.value} plays</p>
        </div>
      )}
    </motion.div>
  );
};
