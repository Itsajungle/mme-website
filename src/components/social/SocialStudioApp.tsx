"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Image as ImageIcon,
  Video,
  Layers,
  FileText,
  Plus,
  Trash2,
  Bold,
  Italic,
  List,
  Link2,
  AlignLeft,
  User,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Send,
  Wand2,
  Clock,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import type { PublishResult } from "@/lib/social-engine/types";
import type { SocialBrandKit as SocialBrandKitType } from "@/lib/social-engine/brand-kit-types";
import { DEFAULT_SOCIAL_BRAND_KIT } from "@/lib/social-engine/brand-kit-types";
import { ContentPreview } from "./ContentPreview";
import { PipelineStatus } from "./PipelineStatus";
import { SocialBrandKit } from "./SocialBrandKit";

interface SocialStudioAppProps {
  brand: Brand;
}

const MODES = [
  { id: "brandkit", label: "Brand Kit", icon: Palette },
  { id: "quick", label: "Quick Post", icon: FileText },
  { id: "video", label: "Video Post", icon: Video },
  { id: "slideshow", label: "Slideshow", icon: Layers },
  { id: "blog", label: "Blog Post", icon: AlignLeft },
] as const;

type Mode = (typeof MODES)[number]["id"];

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", color: "#ff0050" },
  { id: "instagram", label: "Instagram", color: "#e1306c" },
  { id: "facebook", label: "Facebook", color: "#1877f2" },
  { id: "x", label: "X", color: "#999" },
  { id: "linkedin", label: "LinkedIn", color: "#0077b5" },
];

const PLACEHOLDER_AVATARS = [
  { id: "av-1", name: "Alex", style: "Professional" },
  { id: "av-2", name: "Sam", style: "Casual" },
  { id: "av-3", name: "Jordan", style: "Dynamic" },
];

const COMING_SOON_MODES: Mode[] = ["slideshow", "blog"];

interface SlideItem {
  id: string;
  narration: string;
}

// ── Inline sub-component: PublishStatusPanel ──────────────────────────────
function PublishStatusPanel({ results }: { results: PublishResult[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-bg-deep p-4 space-y-3"
    >
      <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
        Publish Status
      </p>
      <div className="space-y-2">
        {results.map((r) => {
          const platform = PLATFORMS.find((p) => p.id === r.platform);
          const isOk = r.status === "published";
          const isFail = r.status === "failed";
          return (
            <div
              key={r.platform}
              className="flex items-center justify-between gap-3 py-1.5"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: platform?.color ?? "#666" }}
                />
                <span className="text-sm text-text capitalize">
                  {platform?.label ?? r.platform}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isOk && (
                  <>
                    <CheckCircle2 size={15} className="text-accent" />
                    {r.postUrl ? (
                      <a
                        href={r.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        View <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-xs text-accent">Published</span>
                    )}
                  </>
                )}
                {isFail && (
                  <>
                    <XCircle size={15} className="text-red-400" />
                    <span className="text-xs text-red-400">Failed</span>
                  </>
                )}
                {r.status === "not_configured" && (
                  <>
                    <Clock size={15} className="text-text-muted" />
                    <span className="text-xs text-text-muted">Not configured</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Inline sub-component: ErrorBanner ────────────────────────────────────
function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
    >
      <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
      <p className="flex-1 text-xs text-red-300">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-200 transition-colors text-xs"
      >
        ✕
      </button>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export function SocialStudioApp({ brand }: SocialStudioAppProps) {
  const [mode, setMode] = useState<Mode>("brandkit");
  const [socialBrandKit, setSocialBrandKit] = useState<SocialBrandKitType>(DEFAULT_SOCIAL_BRAND_KIT);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);

  // Quick post state
  const [platformContent, setPlatformContent] = useState<Record<string, string>>({});

  // Video post state
  const [scriptContent, setScriptContent] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("av-1");

  // Slideshow / blog state (display only — Coming V2.1)
  const [slides, setSlides] = useState<SlideItem[]>([
    { id: "s-1", narration: "" },
    { id: "s-2", narration: "" },
  ]);
  const [blogContent, setBlogContent] = useState("");

  // Shared generation state
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<PublishResult[] | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<"draft" | "review" | "scheduled" | "published">("draft");

  // AI prompt modals
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPromptText, setAiPromptText] = useState("");
  const [showImagePrompt, setShowImagePrompt] = useState(false);

  // Image options
  const [aspectRatio, setAspectRatio] = useState<"square" | "landscape" | "portrait">("square");

  // Video
  const [videoFormat, setVideoFormat] = useState<"9:16" | "16:9" | "1:1">("16:9");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);

  // Errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────
  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const addSlide = () =>
    setSlides((prev) => [...prev, { id: `s-${Date.now()}`, narration: "" }]);

  const removeSlide = (id: string) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSlideNarration = (id: string, text: string) =>
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, narration: text } : s)));

  const showError = (msg: string) => setErrorMessage(msg);
  const clearError = () => setErrorMessage(null);

  // Derive content for a given platform (falls back to the unified script for video)
  const getContentForPlatform = (pId: string): string => {
    if (mode === "video") return scriptContent;
    if (mode === "slideshow") return slides.map((s) => s.narration).join("\n\n");
    if (mode === "blog") return blogContent;
    return platformContent[pId] ?? "";
  };

  // ── API calls ─────────────────────────────────────────────────────────
  const handleGenerateCopy = async () => {
    if (selectedPlatforms.length === 0) {
      showError("Select at least one platform first.");
      return;
    }
    setIsGeneratingCopy(true);
    clearError();
    try {
      const res = await fetch("/api/social/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSlug: brand.slug,
          platforms: selectedPlatforms,
          contentType: mode === "video" ? "video_script" : "quick",
          customPrompt: aiPromptText || undefined,
          brandColors: {
            primary: socialBrandKit.primaryColor,
            secondary: socialBrandKit.secondaryColor,
            accent: socialBrandKit.accentColor,
          },
          brandTagline: socialBrandKit.tagline || undefined,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();

      // data.platformVariants is { instagram: { text, hashtags }, ... }
      const variants: Record<string, string> = {};
      const first: string[] = [];
      for (const pId of selectedPlatforms) {
        const v = data?.platformVariants?.[pId];
        const text = v?.text ?? "";
        variants[pId] = text ? `${text}${v?.hashtags?.length ? "\n\n" + v.hashtags.join(" ") : ""}` : "";
        if (v?.suggestedImagePrompt && !first.length) first.push(v.suggestedImagePrompt);
      }

      if (mode === "video") {
        setScriptContent(variants[selectedPlatforms[0]] ?? "");
      } else {
        setPlatformContent(variants);
      }
      if (first[0]) setImagePrompt(first[0]);
      setPipelineStatus("review");
    } catch {
      showError("Something went wrong generating your copy. Please try again.");
    } finally {
      setIsGeneratingCopy(false);
      setShowAiPrompt(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      showError("Enter an image description first.");
      return;
    }
    setIsGeneratingImage(true);
    clearError();
    try {
      const res = await fetch("/api/social/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          platform: selectedPlatforms[0] ?? "instagram",
          brandSlug: brand.slug,
          aspectRatio,
        }),
      });
      if (!res.ok) throw new Error("Image generation failed");
      const data = await res.json();
      setGeneratedImageUrl(data.url ?? null);
      setShowImagePrompt(false);
    } catch {
      showError("Something went wrong generating the image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!scriptContent.trim()) {
      showError("Write or generate a script first.");
      return;
    }
    setIsGeneratingVideo(true);
    clearError();
    try {
      const res = await fetch("/api/social/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: scriptContent,
          brandSlug: brand.slug,
          format: videoFormat,
        }),
      });
      if (!res.ok) throw new Error("Video generation failed");
      const data = await res.json();
      setGeneratedVideoUrl(data.videoUrl ?? data.url ?? null);
      setGeneratedAudioUrl(data.audioUrl ?? null);
      setPipelineStatus("review");
    } catch {
      showError("Something went wrong generating the video. Please try again.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      showError("Select at least one platform to publish.");
      return;
    }
    setIsPublishing(true);
    clearError();
    try {
      const content: Record<string, { text: string; imageUrl?: string }> = {};
      for (const pId of selectedPlatforms) {
        content[pId] = {
          text: getContentForPlatform(pId),
          imageUrl: generatedImageUrl ?? undefined,
        };
      }
      const res = await fetch("/api/social/publish-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          content,
          brandSlug: brand.slug,
        }),
      });
      if (!res.ok) throw new Error("Publish failed");
      const data = await res.json();
      setPublishResults(data.results ?? []);
      const allOk = (data.results as PublishResult[]).every((r) => r.status !== "failed");
      if (allOk) setPipelineStatus("published");
    } catch {
      showError("Something went wrong publishing. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  const isComingSoon = COMING_SOON_MODES.includes(mode);

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Palette size={18} className="text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-text">Social Studio</h2>
          <p className="text-xs text-text-muted">{brand.name}</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 px-6 pt-4 pb-2 overflow-x-auto">
        {MODES.map((m) => {
          const Icon = m.icon;
          const coming = COMING_SOON_MODES.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                mode === m.id
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text hover:bg-white/5"
              )}
            >
              <Icon size={14} />
              {m.label}
              {coming && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  V2.1
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Platform selector — hide for coming-soon modes and brandkit */}
      {!isComingSoon && mode !== "brandkit" && (
        <div className="px-6 pb-4">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-2">
            Platforms
          </p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  selectedPlatforms.includes(p.id)
                    ? "border-accent/50 text-text bg-accent/10"
                    : "border-border text-text-muted hover:border-border hover:text-text-secondary"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: selectedPlatforms.includes(p.id) ? p.color : "var(--border)",
                  }}
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand Kit — full width when selected */}
      {mode === "brandkit" && (
        <div className="border-t border-border">
          <SocialBrandKit kit={socialBrandKit} onUpdate={setSocialBrandKit} brand={brand} />
        </div>
      )}

      {/* Main content area */}
      {mode !== "brandkit" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-border">
        {/* ── Editor panel ── */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-border relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Error banner */}
              <AnimatePresence>
                {errorMessage && (
                  <ErrorBanner message={errorMessage} onDismiss={clearError} />
                )}
              </AnimatePresence>

              {/* ── Quick Post ── */}
              {mode === "quick" && (
                <div className="space-y-4">
                  {/* AI generate prompt */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAiPrompt((v) => !v)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                      <Wand2 size={12} />
                      AI Generate
                    </button>
                    {Object.keys(platformContent).length > 0 && (
                      <span className="text-[10px] text-text-muted font-mono">
                        {selectedPlatforms.length} platform variant
                        {selectedPlatforms.length !== 1 ? "s" : ""} generated
                      </span>
                    )}
                  </div>

                  <AnimatePresence>
                    {showAiPrompt && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 space-y-3">
                          <p className="text-xs text-text-muted">
                            What do you want to post about?
                          </p>
                          <textarea
                            value={aiPromptText}
                            onChange={(e) => setAiPromptText(e.target.value)}
                            placeholder="Describe the topic, angle, or offer..."
                            className="w-full h-20 bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleGenerateCopy}
                              disabled={isGeneratingCopy}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isGeneratingCopy ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Sparkles size={12} />
                              )}
                              {isGeneratingCopy ? "Generating…" : "Generate Copy"}
                            </button>
                            <button
                              onClick={() => setShowAiPrompt(false)}
                              className="text-xs text-text-muted hover:text-text transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Per-platform text editors */}
                  {selectedPlatforms.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPlatforms.map((pId) => {
                        const plat = PLATFORMS.find((p) => p.id === pId);
                        return (
                          <div key={pId}>
                            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: plat?.color ?? "#666" }}
                              />
                              {plat?.label ?? pId}
                            </label>
                            <textarea
                              value={platformContent[pId] ?? ""}
                              onChange={(e) =>
                                setPlatformContent((prev) => ({
                                  ...prev,
                                  [pId]: e.target.value,
                                }))
                              }
                              placeholder={`Write your ${plat?.label ?? pId} post…`}
                              className="w-full h-28 bg-bg-deep border border-border rounded-lg p-3 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">
                      Select at least one platform above.
                    </p>
                  )}

                  {/* Image generation */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowImagePrompt((v) => !v)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                      <ImageIcon size={12} />
                      Generate Image
                    </button>

                    <AnimatePresence>
                      {showImagePrompt && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-lg border border-border bg-bg-deep p-3 space-y-3">
                            <textarea
                              value={imagePrompt}
                              onChange={(e) => setImagePrompt(e.target.value)}
                              placeholder="Describe the image you want…"
                              className="w-full h-16 bg-transparent text-sm text-text placeholder:text-text-muted resize-none focus:outline-none"
                            />
                            {/* Aspect ratio */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-text-muted font-mono">
                                Ratio:
                              </span>
                              {(["square", "landscape", "portrait"] as const).map((r) => (
                                <button
                                  key={r}
                                  onClick={() => setAspectRatio(r)}
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-mono border transition-colors",
                                    aspectRatio === r
                                      ? "border-accent/50 text-accent bg-accent/10"
                                      : "border-border text-text-muted hover:text-text"
                                  )}
                                >
                                  {r === "square" ? "1:1" : r === "landscape" ? "16:9" : "4:5"}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleGenerateImage}
                                disabled={isGeneratingImage}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isGeneratingImage ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Sparkles size={12} />
                                )}
                                {isGeneratingImage ? "Generating…" : "Generate"}
                              </button>
                              {generatedImageUrl && (
                                <button
                                  onClick={handleGenerateImage}
                                  disabled={isGeneratingImage}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-text-muted hover:text-text transition-colors disabled:opacity-50"
                                >
                                  <RefreshCw size={11} />
                                  Regenerate
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Image preview area */}
                    <AnimatePresence mode="wait">
                      {generatedImageUrl ? (
                        <motion.div
                          key="img"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.25 }}
                          className="aspect-video rounded-lg overflow-hidden border border-accent/20"
                        >
                          <img
                            src={generatedImageUrl}
                            alt="Generated"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          className="aspect-video rounded-lg border border-dashed border-border bg-bg-deep flex items-center justify-center"
                        >
                          <div className="text-center text-text-muted">
                            <ImageIcon size={24} className="mx-auto mb-1" />
                            <p className="text-xs">No image yet</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ── Video Post ── */}
              {mode === "video" && (
                <div className="space-y-4">
                  {/* Script */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                        Script
                      </label>
                      <button
                        onClick={() => setShowAiPrompt((v) => !v)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-medium hover:bg-accent/20 transition-colors"
                      >
                        <Wand2 size={10} />
                        AI Script
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAiPrompt && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mb-2"
                        >
                          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 space-y-2">
                            <textarea
                              value={aiPromptText}
                              onChange={(e) => setAiPromptText(e.target.value)}
                              placeholder="What should the video be about?"
                              className="w-full h-16 bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleGenerateCopy}
                                disabled={isGeneratingCopy}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isGeneratingCopy ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : (
                                  <Sparkles size={11} />
                                )}
                                {isGeneratingCopy ? "Generating…" : "Generate Script"}
                              </button>
                              <button
                                onClick={() => setShowAiPrompt(false)}
                                className="text-xs text-text-muted hover:text-text transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <textarea
                      value={scriptContent}
                      onChange={(e) => setScriptContent(e.target.value)}
                      placeholder="Write your video script…"
                      className="w-full h-32 bg-bg-deep border border-border rounded-lg p-4 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>

                  {/* Avatar selection */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-2 block">
                      Presenter
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PLACEHOLDER_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          onClick={() => setSelectedAvatar(av.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                            selectedAvatar === av.id
                              ? "border-accent bg-accent/10"
                              : "border-border bg-bg-deep hover:border-border"
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              selectedAvatar === av.id ? "bg-accent/20" : "bg-white/5"
                            )}
                          >
                            <User
                              size={18}
                              className={
                                selectedAvatar === av.id ? "text-accent" : "text-text-muted"
                              }
                            />
                          </div>
                          <span className="text-xs text-text font-medium">{av.name}</span>
                          <span className="text-[10px] text-text-muted">{av.style}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format selector */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-2 block">
                      Format
                    </label>
                    <div className="flex gap-2">
                      {(["9:16", "16:9", "1:1"] as const).map((fmt) => {
                        const labels: Record<string, string> = {
                          "9:16": "9:16 · Stories",
                          "16:9": "16:9 · Feed",
                          "1:1": "1:1 · Square",
                        };
                        return (
                          <button
                            key={fmt}
                            onClick={() => setVideoFormat(fmt)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors",
                              videoFormat === fmt
                                ? "border-accent/50 text-accent bg-accent/10"
                                : "border-border text-text-muted hover:text-text"
                            )}
                          >
                            {labels[fmt]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate video button */}
                  <button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isGeneratingVideo ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Video size={14} />
                    )}
                    {isGeneratingVideo ? "Generating Video…" : "Generate Video"}
                  </button>

                  {/* Video / audio result */}
                  <AnimatePresence>
                    {(generatedVideoUrl || generatedAudioUrl) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        {generatedVideoUrl && (
                          <div className="aspect-video rounded-lg overflow-hidden border border-accent/20 bg-bg-deep">
                            <video
                              src={generatedVideoUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {generatedAudioUrl && (
                          <audio src={generatedAudioUrl} controls className="w-full" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Slideshow (Coming V2.1) ── */}
              {mode === "slideshow" && (
                <div className="relative space-y-4">
                  {/* Greyed-out content */}
                  <div className="pointer-events-none select-none opacity-30 space-y-3">
                    {slides.map((slide, i) => (
                      <div key={slide.id} className="rounded-lg border border-border bg-bg-deep p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-text-muted">Slide {i + 1}</span>
                          <Trash2 size={12} className="text-text-muted" />
                        </div>
                        <textarea
                          readOnly
                          value={slide.narration}
                          onChange={(e) => updateSlideNarration(slide.id, e.target.value)}
                          placeholder="Slide narration…"
                          className="w-full h-16 bg-transparent text-sm text-text placeholder:text-text-muted resize-none focus:outline-none"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addSlide}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-text-muted"
                    >
                      <Plus size={12} />
                      Add Slide
                    </button>
                  </div>
                  {/* Coming soon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 bg-bg-card/80 backdrop-blur-sm rounded-xl px-8 py-6 border border-border">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                        Coming in V2.1
                      </span>
                      <p className="text-sm text-text-muted text-center">
                        Slideshow generation is in development
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Blog Post (Coming V2.1) ── */}
              {mode === "blog" && (
                <div className="relative space-y-3">
                  {/* Greyed-out content */}
                  <div className="pointer-events-none select-none opacity-30 space-y-3">
                    <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-bg-deep">
                      {[Bold, Italic, List, Link2, AlignLeft].map((Icon, i) => (
                        <button
                          key={i}
                          className="p-2 rounded hover:bg-white/5 text-text-muted hover:text-text transition-colors"
                        >
                          <Icon size={14} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      readOnly
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Start writing your blog post…"
                      className="w-full h-64 bg-bg-deep border border-border rounded-lg p-4 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none"
                    />
                  </div>
                  {/* Coming soon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 bg-bg-card/80 backdrop-blur-sm rounded-xl px-8 py-6 border border-border">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                        Coming in V2.1
                      </span>
                      <p className="text-sm text-text-muted text-center">
                        Blog post generation is in development
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Preview panel ── */}
        <div className="p-6 space-y-4">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
            Preview
          </p>
          {isComingSoon ? (
            <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border">
              <p className="text-sm text-text-muted">Preview available in V2.1</p>
            </div>
          ) : selectedPlatforms.length > 0 ? (
            <div className="space-y-4 max-h-[540px] overflow-y-auto pr-1">
              {selectedPlatforms.map((pId) => (
                <ContentPreview
                  key={pId}
                  platform={pId}
                  content={getContentForPlatform(pId)}
                  imageUrl={generatedImageUrl ?? undefined}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border text-text-muted text-sm">
              Select a platform to preview
            </div>
          )}
        </div>
      </div>
      )}

      {/* Pipeline + Actions */}
      {mode !== "brandkit" && (
      <div className="border-t border-border px-6 py-5 space-y-5">
        {/* Pipeline status */}
        <div className="pb-4">
          <PipelineStatus status={pipelineStatus} />
        </div>

        {/* Publish results */}
        <AnimatePresence>
          {publishResults && publishResults.length > 0 && (
            <PublishStatusPanel results={publishResults} />
          )}
        </AnimatePresence>

        {/* Action buttons */}
        {!isComingSoon && (
          <div className="flex items-center justify-end gap-3">
            {pipelineStatus === "published" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-accent text-sm font-semibold"
              >
                <CheckCircle2 size={16} />
                Published
              </motion.div>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing || selectedPlatforms.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {isPublishing ? "Publishing…" : "Publish"}
              </button>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
