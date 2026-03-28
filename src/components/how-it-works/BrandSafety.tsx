"use client";

import { Shield, AlertTriangle, MapPin, Ban, Layers, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";

const FILTER_CRITERIA = [
  {
    icon: ThumbsUp,
    label: "Sentiment Analysis",
    description:
      "Every moment is scored for emotional tone. Negative or controversial events are flagged before they ever reach a brand.",
  },
  {
    icon: MapPin,
    label: "Territory Rules",
    description:
      "Geographic restrictions enforced at the moment level. A brand active only in the North West will never be matched to a London-only event.",
  },
  {
    icon: Layers,
    label: "Sector Rules",
    description:
      "Industry-specific guardrails prevent inappropriate matches. Alcohol brands are excluded from youth-focused moments, and so on.",
  },
  {
    icon: Ban,
    label: "Exclusion Lists",
    description:
      "Brands define keywords, topics, and entities that must never appear alongside their advertising. Hard blocks, no exceptions.",
  },
  {
    icon: AlertTriangle,
    label: "Sensitivity Scoring",
    description:
      "Moments involving tragedy, political tension, or public grief are automatically escalated for human review or suppressed entirely.",
  },
  {
    icon: Shield,
    label: "Compliance Checks",
    description:
      "ASA, Ofcom, and BCAP rules are encoded into the safety layer. Every generated ad is checked against broadcast advertising standards.",
  },
];

export function BrandSafety() {
  return (
    <Section className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader
          title="Brand Safety Agent"
          subtitle="An AI-powered safety layer sits between moment detection and brand matching — ensuring nothing inappropriate ever reaches your audience."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-center text-sm font-mono text-accent mb-10">
          LAYER 2 — SAFETY
        </p>
      </FadeIn>

      {/* Safety pipeline visual */}
      <FadeIn delay={0.15}>
        <div className="flex items-center justify-center gap-3 mb-12">
          {["Moment In", "Sentiment", "Territory", "Sector", "Exclusions", "Compliance", "Safe"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="px-3 py-1.5 rounded-full border border-border bg-bg-card text-xs font-mono text-text-secondary whitespace-nowrap"
                >
                  {step}
                </motion.div>
                {i < 6 && (
                  <span className="text-accent/40 text-xs hidden sm:inline">&rarr;</span>
                )}
              </div>
            )
          )}
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FILTER_CRITERIA.map((filter) => (
          <StaggerItem key={filter.label}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius)] bg-accent/10 mb-4">
                <filter.icon size={24} className="text-accent" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text">
                {filter.label}
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {filter.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </Section>
  );
}
