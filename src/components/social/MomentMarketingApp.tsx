"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Radio,
  Share2,
  Layers,
  Filter,
  TrendingUp,
  BarChart3,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand, MomentItem } from "@/lib/demo-data";
import { MomentCard } from "./MomentCard";

interface MomentMarketingAppProps {
  brand: Brand;
}

const MEDIA_MODES = [
  { id: "both", label: "Both", icon: Layers },
  { id: "radio", label: "Radio", icon: Radio },
  { id: "social", label: "Social", icon: Share2 },
] as const;

type MediaMode = (typeof MEDIA_MODES)[number]["id"];

const TRIGGER_TYPES = [
  "weather",
  "sport",
  "news",
  "culture",
  "traffic",
  "seasonal",
  "industry",
  "breaking",
] as const;

export function MomentMarketingApp({ brand }: MomentMarketingAppProps) {
  const [mediaMode, setMediaMode] = useState<MediaMode>("both");
  const [activeTriggerFilters, setActiveTriggerFilters] = useState<string[]>([]);
  const [generatingMomentId, setGeneratingMomentId] = useState<string | null>(null);

  const toggleFilter = (type: string) => {
    setActiveTriggerFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredMoments = useMemo(() => {
    if (activeTriggerFilters.length === 0) return brand.moments;
    return brand.moments.filter((m) => activeTriggerFilters.includes(m.triggerType));
  }, [brand.moments, activeTriggerFilters]);

  const averagePop =
    brand.moments.length > 0
      ? Math.round(
          brand.moments.reduce((sum, m) => sum + m.popScore, 0) / brand.moments.length
        )
      : 0;

  const handleGenerate = (moment: MomentItem) => {
    setGeneratingMomentId(moment.id);
  };

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <Zap size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-text">
              Moment Marketing Engine
            </h2>
            <p className="text-xs text-text-muted">{brand.name}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-xs font-mono text-text">
              {brand.moments.length} active
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
            <BarChart3 size={14} className="text-accent" />
            <span className="text-xs font-mono text-text">
              Avg POP: {averagePop}
            </span>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="px-6 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Cross-media toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-deep border border-border">
          {MEDIA_MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMediaMode(m.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  mediaMode === m.id
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:text-text"
                )}
              >
                <Icon size={12} />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Trigger type filters */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          <Filter size={12} className="text-text-muted shrink-0" />
          {TRIGGER_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono border transition-all",
                activeTriggerFilters.includes(type)
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-transparent bg-white/5 text-text-muted hover:text-text-secondary"
              )}
            >
              {type}
            </button>
          ))}
          {activeTriggerFilters.length > 0 && (
            <button
              onClick={() => setActiveTriggerFilters([])}
              className="text-text-muted hover:text-text text-[10px] ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Mobile stats */}
      <div className="sm:hidden flex items-center gap-3 px-6 py-2 border-b border-border">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
          <TrendingUp size={14} className="text-accent" />
          <span className="text-xs font-mono text-text">
            {brand.moments.length} active
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
          <BarChart3 size={14} className="text-accent" />
          <span className="text-xs font-mono text-text">
            Avg POP: {averagePop}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Moment feed */}
        <div className="lg:col-span-2 p-6 space-y-3 border-b lg:border-b-0 lg:border-r border-border">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-3">
            Real-Time Moment Feed
            <span className="ml-2 inline-flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              Live
            </span>
          </p>

          {filteredMoments.length > 0 ? (
            <div className="space-y-3">
              {filteredMoments.map((moment) => (
                <MomentCard
                  key={moment.id}
                  moment={moment}
                  onGenerate={() => handleGenerate(moment)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border text-text-muted text-sm">
              No moments match the current filters
            </div>
          )}
        </div>

        {/* Generation panel */}
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-3">
            Content Generation
          </p>

          <AnimatePresence mode="wait">
            {generatingMomentId ? (
              <motion.div
                key={generatingMomentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {(() => {
                  const moment = brand.moments.find(
                    (m) => m.id === generatingMomentId
                  );
                  if (!moment) return null;

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-accent" />
                          <span className="text-xs font-semibold text-text">
                            Generated Content
                          </span>
                        </div>
                        <button
                          onClick={() => setGeneratingMomentId(null)}
                          className="text-text-muted hover:text-text"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Suggested script/post */}
                      <div className="rounded-lg border border-border bg-bg-deep p-3 space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                          Suggested Post
                        </p>
                        <p className="text-xs text-text leading-relaxed">
                          {moment.suggestedAction}. Powered by real-time moment
                          detection for {brand.name}. #{brand.slug.replace(/-/g, "")}{" "}
                          #MomentMarketing
                        </p>
                      </div>

                      {/* Platform recommendations */}
                      <div className="rounded-lg border border-border bg-bg-deep p-3 space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                          Recommended Platforms
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {["Instagram", "TikTok", "Facebook"].map((p) => (
                            <span
                              key={p}
                              className="px-2 py-1 rounded-full text-[10px] bg-accent/10 text-accent font-medium"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Estimated POP impact */}
                      <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1">
                          Estimated POP Impact
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-accent">
                            +{Math.round(moment.popScore * 0.15)}
                          </span>
                          <span className="text-xs text-text-muted">
                            points above baseline
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-bg-deep overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${moment.popScore}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors">
                        <Zap size={14} />
                        Create in Social Studio
                      </button>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <Sparkles size={20} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">
                  Click &quot;Generate Content&quot; on a moment to see AI suggestions
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
