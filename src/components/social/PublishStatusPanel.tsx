"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Briefcase,
  AtSign,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublishResult } from "@/lib/social-engine/types";

interface PublishStatusPanelProps {
  results: PublishResult[] | null;
  isPublishing: boolean;
}

const PLATFORM_CONFIG: Record<
  string,
  { label: string; icon: typeof Send }
> = {
  instagram: { label: "Instagram", icon: Send },
  linkedin: { label: "LinkedIn", icon: Briefcase },
  x: { label: "X", icon: AtSign },
  facebook: { label: "Facebook", icon: Globe },
};

const DEMO_PLATFORMS = ["instagram", "linkedin", "x", "facebook"];

export function PublishStatusPanel({ results, isPublishing }: PublishStatusPanelProps) {
  if (!isPublishing && !results) return null;

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Send size={15} className="text-accent" />
        </div>
        <span className="font-semibold text-sm text-text">
          {isPublishing ? "Publishing..." : "Publish Results"}
        </span>
        {isPublishing && (
          <Loader2 size={14} className="text-accent animate-spin ml-auto" />
        )}
      </div>

      <div className="divide-y divide-border">
        {/* Loading state — show platform icons with spinners */}
        {isPublishing && !results && (
          <>
            {DEMO_PLATFORMS.map((platform) => {
              const config = PLATFORM_CONFIG[platform] ?? {
                label: platform,
                icon: Send,
              };
              const Icon = config.icon;
              return (
                <div
                  key={platform}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-deep border border-border shrink-0">
                    <Icon size={13} className="text-text-muted" />
                  </div>
                  <span className="flex-1 text-sm text-text">{config.label}</span>
                  <Loader2 size={14} className="text-text-muted animate-spin" />
                </div>
              );
            })}
          </>
        )}

        {/* Results */}
        <AnimatePresence>
          {results &&
            results.map((result, i) => {
              const config = PLATFORM_CONFIG[result.platform] ?? {
                label: result.platform,
                icon: Send,
              };
              const Icon = config.icon;

              return (
                <motion.div
                  key={result.platform}
                  className="flex items-center gap-3 px-5 py-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.07 }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-deep border border-border shrink-0">
                    <Icon size={13} className="text-text-muted" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text">{config.label}</span>
                    {result.status === "failed" && result.error && (
                      <p className="text-[11px] text-red-400 truncate">{result.error}</p>
                    )}
                    {result.status === "not_configured" && (
                      <p className="text-[11px] text-text-muted">Not configured</p>
                    )}
                  </div>

                  {/* Status badge */}
                  {result.status === "published" && (
                    <div className="inline-flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 size={14} className="text-accent" />
                      {result.postUrl ? (
                        <a
                          href={result.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "text-[11px] font-mono text-accent hover:underline"
                          )}
                        >
                          Published
                        </a>
                      ) : (
                        <span className="text-[11px] font-mono text-accent">Published</span>
                      )}
                    </div>
                  )}

                  {result.status === "failed" && (
                    <div className="inline-flex items-center gap-1.5 shrink-0">
                      <XCircle size={14} className="text-red-400" />
                      <span className="text-[11px] font-mono text-red-400">Failed</span>
                    </div>
                  )}

                  {result.status === "not_configured" && (
                    <div className="inline-flex items-center gap-1.5 shrink-0">
                      <AlertTriangle size={13} className="text-amber-400" />
                      <span className="text-[11px] font-mono text-amber-400">
                        Not Configured
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
