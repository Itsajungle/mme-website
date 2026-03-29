"use client";

import { motion } from "framer-motion";
import { Radio, Share2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PIPELINE_STAGES,
  STAGE_LABELS,
  type PipelineItemData,
  type PipelineStage,
} from "@/lib/quality-engine-demo-data";

interface PipelineItemProps {
  item: PipelineItemData;
  index: number;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  processing: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Processing" },
  approved: { bg: "bg-green-500/10", text: "text-accent", label: "Approved" },
  "revision-required": { bg: "bg-orange-500/10", text: "text-orange-400", label: "Revision" },
  rejected: { bg: "bg-red-500/10", text: "text-red-400", label: "Rejected" },
};

function getStageIndex(stage: PipelineStage): number {
  return PIPELINE_STAGES.indexOf(stage);
}

export function PipelineItem({ item, index }: PipelineItemProps) {
  const style = STATUS_STYLES[item.status];
  const currentStageIdx = getStageIndex(item.currentStage);
  const isRadio = item.contentType === "radio-ad";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-xl bg-bg-card border border-border p-4 hover:border-border-hover transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Left: content info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              isRadio ? "bg-purple-500/10" : "bg-blue-500/10"
            )}
          >
            {isRadio ? (
              <Radio size={16} className="text-purple-400" />
            ) : (
              <Share2 size={16} className="text-blue-400" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted">{item.id}</span>
              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider", style.bg, style.text)}>
                {style.label}
              </span>
            </div>
            <p className="font-heading text-sm font-bold text-text truncate">
              {item.brandName} — {item.title}
            </p>
          </div>
        </div>

        {/* Right: score + time */}
        <div className="flex items-center gap-4 shrink-0">
          {item.score !== undefined && (
            <div className="text-right">
              <p className="text-xs text-text-muted uppercase tracking-wider">Score</p>
              <p
                className={cn(
                  "font-mono text-sm font-bold",
                  item.score >= 85 ? "text-accent" : item.score >= 70 ? "text-amber-400" : "text-orange-400"
                )}
              >
                {item.score}%
              </p>
            </div>
          )}
          <div className="flex items-center gap-1 text-text-muted">
            <Clock size={12} />
            <span className="font-mono text-xs">{item.timeInPipeline}</span>
          </div>
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="mt-3 flex gap-1">
        {PIPELINE_STAGES.map((stage, i) => {
          const isComplete = i < currentStageIdx;
          const isCurrent = i === currentStageIdx;
          const isApprovedFinal = item.status === "approved" && i === currentStageIdx;
          return (
            <div key={stage} className="flex-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  isApprovedFinal
                    ? "bg-accent"
                    : isComplete
                    ? "bg-accent/60"
                    : isCurrent
                    ? "bg-amber-400"
                    : "bg-white/5"
                )}
              />
              <p
                className={cn(
                  "text-[10px] mt-1 truncate",
                  isCurrent ? "text-text-secondary" : "text-text-muted"
                )}
              >
                {STAGE_LABELS[stage]}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
