"use client";

import { motion } from "framer-motion";
import { Mic2, Music, Volume2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineSegment {
  label: string;
  start: number;
  end: number;
  color: string;
}

const TRACK_DATA: {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  segments: TimelineSegment[];
}[] = [
  {
    name: "Voice",
    icon: Mic2,
    color: "bg-accent",
    segments: [
      { label: "Intro line", start: 3, end: 10, color: "bg-accent" },
      { label: "Body copy", start: 10.5, end: 22, color: "bg-accent" },
      { label: "CTA + Logo", start: 22.5, end: 28, color: "bg-accent/80" },
    ],
  },
  {
    name: "Music",
    icon: Music,
    color: "bg-blue-500",
    segments: [
      { label: "Jingle intro", start: 0, end: 3, color: "bg-blue-500" },
      {
        label: "Music bed (ducked)",
        start: 3,
        end: 28,
        color: "bg-blue-500/40",
      },
      { label: "Jingle out", start: 28, end: 30, color: "bg-blue-500" },
    ],
  },
  {
    name: "SFX",
    icon: Volume2,
    color: "bg-amber",
    segments: [
      { label: "Engine start", start: 1, end: 2.5, color: "bg-amber" },
      { label: "Keys jingle", start: 14, end: 15, color: "bg-amber/70" },
      { label: "Door close", start: 27, end: 28, color: "bg-amber" },
    ],
  },
];

export function ProductionTimeline({ duration }: { duration: string }) {
  const totalSeconds = parseInt(duration) || 30;
  const tickInterval = totalSeconds <= 15 ? 1 : totalSeconds <= 30 ? 2 : 5;
  const ticks: number[] = [];
  for (let i = 0; i <= totalSeconds; i += tickInterval) {
    ticks.push(i);
  }

  function toPercent(seconds: number) {
    return (seconds / totalSeconds) * 100;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Maximize2 size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-text">
              Production Timeline
            </h2>
            <p className="text-sm text-text-muted">
              Multi-track view &middot; {duration}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text hover:border-border-hover transition-colors">
            <ZoomOut size={14} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text hover:border-border-hover transition-colors">
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
        {/* Timeline Ruler */}
        <div className="flex border-b border-border">
          {/* Track label spacer */}
          <div className="w-24 shrink-0 border-r border-border bg-bg-deep" />
          {/* Ruler */}
          <div className="relative flex-1 h-8 bg-bg-deep">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="absolute top-0 h-full flex flex-col items-center"
                style={{ left: `${toPercent(tick)}%` }}
              >
                <div className="h-2 w-px bg-border" />
                <span className="text-[9px] font-mono text-text-muted mt-0.5">
                  {tick}s
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tracks */}
        {TRACK_DATA.map((track, trackIdx) => {
          const Icon = track.icon;
          return (
            <div
              key={track.name}
              className={cn(
                "flex",
                trackIdx < TRACK_DATA.length - 1 && "border-b border-border"
              )}
            >
              {/* Track Label */}
              <div className="w-24 shrink-0 border-r border-border bg-bg-deep flex items-center gap-2 px-3 py-4">
                <Icon size={14} className="text-text-muted" />
                <span className="text-xs font-medium text-text-secondary">
                  {track.name}
                </span>
              </div>

              {/* Track Content */}
              <div className="relative flex-1 py-2 px-1 min-h-[48px]">
                {track.segments.map((segment, segIdx) => (
                  <motion.div
                    key={segIdx}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{
                      delay: trackIdx * 0.15 + segIdx * 0.08,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    style={{
                      left: `${toPercent(segment.start)}%`,
                      width: `${toPercent(segment.end - segment.start)}%`,
                    }}
                    className={cn(
                      "absolute top-2 bottom-2 rounded-md flex items-center justify-center origin-left",
                      segment.color
                    )}
                    title={segment.label}
                  >
                    <span className="text-[9px] font-medium text-bg truncate px-1.5">
                      {segment.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Playhead indicator */}
        <div className="flex border-t border-border">
          <div className="w-24 shrink-0 border-r border-border bg-bg-deep" />
          <div className="relative flex-1 h-6 bg-bg-deep">
            <motion.div
              className="absolute top-0 bottom-0 w-0.5 bg-accent"
              initial={{ left: "0%" }}
              animate={{ left: "40%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              <div className="absolute -top-0.5 -left-1 w-2.5 h-2.5 rounded-full bg-accent" />
            </motion.div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="font-mono text-[10px] text-text-muted">
                0:00 / 0:{totalSeconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
