"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, LayoutGrid, List, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import { SECTORS } from "@/lib/sectors";

type SortKey = "name" | "lastActivity" | "campaigns";
type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "onboarding" | "paused";

interface BrandFilterProps {
  brands: Brand[];
  onFilter: (filtered: Brand[]) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "paused", label: "Paused" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "lastActivity", label: "Last Activity" },
  { value: "campaigns", label: "Campaign Count" },
];

export default function BrandFilter({
  brands,
  onFilter,
  viewMode: externalViewMode,
  onViewModeChange,
}: BrandFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>("grid");

  const viewMode = externalViewMode ?? internalViewMode;
  const setViewMode = onViewModeChange ?? setInternalViewMode;

  const filterAndSort = useCallback(() => {
    let result = [...brands];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => b.name.toLowerCase().includes(q));
    }

    // Sector filter
    if (selectedSector !== "all") {
      result = result.filter((b) => b.sectorId === selectedSector);
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter((b) => b.status === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "lastActivity":
          return b.lastActivity.localeCompare(a.lastActivity);
        case "campaigns":
          return b.campaigns.length - a.campaigns.length;
        default:
          return 0;
      }
    });

    return result;
  }, [brands, searchQuery, selectedSector, selectedStatus, sortBy]);

  useEffect(() => {
    onFilter(filterAndSort());
  }, [filterAndSort, onFilter]);

  const sectorOptions = useMemo(
    () => [{ id: "all", name: "All Sectors" }, ...SECTORS],
    []
  );

  return (
    <div className="space-y-4">
      {/* Top row: Search + View toggle */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full rounded-[var(--radius)] border border-border bg-bg-input py-2.5 pl-10 pr-4",
              "text-sm text-text placeholder:text-text-muted",
              "focus:border-border-focus focus:outline-none transition-colors"
            )}
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-[var(--radius)] border border-border bg-bg-card p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-[6px] p-2 transition-colors",
              viewMode === "grid"
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-secondary"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-[6px] p-2 transition-colors",
              viewMode === "list"
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-secondary"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter row: Sector chips, Status, Sort */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sector selector */}
        <div className="relative">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className={cn(
              "appearance-none rounded-[var(--radius)] border border-border bg-bg-card",
              "py-2 pl-3 pr-8 text-sm text-text-secondary",
              "focus:border-border-focus focus:outline-none transition-colors cursor-pointer"
            )}
          >
            {sectorOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedStatus(opt.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                selectedStatus === opt.value
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-bg-card text-text-muted border border-border hover:border-border-hover hover:text-text-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className={cn(
              "appearance-none rounded-[var(--radius)] border border-border bg-bg-card",
              "py-2 pl-3 pr-8 text-sm text-text-secondary",
              "focus:border-border-focus focus:outline-none transition-colors cursor-pointer"
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        </div>
      </div>
    </div>
  );
}
