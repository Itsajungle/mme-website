"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Play,
  User,
  Clapperboard,
  Check,
  Loader2,
  Clock,
  Sparkles,
  ImageIcon,
  Volume2,
  Download,
  ChevronDown,
  ChevronUp,
  Mic,
  RotateCcw,
  Monitor,
  Square,
  Smartphone,
  Pencil,
  Eye,
  AlertCircle,
  MapPin,
  Car,
  Tag,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import type {
  AspectRatio,
  ClipType,
  ClipStatus,
  TimelineClip,
  GeneratedScript,
  Avatar,
  PipelineStage,
  ImageSource,
  LowerThirdData,
  CampaignBrief,
  RenderSegment,
  RenderOverlay,
} from "@/types/video-production";

interface ProductionComposerAppProps {
  brand: Brand;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { value: "9:16", label: "9:16", icon: <Smartphone size={12} /> },
  { value: "16:9", label: "16:9", icon: <Monitor size={12} /> },
  { value: "1:1", label: "1:1", icon: <Square size={12} /> },
];

const CLIP_TYPE_CONFIG: Record<ClipType, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  remotion_intro: { label: "Brand Intro", color: "text-red-400", bgColor: "bg-red-400/10", icon: <Film size={12} /> },
  presenter: { label: "Presenter", color: "text-blue-400", bgColor: "bg-blue-400/10", icon: <User size={12} /> },
  image_overlay: { label: "Showcase", color: "text-emerald-400", bgColor: "bg-emerald-400/10", icon: <ImageIcon size={12} /> },
  remotion_offer: { label: "Offer Card", color: "text-red-400", bgColor: "bg-red-400/10", icon: <Tag size={12} /> },
  remotion_outro: { label: "Brand Outro", color: "text-red-400", bgColor: "bg-red-400/10", icon: <Film size={12} /> },
};

const DEFAULT_CLIPS: TimelineClip[] = [
  { clipNumber: 1, type: "remotion_intro", label: "Brand Intro", duration: 3, status: "pending", notes: "Animated logo reveal" },
  { clipNumber: 2, type: "presenter", label: "Presenter Intro", duration: 10, status: "pending" },
  { clipNumber: 3, type: "image_overlay", label: "Product Showcase", duration: 12, status: "pending" },
  { clipNumber: 4, type: "presenter", label: "Presenter Offer", duration: 10, status: "pending" },
  { clipNumber: 5, type: "remotion_offer", label: "Offer Card", duration: 5, status: "pending" },
  { clipNumber: 6, type: "presenter", label: "Presenter CTA", duration: 8, status: "pending" },
  { clipNumber: 7, type: "remotion_outro", label: "Brand Outro", duration: 3, status: "pending" },
];

function getClipStartTime(clips: TimelineClip[], clipIndex: number): number {
  return clips.slice(0, clipIndex).reduce((sum, c) => sum + c.duration, 0);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ClipStatusBadge({ status }: { status: ClipStatus }) {
  const config: Record<ClipStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: "Pending", color: "text-text-muted", icon: <Clock size={10} /> },
    generating: { label: "Generating", color: "text-yellow-400", icon: <Loader2 size={10} className="animate-spin" /> },
    complete: { label: "Complete", color: "text-accent", icon: <Check size={10} /> },
    error: { label: "Error", color: "text-red-400", icon: <AlertCircle size={10} /> },
  };
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-mono", c.color)}>
      {c.icon}
      {c.label}
    </span>
  );
}

function TimelineStrip({ clips, expandedClip, onToggle }: {
  clips: TimelineClip[];
  expandedClip: number | null;
  onToggle: (n: number) => void;
}) {
  const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);

  return (
    <div className="space-y-2">
      {/* Visual timeline bar */}
      <div className="flex gap-0.5 h-10 rounded-lg overflow-hidden border border-border">
        {clips.map((clip) => {
          const widthPct = (clip.duration / totalDuration) * 100;
          const typeConfig = CLIP_TYPE_CONFIG[clip.type];
          return (
            <button
              key={clip.clipNumber}
              onClick={() => onToggle(clip.clipNumber)}
              className={cn(
                "relative flex items-center justify-center transition-all hover:brightness-125",
                typeConfig.bgColor,
                expandedClip === clip.clipNumber && "ring-1 ring-white/30"
              )}
              style={{ width: `${widthPct}%` }}
            >
              <span className={cn("text-[9px] font-mono font-bold", typeConfig.color)}>
                {clip.clipNumber}
              </span>
              {clip.status === "generating" && (
                <Loader2 size={8} className="absolute top-1 right-1 animate-spin text-yellow-400" />
              )}
              {clip.status === "complete" && (
                <Check size={8} className="absolute top-1 right-1 text-accent" />
              )}
              {clip.status === "error" && (
                <AlertCircle size={8} className="absolute top-1 right-1 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Duration labels */}
      <div className="flex gap-0.5">
        {clips.map((clip) => {
          const widthPct = (clip.duration / totalDuration) * 100;
          return (
            <div key={clip.clipNumber} className="text-center" style={{ width: `${widthPct}%` }}>
              <span className="text-[8px] text-text-muted font-mono">{clip.duration}s</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function ProductionComposerApp({ brand }: ProductionComposerAppProps) {
  // Campaign brief
  const [brief, setBrief] = useState<CampaignBrief>({ concept: "" });

  // Presenter / voice
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("");
  const [avatarsLoading, setAvatarsLoading] = useState(false);
  const [voices, setVoices] = useState<{ voiceId: string; name: string; accent?: string }[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState(brand.audioBrandKit.voiceId);
  const [voicesLoading, setVoicesLoading] = useState(false);

  // Lower third
  const [lowerThird, setLowerThird] = useState<LowerThirdData>({ name: "", title: "" });

  // Aspect ratio
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");

  // Image source for clip 3
  const [imageSource, setImageSource] = useState<ImageSource>("ai_generated");

  // Timeline clips
  const [clips, setClips] = useState<TimelineClip[]>(DEFAULT_CLIPS);
  const [expandedClip, setExpandedClip] = useState<number | null>(null);

  // Script state
  const [scriptGenerated, setScriptGenerated] = useState(false);
  const [scriptEditing, setScriptEditing] = useState(false);

  // Pipeline state
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("idle");
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [presenterVideosReady, setPresenterVideosReady] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [composedVideoUrl, setComposedVideoUrl] = useState<string | null>(null);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Demo mode
  const [demoMode, setDemoMode] = useState(false);

  // Polling refs
  const pollingRef = useRef<Record<string, NodeJS.Timeout>>({});
  const composePollingRef = useRef<NodeJS.Timeout | null>(null);

  // Voice map from API (avatar_id → ElevenLabs voice_id)
  const [avatarVoiceMap, setAvatarVoiceMap] = useState<Record<string, string>>({});

  // ─── Fetch avatars ──────────────────────────────────────────────────────

  useEffect(() => {
    setAvatarsLoading(true);
    fetch("/api/video/list-presenters")
      .then((r) => r.json())
      .then((data) => {
        const list: Avatar[] = data.avatars ?? [];
        setAvatars(list);
        if (data.voiceMap) setAvatarVoiceMap(data.voiceMap);
        const defaultId = data.defaultAvatarId || "Marcus_Suit_Front_public";
        if (!selectedAvatarId) {
          setSelectedAvatarId(defaultId);
          if (data.voiceMap?.[defaultId]) {
            setSelectedVoiceId(data.voiceMap[defaultId]);
          }
        }
      })
      .catch(() => {
        setAvatars([
          { avatar_id: "demo-1", avatar_name: "Aria", preview_image_url: "", group: "stock" },
          { avatar_id: "demo-2", avatar_name: "Marcus", preview_image_url: "", group: "stock" },
        ]);
      })
      .finally(() => setAvatarsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Fetch voices ──────────────────────────────────────────────────────

  useEffect(() => {
    setVoicesLoading(true);
    fetch("/api/audio/voices")
      .then((r) => r.json())
      .then((data) => {
        const list = data.voices ?? [];
        setVoices(list);
      })
      .catch(() => setVoices([]))
      .finally(() => setVoicesLoading(false));
  }, []);

  // ─── Cleanup polling on unmount ─────────────────────────────────────────

  useEffect(() => {
    return () => {
      Object.values(pollingRef.current).forEach(clearInterval);
      if (composePollingRef.current) clearInterval(composePollingRef.current);
    };
  }, []);

  // ─── Update clip helper ─────────────────────────────────────────────────

  const updateClip = useCallback((clipNumber: number, patch: Partial<TimelineClip>) => {
    setClips((prev) =>
      prev.map((c) => (c.clipNumber === clipNumber ? { ...c, ...patch } : c))
    );
  }, []);

  // ─── Generate Script ────────────────────────────────────────────────────

  const handleGenerateScript = async () => {
    if (!brief.concept.trim()) return;
    setPipelineStage("script");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/video/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: brief.concept,
          carMake: brief.carMake,
          carModel: brief.carModel,
          carYear: brief.carYear,
          dealDetails: brief.dealDetails,
          location: brief.location,
          brandName: brand.name,
          brandSlug: brand.slug,
          logoLine: brand.logoLine,
          locations: brand.locations,
          sectorName: brand.sectorName,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = typeof errData?.error === "string" ? errData.error : JSON.stringify(errData?.error ?? `Status ${res.status}`);
        throw new Error(errMsg || "Script generation failed");
      }

      const script: GeneratedScript = await res.json();

      // Map script clips to timeline
      const newClips: TimelineClip[] = script.clips.map((sc) => ({
        clipNumber: sc.clipNumber,
        type: sc.type,
        label: DEFAULT_CLIPS.find((d) => d.clipNumber === sc.clipNumber)?.label ?? `Clip ${sc.clipNumber}`,
        duration: sc.duration,
        status: "pending" as ClipStatus,
        script: sc.script,
        direction: sc.direction,
        imagePrompt: sc.imagePrompt,
        offerData: sc.offerData,
        notes: sc.notes,
      }));

      setClips(newClips);
      setScriptGenerated(true);
      setPipelineStage("idle");
    } catch (err) {
      console.error("[generate-script]", err);
      setErrorMessage(err instanceof Error ? err.message : "Script generation failed");
      setPipelineStage("error");
    }
  };

  // ─── Poll presenter video status ────────────────────────────────────────

  const pollPresenterStatus = useCallback(
    (videoId: string, clipNumber: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 120; // 10 minutes at 5s intervals
        const interval = setInterval(async () => {
          attempts++;
          try {
            const res = await fetch(`/api/video/presenter-status?videoId=${videoId}`);
            const data = await res.json();

            if (data.status === "completed") {
              clearInterval(interval);
              delete pollingRef.current[`clip-${clipNumber}`];
              resolve(data.video_url ?? "");
            } else if (data.status === "failed" || attempts >= maxAttempts) {
              clearInterval(interval);
              delete pollingRef.current[`clip-${clipNumber}`];
              reject(new Error(data.error || "Presenter video generation timed out"));
            }
          } catch {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              delete pollingRef.current[`clip-${clipNumber}`];
              reject(new Error("Polling failed"));
            }
          }
        }, 5000);

        pollingRef.current[`clip-${clipNumber}`] = interval;
      });
    },
    []
  );

  // ─── Produce Video (full pipeline) ──────────────────────────────────────

  const handleProduceVideo = async () => {
    setErrorMessage(null);
    setComposedVideoUrl(null);
    setRenderId(null);
    setPresenterVideosReady(false);
    setImageReady(false);

    // Validate before starting
    if (!selectedAvatarId) {
      setErrorMessage("Please select an AI Presenter before producing.");
      return;
    }
    if (!selectedVoiceId) {
      setErrorMessage("Please select a voice before producing.");
      return;
    }
    if (!brief.concept.trim()) {
      setErrorMessage("Please enter a campaign brief before producing.");
      return;
    }

    // Stage 1: Script (if not ready)
    if (!scriptGenerated) {
      await handleGenerateScript();
    }

    // Stage 2: Presenter Videos (clips 2, 4, 6 — in parallel)
    setPipelineStage("presenter_videos");
    setPipelineProgress(10);
    const presenterClips = clips.filter((c) => c.type === "presenter" && c.script);

    try {
      // Launch all presenter clips in parallel
      const presenterPromises = presenterClips.map(async (clip) => {
        updateClip(clip.clipNumber, { status: "generating" });

        if (demoMode) {
          // In demo mode, simulate a delay and return empty URL
          await new Promise((r) => setTimeout(r, 2000));
          updateClip(clip.clipNumber, { status: "complete", videoUrl: "" });
          return { clipNumber: clip.clipNumber, videoUrl: "" };
        }

        const res = await fetch("/api/video/generate-presenter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scriptText: clip.script,
            avatarId: selectedAvatarId,
            voiceId: selectedVoiceId,
            aspectRatio,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = typeof errData?.error === "string" ? errData.error : JSON.stringify(errData?.error ?? `Status ${res.status}`);
          throw new Error(errMsg || `Presenter generation failed for clip ${clip.clipNumber}`);
        }

        const data = await res.json();
        const videoUrl = await pollPresenterStatus(data.video_id, clip.clipNumber);
        updateClip(clip.clipNumber, { status: "complete", videoUrl });
        return { clipNumber: clip.clipNumber, videoUrl };
      });

      const presenterResults = await Promise.all(presenterPromises);
      setPresenterVideosReady(true);
      setPipelineProgress(50);

      // Stage 3: Clip 3 Image
      setPipelineStage("images");
      const clip3 = clips.find((c) => c.clipNumber === 3);
      let clip3ImageUrl = "";

      if (clip3) {
        updateClip(3, { status: "generating" });

        if (imageSource === "ai_generated" && clip3.imagePrompt) {
          try {
            const res = await fetch("/api/social/generate-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: clip3.imagePrompt,
                platform: "instagram",
                brandSlug: brand.slug,
                aspectRatio: aspectRatio === "9:16" ? "portrait" : aspectRatio === "1:1" ? "square" : "landscape",
              }),
            });
            const data = await res.json();
            clip3ImageUrl = data?.url ?? "";
          } catch {
            // Fall back to brand kit placeholder
            clip3ImageUrl = `/brands/tadg-riordan/${brief.location === "Tallaght Garage" ? "tallaght-garage.webp" : "ashbourne-garage.webp"}`;
          }
        } else {
          clip3ImageUrl = `/brands/tadg-riordan/${brief.location === "Tallaght Garage" ? "tallaght-garage.webp" : "ashbourne-garage.webp"}`;
        }

        updateClip(3, { status: "complete", imageUrl: clip3ImageUrl });
      }

      setImageReady(true);
      setPipelineProgress(70);

      // Stage 4: Composition
      setPipelineStage("composition");
      updateClip(1, { status: "complete" });
      updateClip(5, { status: "complete" });
      updateClip(7, { status: "complete" });

      const logoUrl = "/brands/tadg-riordan/logo-dark.png";

      // Build segments
      const segments: RenderSegment[] = [];
      const overlays: RenderOverlay[] = [];

      for (const clip of clips) {
        if (clip.type === "remotion_intro") {
          segments.push({
            type: "remotion",
            template: "LogoReveal",
            duration: clip.duration,
            props: { logoUrl, logoColor: "#E31E24", tagline: brand.logoLine, backgroundColor: "#E31E24" },
          });
        } else if (clip.type === "presenter") {
          const result = presenterResults.find((r) => r.clipNumber === clip.clipNumber);
          segments.push({
            type: "heygen",
            videoUrl: result?.videoUrl ?? "",
            duration: clip.duration,
          });

          // Add lower third overlay
          if (lowerThird.name) {
            const startTime = getClipStartTime(clips, clips.indexOf(clip)) + 2;
            overlays.push({
              template: "LowerThird",
              startTime,
              duration: 5,
              mode: "overlay",
              props: { name: lowerThird.name, title: lowerThird.title },
            });
          }
        } else if (clip.type === "image_overlay") {
          // Clip 3 — the presenter video continues underneath, with image overlay
          const clip3Presenter = presenterResults.find((r) => r.clipNumber === 3);
          // Use clip 2's continued video, or a separate generation
          segments.push({
            type: "heygen",
            videoUrl: clip3Presenter?.videoUrl ?? presenterResults[0]?.videoUrl ?? "",
            duration: clip.duration,
          });
          overlays.push({
            template: "ProductShowcase",
            startTime: getClipStartTime(clips, clips.indexOf(clip)),
            duration: clip.duration,
            mode: "fullscreen",
            props: { imageUrl: clip3ImageUrl },
          });
        } else if (clip.type === "remotion_offer") {
          segments.push({
            type: "remotion",
            template: "StatCard",
            duration: clip.duration,
            props: {
              stat: clip.offerData?.price ?? "",
              label: clip.offerData?.headline ?? "",
              subtitle: [clip.offerData?.finance, clip.offerData?.terms].filter(Boolean).join(" | "),
              color: "#E31E24",
            },
          });
        } else if (clip.type === "remotion_outro") {
          segments.push({
            type: "remotion",
            template: "LogoReveal",
            duration: clip.duration,
            props: { logoUrl, logoColor: "#E31E24", variant: "outro" },
          });
        }
      }

      // Submit composition
      const composeRes = await fetch("/api/video/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segments, overlays, platform: "instagram", aspectRatio }),
      });

      if (!composeRes.ok) {
        const errData = await composeRes.json().catch(() => ({}));
        const errMsg = typeof errData?.error === "string" ? errData.error : JSON.stringify(errData?.error ?? `Status ${composeRes.status}`);
        throw new Error(errMsg || "Composition failed");
      }

      const composeData = await composeRes.json();
      const newRenderId = composeData.renderId;
      setRenderId(newRenderId);
      setPipelineProgress(80);

      // Poll composition status
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const res = await fetch(`/api/video/compose-status?renderId=${newRenderId}`);
            const data = await res.json();
            setPipelineProgress(80 + Math.min(data.progress ?? 0, 100) * 0.2);

            if (data.status === "completed") {
              clearInterval(interval);
              composePollingRef.current = null;
              setComposedVideoUrl(data.outputUrl ?? `/api/video/compose-download?renderId=${newRenderId}`);
              resolve();
            } else if (data.status === "failed" || attempts >= 60) {
              clearInterval(interval);
              composePollingRef.current = null;
              reject(new Error(data.error || "Composition timed out"));
            }
          } catch {
            if (attempts >= 60) {
              clearInterval(interval);
              composePollingRef.current = null;
              reject(new Error("Composition polling failed"));
            }
          }
        }, 5000);
        composePollingRef.current = interval;
      });

      setPipelineStage("complete");
      setPipelineProgress(100);
    } catch (err) {
      console.error("[produce-video]", err);
      const msg = err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : "Production failed — check console for details";
      setErrorMessage(msg);
      setPipelineStage("error");
    }
  };

  // ─── Retry single clip ──────────────────────────────────────────────────

  const handleRetryClip = async (clipNumber: number) => {
    const clip = clips.find((c) => c.clipNumber === clipNumber);
    if (!clip) return;

    updateClip(clipNumber, { status: "generating", error: undefined });

    try {
      if (clip.type === "presenter" && clip.script) {
        const res = await fetch("/api/video/generate-presenter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scriptText: clip.script,
            avatarId: selectedAvatarId,
            voiceId: selectedVoiceId,
            aspectRatio,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const videoUrl = await pollPresenterStatus(data.video_id, clipNumber);
        updateClip(clipNumber, { status: "complete", videoUrl });
      } else if (clip.type === "image_overlay" && clip.imagePrompt) {
        const res = await fetch("/api/social/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: clip.imagePrompt,
            platform: "instagram",
            brandSlug: brand.slug,
          }),
        });
        const data = await res.json();
        updateClip(clipNumber, { status: "complete", imageUrl: data?.url });
      }
    } catch (err) {
      updateClip(clipNumber, {
        status: "error",
        error: err instanceof Error ? err.message : "Retry failed",
      });
    }
  };

  // ─── Derived state ──────────────────────────────────────────────────────

  const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);
  const isProducing = ["script", "presenter_videos", "images", "composition"].includes(pipelineStage);
  const stageLabels: Record<PipelineStage, string> = {
    idle: "Ready",
    script: "Generating script...",
    presenter_videos: "Generating presenter videos...",
    images: "Generating images...",
    composition: "Composing final video...",
    complete: "Production complete",
    error: "Error occurred",
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Error Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 mx-6 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
          >
            <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <p className="flex-1 text-xs text-red-300">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200 transition-colors text-xs">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Clapperboard size={18} className="text-accent" />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-lg font-semibold text-text">Production Composer</h2>
          <p className="text-xs text-text-muted">{brand.name} — 7-Clip Video Ad</p>
        </div>

        {/* Demo mode toggle */}
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={cn(
            "px-2.5 py-1 rounded text-[10px] font-mono transition-all border",
            demoMode
              ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
              : "border-border bg-bg-deep text-text-muted hover:text-text"
          )}
        >
          {demoMode ? "Demo Mode" : "Live Mode"}
        </button>

        {/* Aspect ratio selector */}
        <div className="flex items-center gap-1 bg-bg-deep rounded-lg p-1 border border-border">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.value}
              onClick={() => setAspectRatio(ar.value)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all",
                aspectRatio === ar.value ? "bg-accent/20 text-accent" : "text-text-muted hover:text-text"
              )}
            >
              {ar.icon}
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* ─── Left Column: Campaign Brief + Script + Timeline ─────────── */}
        <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-border">
          {/* Campaign Brief */}
          <div className="p-6 border-b border-border space-y-4">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1.5">
              <FileText size={10} />
              Campaign Brief
            </label>

            <textarea
              value={brief.concept}
              onChange={(e) => setBrief((p) => ({ ...p, concept: e.target.value }))}
              placeholder="Describe the video ad concept... e.g. 'Spring sale on the new 2024 Toyota Corolla — zero deposit, finance from €299/month at Ashbourne'"
              className="w-full h-24 bg-bg-deep border border-border rounded-lg p-4 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1">
                  <Car size={9} /> Make
                </label>
                <input
                  value={brief.carMake ?? ""}
                  onChange={(e) => setBrief((p) => ({ ...p, carMake: e.target.value }))}
                  placeholder="Toyota"
                  className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-text-muted font-mono">Model</label>
                <input
                  value={brief.carModel ?? ""}
                  onChange={(e) => setBrief((p) => ({ ...p, carModel: e.target.value }))}
                  placeholder="Corolla"
                  className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-text-muted font-mono">Year</label>
                <input
                  value={brief.carYear ?? ""}
                  onChange={(e) => setBrief((p) => ({ ...p, carYear: e.target.value }))}
                  placeholder="2024"
                  className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1">
                  <MapPin size={9} /> Location
                </label>
                <select
                  value={brief.location ?? ""}
                  onChange={(e) => setBrief((p) => ({ ...p, location: e.target.value }))}
                  className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-accent/50"
                >
                  <option value="">Select...</option>
                  {brand.locations.map((loc) => (
                    <option key={loc.name} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1">
                <Tag size={9} /> Deal Details
              </label>
              <input
                value={brief.dealDetails ?? ""}
                onChange={(e) => setBrief((p) => ({ ...p, dealDetails: e.target.value }))}
                placeholder="€22,995, from €299/month, zero deposit, 5-year warranty"
                className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateScript}
                disabled={!brief.concept.trim() || pipelineStage === "script"}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
                  pipelineStage === "script"
                    ? "bg-yellow-400/10 text-yellow-400 cursor-wait"
                    : brief.concept.trim()
                    ? "bg-accent/10 text-accent hover:bg-accent/20"
                    : "bg-white/5 text-text-muted cursor-not-allowed"
                )}
              >
                {pipelineStage === "script" ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    Generate Script
                  </>
                )}
              </button>

              {scriptGenerated && (
                <button
                  onClick={() => setScriptEditing(!scriptEditing)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text transition-colors border border-border hover:border-accent/30"
                >
                  {scriptEditing ? <Eye size={12} /> : <Pencil size={12} />}
                  {scriptEditing ? "Preview" : "Edit Script"}
                </button>
              )}
            </div>
          </div>

          {/* ─── Script Preview / Edit Panel ─── */}
          {scriptGenerated && (
            <div className="p-6 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1.5">
                  <FileText size={10} />
                  Full Script — {clips.filter(c => c.script).length} spoken clips
                </label>
                <button
                  onClick={() => setScriptEditing(!scriptEditing)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium text-text-muted hover:text-text transition-colors border border-border hover:border-accent/30"
                >
                  {scriptEditing ? <Eye size={10} /> : <Pencil size={10} />}
                  {scriptEditing ? "Lock Script" : "Edit Script"}
                </button>
              </div>
              <div className="rounded-lg border border-border bg-black/20 max-h-[320px] overflow-y-auto divide-y divide-border/30">
                {clips.map((clip) => {
                  const typeConfig = CLIP_TYPE_CONFIG[clip.type];
                  const hasSpokenContent = clip.script || clip.type === "presenter" || clip.type === "image_overlay";
                  return (
                    <div key={clip.clipNumber} className="px-4 py-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold", typeConfig.bgColor, typeConfig.color)}>
                          {clip.clipNumber}
                        </div>
                        <span className="text-[11px] text-text font-medium">{clip.label}</span>
                        <span className="text-[10px] text-text-muted">{clip.duration}s</span>
                        {clip.type.startsWith("remotion") && (
                          <span className="text-[9px] text-red-400/60 font-mono ml-auto">Motion graphic</span>
                        )}
                      </div>
                      {clip.script ? (
                        scriptEditing ? (
                          <textarea
                            value={clip.script}
                            onChange={(e) => updateClip(clip.clipNumber, { script: e.target.value })}
                            className="w-full bg-black/30 border border-border/50 rounded p-2 text-xs text-text resize-none focus:outline-none focus:border-accent/50 leading-relaxed"
                            rows={Math.max(2, Math.ceil(clip.script.length / 80))}
                          />
                        ) : (
                          <p className="text-[11px] text-text/80 leading-relaxed border-l-2 border-accent/20 pl-3 italic">
                            &ldquo;{clip.script}&rdquo;
                          </p>
                        )
                      ) : clip.notes ? (
                        <p className="text-[10px] text-text-muted italic">{clip.notes}</p>
                      ) : clip.offerData ? (
                        <div className="text-[10px] text-text-muted">
                          {clip.offerData.headline} — {clip.offerData.price} | {clip.offerData.finance}
                        </div>
                      ) : null}
                      {clip.direction && (
                        <p className="text-[9px] text-blue-400/60 font-mono">
                          Direction: {clip.direction}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {scriptEditing && (
                <p className="text-[9px] text-amber-400/60 font-mono text-center">
                  Editing mode — changes are saved automatically. Click &quot;Lock Script&quot; when done.
                </p>
              )}
            </div>
          )}

          {/* 7-Clip Timeline */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                7-Clip Timeline — {formatDuration(totalDuration)}
              </label>
              {scriptGenerated && (
                <span className="text-[10px] text-accent font-mono flex items-center gap-1">
                  <Check size={10} />
                  Script Ready
                </span>
              )}
            </div>

            <TimelineStrip clips={clips} expandedClip={expandedClip} onToggle={(n) => setExpandedClip(expandedClip === n ? null : n)} />

            {/* Clip detail cards */}
            <div className="space-y-2">
              {clips.map((clip) => {
                const typeConfig = CLIP_TYPE_CONFIG[clip.type];
                const isExpanded = expandedClip === clip.clipNumber;

                return (
                  <motion.div
                    key={clip.clipNumber}
                    className={cn(
                      "rounded-lg border transition-colors",
                      isExpanded ? "border-white/20 bg-bg-deep" : "border-border bg-bg-deep/50"
                    )}
                    layout
                  >
                    {/* Clip header */}
                    <button
                      onClick={() => setExpandedClip(isExpanded ? null : clip.clipNumber)}
                      className="w-full flex items-center gap-3 p-3"
                    >
                      <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0", typeConfig.bgColor)}>
                        <span className={cn("text-xs font-bold", typeConfig.color)}>{clip.clipNumber}</span>
                      </div>
                      <div className={cn("shrink-0", typeConfig.color)}>{typeConfig.icon}</div>
                      <div className="flex-1 text-left">
                        <span className="text-xs text-text font-medium">{clip.label}</span>
                        <span className="text-[10px] text-text-muted ml-2">{clip.duration}s</span>
                      </div>
                      <ClipStatusBadge status={clip.status} />
                      {clip.status === "error" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRetryClip(clip.clipNumber); }}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <RotateCcw size={12} />
                        </button>
                      )}
                      {isExpanded ? <ChevronUp size={12} className="text-text-muted" /> : <ChevronDown size={12} className="text-text-muted" />}
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 space-y-2 border-t border-border/50 pt-2">
                            {/* Script text */}
                            {clip.script && (
                              <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-wider text-text-muted font-mono">Script</label>
                                {scriptEditing ? (
                                  <textarea
                                    value={clip.script}
                                    onChange={(e) => updateClip(clip.clipNumber, { script: e.target.value })}
                                    className="w-full bg-black/20 border border-border rounded p-2 text-xs text-text resize-none focus:outline-none focus:border-accent/50"
                                    rows={3}
                                  />
                                ) : (
                                  <p className="text-[11px] text-text-muted italic leading-snug border-l-2 border-accent/30 pl-2">
                                    &ldquo;{clip.script}&rdquo;
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Direction */}
                            {clip.direction && (
                              <p className="text-[10px] text-text-muted">
                                <span className="text-blue-400 font-mono">Direction:</span> {clip.direction}
                              </p>
                            )}

                            {/* Image prompt for clip 3 */}
                            {clip.imagePrompt && (
                              <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-wider text-text-muted font-mono">Image Prompt</label>
                                <p className="text-[10px] text-emerald-400/70">{clip.imagePrompt}</p>
                              </div>
                            )}

                            {/* Offer data for clip 5 */}
                            {clip.offerData && (
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(clip.offerData).map(([key, val]) => (
                                  <div key={key} className="text-[10px]">
                                    <span className="text-text-muted font-mono capitalize">{key}: </span>
                                    <span className="text-text">{val}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Notes */}
                            {clip.notes && (
                              <p className="text-[10px] text-text-muted italic">{clip.notes}</p>
                            )}

                            {/* Error */}
                            {clip.error && (
                              <p className="text-[10px] text-red-400">{clip.error}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Clip 3 image source toggle */}
            {scriptGenerated && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-deep p-3">
                <ImageIcon size={14} className="text-emerald-400 shrink-0" />
                <span className="text-xs text-text-muted">Clip 3 Image:</span>
                <div className="flex items-center gap-1 bg-black/20 rounded-lg p-0.5">
                  <button
                    onClick={() => setImageSource("ai_generated")}
                    className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-medium transition-all",
                      imageSource === "ai_generated" ? "bg-emerald-400/20 text-emerald-400" : "text-text-muted hover:text-text"
                    )}
                  >
                    AI Generated
                  </button>
                  <button
                    onClick={() => setImageSource("brand_kit")}
                    className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-medium transition-all",
                      imageSource === "brand_kit" ? "bg-emerald-400/20 text-emerald-400" : "text-text-muted hover:text-text"
                    )}
                  >
                    Brand Kit Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column: Presenter, Voice, Lower Third, Status, Preview ─── */}
        <div className="divide-y divide-border">
          {/* AI Presenter Selector */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1.5">
              <User size={10} />
              AI Presenter
            </label>
            {avatarsLoading ? (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Loader2 size={12} className="animate-spin" />
                Loading presenters...
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-3">
                {/* Stock Presenters */}
                {avatars.filter((a) => a.group !== "custom").length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-text-muted font-mono mb-1.5">Stock Presenters</p>
                    <div className="grid grid-cols-2 gap-2">
                      {avatars.filter((a) => a.group !== "custom").map((avatar) => (
                        <button
                          key={avatar.avatar_id}
                          onClick={() => {
                            setSelectedAvatarId(avatar.avatar_id);
                            if (avatarVoiceMap[avatar.avatar_id]) {
                              setSelectedVoiceId(avatarVoiceMap[avatar.avatar_id]);
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center",
                            selectedAvatarId === avatar.avatar_id
                              ? "border-accent bg-accent/10"
                              : "border-border bg-bg-deep hover:border-border"
                          )}
                        >
                          {avatar.preview_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatar.preview_image_url}
                              alt={avatar.avatar_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              selectedAvatarId === avatar.avatar_id ? "bg-accent/20" : "bg-white/5"
                            )}>
                              <User size={16} className={selectedAvatarId === avatar.avatar_id ? "text-accent" : "text-text-muted"} />
                            </div>
                          )}
                          <span className="text-[11px] text-text font-medium truncate w-full">{avatar.avatar_name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Custom Presenters */}
                {avatars.filter((a) => a.group === "custom").length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-text-muted font-mono mb-1.5">Custom Presenters</p>
                    <div className="grid grid-cols-2 gap-2">
                      {avatars.filter((a) => a.group === "custom").map((avatar) => (
                        <button
                          key={avatar.avatar_id}
                          onClick={() => {
                            setSelectedAvatarId(avatar.avatar_id);
                            if (avatarVoiceMap[avatar.avatar_id]) {
                              setSelectedVoiceId(avatarVoiceMap[avatar.avatar_id]);
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center",
                            selectedAvatarId === avatar.avatar_id
                              ? "border-accent bg-accent/10"
                              : "border-border bg-bg-deep hover:border-border"
                          )}
                        >
                          {avatar.preview_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatar.preview_image_url}
                              alt={avatar.avatar_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              selectedAvatarId === avatar.avatar_id ? "bg-accent/20" : "bg-white/5"
                            )}>
                              <User size={16} className={selectedAvatarId === avatar.avatar_id ? "text-accent" : "text-text-muted"} />
                            </div>
                          )}
                          <span className="text-[11px] text-text font-medium truncate w-full">{avatar.avatar_name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voice Selector */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1.5">
              <Mic size={10} />
              AI Voice
            </label>
            {voicesLoading ? (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Loader2 size={12} className="animate-spin" />
                Loading voices...
              </div>
            ) : (
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-accent/50"
              >
                {voices.length > 0 ? (
                  voices.map((v) => (
                    <option key={v.voiceId} value={v.voiceId}>
                      {v.name} {v.accent ? `(${v.accent})` : ""}
                    </option>
                  ))
                ) : (
                  <option value={brand.audioBrandKit.voiceId}>
                    {brand.audioBrandKit.voiceName} — {brand.audioBrandKit.voiceDescription}
                  </option>
                )}
              </select>
            )}
            <p className="text-[9px] text-text-muted font-mono">
              Default: {brand.audioBrandKit.voiceName} ({brand.audioBrandKit.voiceDescription})
            </p>
          </div>

          {/* Lower Third */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Lower Third</label>
            <input
              value={lowerThird.name}
              onChange={(e) => setLowerThird((p) => ({ ...p, name: e.target.value }))}
              placeholder="Name (e.g. Tadg Riordan)"
              className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
            />
            <input
              value={lowerThird.title}
              onChange={(e) => setLowerThird((p) => ({ ...p, title: e.target.value }))}
              placeholder="Title (e.g. Owner, Tadg Riordan Motors)"
              className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
            />
          </div>

          {/* Production Status */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Production Status</label>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-bg-deep border border-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${pipelineProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-mono",
                  pipelineStage === "error" ? "text-red-400" : pipelineStage === "complete" ? "text-accent" : "text-text-muted"
                )}>
                  {stageLabels[pipelineStage]}
                </span>
                <span className="text-[10px] text-text-muted font-mono">{Math.round(pipelineProgress)}%</span>
              </div>
            </div>

            {/* Stage indicators */}
            <div className="space-y-2">
              {[
                { label: "Script", ready: scriptGenerated, stage: "script" as PipelineStage },
                { label: "Presenter Videos", ready: presenterVideosReady, stage: "presenter_videos" as PipelineStage },
                { label: "Images", ready: imageReady, stage: "images" as PipelineStage },
                { label: "Composition", ready: pipelineStage === "complete", stage: "composition" as PipelineStage },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center",
                    item.ready
                      ? "bg-accent/20 text-accent"
                      : pipelineStage === item.stage
                      ? "bg-yellow-400/20 text-yellow-400"
                      : "bg-white/5 text-text-muted"
                  )}>
                    {item.ready ? (
                      <Check size={10} />
                    ) : pipelineStage === item.stage ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Clock size={10} />
                    )}
                  </div>
                  <span className="text-xs text-text-muted flex-1">{item.label}</span>
                  <span className={cn(
                    "text-[10px] font-mono",
                    item.ready ? "text-accent" : pipelineStage === item.stage ? "text-yellow-400" : "text-text-muted"
                  )}>
                    {item.ready ? "Done" : pipelineStage === item.stage ? "..." : "Waiting"}
                  </span>
                </div>
              ))}
            </div>

            {isProducing && (
              <p className="text-[9px] text-text-muted font-mono">
                Presenter videos typically take 1-3 minutes per clip.
              </p>
            )}
          </div>

          {/* Video Preview */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Preview</label>

            <div className={cn(
              "rounded-lg border border-border bg-bg-deep flex items-center justify-center relative overflow-hidden",
              aspectRatio === "9:16" ? "aspect-[9/16] max-h-64" : aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
            )}>
              {isProducing ? (
                <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Loader2 size={24} className="text-accent animate-spin" />
                  <span className="text-xs text-accent font-mono">Producing...</span>
                </motion.div>
              ) : composedVideoUrl ? (
                <video
                  src={composedVideoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : pipelineStage === "complete" ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <Play size={20} className="text-accent ml-0.5" />
                  </div>
                  <span className="text-xs text-text-muted">Video ready</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <Film size={24} />
                  <span className="text-xs">Generate a script, then produce</span>
                </div>
              )}

              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white/70">
                {formatDuration(totalDuration)}
              </div>
            </div>

            {/* Produce Video button */}
            <button
              onClick={handleProduceVideo}
              disabled={!scriptGenerated || isProducing}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                scriptGenerated && !isProducing
                  ? "bg-accent text-bg hover:bg-accent/90"
                  : "bg-white/5 text-text-muted cursor-not-allowed"
              )}
            >
              {isProducing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Producing...
                </>
              ) : (
                <>
                  <Clapperboard size={14} />
                  Produce Video
                </>
              )}
            </button>

            {/* Download button */}
            {composedVideoUrl && (
              <a
                href={composedVideoUrl}
                download
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-accent/50 bg-bg-deep text-accent hover:bg-accent/10 transition-colors"
              >
                <Download size={14} />
                Download Video
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
