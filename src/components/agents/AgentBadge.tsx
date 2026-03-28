"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXECUTIVE_PRODUCERS } from "@/lib/agents";
import { SECTORS } from "@/lib/sectors";

interface AgentBadgeProps {
  epAgentId: string;
  brandAgentName?: string;
  compact?: boolean;
}

export default function AgentBadge({
  epAgentId,
  brandAgentName,
  compact = false,
}: AgentBadgeProps) {
  const [hovered, setHovered] = useState(false);

  const ep = EXECUTIVE_PRODUCERS.find((e) => e.id === epAgentId);
  const sector = ep ? SECTORS.find((s) => s.id === ep.sectorId) : undefined;
  const sectorColor = sector?.color ?? "#64748B";

  if (!ep) return null;

  if (compact) {
    return (
      <div
        className="relative inline-flex items-center gap-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* EP dot with pulse */}
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-30"
            style={{ backgroundColor: sectorColor }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: sectorColor }}
          />
        </span>

        {brandAgentName && (
          <Bot className="h-3.5 w-3.5 text-amber" />
        )}

        {/* Tooltip */}
        {hovered && (
          <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-bg-card px-3 py-2 shadow-xl">
            <div className="flex items-center gap-1.5 text-xs font-medium text-text">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: sectorColor }}
              />
              {ep.name}
            </div>
            {brandAgentName && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                <Bot className="h-3 w-3 text-amber" />
                {brandAgentName}
              </div>
            )}
            {/* Tooltip arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-bg-card" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-card px-3 py-2">
      {/* EP agent */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-25"
            style={{ backgroundColor: sectorColor }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: sectorColor }}
          />
        </span>
        <span className="text-xs font-medium text-text">{ep.name}</span>
      </div>

      {/* Brand agent */}
      {brandAgentName && (
        <>
          <span className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-amber" />
            <span className="text-xs font-medium text-text-secondary">
              {brandAgentName}
            </span>
          </div>
        </>
      )}

      {/* Active indicator */}
      <span
        className={cn(
          "ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
          "bg-accent/10 text-accent"
        )}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        Live
      </span>
    </div>
  );
}
