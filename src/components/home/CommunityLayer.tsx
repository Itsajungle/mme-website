"use client";

import { CalendarHeart, Users, PartyPopper, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { COMMUNITY_LAYER } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = { CalendarHeart, Users, PartyPopper };

export function CommunityLayer() {
  return (
    <Section className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader title={COMMUNITY_LAYER.headline} subtitle={COMMUNITY_LAYER.body} />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMMUNITY_LAYER.blocks.map((block) => {
          const Icon = iconMap[block.icon];
          return (
            <StaggerItem key={block.title}>
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg p-6 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-text mb-2">
                  {block.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {block.detail}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </Section>
  );
}
