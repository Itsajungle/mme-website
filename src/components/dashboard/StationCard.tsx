"use client";

import Link from "next/link";
import { Radio, MapPin, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Station, STATUS_CONFIG } from "@/lib/clients";

export function StationCard({ station }: { station: Station }) {
  const status = STATUS_CONFIG[station.status];

  return (
    <Link href={`/dashboard/station/${station.slug}`}>
      <div
        className={cn(
          "group rounded-xl border border-border bg-bg-deep p-5 transition-all hover:border-border-hover hover:bg-bg-card-hover",
          status.glow && "ring-1 ring-accent/20"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                status.glow ? "bg-accent/10" : "bg-white/5"
              )}
            >
              <Radio size={20} className={status.glow ? "text-accent" : "text-text-muted"} />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-text group-hover:text-accent transition-colors">
                {station.name}
              </h3>
              {station.frequency && (
                <p className="text-xs text-text-muted">{station.frequency}</p>
              )}
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              station.status === "pilot-active" && "bg-accent/10 text-accent",
              station.status === "onboarding" && "bg-amber-400/10 text-amber-400",
              station.status === "coming-soon" && "bg-white/5 text-text-muted"
            )}
          >
            {status.label}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <MapPin size={14} className="shrink-0" />
            <span>{station.broadcastArea}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Layers size={14} className="shrink-0" />
            <span>{station.sectors.length} sectors</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex gap-1.5 flex-wrap">
            {station.sectors.slice(0, 3).map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                {s}
              </span>
            ))}
            {station.sectors.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                +{station.sectors.length - 3}
              </span>
            )}
          </div>
          <ChevronRight size={16} className="text-text-muted group-hover:text-accent transition-colors" />
        </div>
      </div>
    </Link>
  );
}
