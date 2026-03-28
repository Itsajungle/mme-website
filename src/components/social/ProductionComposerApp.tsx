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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";

interface ProductionComposerAppProps {
  brand: Brand;
}

interface ClipItem {
  id: string;
  description: string;
  status: "pending" | "generating" | "complete";
}

const PRESENTERS = [
  { id: "pr-1", name: "Alex M.", role: "Professional Anchor", tone: "Authoritative" },
  { id: "pr-2", name: "Sam K.", role: "Casual Host", tone: "Friendly" },
  { id: "pr-3", name: "Jordan L.", role: "Dynamic Presenter", tone: "Energetic" },
  { id: "pr-4", name: "Taylor R.", role: "Storyteller", tone: "Warm" },
];

export function ProductionComposerApp({ brand }: ProductionComposerAppProps) {
  const [concept, setConcept] = useState("");
  const [selectedPresenter, setSelectedPresenter] = useState("pr-1");
  const [clips, setClips] = useState<ClipItem[]>([
    { id: "c-1", description: "Opening hook — brand intro", status: "pending" },
    { id: "c-2", description: "Main message — key offer", status: "pending" },
    { id: "c-3", description: "Call to action — closing", status: "pending" },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

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

  const updateClipDescription = (id: string, text: string) => {
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, description: text } : c))
    );
  };

  const handleGenerateClips = () => {
    setIsGenerating(true);
    // Simulate sequential generation
    clips.forEach((clip, i) => {
      setTimeout(() => {
        setClips((prev) =>
          prev.map((c) =>
            c.id === clip.id ? { ...c, status: "generating" } : c
          )
        );
      }, i * 800);
      setTimeout(() => {
        setClips((prev) =>
          prev.map((c) =>
            c.id === clip.id ? { ...c, status: "complete" } : c
          )
        );
        if (i === clips.length - 1) {
          setIsGenerating(false);
        }
      }, (i + 1) * 800 + 400);
    });
  };

  const handleCompose = () => {
    setIsComposing(true);
    setTimeout(() => setIsComposing(false), 2000);
  };

  const allComplete = clips.every((c) => c.status === "complete");

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Film size={18} className="text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-text">
            Production Composer
          </h2>
          <p className="text-xs text-text-muted">{brand.name}</p>
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
                  {/* Clip number */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold",
                      clip.status === "complete"
                        ? "bg-accent/20 text-accent"
                        : clip.status === "generating"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-white/5 text-text-muted"
                    )}
                  >
                    {clip.status === "complete" ? (
                      <Check size={14} />
                    ) : clip.status === "generating" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      i + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={clip.description}
                      onChange={(e) =>
                        updateClipDescription(clip.id, e.target.value)
                      }
                      placeholder={`Clip ${i + 1} description...`}
                      className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          "text-[10px] font-mono",
                          clip.status === "complete"
                            ? "text-accent"
                            : clip.status === "generating"
                              ? "text-yellow-400"
                              : "text-text-muted"
                        )}
                      >
                        {clip.status === "complete"
                          ? "Complete"
                          : clip.status === "generating"
                            ? "Generating..."
                            : "Pending"}
                      </span>
                    </div>
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

            <div className="flex items-center gap-2">
              <button
                onClick={addClip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-text-muted hover:text-text hover:border-accent/30 transition-colors"
              >
                <Plus size={12} />
                Add Clip
              </button>

              <button
                onClick={handleGenerateClips}
                disabled={isGenerating}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isGenerating
                    ? "bg-yellow-400/10 text-yellow-400 cursor-wait"
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                )}
              >
                {isGenerating ? (
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
          </div>
        </div>

        {/* Right: Presenter + Preview */}
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
                <div
                  key={clip.id}
                  className="flex items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center text-[10px]",
                      clip.status === "complete"
                        ? "bg-accent/20 text-accent"
                        : clip.status === "generating"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-white/5 text-text-muted"
                    )}
                  >
                    {clip.status === "complete" ? (
                      <Check size={10} />
                    ) : clip.status === "generating" ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Clock size={10} />
                    )}
                  </div>
                  <span className="text-xs text-text-secondary flex-1 truncate">
                    Clip {i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-mono",
                      clip.status === "complete"
                        ? "text-accent"
                        : clip.status === "generating"
                          ? "text-yellow-400"
                          : "text-text-muted"
                    )}
                  >
                    {clip.status === "complete"
                      ? "Done"
                      : clip.status === "generating"
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
            <div className="aspect-video rounded-lg border border-border bg-bg-deep flex items-center justify-center relative overflow-hidden">
              {isComposing ? (
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 size={24} className="text-accent animate-spin" />
                  <span className="text-xs text-accent font-mono">
                    Composing...
                  </span>
                </motion.div>
              ) : allComplete ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <Play size={20} className="text-accent ml-0.5" />
                  </div>
                  <span className="text-xs text-text-secondary">
                    Ready to preview
                  </span>
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

            <button
              onClick={handleCompose}
              disabled={!allComplete || isComposing}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                allComplete && !isComposing
                  ? "bg-accent text-bg hover:bg-accent-hover"
                  : "bg-white/5 text-text-muted cursor-not-allowed"
              )}
            >
              <Clapperboard size={14} />
              Compose Final Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
