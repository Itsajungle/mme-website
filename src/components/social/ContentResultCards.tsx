"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Send,
  Check,
  X,
  Loader2,
  ImageIcon,
  Palette,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "#ff0050",
  instagram: "#e1306c",
  facebook: "#1877f2",
  x: "#999",
  linkedin: "#0077b5",
};

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X",
  linkedin: "LinkedIn",
};

// Platforms that use square images
const SQUARE_PLATFORMS = new Set(["instagram", "tiktok"]);

type CanvaState =
  | "idle"
  | "creating"
  | "canva_editing"
  | "exporting"
  | "exported";

interface ContentItem {
  platform: string;
  headline: string;
  body: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
  imageUrl?: string;
}

interface ContentResultCardsProps {
  content: ContentItem[];
  onEdit: (platform: string, field: string, value: string) => void;
  onPublish: (platform: string) => void;
  isPublishing?: Record<string, boolean>;
  canvaConnected?: boolean;
  brandSlug?: string;
}

export function ContentResultCards({
  content,
  onEdit,
  onPublish,
  isPublishing = {},
  canvaConnected = false,
  brandSlug = "",
}: ContentResultCardsProps) {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, Partial<ContentItem>>>({});
  const [canvaStates, setCanvaStates] = useState<Record<string, CanvaState>>({});
  const [canvaDesignIds, setCanvaDesignIds] = useState<Record<string, string>>({});
  const [canvaExportIds, setCanvaExportIds] = useState<Record<string, string>>({});
  const [canvaImageUrls, setCanvaImageUrls] = useState<Record<string, string>>({});

  const startEdit = (platform: string, item: ContentItem) => {
    setEditingCard(platform);
    setEditValues((prev) => ({
      ...prev,
      [platform]: { headline: item.headline, body: item.body, cta: item.cta },
    }));
  };

  const cancelEdit = () => setEditingCard(null);

  const saveEdit = (platform: string) => {
    const vals = editValues[platform];
    if (vals) {
      if (vals.headline !== undefined) onEdit(platform, "headline", vals.headline);
      if (vals.body !== undefined) onEdit(platform, "body", vals.body);
      if (vals.cta !== undefined) onEdit(platform, "cta", vals.cta);
    }
    setEditingCard(null);
  };

  const setCanvaState = (platform: string, state: CanvaState) =>
    setCanvaStates((prev) => ({ ...prev, [platform]: state }));

  const handleOpenInCanva = async (platform: string, title: string) => {
    setCanvaState(platform, "creating");
    try {
      const res = await fetch("/api/canva/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: brandSlug, title, design_type: `custom_${platform}` }),
      });
      if (!res.ok) throw new Error("Failed to create design");
      const data = await res.json();
      setCanvaDesignIds((prev) => ({ ...prev, [platform]: data.design_id }));
      window.open(data.edit_url, "_blank");
      setCanvaState(platform, "canva_editing");
    } catch (err) {
      console.error("Canva design creation failed:", err);
      setCanvaState(platform, "idle");
    }
  };

  const handleExportFromCanva = async (platform: string) => {
    const designId = canvaDesignIds[platform];
    if (!designId) return;
    setCanvaState(platform, "exporting");
    try {
      const exportRes = await fetch(`/api/canva/designs/${designId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: brandSlug, format: "png" }),
      });
      if (!exportRes.ok) throw new Error("Export failed");
      const exportData = await exportRes.json();
      const exportId = exportData.export_id;
      setCanvaExportIds((prev) => ({ ...prev, [platform]: exportId }));

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30;
      const poll = async () => {
        const statusRes = await fetch(
          `/api/canva/exports/${exportId}?brand_id=${encodeURIComponent(brandSlug)}`,
        );
        if (!statusRes.ok) throw new Error("Status check failed");
        const statusData = await statusRes.json();

        if (statusData.status === "completed" && statusData.download_urls?.length) {
          setCanvaImageUrls((prev) => ({
            ...prev,
            [platform]: statusData.download_urls[0],
          }));
          setCanvaState(platform, "exported");
          return;
        }
        if (statusData.status === "failed") {
          setCanvaState(platform, "canva_editing");
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setCanvaState(platform, "canva_editing");
        }
      };
      await poll();
    } catch {
      setCanvaState(platform, "canva_editing");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {content.map((item, i) => {
        const color = PLATFORM_COLORS[item.platform] ?? "#00FF96";
        const label = PLATFORM_LABELS[item.platform] ?? item.platform;
        const isEditing = editingCard === item.platform;
        const isSquare = SQUARE_PLATFORMS.has(item.platform);
        const publishing = isPublishing[item.platform] ?? false;
        const cState = canvaStates[item.platform] ?? "idle";
        const exportedUrl = canvaImageUrls[item.platform];

        return (
          <motion.div
            key={item.platform}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="rounded-xl border border-border bg-bg-card overflow-hidden"
          >
            {/* Platform colour accent stripe */}
            <div className="h-1" style={{ backgroundColor: color }} />

            <div className="p-4 space-y-3">
              {/* Platform badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-semibold text-text">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(item.platform)}
                        className="p-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(item.platform, item)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors"
                    >
                      <Edit3 size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Image preview */}
              <div
                className={cn(
                  "rounded-lg overflow-hidden border border-border bg-bg-deep",
                  isSquare ? "aspect-square" : "aspect-video",
                )}
              >
                {exportedUrl ? (
                  <img
                    src={exportedUrl}
                    alt={`Canva design for ${label}`}
                    className="w-full h-full object-cover"
                  />
                ) : item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={`Generated for ${label}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <div className="text-center">
                      <ImageIcon size={20} className="mx-auto mb-1 opacity-40" />
                      <p className="text-[10px] font-mono">No image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Headline */}
              {isEditing ? (
                <input
                  value={editValues[item.platform]?.headline ?? item.headline}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      [item.platform]: { ...prev[item.platform], headline: e.target.value },
                    }))
                  }
                  className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm font-semibold text-text focus:outline-none focus:border-accent/50 transition-colors"
                />
              ) : (
                <p className="text-sm font-semibold text-text leading-snug">{item.headline}</p>
              )}

              {/* Body */}
              {isEditing ? (
                <textarea
                  value={editValues[item.platform]?.body ?? item.body}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      [item.platform]: { ...prev[item.platform], body: e.target.value },
                    }))
                  }
                  className="w-full h-24 bg-bg-deep border border-border rounded-lg px-3 py-2 text-xs text-text-secondary resize-none focus:outline-none focus:border-accent/50 transition-colors"
                />
              ) : (
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">
                  {item.body}
                </p>
              )}

              {/* Hashtags */}
              {item.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.hashtags.slice(0, 8).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/8 text-accent/70 border border-accent/10"
                    >
                      #{tag.replace(/^#/, "")}
                    </span>
                  ))}
                  {item.hashtags.length > 8 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-text-muted">
                      +{item.hashtags.length - 8}
                    </span>
                  )}
                </div>
              )}

              {/* CTA */}
              {item.cta && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                    CTA:
                  </span>
                  {isEditing ? (
                    <input
                      value={editValues[item.platform]?.cta ?? item.cta}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [item.platform]: { ...prev[item.platform], cta: e.target.value },
                        }))
                      }
                      className="flex-1 bg-bg-deep border border-border rounded px-2 py-1 text-[11px] text-text focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  ) : (
                    <span className="text-[11px] text-amber-400">{item.cta}</span>
                  )}
                </div>
              )}

              {/* Canva design flow */}
              {canvaConnected && (
                <AnimatePresence mode="wait">
                  {cState === "idle" && (
                    <motion.button
                      key="open-canva"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => handleOpenInCanva(item.platform, item.headline)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:from-blue-600/20 hover:to-purple-600/20 transition-all"
                    >
                      <Palette size={12} />
                      Design with Canva
                    </motion.button>
                  )}

                  {cState === "creating" && (
                    <motion.div
                      key="creating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs"
                    >
                      <Loader2 size={12} className="animate-spin" />
                      Creating design…
                    </motion.div>
                  )}

                  {cState === "canva_editing" && (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                        </span>
                        Waiting for edits in Canva…
                      </div>
                      <button
                        onClick={() => handleExportFromCanva(item.platform)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
                      >
                        <Download size={12} />
                        Export from Canva
                      </button>
                    </motion.div>
                  )}

                  {cState === "exporting" && (
                    <motion.div
                      key="exporting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs"
                    >
                      <Loader2 size={12} className="animate-spin" />
                      Exporting design…
                    </motion.div>
                  )}

                  {cState === "exported" && (
                    <motion.div
                      key="exported"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium"
                    >
                      <Check size={12} />
                      Canva design exported
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Publish button */}
              <button
                onClick={() => onPublish(item.platform)}
                disabled={publishing}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                {publishing ? "Publishing…" : `Publish to ${label}`}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
