"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Share2,
  Zap,
  X,
  Play,
  Loader2,
  CheckCircle2,
  Music,
  Mic,
  ImageIcon,
  Volume2,
  TrendingUp,
  Send,
  Sun,
  Trophy,
  Newspaper,
  Palette,
  Car,
  Leaf,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand, MomentItem } from "@/lib/demo-data";
import type { GeneratedCopy, PublishResult } from "@/lib/social-engine/types";
import { generateScript } from "@/lib/audio-engine/script-generator";

// ─── Trigger Config (matches MomentCard) ─────────────────────────────────────
const TRIGGER_CONFIG: Record<
  string,
  { icon: typeof Sun; color: string; bg: string; label: string }
> = {
  weather:  { icon: Sun,           color: "text-blue-400",    bg: "bg-blue-400/10",    label: "Weather"  },
  sport:    { icon: Trophy,         color: "text-green-400",   bg: "bg-green-400/10",   label: "Sport"    },
  news:     { icon: Newspaper,      color: "text-purple-400",  bg: "bg-purple-400/10",  label: "News"     },
  culture:  { icon: Palette,        color: "text-pink-400",    bg: "bg-pink-400/10",    label: "Culture"  },
  traffic:  { icon: Car,            color: "text-orange-400",  bg: "bg-orange-400/10",  label: "Traffic"  },
  seasonal: { icon: Leaf,           color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Seasonal" },
  industry: { icon: Building2,      color: "text-cyan-400",    bg: "bg-cyan-400/10",    label: "Industry" },
  breaking: { icon: AlertTriangle,  color: "text-red-400",     bg: "bg-red-400/10",     label: "Breaking" },
};

// ─── POP Score Ring ───────────────────────────────────────────────────────────
function PopScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-11 h-11 shrink-0">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
        <motion.circle
          cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
          className={cn(score >= 80 ? "text-accent" : score >= 60 ? "text-yellow-400" : "text-orange-400")}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text">{score}</span>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ generating }: { generating: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all",
      generating ? "bg-amber-500/10 text-amber-400" : "bg-accent/10 text-accent"
    )}>
      {generating ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
      {generating ? "Generating…" : "Ready"}
    </div>
  );
}

// ─── Platform Badge ───────────────────────────────────────────────────────────
const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  x:         "bg-sky-500/10 text-sky-400 border-sky-500/20",
  linkedin:  "bg-blue-600/10 text-blue-400 border-blue-600/20",
};

function PlatformBadge({ platform }: { platform: string }) {
  const label = platform === "x" ? "X / Twitter" : platform.charAt(0).toUpperCase() + platform.slice(1);
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", PLATFORM_COLORS[platform] ?? "bg-border text-text-muted border-border")}>
      {label}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface CrossMediaBridgeProps {
  brand: Brand;
  moment: MomentItem;
  socialContent?: GeneratedCopy;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CrossMediaBridge({ brand, moment, socialContent, onClose }: CrossMediaBridgeProps) {
  // --- Radio state ---
  const [radioScript, setRadioScript]           = useState<string>("");
  const [radioAudioUrl, setRadioAudioUrl]       = useState<string | null>(null);
  const [isGeneratingRadio, setIsGeneratingRadio] = useState(true);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // --- Social state ---
  const [socialCopy, setSocialCopy]               = useState<GeneratedCopy | null>(socialContent ?? null);
  const [socialImageUrl, setSocialImageUrl]       = useState<string | null>(null);
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(!socialContent);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // --- Publish state ---
  const [isPublishing, setIsPublishing]           = useState(false);
  const [publishResults, setPublishResults]       = useState<PublishResult[] | null>(null);
  const [radioPublished, setRadioPublished]       = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const hasMounted = useRef(false);

  // ── Derived: trigger config ──────────────────────────────────────────────
  const triggerConfig = TRIGGER_CONFIG[moment.triggerType] ?? TRIGGER_CONFIG.news;
  const TriggerIcon = triggerConfig.icon;

  // ── Cross-media lift calculation ─────────────────────────────────────────
  const radioReach  = moment.popScore * 100;
  const socialReach = moment.popScore * 80;
  const combinedReach = radioReach + socialReach + radioReach * socialReach * 0.15;
  const singleBestReach = Math.max(radioReach, socialReach);
  const liftPct = Math.round(((combinedReach - singleBestReach) / singleBestReach) * 100);

  // ── Generate radio script on mount ──────────────────────────────────────
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    // Generate radio script using the local template engine (zero API cost)
    const generated = generateScript({
      brand: {
        name:             brand.name,
        locations:        brand.locations,
        logoLine:         brand.logoLine,
        sector:           brand.sectorName,
        voiceName:        brand.audioBrandKit.voiceName,
        voiceDescription: brand.audioBrandKit.voiceDescription,
      },
      promotion:    moment.suggestedAction,
      triggerType:  moment.triggerType.charAt(0).toUpperCase() + moment.triggerType.slice(1),
      triggerContext: moment.description,
      duration:     30,
      tone:         "friendly",
    });

    setTimeout(() => {
      setRadioScript(generated.fullText);
      setIsGeneratingRadio(false);
    }, 900);

    // Generate social copy if not pre-supplied
    if (!socialContent) {
      fetch("/api/social/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSlug:      brand.slug,
          momentId:       moment.id,
          momentContext:  `${moment.title}: ${moment.description}`,
          platforms:      ["instagram", "x", "linkedin"],
          contentType:    "quick",
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          // runSocialQualityChain returns { content, qualityScore, chainStage, retries }
          if (data?.content) {
            setSocialCopy(data.content);
          } else if (data?.platformVariants) {
            setSocialCopy(data as GeneratedCopy);
          }
        })
        .catch(() => {
          // Demo fallback
          setSocialCopy({
            platformVariants: {
              instagram: { text: `✨ ${moment.title} — and ${brand.name} is ready for it. ${brand.logoLine} 🎯`, hashtags: ["#moment", `#${brand.sectorId}`] },
              x:         { text: `${moment.title}. ${brand.name} has you covered. ${brand.logoLine}`, hashtags: [] },
              linkedin:  { text: `${moment.title}\n\nAt ${brand.name}, we believe in meeting the moment. ${brand.logoLine}`, hashtags: [`#${brand.sectorId}`, "#marketing"] },
            },
            momentRelevanceScore: moment.popScore,
            suggestedPublishTime:  "Now",
            toneAnalysis:          "On-brand, moment-led",
          });
        })
        .finally(() => setIsGeneratingSocial(false));
    }
  }, []);

  // ── Preview audio ────────────────────────────────────────────────────────
  async function handlePreviewAudio() {
    if (!radioScript) return;
    setIsGeneratingAudio(true);
    try {
      const voiceText = radioScript
        .replace(/\[.*?\]/g, "")
        .replace(/VOICE.*?:\n/g, "")
        .replace(/"/g, "")
        .replace(/\n{2,}/g, " ")
        .trim();

      const res = await fetch("/api/audio/voice-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: voiceText, voiceId: brand.audioBrandKit.voiceId }),
      });
      const data = await res.json();
      if (data?.url) setRadioAudioUrl(data.url);
    } catch {
      // API unavailable — demo state
    } finally {
      setIsGeneratingAudio(false);
    }
  }

  // ── Generate image ───────────────────────────────────────────────────────
  async function handleGenerateImage() {
    if (!socialCopy) return;
    setIsGeneratingImage(true);
    try {
      const prompt = socialCopy.platformVariants.instagram?.suggestedImagePrompt
        ?? `${brand.name} — ${moment.title}, ${brand.sectorName} brand, vibrant, modern`;

      const res = await fetch("/api/social/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform: "instagram", brandSlug: brand.slug, aspectRatio: "square" }),
      });
      const data = await res.json();
      if (data?.url) setSocialImageUrl(data.url);
    } catch {
      // Demo state
    } finally {
      setIsGeneratingImage(false);
    }
  }

  // ── Publish social ───────────────────────────────────────────────────────
  async function handlePublishSocial() {
    if (!socialCopy) return;
    setIsPublishing(true);
    try {
      const platforms = Object.keys(socialCopy.platformVariants);
      const content: Record<string, { text: string; imageUrl?: string; hashtags?: string[] }> = {};
      for (const platform of platforms) {
        const variant = socialCopy.platformVariants[platform as keyof typeof socialCopy.platformVariants];
        if (variant) {
          content[platform] = { text: variant.text, imageUrl: socialImageUrl ?? undefined, hashtags: variant.hashtags };
        }
      }
      const res = await fetch("/api/social/publish-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms, content, brandSlug: brand.slug, momentId: moment.id }),
      });
      const data = await res.json();
      if (data?.results) setPublishResults(data.results);
    } catch {
      setPublishResults([{ platform: "all", status: "not_configured" }]);
    } finally {
      setIsPublishing(false);
    }
  }

  // ── Publish all ──────────────────────────────────────────────────────────
  async function handlePublishAll() {
    setRadioPublished(true);
    await handlePublishSocial();
  }

  // ── ComProd score proxy ──────────────────────────────────────────────────
  const comProdScore = Math.min(100, Math.round(moment.popScore * 0.92 + 5));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="cmb-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 sm:items-center"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Bridge panel */}
        <motion.div
          key="cmb-panel"
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-bg-deep shadow-[0_0_80px_rgba(0,255,150,0.07)]"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Accent glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <div className="sticky top-0 z-10 border-b border-border bg-bg-deep/95 backdrop-blur-md px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                {/* Trigger icon */}
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", triggerConfig.bg)}>
                  <TriggerIcon size={18} className={triggerConfig.color} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Moment Detected</span>
                    {/* Trigger type badge */}
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border", triggerConfig.bg, triggerConfig.color, "border-current/20")}>
                      {triggerConfig.label}
                    </span>
                    {/* Timestamp */}
                    <span className="text-[10px] text-text-muted">{moment.timestamp}</span>
                  </div>
                  <h2 className="font-heading text-lg font-bold text-text leading-tight truncate">
                    {moment.title}
                  </h2>
                </div>

                {/* POP Score ring */}
                <div className="shrink-0 ml-2 flex flex-col items-center">
                  <PopScoreRing score={moment.popScore} />
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">POP</span>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-hover hover:text-text"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── BODY: two-panel split ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">

            {/* ══ LEFT — Radio Response ═══════════════════════════════════ */}
            <div className="p-6 space-y-5">
              {/* Panel header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                    <Radio size={14} className="text-accent" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-text">Radio Response</span>
                </div>
                <StatusBadge generating={isGeneratingRadio} />
              </div>

              {/* Script */}
              <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
                <div className="border-b border-border bg-bg-deep/50 px-4 py-2 flex items-center gap-2">
                  <Mic size={12} className="text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Script</span>
                </div>
                <div className="p-4 min-h-[120px]">
                  {isGeneratingRadio ? (
                    <div className="flex flex-col gap-2">
                      {[80, 65, 90, 55, 75].map((w, i) => (
                        <motion.div
                          key={i}
                          className="h-2 rounded-full bg-border"
                          style={{ width: `${w}%` }}
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-secondary">
                      {radioScript}
                    </pre>
                  )}
                </div>
              </div>

              {/* Voice & music info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-bg-card p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Mic size={11} className="text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Voice</span>
                  </div>
                  <p className="text-xs font-medium text-text">{brand.audioBrandKit.voiceName}</p>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{brand.audioBrandKit.voiceDescription}</p>
                </div>
                <div className="rounded-lg border border-border bg-bg-card p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Music size={11} className="text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Music</span>
                  </div>
                  <p className="text-xs font-medium text-text leading-tight">{brand.audioBrandKit.brandMusic}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Duration: 30s</p>
                </div>
              </div>

              {/* Preview Audio button */}
              {!isGeneratingRadio && (
                <div className="space-y-3">
                  {!radioAudioUrl ? (
                    <button
                      onClick={handlePreviewAudio}
                      disabled={isGeneratingAudio}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        isGeneratingAudio
                          ? "border-border text-text-muted cursor-not-allowed"
                          : "border-accent/30 text-accent hover:bg-accent/5 hover:border-accent/50"
                      )}
                    >
                      {isGeneratingAudio ? (
                        <><Loader2 size={15} className="animate-spin" /> Synthesising Voice…</>
                      ) : (
                        <><Volume2 size={15} /> Preview Audio</>
                      )}
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-accent/20 bg-accent/5 p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Play size={13} className="text-accent" />
                        <span className="text-[11px] font-bold text-text">Audio Preview</span>
                      </div>
                      <audio ref={audioRef} src={radioAudioUrl} controls className="w-full h-8 accent-accent" />
                    </motion.div>
                  )}

                  {/* ComProd Score */}
                  <div className="rounded-xl border border-border bg-bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">ComProd Score</span>
                      <span className={cn(
                        "text-[10px] font-bold rounded-full px-2 py-0.5",
                        comProdScore >= 75 ? "bg-accent/10 text-accent" : "bg-amber-500/10 text-amber-400"
                      )}>
                        {comProdScore >= 75 ? "Approved" : "Review"}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="font-heading text-3xl font-bold text-text">{comProdScore}</span>
                      <span className="text-sm text-text-muted">/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-bg-deep overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${comProdScore}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={cn("h-full rounded-full", comProdScore >= 75 ? "bg-accent" : "bg-amber-500")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ══ RIGHT — Social Response ══════════════════════════════════ */}
            <div className="p-6 space-y-5">
              {/* Panel header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                    <Share2 size={14} className="text-accent" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-text">Social Response</span>
                </div>
                <StatusBadge generating={isGeneratingSocial} />
              </div>

              {/* Platform variants */}
              <div className="space-y-3">
                {isGeneratingSocial ? (
                  ([["instagram", 75], ["x", 60], ["linkedin", 85]] as [string, number][]).map(([platform, w]) => (
                    <div key={platform} className="rounded-xl border border-border bg-bg-card p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <PlatformBadge platform={platform} />
                      </div>
                      <div className="space-y-2">
                        {[w, w * 0.85, w * 0.65].map((width, i) => (
                          <motion.div
                            key={i}
                            className="h-2 rounded-full bg-border"
                            style={{ width: `${width}%` }}
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : socialCopy ? (
                  (["instagram", "x", "linkedin"] as const).map((platform) => {
                    const variant = socialCopy.platformVariants[platform];
                    if (!variant) return null;
                    return (
                      <motion.div
                        key={platform}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-xl border border-border bg-bg-card p-4 hover:border-border-hover transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <PlatformBadge platform={platform} />
                          {variant.hashtags.length > 0 && (
                            <span className="text-[10px] text-text-muted">{variant.hashtags.length} tags</span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">{variant.text}</p>
                        {variant.hashtags.length > 0 && (
                          <p className="mt-2 text-[10px] text-accent/70 leading-relaxed">
                            {variant.hashtags.join(" ")}
                          </p>
                        )}
                      </motion.div>
                    );
                  })
                ) : null}
              </div>

              {/* Generate Image */}
              {!isGeneratingSocial && (
                <div className="space-y-3">
                  {!socialImageUrl ? (
                    <button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        isGeneratingImage
                          ? "border-border text-text-muted cursor-not-allowed"
                          : "border-accent/30 text-accent hover:bg-accent/5 hover:border-accent/50"
                      )}
                    >
                      {isGeneratingImage ? (
                        <><Loader2 size={15} className="animate-spin" /> Generating Image…</>
                      ) : (
                        <><ImageIcon size={15} /> Generate Image</>
                      )}
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative overflow-hidden rounded-xl border border-accent/20 aspect-square w-full max-w-[220px] mx-auto"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={socialImageUrl}
                        alt="Generated social image"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <span className="rounded-full bg-accent/90 px-2 py-0.5 text-[9px] font-bold text-bg uppercase">
                          Generated
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Publish results */}
                  {publishResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-accent/20 bg-accent/5 p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 size={14} className="text-accent" />
                        <span className="text-xs font-bold text-text">Publish Results</span>
                      </div>
                      <div className="space-y-1.5">
                        {publishResults.map((result, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <span className="text-text-muted capitalize">{result.platform}</span>
                            <span className={cn(
                              "font-medium",
                              result.status === "published" ? "text-accent" :
                              result.status === "failed" ? "text-red-400" : "text-amber-400"
                            )}>
                              {result.status === "published" ? "Published" :
                               result.status === "failed" ? "Failed" : "Not Configured"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── FOOTER ─────────────────────────────────────────────────── */}
          <div className="border-t border-border bg-bg-card/50 px-6 py-5 space-y-4">
            {/* Cross-media lift */}
            <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp size={16} className="text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-text">
                  Cross-Media Lift:{" "}
                  <span className="text-accent">+{liftPct}%</span>{" "}
                  <span className="text-text-muted font-normal">estimated reach vs single-channel</span>
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Radio reach: ~{radioReach.toLocaleString()} · Social reach: ~{socialReach.toLocaleString()} · Combined: ~{Math.round(combinedReach).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Publish buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Publish Radio Ad */}
              <button
                onClick={() => setRadioPublished(true)}
                disabled={isGeneratingRadio || radioPublished}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                  radioPublished
                    ? "border-accent/30 bg-accent/5 text-accent cursor-default"
                    : isGeneratingRadio
                    ? "border-border text-text-muted cursor-not-allowed opacity-50"
                    : "border-border text-text-secondary hover:border-border-hover hover:text-text"
                )}
              >
                {radioPublished ? (
                  <><CheckCircle2 size={15} className="text-accent" /> Scheduled</>
                ) : (
                  <><Radio size={15} /> Publish Radio Ad</>
                )}
              </button>

              {/* Publish Social Posts */}
              <button
                onClick={handlePublishSocial}
                disabled={isGeneratingSocial || isPublishing || !!publishResults}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                  publishResults
                    ? "border-accent/30 bg-accent/5 text-accent cursor-default"
                    : isGeneratingSocial || isPublishing
                    ? "border-border text-text-muted cursor-not-allowed opacity-50"
                    : "border-border text-text-secondary hover:border-border-hover hover:text-text"
                )}
              >
                {isPublishing ? (
                  <><Loader2 size={15} className="animate-spin" /> Publishing…</>
                ) : publishResults ? (
                  <><CheckCircle2 size={15} className="text-accent" /> Published</>
                ) : (
                  <><Share2 size={15} /> Publish Social Posts</>
                )}
              </button>

              {/* PUBLISH ALL — primary */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePublishAll}
                disabled={isGeneratingRadio || isGeneratingSocial || isPublishing || (radioPublished && !!publishResults)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all",
                  radioPublished && publishResults
                    ? "bg-accent/20 text-accent cursor-default"
                    : isGeneratingRadio || isGeneratingSocial || isPublishing
                    ? "bg-accent/30 text-bg/50 cursor-not-allowed"
                    : "bg-accent text-bg hover:bg-accent/90 shadow-[0_0_20px_rgba(0,255,150,0.25)]"
                )}
              >
                {isPublishing ? (
                  <><Loader2 size={15} className="animate-spin" /> Publishing All…</>
                ) : radioPublished && publishResults ? (
                  <><CheckCircle2 size={15} /> All Published</>
                ) : (
                  <><Zap size={15} /> PUBLISH ALL</>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
