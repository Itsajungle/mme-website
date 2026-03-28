"use client";

import {
  Cloud,
  Trophy,
  Newspaper,
  TrendingUp,
  Car,
  Calendar,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/shared/AnimatedSection";

const DATA_SOURCES = [
  {
    icon: Cloud,
    label: "Weather APIs",
    description:
      "Real-time temperature, precipitation, and forecast data — triggering ads for ice cream when it hits 25C or umbrellas when rain is inbound.",
  },
  {
    icon: Trophy,
    label: "Sports Feeds",
    description:
      "Live scores, fixtures, and results from football, rugby, cricket, and more. A last-minute winner becomes an ad trigger within seconds.",
  },
  {
    icon: Newspaper,
    label: "News Aggregators",
    description:
      "Breaking news and trending stories filtered for relevance. A royal event, a cultural moment, a national celebration — all captured.",
  },
  {
    icon: TrendingUp,
    label: "Social Trends",
    description:
      "Hashtag velocity, viral content signals, and platform-specific trending topics. If the nation is talking about it, we know.",
  },
  {
    icon: Car,
    label: "Traffic Data",
    description:
      "Congestion alerts, travel disruptions, and commuter patterns. Reach drivers stuck on the M25 with hyper-relevant messaging.",
  },
  {
    icon: Calendar,
    label: "Cultural Calendar",
    description:
      "Bank holidays, awareness days, seasonal events, and local festivals. Pre-mapped moments ready to activate at the right time.",
  },
];

export function DetectionLayer() {
  return (
    <Section id="detection">
      <FadeIn>
        <SectionHeader
          title="Moment Detection Intelligence"
          subtitle="MME continuously monitors dozens of real-time data sources, identifying culturally relevant moments the instant they emerge."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-center text-sm font-mono text-accent mb-10">
          LAYER 1 — DETECTION
        </p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DATA_SOURCES.map((source) => (
          <StaggerItem key={source.label}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius)] bg-accent/10 mb-4">
                <source.icon size={24} className="text-accent" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text">
                {source.label}
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {source.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.3}>
        <p className="mt-10 text-center text-text-muted text-sm max-w-xl mx-auto">
          Every data source is normalised into a unified moment schema — timestamped, geotagged, and scored for cultural relevance before it reaches the matching engine.
        </p>
      </FadeIn>
    </Section>
  );
}
