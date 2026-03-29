"use client";

import { useState, useEffect, useCallback } from "react";
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
  Play,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import type { PublishResult } from "@/lib/social-engine/types";
import type { SocialBrandKit as SocialBrandKitType } from "@/lib/social-engine/brand-kit-types";
import { DEFAULT_SOCIAL_BRAND_KIT } from "@/lib/social-engine/brand-kit-types";
import { ContentPreview } from "./ContentPreview";
import { PipelineStatus } from "./PipelineStatus";
import { SocialBrandKit } from "./SocialBrandKit";
import { ContentResultCards } from "./ContentResultCards";
import { CanvaConnect } from "./CanvaConnect";

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

const COMING_SOON_MODES: Mode[] = ["blog"];

interface SlideItem {
  id: string;
  narration: string;
}

// Types for the unified content generation response
interface GeneratedContentItem {
  platform: string;
  headline: string;
  body: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
  imageUrl?: string;
}

interface GeneratedSlide {
  slideNumber: number;
  heading: string;
  narration: string;
  imagePrompt: string;
  imageUrl?: string;
  duration: number;
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

  // Slideshow state
  const [slides, setSlides] = useState<SlideItem[]>([
    { id: "s-1", narration: "" },
    { id: "s-2", narration: "" },
  ]);
  const [blogContent, setBlogContent] = useState("");

  // Slideshow input fields (car dealer)
  const [slideshowProduct, setSlideshowProduct] = useState("");
  const [slideshowFeatures, setSlideshowFeatures] = useState("");
  const [slideshowDealer, setSlideshowDealer] = useState("");
  const [slideshowLocation, setSlideshowLocation] = useState("");
  const [slideshowCount, setSlideshowCount] = useState(7);
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carColour, setCarColour] = useState("");
  const [dealDetails, setDealDetails] = useState("");
  const [slideshowVoiceId, setSlideshowVoiceId] = useState("");
  const [availableVoices, setAvailableVoices] = useState<Array<{ voiceId: string; name: string; accent?: string }>>([]);
  const [slideshowProgress, setSlideshowProgress] = useState<string | null>(null);
  const [slideshowAudioUrl, setSlideshowAudioUrl] = useState<string | null>(null);

  // Generated content results (Quick Post / MME Moment)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentItem[] | null>(null);
  // Generated slideshow results
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedSlide[] | null>(null);
  const [slideshowTotalDuration, setSlideshowTotalDuration] = useState(0);
  const [slideshowScript, setSlideshowScript] = useState("");
  const [isGeneratingSlideshow, setIsGeneratingSlideshow] = useState(false);
  const [publishingPlatforms, setPublishingPlatforms] = useState<Record<string, boolean>>({});

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

  // Canva connection
  const [canvaConnected, setCanvaConnected] = useState(false);

  const checkCanvaStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/canva/status?brand_id=${encodeURIComponent(brand.slug)}`);
      if (res.ok) {
        const data = await res.json();
        setCanvaConnected(data.connected);
      }
    } catch { /* ignore */ }
  }, [brand.slug]);

  useEffect(() => {
    checkCanvaStatus();
    // Check if redirected back from Canva OAuth
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("canva") === "connected") {
        setCanvaConnected(true);
      }
    }
  }, [checkCanvaStatus]);

  // Load available voices for slideshow
  useEffect(() => {
    fetch("/api/audio/voices")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.voices) {
          setAvailableVoices(
            data.voices.map((v: { voice_id?: string; voiceId?: string; name: string; accent?: string }) => ({
              voiceId: v.voice_id ?? v.voiceId ?? "",
              name: v.name,
              accent: v.accent,
            })),
          );
        }
      })
      .catch(() => { /* voices will use brand default */ });
  }, []);

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

  // Generate content via the unified endpoint (Quick Post + MME Moment)
  const handleGenerateContent = async (contentType: "quick-post" | "mme-moment" = "quick-post") => {
    if (selectedPlatforms.length === 0) {
      showError("Select at least one platform first.");
      return;
    }
    setIsGeneratingCopy(true);
    clearError();
    setGeneratedContent(null);
    try {
      const res = await fetch("/api/social/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSlug: brand.slug,
          contentType,
          platforms: selectedPlatforms,
          topic: aiPromptText || undefined,
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

      if (data.success && data.content) {
        setGeneratedContent(data.content as GeneratedContentItem[]);
        // Also populate platform text editors as fallback
        const variants: Record<string, string> = {};
        for (const item of data.content as GeneratedContentItem[]) {
          const hashStr = item.hashtags?.length ? "\n\n" + item.hashtags.map((t: string) => `#${t.replace(/^#/, "")}`).join(" ") : "";
          variants[item.platform] = `${item.headline}\n\n${item.body}${hashStr}`;
          if (item.imagePrompt && !imagePrompt) setImagePrompt(item.imagePrompt);
          if (item.imageUrl && !generatedImageUrl) setGeneratedImageUrl(item.imageUrl);
        }
        setPlatformContent(variants);
      }
      setPipelineStatus("review");
    } catch {
      showError("Something went wrong generating your content. Please try again.");
    } finally {
      setIsGeneratingCopy(false);
      setShowAiPrompt(false);
    }
  };

  // Legacy copy generation for video mode only
  const handleGenerateCopy = async () => {
    if (mode === "quick" || mode === "slideshow") {
      return handleGenerateContent("quick-post");
    }
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
          contentType: "video_script",
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

      const variants: Record<string, string> = {};
      const first: string[] = [];
      for (const pId of selectedPlatforms) {
        const v = data?.platformVariants?.[pId];
        const text = v?.text ?? "";
        variants[pId] = text ? `${text}${v?.hashtags?.length ? "\n\n" + v.hashtags.join(" ") : ""}` : "";
        if (v?.suggestedImagePrompt && !first.length) first.push(v.suggestedImagePrompt);
      }

      setScriptContent(variants[selectedPlatforms[0]] ?? "");
      if (first[0]) setImagePrompt(first[0]);
      setPipelineStatus("review");
    } catch {
      showError("Something went wrong generating your copy. Please try again.");
    } finally {
      setIsGeneratingCopy(false);
      setShowAiPrompt(false);
    }
  };

  // Generate narrated slideshow (car dealer)
  const handleGenerateSlideshow = async () => {
    if (!carMake.trim() || !carModel.trim()) {
      showError("Enter at least the car make and model.");
      return;
    }
    setIsGeneratingSlideshow(true);
    clearError();
    setGeneratedSlides(null);
    setSlideshowAudioUrl(null);
    setGeneratedVideoUrl(null);
    setGeneratedAudioUrl(null);
    setSlideshowProgress("Generating script...");
    try {
      const res = await fetch("/api/social/generate-slideshow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSlug: brand.slug,
          carMake,
          carModel,
          carColour: carColour || "white",
          dealDetails: dealDetails || "Great deals available",
          voiceId: slideshowVoiceId || undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Slideshow generation failed");
      }
      setSlideshowProgress("Processing results...");
      const data = await res.json();

      if (data.success && data.slides) {
        setGeneratedSlides(
          data.slides.map((s: { type: string; heading: string; narration: string; imageUrl?: string; duration: number }, i: number) => ({
            slideNumber: i + 1,
            heading: s.heading,
            narration: s.narration,
            imagePrompt: "",
            imageUrl: s.imageUrl,
            duration: s.duration,
            type: s.type,
          })),
        );
        setSlideshowTotalDuration(data.totalDuration ?? 0);
        setSlideshowScript(
          data.script
            ? `${data.script.intro} ${data.script.carDescription} ${data.script.cta}`
            : "",
        );
        setSlideshowAudioUrl(data.audioUrl ?? null);
      }
      setPipelineStatus("review");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Something went wrong generating your slideshow.");
    } finally {
      setIsGeneratingSlideshow(false);
      setSlideshowProgress(null);
    }
  };

  // Publish single platform from content cards
  const handlePublishPlatform = async (platform: string) => {
    setPublishingPlatforms((prev) => ({ ...prev, [platform]: true }));
    clearError();
    try {
      const item = generatedContent?.find((c) => c.platform === platform);
      if (!item) return;
      const res = await fetch("/api/social/publish-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: [platform],
          content: {
            [platform]: {
              text: `${item.headline}\n\n${item.body}\n\n${item.hashtags.map((t) => `#${t.replace(/^#/, "")}`).join(" ")}`,
              imageUrl: item.imageUrl,
            },
          },
          brandSlug: brand.slug,
        }),
      });
      if (!res.ok) throw new Error("Publish failed");
      const data = await res.json();
      setPublishResults((prev) => [...(prev ?? []), ...(data.results ?? [])]);
    } catch {
      showError(`Failed to publish to ${platform}. Please try again.`);
    } finally {
      setPublishingPlatforms((prev) => ({ ...prev, [platform]: false }));
    }
  };

  // Edit content card field
  const handleEditContent = (platform: string, field: string, value: string) => {
    setGeneratedContent((prev) =>
      prev?.map((item) =>
        item.platform === platform ? { ...item, [field]: value } : item,
      ) ?? null,
    );
  };

  // Generate slideshow video (single composed output)
  const handleGenerateSlideshowVideo = async () => {
    if (!generatedSlides || generatedSlides.length === 0) {
      showError("Generate a slideshow first.");
      return;
    }
    setIsGeneratingVideo(true);
    clearError();
    try {
      const fullScript = generatedSlides.map((s) => s.narration).filter(Boolean).join("\n\n");
      const res = await fetch("/api/social/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: fullScript,
          brandSlug: brand.slug,
          format: "16:9" as const,
          audioUrl: slideshowAudioUrl,
          slides: generatedSlides.map((s) => ({
            heading: s.heading,
            narration: s.narration,
            imageUrl: s.imageUrl,
            duration: s.duration,
          })),
        }),
      });
      if (!res.ok) throw new Error("Video generation failed");
      const data = await res.json();
      setGeneratedVideoUrl(data.videoUrl ?? data.url ?? null);
      setGeneratedAudioUrl(data.audioUrl ?? slideshowAudioUrl ?? null);
      setPipelineStatus("review");
    } catch {
      showError("Something went wrong generating the video. Please try again.");
    } finally {
      setIsGeneratingVideo(false);
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

      {/* Platform selector — hide for coming-soon modes, brandkit, and slideshow */}
      {!isComingSoon && mode !== "brandkit" && mode !== "slideshow" && (
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
                    {generatedContent && generatedContent.length > 0 && (
                      <span className="text-[10px] text-text-muted font-mono">
                        {generatedContent.length} platform variant
                        {generatedContent.length !== 1 ? "s" : ""} generated
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
                              onClick={() => handleGenerateContent("quick-post")}
                              disabled={isGeneratingCopy}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isGeneratingCopy ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Sparkles size={12} />
                              )}
                              {isGeneratingCopy ? "Generating…" : "Generate Content"}
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

                  {/* Canva connection */}
                  <CanvaConnect
                    brandSlug={brand.slug}
                    connected={canvaConnected}
                    onDisconnect={async () => {
                      try {
                        await fetch(`/api/canva/status?brand_id=${encodeURIComponent(brand.slug)}`);
                        setCanvaConnected(false);
                      } catch { /* ignore */ }
                    }}
                  />

                  {/* Generated content cards */}
                  {generatedContent && generatedContent.length > 0 ? (
                    <ContentResultCards
                      content={generatedContent}
                      onEdit={handleEditContent}
                      onPublish={handlePublishPlatform}
                      isPublishing={publishingPlatforms}
                      canvaConnected={canvaConnected}
                      brandSlug={brand.slug}
                    />
                  ) : selectedPlatforms.length > 0 ? (
                    <div className="flex items-center justify-center h-32 rounded-xl border border-dashed border-border text-text-muted text-sm">
                      <div className="text-center">
                        <Sparkles size={20} className="mx-auto mb-2 opacity-40" />
                        <p className="text-xs">Click &quot;AI Generate&quot; to create content</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">
                      Select at least one platform above.
                    </p>
                  )}
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

              {/* ── Slideshow ── */}
              {mode === "slideshow" && (
                <div className="space-y-4">
                  {/* Car dealer slideshow input form */}
                  {!generatedSlides && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
                            Car Make
                          </label>
                          <input
                            value={carMake}
                            onChange={(e) => setCarMake(e.target.value)}
                            placeholder="e.g. Toyota"
                            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
                            Car Model
                          </label>
                          <input
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                            placeholder="e.g. Corolla"
                            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
                            Colour
                          </label>
                          <input
                            value={carColour}
                            onChange={(e) => setCarColour(e.target.value)}
                            placeholder="e.g. Pearl White"
                            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
                          Deal / Promotion Details
                        </label>
                        <textarea
                          value={dealDetails}
                          onChange={(e) => setDealDetails(e.target.value)}
                          placeholder="0% finance, free first service, 3-year warranty, trade-in bonus…"
                          className="w-full h-20 bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
                          AI Voice
                        </label>
                        <div className="relative">
                          <select
                            value={slideshowVoiceId}
                            onChange={(e) => setSlideshowVoiceId(e.target.value)}
                            className="w-full appearance-none bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors pr-8"
                          >
                            <option value="">Default (Brand Voice)</option>
                            {availableVoices.map((v) => (
                              <option key={v.voiceId} value={v.voiceId}>
                                {v.name}{v.accent ? ` — ${v.accent}` : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                      </div>

                      {/* Progress indicator */}
                      {slideshowProgress && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/5 border border-accent/20"
                        >
                          <Loader2 size={12} className="animate-spin text-accent" />
                          <span className="text-xs text-accent">{slideshowProgress}</span>
                        </motion.div>
                      )}

                      <button
                        onClick={handleGenerateSlideshow}
                        disabled={isGeneratingSlideshow || !carMake.trim() || !carModel.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isGeneratingSlideshow ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Sparkles size={12} />
                        )}
                        {isGeneratingSlideshow ? "Generating Narrated Slideshow…" : "Generate Narrated Slideshow"}
                      </button>
                    </div>
                  )}

                  {/* Slideshow results — vertical timeline */}
                  {generatedSlides && generatedSlides.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                          Narrated Slideshow · {generatedSlides.length} slides
                        </p>
                        <button
                          onClick={() => {
                            setGeneratedSlides(null);
                            setSlideshowAudioUrl(null);
                            setGeneratedVideoUrl(null);
                            setGeneratedAudioUrl(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-text-muted hover:text-text hover:bg-white/5 transition-colors"
                        >
                          <RefreshCw size={10} />
                          New
                        </button>
                      </div>

                      {/* Slide cards */}
                      <div className="relative space-y-0">
                        {/* Timeline line */}
                        <div className="absolute left-[17px] top-4 bottom-4 w-px bg-border" />

                        {generatedSlides.map((slide, i) => {
                          const wordCount = slide.narration ? slide.narration.split(/\s+/).filter(Boolean).length : 0;
                          const slideType = (slide as GeneratedSlide & { type?: string }).type;
                          const typeLabel =
                            slideType === "logo" ? "Logo"
                            : slideType === "avatar_intro" ? "Intro"
                            : slideType === "car_image" ? "Car"
                            : slideType === "callout" ? "Deal"
                            : slideType === "avatar_cta" ? "CTA"
                            : "";
                          return (
                            <motion.div
                              key={slide.slideNumber}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.06 }}
                              className="relative pl-10 pb-4"
                            >
                              {/* Slide number badge */}
                              <div className="absolute left-0 top-0 w-[35px] h-[35px] rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center z-10">
                                <span className="text-xs font-bold font-mono text-accent">
                                  {slide.slideNumber}
                                </span>
                              </div>

                              <div className="rounded-xl border border-border bg-bg-card p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  {typeLabel && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider">
                                      {typeLabel}
                                    </span>
                                  )}
                                  <p className="text-sm font-semibold text-text">{slide.heading}</p>
                                </div>

                                {/* Image */}
                                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-bg-deep">
                                  {slide.imageUrl ? (
                                    <img
                                      src={slide.imageUrl}
                                      alt={slide.heading}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                                      <ImageIcon size={18} className="opacity-30" />
                                    </div>
                                  )}
                                </div>

                                {slide.narration && (
                                  <p className="text-xs text-text-secondary leading-relaxed">
                                    {slide.narration}
                                  </p>
                                )}

                                <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
                                  {wordCount > 0 && (
                                    <>
                                      <span>{wordCount} words</span>
                                      <span>·</span>
                                    </>
                                  )}
                                  <span>{slide.duration}s</span>
                                  <Play size={10} className="ml-auto text-text-muted opacity-50" />
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Total duration */}
                      <div className="rounded-lg border border-border bg-bg-deep p-3 flex items-center justify-between">
                        <span className="text-xs text-text-muted font-mono">
                          Total duration
                        </span>
                        <span className="text-sm font-semibold text-text">
                          {Math.floor(slideshowTotalDuration / 60)}:{String(slideshowTotalDuration % 60).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Audio narration player */}
                      {slideshowAudioUrl && !generatedVideoUrl && (
                        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 space-y-2">
                          <p className="text-[10px] uppercase tracking-wider text-accent font-mono">
                            AI Narration
                          </p>
                          <audio src={slideshowAudioUrl} controls className="w-full" />
                        </div>
                      )}

                      {/* Generate Video button */}
                      <button
                        onClick={handleGenerateSlideshowVideo}
                        disabled={isGeneratingVideo}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isGeneratingVideo ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Video size={14} />
                        )}
                        {isGeneratingVideo ? "Composing Video…" : "Compose Video"}
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
                                {generatedVideoUrl.includes("/api/video/serve") ? (
                                  <video
                                    src={generatedVideoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={generatedVideoUrl}
                                    alt="Slideshow preview"
                                    className="w-full h-full object-cover"
                                  />
                                )}
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
          ) : mode === "slideshow" ? (
            generatedSlides && generatedSlides.length > 0 ? (
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                <div className="rounded-lg border border-border bg-bg-deep p-3 text-center">
                  <p className="text-xs text-text-muted font-mono mb-1">Narrated Slideshow</p>
                  <p className="text-lg font-semibold text-text">
                    {carMake && carModel ? `${carMake} ${carModel}` : slideshowProduct || "Car Dealer Promo"}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {generatedSlides.length} slides · {Math.floor(slideshowTotalDuration / 60)}:{String(slideshowTotalDuration % 60).padStart(2, "0")}
                  </p>
                </div>
                {generatedSlides.map((slide) => {
                  const slideType = (slide as GeneratedSlide & { type?: string }).type;
                  return (
                    <div key={slide.slideNumber} className="rounded-lg border border-border bg-bg-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-[10px] font-bold font-mono flex items-center justify-center">
                          {slide.slideNumber}
                        </span>
                        <span className="text-xs font-medium text-text">{slide.heading}</span>
                        {slideType === "callout" && (
                          <span className="ml-auto px-1.5 py-0.5 rounded text-[8px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">
                            DEAL
                          </span>
                        )}
                      </div>
                      {slide.imageUrl && (
                        <div className="aspect-video rounded overflow-hidden mb-2">
                          <img src={slide.imageUrl} alt={slide.heading} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {slide.narration && (
                        <p className="text-[11px] text-text-secondary leading-relaxed">{slide.narration}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border text-text-muted text-sm">
                Generate a slideshow to preview
              </div>
            )
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
