"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_CLIENTS,
  SALES_REPS,
  type MockClient,
  type PipelineStageId,
} from "@/lib/sales-portal/demo-data";

const TEMP_COLORS: Record<string, string> = {
  hot: "#ff1744",
  warm: "#ff9100",
  cool: "#40c4ff",
  landed: "#00e676",
};

interface PitchZone {
  stageId: PipelineStageId;
  label: string;
  pitchLabel: string;
}

const PITCH_ZONES: PitchZone[] = [
  { stageId: "closed", label: "GOAL!", pitchLabel: "GOAL!" },
  { stageId: "negotiating", label: "In The Box", pitchLabel: "IN THE BOX" },
  { stageId: "proposal-sent", label: "Attacking Third", pitchLabel: "ATTACKING THIRD" },
  { stageId: "demo-booked", label: "Midfield", pitchLabel: "MIDFIELD" },
  { stageId: "discovery-call", label: "Build-Up Play", pitchLabel: "BUILD-UP PLAY" },
  { stageId: "first-contact", label: "Kick-Off", pitchLabel: "KICK-OFF" },
];

interface RepPitchViewProps {
  filterRepId?: string | null;
}

function DealCard({ client }: { client: MockClient }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border border-white/20 px-3 py-2 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(10, 15, 30, 0.85)",
        borderLeft: `3px solid ${TEMP_COLORS[client.temperature]}`,
      }}
    >
      <p className="text-xs font-semibold text-white truncate max-w-[140px]">
        {client.name}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[10px] font-mono font-bold text-white/90">
          €{client.annualValue.toLocaleString()}
        </span>
        {client.daysInStage > 0 && (
          <span className="text-[9px] text-white/50">{client.daysInStage}d</span>
        )}
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: TEMP_COLORS[client.temperature] }}
        />
      </div>
    </motion.div>
  );
}

export function RepPitchView({ filterRepId }: RepPitchViewProps) {
  const repClients = filterRepId
    ? MOCK_CLIENTS.filter((c) => c.assignedRep === filterRepId)
    : MOCK_CLIENTS;

  const rep = filterRepId ? SALES_REPS.find((r) => r.id === filterRepId) : null;
  const totalPipeline = repClients.reduce((s, c) => s + c.annualValue, 0);
  const closedValue = repClients
    .filter((c) => c.pipelineStage === "closed")
    .reduce((s, c) => s + c.annualValue, 0);

  const clientsByStage = (stageId: PipelineStageId) =>
    repClients.filter((c) => c.pipelineStage === stageId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Scoreboard */}
      <div className="rounded-xl border border-border bg-bg-card px-6 py-5 flex items-center gap-4">
        {rep ? (
          <>
            <div
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0",
                rep.avatarColor
              )}
            >
              {rep.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-lg font-bold text-text">
                {rep.name}&apos;s Pitch
              </h2>
              <p className="text-xs text-text-muted">{rep.role} · {rep.sectorFocus}</p>
            </div>
          </>
        ) : (
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-lg font-bold text-text">The Pitch</h2>
            <p className="text-xs text-text-muted">All reps · Full pipeline view</p>
          </div>
        )}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1.5 justify-end">
            <TrendingUp size={14} className="text-[#00FF96]" />
            <span className="text-xl font-mono font-bold text-[#00FF96]">
              €{(totalPipeline / 1000).toFixed(0)}K
            </span>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">
            {repClients.length} deals · €{(closedValue / 1000).toFixed(0)}K closed
          </p>
        </div>
      </div>

      {/* Football Pitch */}
      <div
        className="relative rounded-xl overflow-hidden border-2 border-white/30"
        style={{
          background:
            "linear-gradient(180deg, #1a5c2a 0%, #1e6b30 15%, #1a5c2a 30%, #1e6b30 45%, #1a5c2a 60%, #1e6b30 75%, #1a5c2a 90%, #1e6b30 100%)",
        }}
      >
        {PITCH_ZONES.map((zone) => {
          const deals = clientsByStage(zone.stageId);
          const isGoal = zone.stageId === "closed";
          const isKickOff = zone.stageId === "first-contact";

          return (
            <div
              key={zone.stageId}
              className={cn(
                "relative border-b border-white/20 last:border-b-0",
                isGoal && "min-h-[100px]",
                !isGoal && "min-h-[90px]"
              )}
            >
              {/* Goal mouth markings */}
              {isGoal && (
                <>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[40px] border-b-2 border-x-2 border-white/30 rounded-b-lg" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-[20px] border-b-2 border-x-2 border-white/30 rounded-b-md" />
                </>
              )}

              {/* Centre circle for midfield */}
              {zone.stageId === "demo-booked" && (
                <>
                  <div className="absolute top-0 left-0 right-0 border-t-2 border-white/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full border-2 border-white/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30" />
                </>
              )}

              {/* Kick-off markings */}
              {isKickOff && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[30px] border-t-2 border-x-2 border-white/30 rounded-t-lg" />
              )}

              {/* Zone label */}
              <div className="absolute top-2 left-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                  {zone.pitchLabel}
                </span>
              </div>

              {/* Deal cards */}
              <div className="relative z-10 flex flex-wrap gap-2 px-4 pt-7 pb-3 justify-center">
                {deals.map((client) => (
                  <DealCard key={client.id} client={client} />
                ))}
                {deals.length === 0 && (
                  <span className="text-[10px] text-white/20 italic py-2">
                    No deals
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-border bg-bg-card px-6 py-3 flex items-center gap-4 flex-wrap">
        {(["hot", "warm", "cool", "landed"] as const).map((temp) => (
          <div key={temp} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: TEMP_COLORS[temp] }}
            />
            <span className="text-[10px] text-text-muted capitalize">{temp}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
