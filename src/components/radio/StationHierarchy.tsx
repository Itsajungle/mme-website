"use client";

import { Building2, Clapperboard, BarChart3, Store } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { RADIO_FEATURES } from "@/lib/constants";

const icons = [Building2, Clapperboard, BarChart3, Store];

export function StationHierarchy() {
  return (
    <Section id="station-hierarchy">
      <FadeIn>
        <SectionHeader
          title="Your Station, Organised"
          subtitle="MME Radio structures your entire ad operation into a clean hierarchy — from station brand down to individual advertisers."
        />
      </FadeIn>

      <StaggerChildren className="relative max-w-xl mx-auto">
        {/* Vertical connection line */}
        <div className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 via-accent/20 to-accent/40 hidden sm:block" />

        {RADIO_FEATURES.stationHierarchy.map((node, i) => {
          const Icon = icons[i];
          return (
            <StaggerItem key={node.level} className="relative mb-6 last:mb-0">
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Node */}
                <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-3">
                  <Icon size={28} className="text-accent" />
                </div>

                {/* Label card */}
                <div className="w-full rounded-[var(--radius-lg)] bg-bg-card border border-border p-5">
                  <h3 className="font-heading text-lg font-bold text-text">
                    {node.level}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {node.description}
                  </p>
                </div>

                {/* Arrow indicator between nodes */}
                {i < RADIO_FEATURES.stationHierarchy.length - 1 && (
                  <div className="mt-3 text-accent/50">
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                      <path d="M6 0v12M1 8l5 6 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </Section>
  );
}
