"use client";

import { Quote } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StaggerChildren, StaggerItem, FadeIn } from "@/components/shared/AnimatedSection";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          title="What the Industry Is Saying"
          subtitle="Leaders in radio and digital media on the future of moment marketing."
        />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <StaggerItem key={t.name}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 h-full flex flex-col">
              <Quote size={20} className="text-accent/40 mb-4" />
              <blockquote className="text-text-secondary text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-heading font-semibold text-text text-sm">{t.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{t.title}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </Section>
  );
}
