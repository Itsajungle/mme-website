"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentStatus, AgentStats } from "@/lib/quality-engine-demo-data";

interface AgentNodeProps {
  name: string;
  role: string;
  status: AgentStatus;
  icon: LucideIcon;
  stats: AgentStats;
  accentColor: string;
  index: number;
}

export function AgentNode({
  name,
  role,
  status,
  icon: Icon,
  stats,
  accentColor,
  index,
}: AgentNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1,
      }}
      className="relative"
    >
      {/* Processing pulse */}
      {status === "processing" && (
        <motion.div
          className="absolute -inset-1 rounded-xl pointer-events-none"
          style={{ border: `1px solid ${accentColor}` }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <div
        className={cn(
          "relative rounded-xl bg-bg-card border p-4 w-[172px]",
          status === "processing" ? "border-transparent" : "border-border"
        )}
        style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
      >
        {/* Idle glow */}
        {status === "idle" && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ boxShadow: `0 0 12px 0 ${accentColor}15` }}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <Icon size={16} style={{ color: accentColor }} />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-text">
                {name}
              </p>
              <p className="text-[10px] text-text-muted">{role}</p>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          {status === "processing" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Loader2 size={12} style={{ color: accentColor }} />
            </motion.div>
          )}
          {status === "complete" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Check size={12} className="text-green-400" />
            </motion.div>
          )}
          {status === "idle" && (
            <div className="h-2 w-2 rounded-full bg-text-muted" />
          )}
          <span
            className={cn(
              "text-[10px] uppercase tracking-wider font-medium",
              status === "idle" && "text-text-muted",
              status === "complete" && "text-green-400",
              status === "processing" && "text-amber-400"
            )}
          >
            {status === "idle" && "Idle"}
            {status === "processing" && "Active"}
            {status === "complete" && "Done"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-border">
          <div>
            <p className="text-[9px] text-text-muted uppercase tracking-wider font-medium">
              Tasks
            </p>
            <p className="font-mono text-xs font-bold text-text">
              {stats.tasksToday}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-text-muted uppercase tracking-wider font-medium">
              Avg
            </p>
            <p className="font-mono text-xs font-bold text-text">
              {stats.avgTime}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-text-muted uppercase tracking-wider font-medium">
              Pass
            </p>
            <p
              className="font-mono text-xs font-bold"
              style={{ color: accentColor }}
            >
              {stats.approvalRate}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
