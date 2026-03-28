"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AnalyticsSummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  previousValue?: number;
  format?: "number" | "percent" | "currency" | "decimal" | "minutes";
  sparklineData?: number[];
}

function formatValue(value: number, format: AnalyticsSummaryCardProps["format"]): string {
  switch (format) {
    case "percent":
      return `${value.toFixed(1)}%`;
    case "currency":
      return `€${value.toLocaleString()}`;
    case "decimal":
      return value.toFixed(2);
    case "minutes":
      return `${value}m`;
    default:
      return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString();
  }
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 60;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#00FF96"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AnalyticsSummaryCard({
  icon: Icon,
  label,
  value,
  previousValue,
  format = "number",
  sparklineData,
}: AnalyticsSummaryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayValue(Math.round(current * 100) / 100);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const trend =
    previousValue !== undefined && previousValue > 0
      ? ((value - previousValue) / previousValue) * 100
      : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-bg-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Icon size={18} className="text-accent" />
        </div>
        {sparklineData && <MiniSparkline data={sparklineData} />}
      </div>
      <p className="font-heading text-2xl font-bold text-text">
        {formatValue(displayValue, format)}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs text-text-muted">{label}</p>
        {trend !== null && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend >= 0 ? "text-accent" : "text-red-400"
            }`}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
