"use client";

import { cn } from "@/lib/utils";
import { SALES_REPS, MOCK_CLIENTS } from "@/lib/sales-portal/demo-data";
import { Phone, Monitor, Trophy, TrendingUp } from "lucide-react";

export function RepProfileCards() {

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-bold text-text">Sales Team</h2>
        <p className="text-sm text-text-muted mt-0.5">
          {SALES_REPS.length} reps · €{(SALES_REPS.reduce((s, r) => s + r.stats.pipelineTotal, 0) / 1000).toFixed(0)}K combined pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SALES_REPS.map((rep) => {
          const pct = Math.round((rep.stats.achieved / rep.stats.target) * 100);

          return (
            <div
              key={rep.id}
              className="rounded-xl border border-border bg-bg-card overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 group"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-border flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0", rep.avatarColor)}>
                  {rep.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-bold text-text group-hover:text-accent transition-colors">{rep.name}</h3>
                  <p className="text-[11px] text-text-muted">{rep.role}</p>
                  <p className="text-[10px] text-text-muted">{rep.sectorFocus}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-mono font-bold text-accent">€{(rep.stats.pipelineTotal / 1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-text-muted">{rep.stats.activeLeads} active leads</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="px-5 py-3 border-b border-border grid grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-sm font-mono font-bold text-text">{rep.stats.callsThisWeek}</p>
                    <p className="text-[9px] text-text-muted">Calls/wk</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor size={12} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-sm font-mono font-bold text-text">{rep.stats.demosBooked}</p>
                    <p className="text-[9px] text-text-muted">Demos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={12} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-sm font-mono font-bold text-text">{rep.stats.dealsClosedThisMonth}</p>
                    <p className="text-[9px] text-text-muted">Closed/mo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={12} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-sm font-mono font-bold text-text">{rep.stats.conversionRate}%</p>
                    <p className="text-[9px] text-text-muted">Conv.</p>
                  </div>
                </div>
              </div>

              {/* Performance bar */}
              <div className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-text-muted">vs Target</span>
                  <span className={cn(
                    "text-xs font-mono font-bold",
                    pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-red-400"
                  )}>
                    {pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-text-muted">
                    €{(rep.stats.achieved / 1000).toFixed(1)}K achieved
                  </span>
                  <span className="text-[9px] text-text-muted">
                    €{(rep.stats.target / 1000).toFixed(0)}K target
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
