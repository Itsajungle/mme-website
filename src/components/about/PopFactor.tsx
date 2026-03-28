"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Heart } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";

const POP_DIMENSIONS = [
  {
    icon: MapPin,
    label: "Proximity",
    traditional: "Geographic POP",
    traditionalDesc:
      "A driver hears a radio ad near a car dealership and pulls in. Physical closeness to the point of purchase.",
    mme: "Temporal & Contextual POP",
    mmeDesc:
      "A listener hears a convertible ad when the sun is shining. The moment itself creates the proximity.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
  },
  {
    icon: Clock,
    label: "Opportunity",
    traditional: "Slot-based scheduling",
    traditionalDesc:
      "Ads run in pre-booked time slots regardless of what is happening in the real world.",
    mme: "Moment-triggered activation",
    mmeDesc:
      "Ads fire when the moment is right — weather, sport, news, traffic, culture — matched in real-time.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  {
    icon: Heart,
    label: "Purchase",
    traditional: "Hope-based attribution",
    traditionalDesc:
      "No way to prove the ad drove the sale. Advertisers simply hope it worked.",
    mme: "Tracked & attributed",
    mmeDesc:
      "Call tracking, footfall measurement, and online conversion — every moment-ad is measurable.",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
  },
];

export function PopFactor() {
  return (
    <Section className="relative overflow-hidden">
      {/* Subtle glow behind section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0, 255, 150, 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <SectionHeader
          title="The POP Factor"
          subtitle="Proximity to Opportunity to Purchase — the principle that made radio advertising powerful, reimagined for the age of AI and moment marketing."
        />

        {/* POP Acronym visual */}
        <FadeIn>
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-16">
            {["Proximity", "Opportunity", "Purchase"].map((word, i) => (
              <div key={word} className="flex items-center gap-3 sm:gap-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                  className="text-center"
                >
                  <span className="block text-3xl sm:text-5xl font-heading font-bold text-accent">
                    {word[0]}
                  </span>
                  <span className="block text-xs sm:text-sm text-text-muted font-mono mt-1">
                    {word}
                  </span>
                </motion.div>
                {i < 2 && (
                  <span className="text-2xl sm:text-4xl text-text-muted font-light select-none">
                    +
                  </span>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Dimension cards */}
        <StaggerChildren className="grid gap-8 lg:grid-cols-3">
          {POP_DIMENSIONS.map((dim) => {
            const Icon = dim.icon;
            return (
              <StaggerItem key={dim.label}>
                <div
                  className={`rounded-[var(--radius-lg)] border ${dim.border} bg-bg-card p-6 h-full`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 rounded-[var(--radius)] ${dim.bg} flex items-center justify-center`}
                    >
                      <Icon size={20} className={dim.color} />
                    </div>
                    <h3 className="text-lg font-bold text-text">{dim.label}</h3>
                  </div>

                  {/* Traditional */}
                  <div className="mb-5">
                    <p className="text-xs uppercase tracking-wider text-text-muted mb-1.5">
                      Traditional Radio
                    </p>
                    <p className="text-sm font-semibold text-text-secondary mb-1">
                      {dim.traditional}
                    </p>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {dim.traditionalDesc}
                    </p>
                  </div>

                  {/* MME */}
                  <div className={`pt-5 border-t ${dim.border}`}>
                    <p className="text-xs uppercase tracking-wider text-text-muted mb-1.5">
                      With MME
                    </p>
                    <p className={`text-sm font-semibold ${dim.color} mb-1`}>
                      {dim.mme}
                    </p>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {dim.mmeDesc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Summary line */}
        <FadeIn delay={0.3}>
          <p className="text-center text-text-muted font-mono text-sm mt-12 max-w-2xl mx-auto">
            MME doesn&apos;t just put your ad near a store — it puts your ad inside a
            moment when the listener is most likely to act.
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
