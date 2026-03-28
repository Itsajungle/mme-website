"use client";

import { motion } from "framer-motion";
import {
  Sun,
  Trophy,
  Newspaper,
  Palette,
  Car,
  Leaf,
  Building2,
  AlertTriangle,
  Zap,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MomentItem } from "@/lib/demo-data";

const TRIGGER_CONFIG: Record<
  string,
  { icon: typeof Sun; color: string; bg: string; label: string }
> = {
  weather: { icon: Sun, color: "text-blue-400", bg: "bg-blue-400/10", label: "Weather" },
  sport: { icon: Trophy, color: "text-green-400", bg: "bg-green-400/10", label: "Sport" },
  news: { icon: Newspaper, color: "text-purple-400", bg: "bg-purple-400/10", label: "News" },
  culture: { icon: Palette, color: "text-pink-400", bg: "bg-pink-400/10", label: "Culture" },
  traffic: { icon: Car, color: "text-orange-400", bg: "bg-orange-400/10", label: "Traffic" },
  seasonal: { icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Seasonal" },
  industry: { icon: Building2, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "Industry" },
  breaking: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10", label: "Breaking" },
};

interface MomentCardProps {
  moment: MomentItem;
  onGenerate?: () => void;
}

function PopScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-border"
        />
        <motion.circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className={cn(
            score >= 80 ? "text-accent" : score >= 60 ? "text-yellow-400" : "text-orange-400"
          )}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text">
        {score}
      </span>
    </div>
  );
}

export function MomentCard({ moment, onGenerate }: MomentCardProps) {
  const config = TRIGGER_CONFIG[moment.triggerType] ?? TRIGGER_CONFIG.news;
  const Icon = config.icon;

  return (
    <motion.div
      className="rounded-xl border border-border bg-bg-card p-4 hover:bg-bg-card-hover transition-colors group"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top row: icon badge + title + POP score */}
      <div className="flex items-start gap-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", config.bg)}>
          <Icon size={18} className={config.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full",
                config.bg,
                config.color
              )}
            >
              {config.label}
            </span>
            <div className="flex items-center gap-1 text-text-muted">
              <Clock size={10} />
              <span className="text-[10px]">{moment.timestamp}</span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-text leading-snug">{moment.title}</h4>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {moment.description}
          </p>
        </div>

        <PopScoreRing score={moment.popScore} />
      </div>

      {/* Suggested action */}
      <div className="mt-3 ml-12 p-2.5 rounded-lg bg-bg-deep/60 border border-border/50">
        <p className="text-[11px] text-text-muted mb-0.5 font-mono uppercase tracking-wider">
          Suggested Action
        </p>
        <p className="text-xs text-text-secondary">{moment.suggestedAction}</p>
      </div>

      {/* Generate button */}
      {onGenerate && (
        <div className="mt-3 ml-12">
          <button
            onClick={onGenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            <Zap size={12} />
            Generate Content
          </button>
        </div>
      )}
    </motion.div>
  );
}
