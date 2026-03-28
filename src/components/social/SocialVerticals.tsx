"use client";

import { Music, Car, BookOpen, Camera, GraduationCap, UtensilsCrossed } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { SOCIAL_FEATURES } from "@/lib/constants";

const verticalMeta: Record<string, { icon: React.ElementType; tagline: string }> = {
  "Music & Entertainment": {
    icon: Music,
    tagline: "Trending artists, release drops, live event moments",
  },
  Automotive: {
    icon: Car,
    tagline: "Weather-triggered promotions, new model launches, motorsport tie-ins",
  },
  "Publishing & Media": {
    icon: BookOpen,
    tagline: "Bestseller surges, author events, cultural commentary",
  },
  "Photography & Visual Arts": {
    icon: Camera,
    tagline: "Golden hour alerts, exhibition openings, visual trend waves",
  },
  "Education & Training": {
    icon: GraduationCap,
    tagline: "Results day, enrolment windows, industry news hooks",
  },
  "Food & Hospitality": {
    icon: UtensilsCrossed,
    tagline: "Weather-matched menus, local events, seasonal moments",
  },
};

export function SocialVerticals() {
  return (
    <Section id="verticals">
      <StaggerChildren>
        <StaggerItem>
          <SectionHeader
            title="Built for Your Industry"
            subtitle="MME Social is trained on vertical-specific triggers and content patterns. Whatever your sector, we detect the moments that matter most to your audience."
          />
        </StaggerItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {SOCIAL_FEATURES.verticals.map((vertical) => {
            const meta = verticalMeta[vertical];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <StaggerItem key={vertical}>
                <div className="flex items-start gap-4 p-5 rounded-[var(--radius-lg)] bg-bg-card border border-border hover:border-accent/40 transition-colors">
                  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius)] bg-accent/10">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-text">
                      {vertical}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                      {meta.tagline}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerChildren>
    </Section>
  );
}
