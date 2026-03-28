"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Type,
  Hash,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS_PER_SECOND: Record<string, number> = {
  "15s": 2.5,
  "30s": 2.5,
  "60s": 2.5,
};

export function ScriptEditor({
  script,
  onChange,
  duration,
  brandName,
}: {
  script: string;
  onChange: (script: string) => void;
  duration: string;
  brandName: string;
}) {
  const stats = useMemo(() => {
    const trimmed = script.trim();
    const chars = trimmed.length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const targetSeconds = parseInt(duration);
    const wps = WORDS_PER_SECOND[duration] || 2.5;
    const targetWords = Math.round(targetSeconds * wps);
    const estimatedSeconds = Math.round(words / wps);
    const withinTarget =
      words >= targetWords * 0.8 && words <= targetWords * 1.15;

    return { chars, words, targetWords, estimatedSeconds, withinTarget };
  }, [script, duration]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-accent" />
          <h3 className="font-heading text-sm font-bold text-text">
            Script Editor
          </h3>
        </div>
        <span className="text-xs text-text-muted font-mono">
          {brandName} &middot; {duration}
        </span>
      </div>

      {/* Editor */}
      <div
        className={cn(
          "rounded-xl border-2 transition-all duration-300 overflow-hidden",
          stats.withinTarget
            ? "border-accent/40 shadow-[0_0_24px_rgba(0,255,150,0.06)]"
            : "border-border"
        )}
      >
        <textarea
          value={script}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          className="w-full bg-bg-card px-5 py-4 font-mono text-xs leading-relaxed text-text-secondary focus:outline-none resize-none"
          spellCheck={false}
        />

        {/* Stats Bar */}
        <div className="flex items-center gap-4 border-t border-border bg-bg-deep px-5 py-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Hash size={12} />
            <span>
              <span className="text-text-secondary font-mono">
                {stats.chars}
              </span>{" "}
              chars
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Type size={12} />
            <span>
              <span className="text-text-secondary font-mono">
                {stats.words}
              </span>
              /{stats.targetWords} words
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={12} />
            <span>
              Est.{" "}
              <span
                className={cn(
                  "font-mono",
                  stats.withinTarget ? "text-accent" : "text-text-secondary"
                )}
              >
                {stats.estimatedSeconds}s
              </span>
              /{duration}
            </span>
          </div>
          {stats.withinTarget && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent"
            >
              ON TARGET
            </motion.span>
          )}
        </div>
      </div>

      {/* Logo Line Highlight */}
      {script.toLowerCase().includes(brandName.toLowerCase()) && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-4 py-2.5">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs text-accent">
            Logo line detected in script
          </span>
        </div>
      )}

      {/* Suggest Improvements */}
      <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-text-secondary hover:border-border-hover hover:text-text transition-colors w-full justify-center">
        <Sparkles size={16} className="text-accent" />
        Suggest Improvements
      </button>
    </div>
  );
}
