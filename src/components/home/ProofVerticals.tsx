"use client";

import Link from "next/link";
import { HeartPulse, Store, Network, Radio, ArrowRight, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { PROOF_VERTICALS } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = { HeartPulse, Store, Network, Radio };

export function ProofVerticals() {
  return (
    <Section className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader title={PROOF_VERTICALS.headline} subtitle={PROOF_VERTICALS.subtitle} />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {PROOF_VERTICALS.cards.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <StaggerItem key={card.title}>
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg p-6 h-full flex flex-col group hover:border-accent/20 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {card.detail}
                </p>
                {card.href && (
                  <Link
                    href={card.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    See the radio story
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </Section>
  );
}
