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
}

export function ContentResultCards({
  content,
  onEdit,
  onPublish,
  isPublishing = {},
}: ContentResultCardsProps) {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, Partial<ContentItem>>>({});

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {content.map((item, i) => {
        const color = PLATFORM_COLORS[item.platform] ?? "#00FF96";
        const label = PLATFORM_LABELS[item.platform] ?? item.platform;
        const isEditing = editingCard === item.platform;
        const isSquare = SQUARE_PLATFORMS.has(item.platform);
        const publishing = isPublishing[item.platform] ?? false;

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
                {item.imageUrl ? (
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
