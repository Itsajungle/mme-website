"use client";

import { cn } from "@/lib/utils";
import {
  PIPELINE_STAGES,
  MOCK_CLIENTS,
  SALES_REPS,
  type PipelineStageId,
  type Temperature,
} from "@/lib/sales-portal/demo-data";

const TEMP_STYLES: Record<Temperature, { bg: string; text: string; border: string }> = {
  hot: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/40" },
  warm: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/40" },
  cool: { bg: "bg-blue-400/20", text: "text-blue-400", border: "border-blue-400/40" },
  landed: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/40" },
};

function getRepInitials(repId: string): { initials: string; color: string } {
  const rep = SALES_REPS.find((r) => r.id === repId);
  return rep
    ? { initials: rep.initials, color: rep.avatarColor }
    : { initials: "??", color: "bg-gray-500" };
}

function formatValue(v: number): string {
  return v >= 1000 ? `€${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K` : `€${v}`;
}

interface SalesPipelineProps {
  filterRepId?: string | null;
}

export function SalesPipeline({ filterRepId }: SalesPipelineProps = {}) {
  const filteredClients = filterRepId
    ? MOCK_CLIENTS.filter((c) => c.assignedRep === filterRepId)
    : MOCK_CLIENTS;

  const clientsByStage = (stageId: PipelineStageId) =>
    filteredClients.filter((c) => c.pipelineStage === stageId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-text">Sales Pipeline</h2>
          <p className="text-sm text-text-muted mt-0.5">
            {filteredClients.length} leads · €{(filteredClients.reduce((s, c) => s + c.annualValue, 0) / 1000).toFixed(0)}K total pipeline
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-medium">
          {(["hot", "warm", "cool"] as const).map((t) => (
            <span key={t} className={cn("flex items-center gap-1.5 uppercase tracking-wider", TEMP_STYLES[t].text)}>
              <span className={cn("h-2 w-2 rounded-full", t === "hot" ? "bg-red-500" : t === "warm" ? "bg-amber-500" : "bg-blue-400")} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-6 gap-3">
        {PIPELINE_STAGES.map((stage) => {
          const clients = clientsByStage(stage.id);
          const stageTotal = clients.reduce((s, c) => s + c.annualValue, 0);

          return (
            <div key={stage.id} className="flex flex-col min-h-[420px]">
              {/* Column header */}
              <div className={cn(
                "rounded-t-lg border border-border px-3 py-2.5",
                stage.id === "closed" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-bg-card"
              )}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{stage.icon}</span>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    stage.id === "closed" ? "text-emerald-400" : "text-text-secondary"
                  )}>
                    {stage.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">{clients.length} leads</span>
                  <span className={cn(
                    "text-xs font-mono font-bold",
                    stage.id === "closed" ? "text-emerald-400" : "text-accent"
                  )}>
                    {formatValue(stageTotal)}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 rounded-b-lg border border-t-0 border-border bg-bg-deep/50 p-2 space-y-2 overflow-y-auto">
                {clients.map((client) => {
                  const temp = TEMP_STYLES[client.temperature];
                  const rep = getRepInitials(client.assignedRep);

                  return (
                    <div
                      key={client.id}
                      className={cn(
                        "rounded-lg border p-3 transition-all hover:scale-[1.02] hover:shadow-lg cursor-default",
                        "bg-bg-card",
                        temp.border
                      )}
                    >
                      {/* Client name + value */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <p className="text-xs font-semibold text-text leading-tight">{client.name}</p>
                        <span className={cn("text-[10px] font-mono font-bold whitespace-nowrap", temp.text)}>
                          {formatValue(client.annualValue)}
                        </span>
                      </div>

                      {/* Sector */}
                      <p className="text-[10px] text-text-muted mb-2">{client.sector}</p>

                      {/* Temperature pill + rep avatar */}
                      <div className="flex items-center justify-between">
                        <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", temp.bg, temp.text)}>
                          {client.temperature}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white", rep.color)}>
                            {rep.initials}
                          </div>
                          {client.daysInStage > 0 && (
                            <span className="text-[9px] text-text-muted">{client.daysInStage}d</span>
                          )}
                        </div>
                      </div>

                      {/* Next action */}
                      <p className="text-[9px] text-text-muted mt-2 leading-snug truncate" title={client.nextAction}>
                        → {client.nextAction}
                      </p>
                    </div>
                  );
                })}

                {clients.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-[10px] text-text-muted italic">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
