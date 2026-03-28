"use client";

import { Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { RADIO_FEATURES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RadioPricing() {
  return (
    <Section id="pricing">
      <FadeIn>
        <SectionHeader
          title="Simple, Scalable Pricing"
          subtitle="Three layers that align our incentives with yours — platform access, campaign activation, and performance-based success fees."
        />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {RADIO_FEATURES.pricing.map((plan, i) => {
          const isHighlighted = i === 1;
          return (
            <StaggerItem key={plan.tier}>
              <div
                className={cn(
                  "relative rounded-[var(--radius-lg)] border p-6 lg:p-8 h-full flex flex-col",
                  isHighlighted
                    ? "bg-accent/5 border-accent/40 ring-1 ring-accent/20"
                    : "bg-bg-card border-border"
                )}
              >
                {/* Highlighted badge */}
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-bg text-xs font-mono font-bold">
                    Most Popular
                  </div>
                )}

                {/* Price label */}
                <div className="mb-4">
                  <p className="text-xs font-mono text-accent uppercase tracking-wider">
                    {plan.tier}
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-text">
                    {plan.price}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-3 mt-auto">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-text-muted"
                    >
                      <Check
                        size={16}
                        className={cn(
                          "flex-shrink-0 mt-0.5",
                          isHighlighted ? "text-accent" : "text-accent/60"
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </Section>
  );
}
