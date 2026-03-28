"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Play,
  User,
  Clapperboard,
  Plus,
  Trash2,
  Check,
  Loader2,
  Clock,
  Wand2,
  MonitorPlay,
  Sparkles,
  ImageIcon,
  Volume2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";

interface ProductionComposerAppProps {
  brand: Brand;
}

type ClipStatus =
  | "pending"
  | "generating_script"
  | "generating_image"
  | "generating_voice"
  | "complete"
  | "error";

interface ClipItem {
  id: string;
  description: string;
  narration?: string;
  imageUrl?: string;
  audioUrl?: string;
  status: ClipStatus;
}

type AspectRatio = "9:16" | "16:9" | "1:1";

const PRESENTERS = [
  { id: "pr-1", name: "Alex M.", role: "Professional Anchor", tone: "Authoritative" },
  { id: "pr-2", name: "Sam K.", role: "Casual Host", tone: "Friendly" },
  { id: "pr-3", name: "Jordan L.", role: "Dynamic Presenter", tone: "Energetic" },
  { id: "pr-4", name: "Taylor R.", role: "Storyteller", tone: "Warm" },
];

const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: "9:16", label: "9:16" },
  { value: "16:9", label: "16:9" },
  { value: "1:1", label: "1:1" },
];

function statusLabel(status: ClipStatus): string {
  switch (status) {
    case "pending": return "Pending";
    case "generating_script": return "Writing script...";
    case "generating_image": return "Generating image...";
    case "generating_voice": return "Generating voice...";
    case "complete": return "Complete";
    case "error": return "Error";
  }
}

function statusColor(status: ClipStatus): string {
  switch (status) {
    case "complete": return "text-accent";
    case "error": return "text-red-400";
    case "pending": return "text-text-muted";
    default: return "text-yellow-400";
  }
}

function ClipStatusIcon({ status, size = 14 }: { status: ClipStatus; size?: number }) {
  if (status === "complete") return <Check size={size} />;
  if (status === "error") return <span className="text-red-400 font-bold leading-none">!</span>;
  if (status !== "pending") return <Loader2 size={size} className="animate-spin" />;
  return null;
}

export function ProductionComposerApp({ brand }: ProductionComposerAppProps) {
  const [concept, setConcept] = useState("");
  const [selectedPresenter, setSelectedPresenter] = useState("pr-1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [clips, setClips] = useState<ClipItem[]>([
    { id: "c-1", description: "Opening hook — brand intro", status: "pending" },
    { id: "c-2", description: "Main message — key offer", status: "pending" },
    { id: "c-3", description: "Call to action — closing", status: "pending" },
  ]);
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
  const [isGeneratingClips, setIsGeneratingClips] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [composedUrl, setComposedUrl] = useState<string | null>(null);
  const [composedAudioUrl, setComposedAudioUrl] = useState<string | null>(null);
  const [publishDone, setPublishDone] = useState(false);

  const updateClip = (id: string, patch: Partial<ClipItem>) =>
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const addClip = () => {
    setClips((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, description: "", status: "pending" },
    ]);
  };

  const removeClip = (id: string) => {
    if (clips.length <= 1) return;
    setClips((prev) => prev.filter((c) => c.id !== id));
  };

  const updateClipDescription = (id: string, text: string) =>
    updateClip(id, { description: text });

  // Generate all scripts via /api/social/generate-copy
  const handleGenerateAllScripts = async () => {
    if (!concept.trim()) return;
    setIsGeneratingScripts(true);

    for (const clip of clips) {
      updateClip(clip.id, { status: "generating_script" });
      try {
        const res = await fetch("/api/social/generate-copy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandSlug: brand.slug,
            customPrompt: `Video clip narration for concept: "${concept}". This is clip: "${clip.description}". Write a short punchy narration for this clip only (2–3 sentences max).`,
            platforms: ["instagram"],
            contentType: "video_script",
          }),
        });
        const data = await res.json();
        const narration =
          data?.content?.platformVariants?.instagram?.text ??
          data?.platformVariants?.instagram?.text ??
          `${brand.name}: ${clip.description}`;
        updateClip(clip.id, { narration, status: "pending" });
      } catch {
        updateClip(clip.id, { status: "error" });
      }
    }

    setIsGeneratingScripts(false);
  };

  // Generate all clips: image + voice per clip
  const handleGenerateClips = async () => {
    setIsGeneratingClips(true);
    setComposedUrl(null);
    setComposedAudioUrl(null);
    setPublishDone(false);

    for (const clip of clips) {
      // Step 1: Generate image
      updateClip(clip.id, { status: "generating_image" });
      let imageUrl: string | undefined;
      try {
        const res = await fetch("/api/social/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: clip.description || concept,
            platform: "instagram",
            brandSlug: brand.slug,
            aspectRatio:
              aspectRatio === "1:1" ? "square" : aspectRatio === "9:16" ? "portrait" : "landscape",
          }),
        });
        const data = await res.json();
        imageUrl = data?.url;
      } catch {
        // continue without image
      }

      // Step 2: Generate voice
      updateClip(clip.id, { status: "generating_voice" });
      let audioUrl: string | undefined;
      try {
        const narrationText = clip.narration || clip.description || concept;
        const res = await fetch("/api/audio/voice-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: narrationText,
            voiceId: brand.audioBrandKit.voiceId,
          }),
        });
        const data = await res.json();
        audioUrl = data?.audioUrl ?? data?.url;
      } catch {
        // continue without audio
      }

      updateClip(clip.id, { status: "complete", imageUrl, audioUrl });
    }

    setIsGeneratingClips(false);
  };

  // Compose final video via /api/audio/mix
  const handleCompose = async () => {
    setIsComposing(true);
    try {
      const voiceSegments = clips
        .filter((c) => c.audioUrl)
        .map((c, i) => ({
          audioUrl: c.audioUrl!,
          startTime: i * 10,
          duration: 10,
          volume: 100,
          track: "voice" as const,
        }));

      if (voiceSegments.length === 0) {
        // No audio to mix — just mark done
        setComposedUrl(null);
        setComposedAudioUrl(null);
        setIsComposing(false);
        return;
      }

      const res = await fetch("/api/audio/mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segments: voiceSegments,
          totalDuration: voiceSegments.length * 10,
          loudnessTarget: -23,
          outputFormat: "mp3",
        }),
      });
      const data = await res.json();
      setComposedAudioUrl(data?.mp3Url ?? data?.wavUrl ?? null);
      // Use the first clip's image as the composition thumbnail
      const firstImage = clips.find((c) => c.imageUrl)?.imageUrl ?? null;
      setComposedUrl(firstImage);
    } catch {
      // ignore
    }
    setIsComposing(false);
  };

  // Publish via /api/social/publish-all
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const imageUrl = clips.find((c) => c.imageUrl)?.imageUrl;
      const narration = clips
        .map((c) => c.narration || c.description)
        .filter(Boolean)
        .join(" ");

      await fetch("/api/social/publish-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: ["instagram"],
          content: {
            instagram: {
              text: narration || concept,
              imageUrl,
              hashtags: [],
            },
          },
          brandSlug: brand.slug,
        }),
      });
      setPublishDone(true);
    } catch {
      // ignore
    }
    setIsPublishing(false);
  };

  const allComplete = clips.every((c) => c.status === "complete");
  const anyHaveNarration = clips.some((c) => c.narration);

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Film size={18} className="text-accent" />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-lg font-semibold text-text">
            Production Composer
          </h2>
          <p className="text-xs text-text-muted">{brand.name}</p>
        </div>

        {/* Aspect ratio selector */}
        <div className="flex items-center gap-1 bg-bg-deep rounded-lg p-1 border border-border">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.value}
              onClick={() => setAspectRatio(ar.value)}
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all",
                aspectRatio === ar.value
                  ? "bg-accent/20 text-accent"
                  : "text-text-muted hover:text-text"
              )}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Left: Concept + Script */}
        <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-border">
          {/* Prompt-based generation */}
          <div className="p-6 border-b border-border space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
              Video Concept
            </label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Describe your video concept... e.g. 'A 30-second ad showcasing our spring sale with upbeat energy and a strong call to action'"
              className="w-full h-24 bg-bg-deep border border-border rounded-lg p-4 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
            />
            <button
              onClick={handleGenerateAllScripts}
              disabled={isGeneratingScripts || !concept.trim()}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
                isGeneratingScripts
                  ? "bg-yellow-400/10 text-yellow-400 cursor-wait"
                  : concept.trim()
                  ? "bg-accent/10 text-accent hover:bg-accent/20"
                  : "bg-white/5 text-text-muted cursor-not-allowed"
              )}
            >
              {isGeneratingScripts ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Generating scripts...
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  Generate All Scripts
                </>
              )}
            </button>
          </div>

          {/* Script composition — clips */}
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                Clip Planning
              </label>
              <span className="text-[10px] text-text-muted font-mono">
                {clips.length} clip{clips.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {clips.map((clip, i) => (
                <motion.div
                  key={clip.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-bg-deep p-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Clip number / status indicator */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold",
                      clip.status === "complete"
                        ? "bg-accent/20 text-accent"
                        : clip.status === "error"
                        ? "bg-red-400/20 text-red-400"
                        : clip.status !== "pending"
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "bg-white/5 text-text-muted"
                    )}
                  >
                    {clip.status === "pending" ? (
                      i + 1
                    ) : (
                      <ClipStatusIcon status={clip.status} size={14} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <input
                      type="text"
                      value={clip.description}
                      onChange={(e) => updateClipDescription(clip.id, e.target.value)}
                      placeholder={`Clip ${i + 1} description...`}
                      className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                    />

                    {/* Generated narration */}
                    {clip.narration && (
                      <p className="text-[11px] text-text-muted italic leading-snug border-l-2 border-accent/30 pl-2">
                        {clip.narration}
                      </p>
                    )}

                    {/* Media indicators */}
                    <div className="flex items-center gap-3">
                      <span className={cn("text-[10px] font-mono", statusColor(clip.status))}>
                        {statusLabel(clip.status)}
                      </span>

                      {clip.imageUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-accent font-mono">
                          <ImageIcon size={9} />
                          Image
                        </span>
                      )}
                      {clip.audioUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-accent font-mono">
                          <Volume2 size={9} />
                          Voice
                        </span>
                      )}
                    </div>

                    {/* Thumbnail preview */}
                    {clip.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={clip.imageUrl}
                        alt={`Clip ${i + 1}`}
                        className="h-16 rounded border border-border/50 object-cover"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => removeClip(clip.id)}
                    className="text-text-muted hover:text-red-400 transition-colors shrink-0 mt-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={addClip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-text-muted hover:text-text hover:border-accent/30 transition-colors"
              >
                <Plus size={12} />
                Add Clip
              </button>

              <button
                onClick={handleGenerateClips}
                disabled={isGeneratingClips || isGeneratingScripts}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isGeneratingClips
                    ? "bg-yellow-400/10 text-yellow-400 cursor-wait"
                    : isGeneratingScripts
                    ? "bg-white/5 text-text-muted cursor-not-allowed"
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                )}
              >
                {isGeneratingClips ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={12} />
                    Generate Clips
                  </>
                )}
              </button>
            </div>

            {anyHaveNarration && (
              <p className="text-[10px] text-text-muted font-mono">
                Scripts ready — click Generate Clips to produce images and voice.
              </p>
            )}
          </div>
        </div>

        {/* Right: Presenter + Progress + Preview + Publish */}
        <div className="divide-y divide-border">
          {/* Avatar/Presenter selector */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
              Presenter
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESENTERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPresenter(p.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center",
                    selectedPresenter === p.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg-deep hover:border-border"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      selectedPresenter === p.id ? "bg-accent/20" : "bg-white/5"
                    )}
                  >
                    <User
                      size={16}
                      className={
                        selectedPresenter === p.id ? "text-accent" : "text-text-muted"
                      }
                    />
                  </div>
                  <span className="text-[11px] text-text font-medium">{p.name}</span>
                  <span className="text-[9px] text-text-muted leading-tight">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Multi-clip progress */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
              Clip Progress
            </label>
            <div className="space-y-2">
              {clips.map((clip, i) => (
                <div key={clip.id} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center text-[10px]",
                      clip.status === "complete"
                        ? "bg-accent/20 text-accent"
                        : clip.status === "error"
                        ? "bg-red-400/20 text-red-400"
                        : clip.status !== "pending"
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "bg-white/5 text-text-muted"
                    )}
                  >
                    {clip.status === "complete" ? (
                      <Check size={10} />
                    ) : clip.status !== "pending" ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Clock size={10} />
                    )}
                  </div>
                  <span className="text-xs text-text-muted flex-1 truncate">
                    Clip {i + 1}
                  </span>
                  <span className={cn("text-[10px] font-mono", statusColor(clip.status))}>
                    {clip.status === "complete"
                      ? "Done"
                      : clip.status !== "pending"
                      ? "..."
                      : "Waiting"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Composition preview */}
          <div className="p-6 space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
              Final Composition
            </label>

            <div
              className={cn(
                "rounded-lg border border-border bg-bg-deep flex items-center justify-center relative overflow-hidden",
                aspectRatio === "9:16" ? "aspect-[9/16] max-h-48" : aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
              )}
            >
              {isComposing ? (
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 size={24} className="text-accent animate-spin" />
                  <span className="text-xs text-accent font-mono">Composing...</span>
                </motion.div>
              ) : composedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={composedUrl} alt="Composition preview" className="w-full h-full object-cover" />
              ) : allComplete ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <Play size={20} className="text-accent ml-0.5" />
                  </div>
                  <span className="text-xs text-text-muted">Ready to compose</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <MonitorPlay size={24} />
                  <span className="text-xs">Generate clips first</span>
                </div>
              )}

              {/* Timecode overlay */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white/70">
                00:00 / 00:30
              </div>
            </div>

            {/* Composed audio player */}
            {composedAudioUrl && (
              <div className="rounded-lg border border-border bg-bg-deep p-3 flex items-center gap-2">
                <Volume2 size={14} className="text-accent shrink-0" />
                <audio controls src={composedAudioUrl} className="flex-1 h-7" />
              </div>
            )}

            <button
              onClick={handleCompose}
              disabled={!allComplete || isComposing}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                allComplete && !isComposing
                  ? "bg-accent text-bg hover:bg-accent/90"
                  : "bg-white/5 text-text-muted cursor-not-allowed"
              )}
            >
              <Clapperboard size={14} />
              Compose Final Video
            </button>
          </div>

          {/* Publish */}
          <div className="p-6">
            <button
              onClick={handlePublish}
              disabled={!allComplete || isPublishing || isComposing}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border",
                publishDone
                  ? "border-accent bg-accent/10 text-accent cursor-default"
                  : allComplete && !isPublishing
                  ? "border-accent/50 bg-bg-deep text-accent hover:bg-accent/10"
                  : "border-border bg-white/5 text-text-muted cursor-not-allowed"
              )}
            >
              {isPublishing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Publishing...
                </>
              ) : publishDone ? (
                <>
                  <Check size={14} />
                  Published
                </>
              ) : (
                <>
                  <Send size={14} />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
