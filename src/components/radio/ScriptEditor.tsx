"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clock,
  Type,
  Hash,
  Sparkles,
  X,
  Check,
  Loader2,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS_PER_SECOND: Record<string, number> = {
  "15s": 2.5,
  "30s": 2.5,
  "60s": 2.5,
};

interface Suggestion {
  id: string;
  category: string;
  text: string;
  replacement?: string;
}

export function ScriptEditor({
  script,
  onChange,
  duration,
  brandName,
  triggerType,
  onRegenerateScript,
  onRegenerateAudio,
  isGenerating,
}: {
  script: string;
  onChange: (script: string) => void;
  duration: string;
  brandName: string;
  triggerType?: string;
  onRegenerateScript?: () => void;
  onRegenerateAudio?: () => void;
  isGenerating?: boolean;
}) {
  const [showPanel, setShowPanel] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  // Word count targets matching the AI prompt ranges
  const TIGHT_TARGETS: Record<string, { min: number; max: number }> = {
    "15s": { min: 35, max: 40 },
    "30s": { min: 70, max: 80 },
    "60s": { min: 140, max: 160 },
  };

  const stats = useMemo(() => {
    // Count only voice lines — strip directions, music/sfx cues
    const voiceOnly = script
      .replace(/\[.*?\]/g, "")
      .replace(/VOICE.*?:\n/g, "")
      .replace(/"/g, "")
      .trim();
    const chars = voiceOnly.length;
    const words = voiceOnly ? voiceOnly.split(/\s+/).filter(Boolean).length : 0;
    const wps = WORDS_PER_SECOND[duration] || 2.5;
    const estimatedSeconds = Math.round(words / wps);

    const target = TIGHT_TARGETS[duration];
    const targetWords = target ? Math.round((target.min + target.max) / 2) : Math.round(parseInt(duration) * wps);
    const min = target?.min ?? targetWords * 0.8;
    const max = target?.max ?? targetWords * 1.15;

    // Status: green (in range), amber (close — within 10% outside), red (way off)
    let status: "green" | "amber" | "red" = "green";
    if (words < min || words > max) {
      const offBy = words < min ? min - words : words - max;
      const threshold = Math.round((max - min) * 0.5);
      status = offBy <= threshold ? "amber" : "red";
    }

    return { chars, words, targetWords, estimatedSeconds, min, max, status };
  }, [script, duration]);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setShowPanel(true);
    setAppliedIds(new Set());
    try {
      const res = await fetch("/api/radio/suggest-improvements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, brandName, duration, triggerType }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
    } catch {
      setSuggestions([
        { id: "err", category: "Error", text: "Could not load suggestions" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [script, brandName, duration, triggerType]);

  const applySuggestion = useCallback(
    async (suggestion: Suggestion) => {
      if (!suggestion.replacement) return;
      try {
        const res = await fetch("/api/radio/apply-improvement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script,
            suggestionId: suggestion.id,
            replacement: suggestion.replacement,
            brandName,
          }),
        });
        const data = await res.json();
        if (data.revisedScript) {
          onChange(data.revisedScript);
          setAppliedIds((prev) => new Set(prev).add(suggestion.id));
        }
      } catch {
        // Silently fail
      }
    },
    [script, brandName, onChange]
  );

  return (
    <div className="space-y-4 relative">
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
          stats.status === "green"
            ? "border-accent/40 shadow-[0_0_24px_rgba(0,255,150,0.06)]"
            : stats.status === "amber"
            ? "border-amber-500/40 shadow-[0_0_24px_rgba(245,158,11,0.06)]"
            : "border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.06)]"
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
              <span
                className={cn(
                  "font-mono font-bold",
                  stats.status === "green" ? "text-accent" : stats.status === "amber" ? "text-amber-400" : "text-red-400"
                )}
              >
                {stats.words}
              </span>
              <span className="text-text-muted">
                /{stats.min}–{stats.max} words
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={12} />
            <span>
              Est.{" "}
              <span
                className={cn(
                  "font-mono",
                  stats.status === "green" ? "text-accent" : stats.status === "amber" ? "text-amber-400" : "text-red-400"
                )}
              >
                {stats.estimatedSeconds}s
              </span>
              /{duration}
            </span>
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              stats.status === "green"
                ? "bg-accent/10 text-accent"
                : stats.status === "amber"
                ? "bg-amber-500/10 text-amber-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            {stats.status === "green" ? "ON TARGET" : stats.status === "amber" ? "CLOSE" : "OUT OF RANGE"}
          </motion.span>
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

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onRegenerateScript && (
          <button
            onClick={onRegenerateScript}
            disabled={isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-text-secondary hover:border-accent/40 hover:text-text transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 size={16} className="text-accent animate-spin" />
            ) : (
              <Sparkles size={16} className="text-accent" />
            )}
            Regenerate Script
          </button>
        )}
        {onRegenerateAudio && (
          <button
            onClick={onRegenerateAudio}
            disabled={isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm font-bold text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Volume2 size={16} />
            )}
            Regenerate Audio
          </button>
        )}
      </div>

      {/* Suggest Improvements Button */}
      <button
        onClick={fetchSuggestions}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-text-secondary hover:border-accent/40 hover:text-text transition-colors w-full justify-center disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={16} className="text-accent animate-spin" />
        ) : (
          <Sparkles size={16} className="text-accent" />
        )}
        Suggest Improvements
      </button>

      {/* Slide-out Suggestions Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 top-0 w-80 bg-bg-card border border-border rounded-xl p-4 shadow-xl z-10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-accent" />
                <h4 className="text-sm font-semibold text-text">
                  Suggestions
                </h4>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-text-muted hover:text-text transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="text-accent animate-spin" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg border border-border bg-bg-deep p-3"
                  >
                    <span className="text-[10px] uppercase tracking-wider font-medium text-amber-400">
                      {s.category}
                    </span>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {s.text}
                    </p>
                    {s.replacement && (
                      <button
                        onClick={() => applySuggestion(s)}
                        disabled={appliedIds.has(s.id)}
                        className={cn(
                          "mt-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                          appliedIds.has(s.id)
                            ? "bg-green-500/10 text-green-400"
                            : "bg-accent/10 text-accent hover:bg-accent/20"
                        )}
                      >
                        {appliedIds.has(s.id) ? (
                          <>
                            <Check size={10} /> Applied
                          </>
                        ) : (
                          "Apply"
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
