"use client";

import { Section } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem, CountUp } from "@/components/shared/AnimatedSection";
import { STATS } from "@/lib/constants";

export function Stats() {
  return (
    <Section>
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
            A Market Ready for Disruption
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            The UK radio advertising market is massive, the audience is captive, and no one is doing what MME does.
          </p>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent">
                {stat.value === 0 ? (
                  <span className="font-mono">0</span>
                ) : (
                  <CountUp value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix} />
                )}
              </div>
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.3}>
        <p className="mt-8 text-center text-sm font-mono text-accent">
          First platform to bridge AI ad generation with FM/DAB broadcast
        </p>
      </FadeIn>
    </Section>
  );
}
