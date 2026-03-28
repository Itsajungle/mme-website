"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectorList({ sectors }: { sectors: string[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {sectors.map((sector) => (
        <div key={sector} className="rounded-lg border border-border bg-bg-deep">
          <button
            onClick={() => setExpanded(expanded === sector ? null : sector)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-text hover:text-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <Briefcase size={16} className="text-text-muted" />
              <span className="font-medium">{sector}</span>
            </div>
            {expanded === sector ? (
              <ChevronDown size={16} className="text-text-muted" />
            ) : (
              <ChevronRight size={16} className="text-text-muted" />
            )}
          </button>
          {expanded === sector && (
            <div className="px-4 pb-4 border-t border-border">
              <div className="pt-3 space-y-3">
                <div className="rounded-lg bg-white/[0.02] border border-dashed border-border p-4 text-center">
                  <p className="text-sm text-text-muted">
                    No brands added yet — add your first advertiser
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SectorBadges({ sectors, className }: { sectors: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sectors.map((sector) => (
        <span
          key={sector}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-text-secondary"
        >
          <Briefcase size={12} />
          {sector}
        </span>
      ))}
    </div>
  );
}
