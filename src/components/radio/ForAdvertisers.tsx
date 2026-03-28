"use client";

import {
  Zap,
  Mic,
  Share2,
  Target,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";

const features = [
  {
    icon: Zap,
    title: "Moment-Triggered Ads",
    description:
      "Your ads run when they matter most — triggered by live weather, sport results, breaking news, traffic events, and cultural trends in your territory.",
  },
  {
    icon: Mic,
    title: "Brand Voice Cloning",
    description:
      "From just 30 seconds of audio, MME clones your brand voice and uses it to generate every ad. Consistent, recognisable, and always on-brand.",
  },
  {
    icon: Share2,
    title: "Cross-Media Distribution",
    description:
      "One moment, two channels. Your radio ad is generated alongside matched social content — TikTok, Reels, Stories — all published simultaneously.",
  },
  {
    icon: Target,
    title: "Contextual Relevance",
    description:
      "Every ad is matched to the moment it runs in. Weather-reactive, sport-reactive, news-reactive — your message always fits the listener's world.",
  },
  {
    icon: Clock,
    title: "Seconds, Not Weeks",
    description:
      "Traditional radio ads take weeks to brief, script, record, and produce. MME generates broadcast-ready ads in seconds from your Audio Brand Kit.",
  },
  {
    icon: ShieldCheck,
    title: "Proven Attribution",
    description:
      "For the first time, track radio ad performance with call tracking, footfall measurement, online conversions, and revenue attribution.",
  },
];

export function ForAdvertisers() {
  return (
    <Section id="for-advertisers">
      <FadeIn>
        <SectionHeader
          title="For Advertisers"
          subtitle="Reach local and national audiences with AI-generated radio ads that respond to the real world — with proof they work."
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
