"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";
import { PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Plans() {
  return (
    <Section id="plans">
      <FadeIn>
        <SectionHeader title={PLANS.headline} subtitle={PLANS.body} />
      </FadeIn>

      {/* The ladder: each tier sits a step higher than the last, climbing
          left-to-right toward the community/connection end — mirroring the hero arc. */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          {PLANS.tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              // step height climbs with each tier (desktop)
              className="lg:[--rise:calc(var(--step)*1.4rem)]"
              style={{ "--step": i } as React.CSSProperties}
            >
              <div className="lg:pb-[var(--rise)]">
                <div
                  className={cn(
                    "rounded-[var(--radius-lg)] border p-4 sm:p-5 h-full flex flex-col",
                    tier.highlighted
                      ? "border-accent/40 bg-accent/5 shadow-[0_10px_30px_-14px_var(--green-glow)]"
                      : "border-border bg-bg-card"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-mono uppercase tracking-wide mb-2",
                      tier.highlighted ? "text-accent" : "text-text-muted"
                    )}
                  >
                    {tier.phase}
                  </span>
                  <h3
                    className={cn(
                      "font-heading text-lg font-bold",
                      tier.highlighted ? "text-accent" : "text-text"
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-snug">
                    {tier.note}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <p className="mt-8 text-center text-sm font-mono text-accent">
            Content → Community → Connection
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
