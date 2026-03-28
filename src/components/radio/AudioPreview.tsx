"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Download, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

function WaveformBars({ playing }: { playing: boolean }) {
  const barCount = 48;
  return (
    <div className="flex items-center justify-center gap-[2px] h-12">
      {Array.from({ length: barCount }).map((_, i) => {
        const baseHeight =
          12 +
          Math.sin(i * 0.6) * 10 +
          Math.cos(i * 0.3) * 8 +
          Math.sin(i * 1.2) * 5;
        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-accent"
            style={{ opacity: 0.3 + Math.sin(i * 0.5) * 0.4 }}
            initial={{ height: 4 }}
            animate={
              playing
                ? {
                    height: [
                      4,
                      baseHeight,
                      baseHeight * 1.4,
                      baseHeight * 0.6,
                      baseHeight,
                      4,
                    ],
                  }
                : { height: baseHeight * 0.6 }
            }
            transition={
              playing
                ? {
                    duration: 1.8 + Math.random() * 1.2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: i * 0.03,
                    ease: "easeInOut",
                  }
                : { duration: 0.4 }
            }
          />
        );
      })}
    </div>
  );
}

export function AudioPreview({
  title,
  duration,
  isGenerated = false,
}: {
  title: string;
  duration: string;
  isGenerated?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  const durationSeconds = parseInt(duration) || 30;
  const formattedDuration = `0:${durationSeconds.toString().padStart(2, "0")}`;

  if (!isGenerated) {
    return (
      <div className="rounded-xl border border-border border-dashed bg-bg-card/50 p-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-deep">
            <Volume2 size={20} className="text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">
              Generate audio to preview
            </p>
            <p className="text-xs text-text-muted mt-1">
              Your ad will appear here once audio generation is complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-bg-card overflow-hidden"
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-bg hover:bg-accent-hover transition-colors"
          >
            {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <div>
            <p className="text-sm font-medium text-text">{title}</p>
            <p className="text-xs text-text-muted font-mono">
              Broadcast-ready &middot; WAV 48kHz
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text hover:border-border-hover transition-colors">
          <Download size={14} />
          Download
        </button>
      </div>

      {/* Waveform */}
      <div className="px-5 py-4">
        <WaveformBars playing={playing} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 border-t border-border px-5 py-3">
        {/* Time */}
        <span className="font-mono text-xs text-text-muted">
          <span className="text-text-secondary">
            {playing ? "0:12" : "0:00"}
          </span>
          {" / "}
          {formattedDuration}
        </span>

        {/* Progress bar */}
        <div className="flex-1 h-1 rounded-full bg-bg-deep overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: "0%" }}
            animate={playing ? { width: "40%" } : { width: "0%" }}
            transition={
              playing
                ? { duration: durationSeconds * 0.4, ease: "linear" }
                : { duration: 0.3 }
            }
          />
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="text-text-muted hover:text-text transition-colors"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setMuted(false);
            }}
            className="h-1 w-16 appearance-none rounded-full bg-bg-deep accent-accent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
          />
        </div>
      </div>
    </motion.div>
  );
}
