"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BarChart3, Target, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_REPS, type DemoRep } from "@/lib/sales-portal/demo-reps";

interface RepSelectorProps {
  selectedRepId: string;
  onSelectRep: (repId: string) => void;
}

export function RepSelector({ selectedRepId, onSelectRep }: RepSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRep = DEMO_REPS.find((r) => r.id === selectedRepId) ?? DEMO_REPS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      {/* Selector */}
      <div ref={containerRef} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3 text-left hover:border-white/20 transition-colors"
        >
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
              selectedRep.avatarColor,
            )}
          >
            {selectedRep.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">{selectedRep.name}</p>
            <p className="text-xs text-text-muted truncate">
              {selectedRep.role} · {selectedRep.sectorFocus}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={cn("text-text-muted transition-transform", open && "rotate-180")}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-bg-card shadow-xl overflow-hidden"
            >
              <div className="max-h-80 overflow-y-auto py-1">
                {DEMO_REPS.map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => {
                      onSelectRep(rep.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors",
                      rep.id === selectedRepId && "bg-white/5",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                        rep.avatarColor,
                      )}
                    >
                      {rep.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{rep.name}</p>
                      <p className="text-[11px] text-text-muted truncate">
                        {rep.role} · {rep.sectorFocus}
                      </p>
                    </div>
                    {rep.id === selectedRepId && (
                      <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats summary */}
      <motion.div
        key={selectedRep.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-text-muted"
      >
        <span className="flex items-center gap-1">
          <BarChart3 size={11} className="text-accent" />
          {selectedRep.stats.adsGenerated} ads generated
        </span>
        <span className="flex items-center gap-1">
          <Target size={11} className="text-accent" />
          Avg score {selectedRep.stats.avgScore}
        </span>
        <span className="flex items-center gap-1">
          <Award size={11} className="text-accent" />
          Top: {selectedRep.stats.topAdvertiser}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp size={11} className="text-accent" />
          {selectedRep.stats.conversionRate}% conversion
        </span>
      </motion.div>
    </div>
  );
}
