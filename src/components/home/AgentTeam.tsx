"use client";

import { Search, ShieldCheck, CheckCircle2, Mic, Send, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { AGENT_TEAM } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  Search,
  ShieldCheck,
  CheckCircle2,
  Mic,
  Send,
};

export function AgentTeam() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader title={AGENT_TEAM.headline} subtitle={AGENT_TEAM.body} />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {AGENT_TEAM.roles.map((role) => {
          const Icon = iconMap[role.icon];
          return (
            <StaggerItem key={role.title}>
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-5 h-full text-center flex flex-col items-center hover:border-accent/20 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-accent" />
                </div>
                <h3 className="font-heading text-sm font-bold text-text leading-tight">
                  {role.title}
                </h3>
                <p className="text-xs text-text-muted mt-1">{role.role}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </Section>
  );
}
