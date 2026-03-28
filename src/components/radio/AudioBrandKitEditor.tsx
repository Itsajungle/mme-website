"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic2,
  Music,
  Music2,
  Volume2,
  Trash2,
  Plus,
  Upload,
  Play,
  Copy,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudioBrandKit } from "@/lib/demo-data";

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Icon size={16} className="text-accent" />
        </div>
        <h3 className="font-heading text-sm font-bold text-text">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function AudioBrandKitEditor({
  kit,
  brandName,
}: {
  kit: AudioBrandKit;
  brandName: string;
}) {
  const [logoLine, setLogoLine] = useState(kit.logoLine);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Volume2 size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-text">
            Audio Brand Kit
          </h2>
          <p className="text-sm text-text-muted">{brandName}</p>
        </div>
      </div>

      {/* Voice Section */}
      <SectionCard icon={Mic2} title="Voice">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">
                Voice Name
              </label>
              <div className="rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text">
                {kit.voiceName}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">
                Description
              </label>
              <div className="rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-secondary">
                {kit.voiceDescription}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">
              Voice ID
            </label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-border bg-bg-input px-3 py-2 font-mono text-xs text-text-muted">
                {kit.voiceId}
              </div>
              <button className="rounded-lg border border-border px-3 py-2 text-text-muted hover:text-text hover:border-border-hover transition-colors">
                <Copy size={14} />
              </button>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-accent/30 px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/5 transition-colors">
            <Wand2 size={14} />
            Clone Voice
          </button>
        </div>
      </SectionCard>

      {/* Brand Music Section */}
      <SectionCard icon={Music} title="Brand Music">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-deep px-4 py-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
              <Play size={14} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text truncate">{kit.brandMusic}</p>
              <p className="text-xs text-text-muted">Primary brand jingle</p>
            </div>
            <span className="text-xs text-text-muted font-mono">0:08</span>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-sm text-text-muted hover:border-border-hover hover:text-text-secondary transition-colors">
            <Upload size={16} />
            Upload New Brand Music
          </button>
        </div>
      </SectionCard>

      {/* Additional Music Section */}
      <SectionCard icon={Music2} title="Additional Music">
        <div className="space-y-2">
          {kit.additionalMusic.length > 0 ? (
            kit.additionalMusic.map((track, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-border bg-bg-deep px-4 py-3 group"
              >
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                  <Play size={12} />
                </button>
                <span className="flex-1 text-sm text-text-secondary">
                  {track}
                </span>
                <button className="text-text-muted opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-text-muted">
              No additional music beds added
            </p>
          )}
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-text-muted hover:border-border-hover hover:text-text-secondary transition-colors">
            <Plus size={14} />
            Add Mood Bed
          </button>
        </div>
      </SectionCard>

      {/* SFX Section */}
      <SectionCard icon={Volume2} title="Sound Effects">
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {kit.sfx.map((sfx, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 rounded-lg border border-border bg-bg-deep px-3 py-2.5 text-xs text-text-secondary hover:border-border-hover hover:text-text transition-colors group"
              >
                <Play
                  size={12}
                  className="text-accent shrink-0"
                />
                <span className="truncate">{sfx}</span>
              </motion.button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-text-muted hover:border-border-hover hover:text-text-secondary transition-colors">
            <Plus size={14} />
            Add SFX
          </button>
        </div>
      </SectionCard>

      {/* Logo Line Section */}
      <SectionCard icon={Mic2} title="Logo Line">
        <div className="space-y-2">
          <input
            type="text"
            value={logoLine}
            onChange={(e) => setLogoLine(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-text font-medium focus:border-border-focus focus:outline-none"
          />
          <p className="text-xs text-text-muted">
            The signature sign-off line used in all ads for {brandName}.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
