"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  ChevronDown,
  ChevronRight,
  Users,
  Bot,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COMPROD_DIRECTOR,
  EXECUTIVE_PRODUCERS,
  type AgentTier1,
  type AgentTier2,
} from "@/lib/agents";
import { SECTORS } from "@/lib/sectors";

function getSectorForEP(sectorId: string) {
  return SECTORS.find((s) => s.id === sectorId);
}

function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  const config = {
    1: { label: "Tier 1", className: "bg-accent/15 text-accent border-accent/30" },
    2: { label: "Tier 2", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    3: { label: "Tier 3", className: "bg-amber/15 text-amber border-amber/30" },
  };
  const { label, className } = config[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        className
      )}
    >
      {label}
    </span>
  );
}

function DirectorCard({ agent }: { agent: AgentTier1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto max-w-lg"
    >
      {/* Green glow effect */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-accent/40 via-accent/20 to-accent/5 blur-[1px]" />
      <div className="relative rounded-2xl border border-accent/30 bg-bg-card p-6 shadow-[0_0_40px_rgba(0,255,150,0.08)]">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Crown className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-text">
                {agent.name}
              </h3>
              <p className="text-sm text-accent">{agent.role}</p>
            </div>
          </div>
          <TierBadge tier={1} />
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          {agent.description}
        </p>
        {/* Animated glow pulse */}
        <div className="absolute -inset-[1px] -z-10 animate-pulse rounded-2xl bg-accent/5 blur-xl" />
      </div>
    </motion.div>
  );
}

function EPCard({ agent, index }: { agent: AgentTier2; index: number }) {
  const sector = getSectorForEP(agent.sectorId);
  const SectorIcon = sector?.icon;
  const truncatedDesc =
    agent.description.length > 100
      ? agent.description.slice(0, 100) + "..."
      : agent.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group rounded-xl border border-border bg-bg-card p-4 transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {SectorIcon && (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${sector.color}15` }}
            >
              <SectorIcon
                className="h-4.5 w-4.5"
                style={{ color: sector.color }}
              />
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-text">{agent.name}</h4>
            {sector && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: sector.color }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: sector.color }}
                />
                {sector.name}
              </span>
            )}
          </div>
        </div>
        <TierBadge tier={2} />
      </div>
      <p className="text-xs leading-relaxed text-text-muted">{truncatedDesc}</p>
    </motion.div>
  );
}

function ConnectingLine() {
  return (
    <div className="flex justify-center py-2">
      <div className="h-8 w-px bg-gradient-to-b from-accent/40 to-accent/10" />
    </div>
  );
}

export default function AgentHierarchy() {
  const [tier2Open, setTier2Open] = useState(true);
  const [tier3Open, setTier3Open] = useState(false);

  return (
    <div className="w-full space-y-2">
      {/* Tier 1 - Director */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
          <Shield className="h-3.5 w-3.5" />
          <span>Tier 1 &mdash; Command</span>
        </div>
        <DirectorCard agent={COMPROD_DIRECTOR} />
      </div>

      <ConnectingLine />

      {/* Tier 2 - Executive Producers */}
      <div>
        <button
          onClick={() => setTier2Open(!tier2Open)}
          className="mb-3 flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted transition-colors hover:text-text-secondary"
        >
          <Users className="h-3.5 w-3.5" />
          <span>Tier 2 &mdash; Executive Producers ({EXECUTIVE_PRODUCERS.length})</span>
          {tier2Open ? (
            <ChevronDown className="ml-auto h-4 w-4" />
          ) : (
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </button>

        <AnimatePresence>
          {tier2Open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {EXECUTIVE_PRODUCERS.map((ep, i) => (
                  <EPCard key={ep.id} agent={ep} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConnectingLine />

      {/* Tier 3 - Brand Agents */}
      <div>
        <button
          onClick={() => setTier3Open(!tier3Open)}
          className="mb-3 flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted transition-colors hover:text-text-secondary"
        >
          <Bot className="h-3.5 w-3.5" />
          <span>Tier 3 &mdash; Brand Agents</span>
          {tier3Open ? (
            <ChevronDown className="ml-auto h-4 w-4" />
          ) : (
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </button>

        <AnimatePresence>
          {tier3Open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-border border-dashed bg-bg-card/50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10">
                  <Sparkles className="h-5 w-5 text-amber" />
                </div>
                <p className="font-heading text-sm font-semibold text-text">
                  Brand Agents are auto-created per brand
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  When a new brand is onboarded, a dedicated Tier 3 agent is
                  automatically provisioned. It inherits its sector EP&apos;s knowledge
                  and adapts to the brand&apos;s unique voice profile.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {["Tadg Riordan Motors", "Halo Bistro", "Greenway Homes"].map(
                    (name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs text-text-secondary"
                      >
                        <Bot className="h-3 w-3 text-amber" />
                        {name}
                      </span>
                    )
                  )}
                  <span className="text-xs text-text-muted">+ more</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
