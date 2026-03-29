"use client";

import { motion } from "framer-motion";
import { Palette, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvaConnectProps {
  brandSlug: string;
  connected: boolean;
  onDisconnect: () => void;
}

const DESIGN_TOOLS = [
  { id: "canva", label: "Canva", available: true },
  { id: "adobe", label: "Adobe Express", available: false },
  { id: "builtin", label: "Built-in", available: false },
] as const;

export function CanvaConnect({
  brandSlug,
  connected,
  onDisconnect,
}: CanvaConnectProps) {
  if (connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-medium text-accent">
            Canva Connected
          </span>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-red-400 transition-colors"
        >
          <Unlink size={10} />
          Disconnect
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-bg-deep p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
          <Palette size={14} className="text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text">
            Connect Design Tool
          </p>
          <p className="text-[10px] text-text-muted">
            Link your Canva account to create professional designs from your
            generated content
          </p>
        </div>
      </div>

      {/* Tool options */}
      <div className="flex gap-2">
        {DESIGN_TOOLS.map((tool) => (
          <div
            key={tool.id}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              tool.available
                ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                : "border-border text-text-muted/40 bg-white/[0.02] cursor-default",
            )}
          >
            {tool.label}
            {!tool.available && (
              <span className="text-[9px] font-mono opacity-60">Soon</span>
            )}
          </div>
        ))}
      </div>

      {/* Connect button */}
      <a
        href={`/api/canva/auth?brand_id=${encodeURIComponent(brandSlug)}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
      >
        <Palette size={12} />
        Connect Canva
      </a>
    </motion.div>
  );
}
