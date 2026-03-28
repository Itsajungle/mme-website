"use client";

import { Mic, Music, Volume2, Tag } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { FadeIn } from "@/components/shared/AnimatedSection";
import { RADIO_FEATURES } from "@/lib/constants";

const icons = [Mic, Music, Volume2, Tag];
const indicators = [
  { label: "30s sample", color: "bg-green-500" },
  { label: "AI-composed", color: "bg-blue-500" },
  { label: "Curated library", color: "bg-purple-500" },
  { label: "Brand signature", color: "bg-amber-500" },
];

export function AudioBrandKit() {
  return (
    <Section id="audio-brand-kit">
      <FadeIn>
        <SectionHeader
          title="Audio Brand Kit"
          subtitle="Every advertiser gets a unique audio identity — voice, music, sound effects, and a signature logo line — built by AI, controlled by you."
        />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RADIO_FEATURES.audioBrandKit.map((item, i) => {
          const Icon = icons[i];
          const indicator = indicators[i];
          return (
            <StaggerItem key={item.name}>
              <div className="group relative rounded-[var(--radius-lg)] bg-bg-card border border-border p-6 h-full hover:border-accent/40 transition-colors">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-accent" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-text">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>

                {/* Visual indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${indicator.color}`} />
                  <span className="text-xs text-text-muted font-mono">
                    {indicator.label}
                  </span>
                </div>

                {/* Decorative waveform on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[var(--radius-lg)] bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </Section>
  );
}
