"use client";

import {
  LayoutDashboard,
  TrendingUp,
  Sparkles,
  Users,
  BarChart3,
  Zap,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";

const features = [
  {
    icon: LayoutDashboard,
    title: "SaaS Platform",
    description:
      "A complete station dashboard to manage brands, campaigns, moments, and ad delivery — all from one interface.",
  },
  {
    icon: TrendingUp,
    title: "Performance Revenue",
    description:
      "Unlock new ad revenue with performance-based pricing. Trackable outcomes mean advertisers pay for results, not just airtime.",
  },
  {
    icon: Sparkles,
    title: "AI Creative Tools",
    description:
      "Generate broadcast-ready ads in seconds with AI voice cloning, music composition, and sound design — no studio time required.",
  },
  {
    icon: Users,
    title: "Advertiser Management",
    description:
      "Onboard local and national advertisers with self-serve Audio Brand Kits. Each brand gets their own voice, music, and SFX profile.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track every ad from moment detection to listener response. Attribution data that proves radio works — for the first time.",
  },
  {
    icon: Zap,
    title: "Moment Detection Feed",
    description:
      "Live feed of weather, sport, news, traffic, and cultural moments across your broadcast territory — matched to your advertiser inventory.",
  },
];

export function ForStations() {
  return (
    <Section id="for-stations">
      <FadeIn>
        <SectionHeader
          title="For Radio Stations"
          subtitle="MME Radio gives your station the AI tools and data layer to compete with digital — while keeping the emotional power of broadcast audio."
        />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <StaggerItem key={feature.title}>
              <div className="rounded-[var(--radius-lg)] bg-bg-card border border-border p-6 h-full">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-accent" />
                </div>
                <h3 className="font-heading text-base font-bold text-text">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </Section>
  );
}
