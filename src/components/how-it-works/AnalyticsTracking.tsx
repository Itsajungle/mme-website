"use client";

import {
  Eye,
  MousePointerClick,
  Phone,
  Footprints,
  TrendingUp,
  Link2,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/shared/AnimatedSection";

const METRICS = [
  {
    icon: Eye,
    label: "Impressions",
    value: "Reach & Frequency",
    description:
      "Total ad exposures across radio listeners and social impressions, deduplicated where possible.",
  },
  {
    icon: MousePointerClick,
    label: "Engagement",
    value: "Clicks & Interactions",
    description:
      "Likes, shares, comments, saves, and click-throughs on every social variant — tracked per moment.",
  },
  {
    icon: Phone,
    label: "Calls",
    value: "Inbound Response",
    description:
      "Unique call tracking numbers per campaign. Attribute every phone enquiry back to the specific moment that triggered it.",
  },
  {
    icon: Footprints,
    label: "Footfall",
    value: "Store Visits",
    description:
      "Location-based attribution linking ad exposure to physical store visits within a configurable time window.",
  },
  {
    icon: TrendingUp,
    label: "Conversions",
    value: "Sales & Sign-ups",
    description:
      "End-to-end conversion tracking from moment detection to purchase — the metric that matters most.",
  },
  {
    icon: Link2,
    label: "Attribution",
    value: "Full-Funnel Mapping",
    description:
      "Multi-touch attribution modelling connecting each moment to downstream revenue. Prove ROI, not just reach.",
  },
];

export function AnalyticsTracking() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          title="Analytics & Tracking"
          subtitle="Every moment, every ad, every interaction — measured, attributed, and fed back into the system to make the next campaign smarter."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-center text-sm font-mono text-accent mb-10">
          LAYER 7 — MEASUREMENT
        </p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {METRICS.map((metric) => (
          <StaggerItem key={metric.label}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius)] bg-accent/10">
                  <metric.icon size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-text">
                    {metric.label}
                  </h3>
                  <p className="text-xs font-mono text-accent">{metric.value}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {metric.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.3}>
        <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-bg-card/50 p-6 max-w-2xl mx-auto text-center">
          <p className="text-sm text-text-secondary">
            All analytics feed into a <span className="text-text font-bold">closed-loop system</span>.
            Performance data from completed campaigns automatically refines moment scoring,
            brand matching, and content generation for the next cycle.
          </p>
          <p className="mt-3 text-xs font-mono text-accent">
            Every campaign makes the next one better.
          </p>
        </div>
      </FadeIn>
    </Section>
  );
}
