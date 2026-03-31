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
  Trash2,
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
  { clipNumber: 2, type: "presenter", label: "Presenter", duration: 30, status: "pending" },
  { clipNumber: 3, type: "image_overlay", label: "Product Showcase", duration: 5, status: "pending", notes: "Overlay on presenter" },
  { clipNumber: 4, type: "remotion_offer", label: "Offer Card", duration: 5, status: "pending", notes: "Overlay on presenter" },
  { clipNumber: 5, type: "remotion_outro", label: "Brand Outro", duration: 3, status: "pending" },
];

function getClipStartTime(clips: TimelineClip[] | undefined, clipIndex: number): number {
  if (!clips || clipIndex < 0) return 0;
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
  // ─── Persistence helpers ──────────────────────────────────────────────────
  const storageKey = `mme-composer-${brand.slug}`;

  function loadSavedState() {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  const saved = useRef(loadSavedState());

  // Campaign brief
  const [brief, setBrief] = useState<CampaignBrief>(saved.current?.brief ?? { concept: "" });

  // Presenter / voice
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("");
  const [avatarsLoading, setAvatarsLoading] = useState(false);
  const [voices, setVoices] = useState<{ id: string; voiceId?: string; name: string; accent?: string }[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState(brand.audioBrandKit.voiceId);
  const [voicesLoading, setVoicesLoading] = useState(false);

  // Lower third
  const [lowerThird, setLowerThird] = useState<LowerThirdData>({ name: "", title: "" });

  // Aspect ratio
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");

  // Image source for clip 3
  const [imageSource, setImageSource] = useState<ImageSource>("ai_generated");

  // Timeline clips — sanitise any "generating" clips back to "pending" on restore
  // (prevents stuck loop if page was refreshed mid-generation)
  const restoredClips: TimelineClip[] = (saved.current?.clips ?? DEFAULT_CLIPS).map(
    (c: TimelineClip) => c.status === "generating" ? { ...c, status: "pending" as ClipStatus } : c
  );
  const [clips, setClips] = useState<TimelineClip[]>(restoredClips);
  const [expandedClip, setExpandedClip] = useState<number | null>(null);

  // Script state
  const [scriptGenerated, setScriptGenerated] = useState(saved.current?.scriptGenerated ?? false);
  const [scriptEditing, setScriptEditing] = useState(false);

  // Pipeline state — only restore "complete", everything else resets to "idle"
  const safePipelineStage = saved.current?.pipelineStage;
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>(safePipelineStage === "complete" ? "complete" : "idle");
  const [pipelineProgress, setPipelineProgress] = useState(safePipelineStage === "complete" ? 100 : 0);
  const [presenterVideosReady, setPresenterVideosReady] = useState(saved.current?.presenterVideosReady ?? false);
  const [imageReady, setImageReady] = useState(saved.current?.imageReady ?? false);
  const [composedVideoUrl, setComposedVideoUrl] = useState<string | null>(saved.current?.composedVideoUrl ?? null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string>(''  );
  const [renderId, setRenderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Demo mode
  const [demoMode, setDemoMode] = useState(saved.current?.demoMode ?? false);

  // ─── Save state to localStorage on changes ─────────────────────────────
  useEffect(() => {
    const state = {
      clips,
      brief,
      scriptGenerated,
      pipelineStage,
      presenterVideosReady,
      imageReady,
      composedVideoUrl,
      demoMode,
      savedAt: Date.now(),
    };
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
  }, [clips, brief, scriptGenerated, pipelineStage, presenterVideosReady, imageReady, composedVideoUrl, demoMode, storageKey]);

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
          // Don't override voice from brand kit — the avatar voice map contains
          // presenter engine voice IDs, not ElevenLabs IDs. Brand voiceId is correct.
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
              // Update clip with actual video duration from presenter engine
              if (data.duration && typeof data.duration === "number") {
                updateClip(clipNumber, { duration: Math.round(data.duration * 10) / 10 });
              }
              resolve(data.video_url ?? "");
            } else if (data.status === "failed" || attempts >= maxAttempts) {
              clearInterval(interval);
              delete pollingRef.current[`clip-${clipNumber}`];
              const errMsg = typeof data.error === "string" ? data.error : JSON.stringify(data.error ?? "Presenter video generation timed out");
              reject(new Error(errMsg));
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
    [updateClip]
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
      let detectedDemoMode = false;
      const presenterPromises = presenterClips.map(async (clip) => {
        updateClip(clip.clipNumber, { status: "generating" });

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

        // Detect demo mode from API response (no presenter engine key configured)
        if (data.source === "demo") {
          detectedDemoMode = true;
          // In demo mode, skip polling — no real video to wait for
          await new Promise((r) => setTimeout(r, 1500));
          updateClip(clip.clipNumber, { status: "complete", videoUrl: "" });
          return { clipNumber: clip.clipNumber, videoUrl: "", demo: true };
        }

        const videoUrl = await pollPresenterStatus(data.video_id, clip.clipNumber);
        updateClip(clip.clipNumber, { status: "complete", videoUrl });
        return { clipNumber: clip.clipNumber, videoUrl, demo: false };
      });

      const presenterResults = await Promise.all(presenterPromises);
      setPresenterVideosReady(true);
      setPipelineProgress(50);

      // If demo mode detected, mark pipeline as demo-complete and skip composition
      if (detectedDemoMode) {
        setDemoMode(true);
        // Mark all remaining clips as complete for visual feedback
        for (const clip of clips) {
          if (clip.type !== "presenter") {
            updateClip(clip.clipNumber, { status: "complete" });
          }
        }
        setPipelineStage("complete");
        setPipelineProgress(100);
        setErrorMessage("Demo mode — AI Presenter engine not connected. Script and timeline are ready for review. Connect the presenter engine to produce final video.");
        return;
      }

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

      // Mark Remotion clips as ready (they'll be composed in the next step)
      updateClip(1, { status: "complete" });
      updateClip(4, { status: "complete" });
      updateClip(5, { status: "complete" });

      // Stop here — presenter clips are ready. User clicks "Compose Final Video" for next step.
      setPipelineStage("idle");
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

  // ─── Compose Final Video (Remotion only — no presenter regeneration) ────

  const handleComposeVideo = async () => {
    setErrorMessage(null);
    setComposedVideoUrl(null);
    setRenderId(null);

    try {
      // Stage 3: Clip 3 Image (if not already done)
      const clip3 = clips.find((c) => c.clipNumber === 3);
      let clip3ImageUrl = clip3?.imageUrl ?? "";

      if (clip3 && !clip3ImageUrl) {
        setPipelineStage("images");
        setPipelineProgress(60);
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
            clip3ImageUrl = `/brands/tadg-riordan/${brief.location === "Tallaght Garage" ? "tallaght-garage.webp" : "ashbourne-garage.webp"}`;
          }
        } else {
          clip3ImageUrl = `/brands/tadg-riordan/${brief.location === "Tallaght Garage" ? "tallaght-garage.webp" : "ashbourne-garage.webp"}`;
        }

        updateClip(3, { status: "complete", imageUrl: clip3ImageUrl });
        setImageReady(true);
      }

      // Stage 4: Composition
      setPipelineStage("composition");
      setPipelineProgress(70);
      updateClip(1, { status: "complete" });
      updateClip(4, { status: "complete" });
      updateClip(5, { status: "complete" });

      const appUrl = typeof window !== "undefined" ? window.location.origin : "";
      const toAbsolute = (u: string) => (!u || u.startsWith("http")) ? u : `${appUrl}${u}`;
      const logoUrl = toAbsolute("/brands/tadg-riordan/logo-dark.png");

      // Gather presenter video URLs from existing clips
      const presenterResults = clips
        .filter((c) => c.type === "presenter" && c.status === "complete" && c.videoUrl)
        .map((c) => ({ clipNumber: c.clipNumber, videoUrl: c.videoUrl! }));

      console.log("[compose-video] Presenter results:", JSON.stringify(presenterResults));

      // Validate: we need at least one presenter video to compose
      if (presenterResults.length === 0) {
        throw new Error("No presenter videos available — please generate presenter clips first");
      }

      // Build segments — logo intro, single presenter clip with overlays, logo outro
      const segments: RenderSegment[] = [];
      const overlays: RenderOverlay[] = [];
      const offerClip = clips.find((c) => c.type === "remotion_offer");

      // 1. Logo intro (3s brand sting)
      segments.push({
        type: "remotion",
        template: "LogoReveal",
        duration: 3,
        props: { logoUrl, backgroundColor: "#0A0F1E", particleColor: "#FFFFFF", tagline: brand.logoLine, platform: "instagram" },
      });

      let runningTime = 3;

      // 2. Single presenter clip — continuous narration
      const pres1 = presenterResults[0];
      const pres1Clip = clips.find((c) => c.type === "presenter" && c.status === "complete" && c.clipNumber === pres1.clipNumber);
      const clipDur = pres1Clip?.duration ?? 30;
      segments.push({ type: "heygen", videoUrl: pres1.videoUrl, duration: clipDur });

      // LowerThird overlay — appears 2s into presenter clip, lasts 5s
      if (lowerThird.name) {
        overlays.push({
          template: "LowerThird",
          startTime: runningTime + 2,
          duration: 5,
          mode: "overlay",
          props: { name: lowerThird.name, title: lowerThird.title },
        });
      }

      // ProductShowcase overlay — appears 1/3 through, overlay mode so narration continues
      if (clip3ImageUrl) {
        overlays.push({
          template: "ProductShowcase",
          startTime: runningTime + Math.floor(clipDur / 3),
          duration: Math.min(5, Math.ceil(clipDur / 4)),
          mode: "overlay",
          props: { imageUrl: toAbsolute(clip3ImageUrl) },
        });
      }

      // StatCard overlay — appears 2/3 through if offer data exists
      if (offerClip?.offerData) {
        overlays.push({
          template: "StatCard",
          startTime: runningTime + Math.floor((clipDur * 2) / 3),
          duration: Math.min(5, Math.ceil(clipDur / 4)),
          mode: "overlay",
          props: {
            statNumber: offerClip.offerData.price ?? "",
            statLabel: offerClip.offerData.headline ?? "",
            subtitle: [offerClip.offerData.finance, offerClip.offerData.terms].filter(Boolean).join(" | "),
            brandColor: "#E31E24",
            platform: "instagram",
          },
        });
      }

      runningTime += clipDur;

      // 3. Logo outro (3s brand sting)
      segments.push({
        type: "remotion",
        template: "LogoReveal",
        duration: 3,
        props: { logoUrl, backgroundColor: "#0A0F1E", particleColor: "#FFFFFF", tagline: brand.logoLine, platform: "instagram" },
      });

      console.log("[compose-video] Segments:", JSON.stringify(segments));
      console.log("[compose-video] Overlays:", JSON.stringify(overlays));

      // Final validation: ensure no heygen segment has an empty videoUrl
      const invalidSegments = segments.filter((s) => s.type === "heygen" && !s.videoUrl);
      if (invalidSegments.length > 0) {
        throw new Error(`${invalidSegments.length} video segment(s) have no video URL — presenter videos may not have completed`);
      }

      // Submit composition
      console.log("[compose-video] Submitting to /api/video/compose...");
      const composeRes = await fetch("/api/video/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segments, overlays, platform: "instagram", aspectRatio }),
      });

      if (!composeRes.ok) {
        const errData = await composeRes.json().catch(() => ({}));
        const errMsg = typeof errData?.error === "string" ? errData.error : JSON.stringify(errData?.error ?? `Status ${composeRes.status}`);
        console.error("[compose-video] Compose API error:", composeRes.status, errMsg);
        throw new Error(errMsg || "Composition failed");
      }

      const composeData = await composeRes.json();
      const newRenderId = composeData.renderId;
      console.log("[compose-video] Render started, renderId:", newRenderId);

      if (!newRenderId) {
        console.error("[compose-video] No renderId in response:", JSON.stringify(composeData));
        throw new Error("Render server did not return a render ID");
      }

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
            console.log(`[compose-video] Poll #${attempts}:`, data.status, `progress=${data.progress ?? 0}`);
            setPipelineProgress(80 + Math.min(data.progress ?? 0, 100) * 0.2);

            if (data.status === "completed") {
              clearInterval(interval);
              composePollingRef.current = null;
              const outputUrl = data.outputUrl ?? `/api/video/compose-download?renderId=${newRenderId}`;
              console.log("[compose-video] Complete! Output:", outputUrl);
              // Cache video as blob for reliable replay (render server may clean up)
              try {
                const videoRes = await fetch(outputUrl);
                const videoBlob = await videoRes.blob();
                const blobUrl = URL.createObjectURL(videoBlob);
                setComposedVideoUrl(blobUrl);
                setModalVideoUrl(outputUrl); // Keep original URL for download
              } catch {
                setComposedVideoUrl(outputUrl);
                setModalVideoUrl(outputUrl);
              }
              setShowVideoModal(true);
              resolve();
            } else if (data.status === "failed" || attempts >= 60) {
              clearInterval(interval);
              composePollingRef.current = null;
              const errMsg = typeof data.error === "string" ? data.error : JSON.stringify(data.error ?? "Composition timed out");
              console.error("[compose-video] Failed:", errMsg);
              reject(new Error(errMsg));
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
      console.error("[compose-video]", err);
      const msg = err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : "Composition failed — check console for details";
      setErrorMessage(msg);
      setPipelineStage("error");
    }
  };

  // ─── Reset production ───────────────────────────────────────────────────

  const handleReset = () => {
    // Stop any active polling
    Object.values(pollingRef.current).forEach((t) => clearInterval(t));
    pollingRef.current = {};
    if (composePollingRef.current) {
      clearInterval(composePollingRef.current);
      composePollingRef.current = null;
    }

    // Reset all state to defaults
    setClips(DEFAULT_CLIPS.map((c) => ({ ...c })));
    setBrief({ concept: "" });
    setScriptGenerated(false);
    setScriptEditing(false);
    setPipelineStage("idle");
    setPipelineProgress(0);
    setPresenterVideosReady(false);
    setImageReady(false);
    setComposedVideoUrl(null);
    setRenderId(null);
    setErrorMessage(null);
    setDemoMode(false);
    setExpandedClip(null);

    // Clear localStorage
    try { localStorage.removeItem(storageKey); } catch {}
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
        if (!res.ok) {
          const errMsg = typeof data?.error === "string" ? data.error : JSON.stringify(data?.error ?? `Status ${res.status}`);
          throw new Error(errMsg || `Presenter generation failed for clip ${clipNumber}`);
        }
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

        {/* Reset / New Production */}
        {scriptGenerated && (
          <button
            onClick={() => {
              setClips(DEFAULT_CLIPS);
              setScriptGenerated(false);
              setScriptEditing(false);
              setPipelineStage("idle");
              setPipelineProgress(0);
              setPresenterVideosReady(false);
              setImageReady(false);
              setComposedVideoUrl(null);
              setRenderId(null);
              setErrorMessage(null);
              setDemoMode(false);
              setBrief({ concept: "" });
              try { localStorage.removeItem(storageKey); } catch {}
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono transition-all border border-border bg-bg-deep text-text-muted hover:text-red-400 hover:border-red-400/50"
          >
            <RotateCcw size={10} />
            New
          </button>
        )}

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

                            {/* Remotion clip preview — Logo Intro */}
                            {clip.type === "remotion_intro" && (
                              <div className="rounded-lg border border-red-400/20 bg-gradient-to-br from-red-900/20 to-bg-deep overflow-hidden">
                                <div className="aspect-video flex items-center justify-center relative">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,30,36,0.15),transparent_70%)]" />
                                  <div className="flex flex-col items-center gap-2 z-10">
                                    <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                      <Film size={24} className="text-red-400" />
                                    </div>
                                    <span className="text-xs font-semibold text-white/90">{brand.name}</span>
                                    {brand.logoLine && (
                                      <span className="text-[10px] text-white/50 italic">{brand.logoLine}</span>
                                    )}
                                  </div>
                                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/50 text-[9px] font-mono text-white/60">
                                    {clip.duration}s — Logo Reveal
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Remotion clip preview — Offer Card */}
                            {clip.type === "remotion_offer" && clip.offerData && (
                              <div className="rounded-lg border border-red-400/20 bg-gradient-to-br from-red-900/30 to-bg-deep overflow-hidden">
                                <div className="aspect-video flex items-center justify-center relative p-4">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,30,36,0.2),transparent_70%)]" />
                                  <div className="flex flex-col items-center gap-1 z-10 text-center">
                                    {clip.offerData.price && (
                                      <span className="text-2xl font-bold text-white">{clip.offerData.price}</span>
                                    )}
                                    {clip.offerData.headline && (
                                      <span className="text-xs font-medium text-white/80">{clip.offerData.headline}</span>
                                    )}
                                    {clip.offerData.finance && (
                                      <span className="text-[10px] text-accent">{clip.offerData.finance}</span>
                                    )}
                                    {clip.offerData.terms && (
                                      <span className="text-[9px] text-white/40 mt-1">{clip.offerData.terms}</span>
                                    )}
                                  </div>
                                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/50 text-[9px] font-mono text-white/60">
                                    {clip.duration}s — Offer Card
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Remotion clip preview — Brand Outro */}
                            {clip.type === "remotion_outro" && (
                              <div className="rounded-lg border border-red-400/20 bg-gradient-to-br from-red-900/20 to-bg-deep overflow-hidden">
                                <div className="aspect-video flex items-center justify-center relative">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,30,36,0.1),transparent_70%)]" />
                                  <div className="flex flex-col items-center gap-2 z-10">
                                    <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                                      <Film size={18} className="text-red-400" />
                                    </div>
                                    <span className="text-xs font-semibold text-white/80">{brand.name}</span>
                                    <span className="text-[10px] text-white/40">End Card</span>
                                  </div>
                                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/50 text-[9px] font-mono text-white/60">
                                    {clip.duration}s — Outro
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Image preview for showcase clip */}
                            {clip.type === "image_overlay" && clip.imageUrl && (
                              <div className="rounded-lg border border-emerald-400/20 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={clip.imageUrl}
                                  alt="Product showcase"
                                  className="w-full aspect-video object-cover"
                                />
                                <div className="px-2 py-1 bg-black/40 text-[9px] font-mono text-emerald-400/70 text-right">
                                  {clip.duration}s — Product Showcase
                                </div>
                              </div>
                            )}

                            {/* Presenter video preview */}
                            {clip.type === "presenter" && clip.status === "complete" && clip.videoUrl && (
                              <div className="rounded-lg border border-blue-400/20 overflow-hidden">
                                <video
                                  src={clip.videoUrl}
                                  controls
                                  className="w-full"
                                  style={{ maxHeight: "200px" }}
                                />
                              </div>
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
                            // Voice is selected independently via ElevenLabs dropdown — don't override
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
                            // Voice is selected independently via ElevenLabs dropdown — don't override
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
                    <option key={v.id} value={v.id}>
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

          <div className="p-6 space-y-3">
            {/* Individual presenter clip videos */}
            {clips.some((c) => c.type === "presenter" && c.status === "complete" && c.videoUrl) && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Presenter Clips</label>
                {clips.filter((c) => c.type === "presenter" && c.status === "complete" && c.videoUrl).map((clip) => (
                  <div key={clip.clipNumber} className="rounded-lg border border-border bg-bg-deep overflow-hidden">
                    <div className="px-3 py-1.5 bg-blue-400/10 border-b border-border flex items-center gap-2">
                      <User size={10} className="text-blue-400" />
                      <span className="text-[10px] font-mono text-blue-400 font-bold">Clip {clip.clipNumber}</span>
                      <span className="text-[10px] text-text-muted">{clip.label}</span>
                    </div>
                    <video
                      src={clip.videoUrl}
                      controls
                      className="w-full"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Compose Section — below presenter clips ──── */}
            {presenterVideosReady && (
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Film size={16} className="text-accent" />
                    <h3 className="text-sm font-semibold text-text">Final Video</h3>
                  </div>
                  {!composedVideoUrl && !isProducing && (
                    <button
                      onClick={handleComposeVideo}
                      disabled={isProducing}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-accent text-bg-deep hover:bg-accent/90 transition-colors"
                    >
                      <Film size={14} />
                      Compose Final Video
                    </button>
                  )}
                  {composedVideoUrl && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowVideoModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-bg-deep hover:bg-accent/90 transition-colors"
                      >
                        <Play size={14} />
                        Watch
                      </button>
                      <a
                        href={modalVideoUrl || composedVideoUrl}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-accent/50 text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Download size={14} />
                        Download
                      </a>
                      <button
                        onClick={handleComposeVideo}
                        disabled={isProducing}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <Film size={14} />
                        Re-compose
                      </button>
                    </div>
                  )}
                </div>
                {isProducing && pipelineStage === "composition" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                      <span className="text-sm text-text-muted">Composing final video... {Math.round(pipelineProgress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-300" style={{ width: `${pipelineProgress}%` }} />
                    </div>
                  </div>
                )}
                {composedVideoUrl && (
                  <div className="rounded-xl border border-accent/20 bg-black overflow-hidden cursor-pointer"
                       onClick={() => setShowVideoModal(true)}>
                    <video
                      src={composedVideoUrl}
                      className="w-full"
                      style={{ maxHeight: '400px' }}
                    />
                    <div className="p-3 text-center text-xs text-text-muted">Click to play in full screen</div>
                  </div>
                )}
              </div>
            )}

            {/* ── Action Buttons ─────────────────────────────── */}

            {/* Step 1: Generate Presenter Clips (only when clips don't have videos yet) */}
            {!presenterVideosReady && (
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
                {isProducing && pipelineStage === "presenter_videos" ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating Presenter Clips...
                  </>
                ) : isProducing ? (
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
            )}

            {/* Regenerate Presenter Clips (when already done, in case user wants to redo) */}
            {presenterVideosReady && !isProducing && (
              <button
                onClick={handleProduceVideo}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border border-border bg-bg-deep text-text-muted hover:text-yellow-400 hover:border-yellow-400/50"
              >
                <RotateCcw size={12} />
                Regenerate Presenter Clips
              </button>
            )}

            {/* Reset Production — always visible when there's any state to clear */}
            {(scriptGenerated || presenterVideosReady || composedVideoUrl || pipelineStage === "error") && !isProducing && (
              <button
                onClick={handleReset}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border border-red-500/20 bg-bg-deep text-red-400/70 hover:text-red-300 hover:border-red-500/40 hover:bg-red-500/5"
              >
                <Trash2 size={12} />
                Reset Production
              </button>
            )}
          </div>
        </div>
      </div>

      {/* === FULL-SCREEN VIDEO MODAL === */}
      {showVideoModal && composedVideoUrl && (
        <div
          onClick={() => setShowVideoModal(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.9)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-bg-deep rounded-xl p-5 border border-border"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowVideoModal(false); }}
              className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-red-500 border-2 border-white text-white font-bold flex items-center justify-center z-[10001] cursor-pointer shadow-lg"
            >
              ✕
            </button>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <Film size={16} className="text-accent" />
                Final Composed Video
              </h3>
              <a
                href={modalVideoUrl || composedVideoUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-accent/50 bg-bg-deep text-accent hover:bg-accent/10 transition-colors"
              >
                <Download size={14} />
                Download
              </a>
            </div>
            <video
              src={composedVideoUrl}
              controls
              autoPlay
              preload="auto"
              className="w-full rounded-lg bg-black"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
