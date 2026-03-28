"use client";

import { Heart, MapPin, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";

const DIMENSIONS = [
  {
    icon: Heart,
    label: "Mood & Sentiment",
    score: 92,
    description:
      "How well does the emotional tone of the moment align with the brand's voice? A celebratory sporting win pairs with upbeat, high-energy brands.",
  },
  {
    icon: MapPin,
    label: "Territorial Relevance",
    score: 87,
    description:
      "Is the moment happening within the brand's active regions? Local moments matched to local advertisers for maximum resonance.",
  },
  {
    icon: Users,
    label: "Audience Fit",
    score: 94,
    description:
      "Does the moment's audience overlap with the brand's target demographic? Age, interests, listening habits — all factored in.",
  },
  {
    icon: Briefcase,
    label: "Brand Alignment",
    score: 89,
    description:
      "Does the moment reinforce or complement the brand's identity and campaign objectives? Strategic fit beyond surface-level relevance.",
  },
];

function ScoreBar({ score, delay }: { score: number; delay: number }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-mono text-text-muted">Match score</span>
        <span className="text-xs font-mono text-accent">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-bg-input overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function MatchingEngine() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          title="AI Matching Engine"
          subtitle="Every brand-moment pairing is scored across four dimensions. Only the highest-quality matches proceed to content generation."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-center text-sm font-mono text-accent mb-10">
          LAYER 3 — MATCHING
        </p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {DIMENSIONS.map((dim, i) => (
          <StaggerItem key={dim.label}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius)] bg-accent/10 shrink-0">
                  <dim.icon size={24} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-text">
                    {dim.label}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    {dim.description}
                  </p>
                  <ScoreBar score={dim.score} delay={i * 0.15} />
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.3}>
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-[var(--radius-lg)] border border-accent/30 bg-accent/5">
            <span className="text-2xl font-bold font-mono text-accent">90.5%</span>
            <span className="text-sm text-text-secondary">
              Composite match score — above threshold, proceed to content generation
            </span>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
