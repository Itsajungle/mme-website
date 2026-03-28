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
  SendHorizonal,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import { ContentPreview } from "./ContentPreview";
import { PipelineStatus } from "./PipelineStatus";

interface SocialStudioAppProps {
  brand: Brand;
}

const MODES = [
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

interface SlideItem {
  id: string;
  narration: string;
}

export function SocialStudioApp({ brand }: SocialStudioAppProps) {
  const [mode, setMode] = useState<Mode>("quick");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [content, setContent] = useState("");
  const [scriptContent, setScriptContent] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("av-1");
  const [blogContent, setBlogContent] = useState("");
  const [slides, setSlides] = useState<SlideItem[]>([
    { id: "s-1", narration: "" },
    { id: "s-2", narration: "" },
  ]);
  const [pipelineStatus] = useState<"draft" | "review" | "scheduled" | "published">("draft");
  const [imageGenerated, setImageGenerated] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const addSlide = () => {
    setSlides((prev) => [
      ...prev,
      { id: `s-${Date.now()}`, narration: "" },
    ]);
  };

  const removeSlide = (id: string) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSlideNarration = (id: string, text: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, narration: text } : s))
    );
  };

  const activeContent =
    mode === "quick"
      ? content
      : mode === "video"
        ? scriptContent
        : mode === "blog"
          ? blogContent
          : slides.map((s) => s.narration).join("\n\n");

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
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                mode === m.id
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text hover:bg-white/5"
              )}
            >
              <Icon size={14} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Platform selector */}
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

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-border">
        {/* Editor panel */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Quick Post */}
              {mode === "quick" && (
                <div className="space-y-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post..."
                    className="w-full h-40 bg-bg-deep border border-border rounded-lg p-4 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  <div className="space-y-3">
                    <button
                      onClick={() => setImageGenerated(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
                    >
                      <ImageIcon size={14} />
                      Generate Image
                    </button>
                    <div
                      className={cn(
                        "aspect-video rounded-lg border border-dashed flex items-center justify-center",
                        imageGenerated
                          ? "border-accent/30 bg-accent/5"
                          : "border-border bg-bg-deep"
                      )}
                    >
                      {imageGenerated ? (
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-lg bg-accent/10 mx-auto mb-2 flex items-center justify-center">
                            <ImageIcon size={24} className="text-accent" />
                          </div>
                          <p className="text-xs text-accent">Image generated</p>
                        </div>
                      ) : (
                        <div className="text-center text-text-muted">
                          <ImageIcon size={24} className="mx-auto mb-1" />
                          <p className="text-xs">No image yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Video Post */}
              {mode === "video" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-2 block">
                      Script
                    </label>
                    <textarea
                      value={scriptContent}
                      onChange={(e) => setScriptContent(e.target.value)}
                      placeholder="Write your video script..."
                      className="w-full h-32 bg-bg-deep border border-border rounded-lg p-4 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-2 block">
                      Avatar / Presenter
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
                              selectedAvatar === av.id
                                ? "bg-accent/20"
                                : "bg-white/5"
                            )}
                          >
                            <User
                              size={18}
                              className={
                                selectedAvatar === av.id
                                  ? "text-accent"
                                  : "text-text-muted"
                              }
                            />
                          </div>
                          <span className="text-xs text-text font-medium">{av.name}</span>
                          <span className="text-[10px] text-text-muted">{av.style}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                    <Video size={14} />
                    Generate Video
                  </button>
                </div>
              )}

              {/* Slideshow */}
              {mode === "slideshow" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {slides.map((slide, i) => (
                      <div
                        key={slide.id}
                        className="rounded-lg border border-border bg-bg-deep p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-text-muted">
                            Slide {i + 1}
                          </span>
                          <button
                            onClick={() => removeSlide(slide.id)}
                            className="text-text-muted hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <textarea
                          value={slide.narration}
                          onChange={(e) =>
                            updateSlideNarration(slide.id, e.target.value)
                          }
                          placeholder="Slide narration..."
                          className="w-full h-16 bg-transparent text-sm text-text placeholder:text-text-muted resize-none focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addSlide}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-text-muted hover:text-text hover:border-accent/30 transition-colors"
                  >
                    <Plus size={12} />
                    Add Slide
                  </button>
                </div>
              )}

              {/* Blog Post */}
              {mode === "blog" && (
                <div className="space-y-3">
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
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Start writing your blog post..."
                    className="w-full h-64 bg-bg-deep border border-border rounded-lg p-4 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Preview panel */}
        <div className="p-6 space-y-4">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
            Preview
          </p>
          {selectedPlatforms.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {selectedPlatforms.map((pId) => (
                <ContentPreview
                  key={pId}
                  platform={pId}
                  content={activeContent}
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

      {/* Pipeline + Actions */}
      <div className="border-t border-border px-6 py-4 space-y-4">
        <div className="pt-2 pb-6">
          <PipelineStatus status={pipelineStatus} />
        </div>
        <div className="flex items-center justify-end">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors">
            <SendHorizonal size={14} />
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}
