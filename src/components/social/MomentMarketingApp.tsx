"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  Loader2,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Brand, MomentItem } from "@/lib/demo-data";
import type { GeneratedCopy } from "@/lib/social-engine/types";
import { MomentCard } from "./MomentCard";

// ─── Platform recommendations by trigger type ────────────────────────────────

const PLATFORM_RECS: Record<MomentItem["triggerType"], string[]> = {
  weather:  ["Instagram", "Facebook", "X"],
  sport:    ["X", "Instagram", "TikTok"],
  news:     ["X", "LinkedIn", "Facebook"],
  culture:  ["Instagram", "TikTok", "Facebook"],
  traffic:  ["X", "Facebook"],
  seasonal: ["Instagram", "Facebook", "LinkedIn"],
  industry: ["LinkedIn", "X", "Facebook"],
  breaking: ["X", "Facebook", "Instagram"],
};

// ─── Cross-media mode filtering ───────────────────────────────────────────────

const RADIO_TRIGGER_TYPES: MomentItem["triggerType"][] = ["weather", "traffic", "sport"];
const SOCIAL_TRIGGER_TYPES: MomentItem["triggerType"][] = [
  "culture", "news", "breaking", "seasonal", "industry",
];

// ─── Constants ────────────────────────────────────────────────────────────────

const MEDIA_MODES = [
  { id: "both",   label: "Both",   icon: Layers },
  { id: "radio",  label: "Radio",  icon: Radio  },
  { id: "social", label: "Social", icon: Share2  },
] as const;

type MediaMode = (typeof MEDIA_MODES)[number]["id"];

const TRIGGER_TYPES = [
  "weather", "sport", "news", "culture", "traffic", "seasonal", "industry", "breaking",
] as const;

// ─── POP score ring — bigger variant for the generation panel ─────────────────

function PopScoreRingLarge({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "text-accent" : score >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
        <circle
          cx="44" cy="44" r={radius}
          fill="none" stroke="currentColor" strokeWidth="5"
          className="text-border"
        />
        <motion.circle
          cx="44" cy="44" r={radius}
          fill="none" stroke="currentColor" strokeWidth="5"
          strokeLinecap="round"
          className={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold", color)}>{score}</span>
        <span className="text-[9px] uppercase tracking-wider text-text-muted font-mono">POP</span>
      </div>
    </div>
  );
}

// ─── Platform badge ───────────────────────────────────────────────────────────

function PlatformBadge({ name }: { name: string }) {
  return (
    <span className="px-2 py-1 rounded-full text-[10px] bg-accent/10 text-accent font-medium">
      {name}
    </span>
  );
}

// ─── Platform variant card ────────────────────────────────────────────────────

function PlatformVariantCard({
  platform,
  text,
  hashtags,
}: {
  platform: string;
  text: string;
  hashtags?: string[];
}) {
  const label =
    platform === "x" ? "X" :
    platform === "instagram" ? "Instagram" :
    platform === "linkedin" ? "LinkedIn" :
    platform === "facebook" ? "Facebook" :
    platform === "tiktok" ? "TikTok" :
    platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div className="rounded-lg border border-border bg-bg-deep p-3 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Globe size={11} className="text-text-muted" />
        <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">{label}</span>
      </div>
      <p className="text-xs text-text leading-relaxed">{text}</p>
      {hashtags && hashtags.length > 0 && (
        <p className="text-[10px] text-accent/70 leading-relaxed font-mono">
          {hashtags.map((h) => `#${h}`).join(" ")}
        </p>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface MomentMarketingAppProps {
  brand: Brand;
  onCreateInStudio?: (content: GeneratedCopy, momentId: string) => void;
  onCreateBoth?: (moment: MomentItem, content: GeneratedCopy) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MomentMarketingApp({
  brand,
  onCreateInStudio,
  onCreateBoth,
}: MomentMarketingAppProps) {
  const router = useRouter();

  // State
  const [moments, setMoments] = useState<MomentItem[]>(brand.moments);
  const [momentSource, setMomentSource] = useState<"live" | "demo">("demo");
  const [mediaMode, setMediaMode] = useState<MediaMode>("both");
  const [activeTriggerFilters, setActiveTriggerFilters] = useState<string[]>([]);
  const [generatingMomentId, setGeneratingMomentId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedCopy | null>(null);

  // Keep track of previously seen moment IDs for slide-in animation
  const seenIdsRef = useRef<Set<string>>(new Set(brand.moments.map((m) => m.id)));

  // ── Fetch moments from API ─────────────────────────────────────────────────

  const fetchMoments = useCallback(async () => {
    try {
      const res = await fetch(`/api/social/moments?brandSlug=${brand.slug}`);
      if (!res.ok) return;
      const data = await res.json();
      const fetched: MomentItem[] = data.moments ?? [];
      setMomentSource(data.source === "live" ? "live" : "demo");

      setMoments((prev) => {
        // Prepend any genuinely new moments at the top
        const newItems = fetched.filter((m) => !seenIdsRef.current.has(m.id));
        newItems.forEach((m) => seenIdsRef.current.add(m.id));
        if (newItems.length === 0) return prev;
        return [...newItems, ...prev];
      });
    } catch {
      // Silently ignore network errors — keep showing existing moments
    }
  }, [brand.slug]);

  // Mount fetch + 60-second poll
  useEffect(() => {
    fetchMoments();
    const id = setInterval(fetchMoments, 60_000);
    return () => clearInterval(id);
  }, [fetchMoments]);

  // Clear generated content when the panel target changes
  useEffect(() => {
    setGeneratedContent(null);
  }, [generatingMomentId]);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const toggleFilter = (type: string) => {
    setActiveTriggerFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredMoments = useMemo(() => {
    let base = moments;

    // Cross-media mode filter
    if (mediaMode === "radio") {
      base = base.filter((m) =>
        (RADIO_TRIGGER_TYPES as readonly string[]).includes(m.triggerType)
      );
    } else if (mediaMode === "social") {
      base = base.filter((m) =>
        (SOCIAL_TRIGGER_TYPES as readonly string[]).includes(m.triggerType)
      );
    }

    // Explicit trigger-type chips
    if (activeTriggerFilters.length > 0) {
      base = base.filter((m) => activeTriggerFilters.includes(m.triggerType));
    }

    return base;
  }, [moments, mediaMode, activeTriggerFilters]);

  const averagePop =
    moments.length > 0
      ? Math.round(moments.reduce((sum, m) => sum + m.popScore, 0) / moments.length)
      : 0;

  // ── Content generation ─────────────────────────────────────────────────────

  const handleGenerate = (moment: MomentItem) => {
    setGeneratingMomentId(moment.id);
    setGeneratedContent(null);
  };

  const runGeneration = async (moment: MomentItem) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/social/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSlug: brand.slug,
          momentContext: moment.description,
          platforms: ["instagram", "x", "linkedin", "facebook"],
          contentType: "quick",
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      // API may return either the GeneratedCopy directly or wrapped in { content }
      const content: GeneratedCopy = data.content ?? data;
      setGeneratedContent(content);
    } catch {
      // Provide a graceful fallback so the panel still renders something
      setGeneratedContent(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Derived values for active moment panel ─────────────────────────────────

  const activeMoment = moments.find((m) => m.id === generatingMomentId) ?? null;
  const crossMediaScore = activeMoment
    ? Math.min(100, Math.round(activeMoment.popScore * 1.15))
    : 0;
  const platformRecs = activeMoment ? (PLATFORM_RECS[activeMoment.triggerType] ?? []) : [];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">

      {/* ── Header ── */}
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

        {/* Stats row */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-xs font-mono text-text">{moments.length} active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
            <BarChart3 size={14} className="text-accent" />
            <span className="text-xs font-mono text-text">Avg POP: {averagePop}</span>
          </div>
        </div>
      </div>

      {/* ── Controls bar ── */}
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

        {/* Trigger-type chips */}
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
                  : "border-transparent bg-white/5 text-text-muted hover:text-text"
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

      {/* ── Mobile stats ── */}
      <div className="sm:hidden flex items-center gap-3 px-6 py-2 border-b border-border">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
          <TrendingUp size={14} className="text-accent" />
          <span className="text-xs font-mono text-text">{moments.length} active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-deep border border-border">
          <BarChart3 size={14} className="text-accent" />
          <span className="text-xs font-mono text-text">Avg POP: {averagePop}</span>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">

        {/* ── Left: Moment feed ── */}
        <div className="lg:col-span-2 p-6 space-y-3 border-b lg:border-b-0 lg:border-r border-border">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-3">
            Real-Time Moment Feed
            <span className="ml-2 inline-flex items-center gap-1">
              {momentSource === "live" ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                  </span>
                  <span className="text-accent">Live</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400" />
                  </span>
                  <span className="text-yellow-400">Demo Mode</span>
                </>
              )}
            </span>
          </p>

          {filteredMoments.length > 0 ? (
            <AnimatePresence initial={false}>
              <div className="space-y-3">
                {filteredMoments.map((moment) => (
                  <motion.div
                    key={moment.id}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MomentCard
                      moment={moment}
                      onGenerate={() => handleGenerate(moment)}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border text-text-muted text-sm">
              No moments match the current filters
            </div>
          )}
        </div>

        {/* ── Right: Generation panel ── */}
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-3">
            Content Generation
          </p>

          <AnimatePresence mode="wait">
            {!activeMoment ? (
              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <Sparkles size={20} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">
                  Click &quot;Generate Content&quot; on a moment to see AI suggestions
                </p>
              </motion.div>
            ) : (
              /* Active generation panel */
              <motion.div
                key={activeMoment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-accent" />
                    <span className="text-xs font-semibold text-text">
                      {generatedContent ? "Generated Content" : "Content Generation"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setGeneratingMomentId(null);
                      setGeneratedContent(null);
                    }}
                    className="text-text-muted hover:text-text"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Moment context chip */}
                <div className="rounded-lg border border-border bg-bg-deep px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-0.5">
                    Moment
                  </p>
                  <p className="text-xs text-text font-medium leading-snug">
                    {activeMoment.title}
                  </p>
                </div>

                {/* Generate button (shown before generation) */}
                {!generatedContent && !isGenerating && (
                  <button
                    onClick={() => runGeneration(activeMoment)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
                  >
                    <Sparkles size={14} />
                    Generate Content
                  </button>
                )}

                {/* Generating spinner */}
                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader2 size={24} className="text-accent animate-spin" />
                    <p className="text-xs text-text-muted">Generating content…</p>
                  </div>
                )}

                {/* Generated content */}
                {generatedContent && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* POP score gauge */}
                    <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-3">
                        Estimated Cross-Media POP Impact
                      </p>
                      <div className="flex items-center gap-4">
                        <PopScoreRingLarge score={crossMediaScore} />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
                            <span>Base moment POP</span>
                            <span className="text-text">{activeMoment.popScore}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
                            <span>Cross-media lift</span>
                            <span className="text-accent">+15%</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono border-t border-border pt-1.5">
                            <span>Combined score</span>
                            <span className="text-accent font-bold">{crossMediaScore}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Platform variants */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                        Platform Copy
                      </p>
                      {Object.entries(generatedContent.platformVariants).map(([platform, variant]) => {
                        if (!variant) return null;
                        return (
                          <PlatformVariantCard
                            key={platform}
                            platform={platform}
                            text={variant.text}
                            hashtags={variant.hashtags}
                          />
                        );
                      })}
                    </div>

                    {/* Image prompt */}
                    {(() => {
                      const firstVariant = Object.values(generatedContent.platformVariants).find(
                        (v) => v?.suggestedImagePrompt
                      );
                      if (!firstVariant?.suggestedImagePrompt) return null;
                      return (
                        <div className="rounded-lg border border-border bg-bg-deep p-3 space-y-1.5">
                          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                            Suggested Image Prompt
                          </p>
                          <p className="text-xs text-text-secondary leading-relaxed italic">
                            &ldquo;{firstVariant.suggestedImagePrompt}&rdquo;
                          </p>
                        </div>
                      );
                    })()}

                    {/* Recommended platforms */}
                    <div className="rounded-lg border border-border bg-bg-deep p-3 space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                        Recommended Platforms
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {platformRecs.map((p) => (
                          <PlatformBadge key={p} name={p} />
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-1">
                      {/* Create in Social Studio */}
                      <button
                        onClick={() => {
                          if (onCreateInStudio) {
                            onCreateInStudio(generatedContent, activeMoment.id);
                          }
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
                      >
                        <Zap size={14} />
                        Create in Social Studio
                      </button>

                      {/* Create Radio Ad */}
                      <button
                        onClick={() => {
                          router.push(
                            `/dashboard/station/${brand.stationSlug}/brand/${brand.slug}/radio?momentId=${activeMoment.id}`
                          );
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-bg-deep text-text text-sm font-medium hover:bg-white/5 transition-colors"
                      >
                        <Radio size={14} className="text-accent" />
                        Create Radio Ad
                      </button>

                      {/* Create Both — The Killer Feature */}
                      <button
                        onClick={() => {
                          if (onCreateBoth) {
                            onCreateBoth(activeMoment, generatedContent);
                          }
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-accent/40 bg-accent/5 text-accent text-sm font-semibold hover:bg-accent/15 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Create Both
                        <span className="text-[10px] font-mono text-accent/60 ml-1">
                          cross-media
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
