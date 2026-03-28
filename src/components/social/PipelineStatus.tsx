"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["draft", "review", "scheduled", "published"] as const;
const STEP_LABELS: Record<string, string> = {
  draft: "Draft",
  review: "Review",
  scheduled: "Schedule",
  published: "Published",
};

interface PipelineStatusProps {
  status: "draft" | "review" | "scheduled" | "published";
}

export function PipelineStatus({ status }: PipelineStatusProps) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1 w-full">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture = i > currentIndex;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Step node */}
            <motion.div
              className={cn(
                "relative flex items-center justify-center rounded-full border-2 transition-colors",
                isComplete && "border-accent bg-accent",
                isCurrent && "border-accent bg-accent/20",
                isFuture && "border-border bg-bg-card"
              )}
              style={{ width: 32, height: 32 }}
              initial={false}
              animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={
                isCurrent
                  ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
            >
              {isComplete ? (
                <Check size={14} className="text-bg" strokeWidth={3} />
              ) : (
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    isCurrent ? "text-accent" : "text-text-muted"
                  )}
                >
                  {i + 1}
                </span>
              )}

              {/* Label below */}
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap",
                  isComplete && "text-accent",
                  isCurrent && "text-accent font-semibold",
                  isFuture && "text-text-muted"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </motion.div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-1.5">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    i < currentIndex ? "bg-accent" : "bg-border"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
