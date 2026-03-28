"use client";

import { useState, useCallback, useMemo } from "react";
import { Radio, MapPin, Signal, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Station, STATUS_CONFIG } from "@/lib/clients";
import { getBrandsByStation, type Brand } from "@/lib/demo-data";
import { SectorList } from "./SectorList";
import { MomentFeed } from "./MomentFeed";
import BrandFilter from "@/components/brand/BrandFilter";
import BrandCard from "@/components/brand/BrandCard";
import AgentActivity from "@/components/agents/AgentActivity";
import { StationAnalyticsPanel } from "@/components/analytics/StationAnalyticsPanel";

export function StationDetail({ station }: { station: Station }) {
  const status = STATUS_CONFIG[station.status];
  const allBrands = useMemo(() => getBrandsByStation(station.slug), [station.slug]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>(allBrands);

  const handleFilter = useCallback((filtered: Brand[]) => {
    setFilteredBrands(filtered);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            status.glow ? "bg-accent/10 ring-1 ring-accent/20" : "bg-white/5"
          )}
        >
          <Radio size={28} className={status.glow ? "text-accent" : "text-text-muted"} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-heading text-2xl font-bold text-text">{station.name}</h1>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                station.status === "pilot-active" && "bg-accent/10 text-accent",
                station.status === "onboarding" && "bg-amber-400/10 text-amber-400",
                station.status === "coming-soon" && "bg-white/5 text-text-muted"
              )}
            >
              {status.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            {station.frequency && (
              <span className="flex items-center gap-1.5">
                <Signal size={14} />
                {station.frequency}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {station.broadcastArea}
            </span>
          </div>
        </div>
      </div>

      {/* Sectors */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-text mb-4">Sectors</h2>
        <SectorList sectors={station.sectors} />
      </div>

      {/* Brands Section */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-text">
          Brands
          <span className="ml-2 text-sm font-normal text-text-muted">
            ({allBrands.length})
          </span>
        </h2>

        {allBrands.length > 0 ? (
          <>
            <BrandFilter brands={allBrands} onFilter={handleFilter} />
            {filteredBrands.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredBrands.map((brand) => (
                  <BrandCard key={brand.slug} brand={brand} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-bg-deep p-8 text-center">
                <p className="text-sm text-text-muted">No brands match your filters</p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-bg-deep p-8 text-center">
            <Megaphone className="mx-auto mb-3 text-text-muted" size={24} />
            <p className="text-sm text-text-muted">
              No brands added yet — add your first advertiser
            </p>
          </div>
        )}
      </div>

      {/* Station Analytics Panel */}
      <StationAnalyticsPanel stationSlug={station.slug} />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-text mb-4">Active Campaigns</h2>
            {allBrands.some((b) => b.campaigns.some((c) => c.status === "active")) ? (
              <div className="space-y-2">
                {allBrands.flatMap((brand) =>
                  brand.campaigns
                    .filter((c) => c.status === "active")
                    .map((c) => (
                      <div
                        key={c.id}
                        className="rounded-lg border border-border bg-bg-deep px-3 py-2.5"
                      >
                        <p className="text-sm font-medium text-text">{c.name}</p>
                        <p className="text-xs text-text-muted">
                          {brand.name} · {c.duration} · POP: {c.popScore}
                        </p>
                      </div>
                    ))
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-bg-deep p-6 text-center">
                <p className="text-sm text-text-muted">No active campaigns</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-text mb-4">Moment Feed</h2>
            <MomentFeed />
          </div>

          <div className="rounded-xl border border-border bg-bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-text mb-4">Agent Activity</h2>
            <AgentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
