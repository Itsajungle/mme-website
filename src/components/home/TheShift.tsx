"use client";

import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { SHIFT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TheShift() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader title={SHIFT.headline} subtitle={SHIFT.body} />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {SHIFT.columns.map((col, i) => (
          <StaggerItem key={col.title}>
            <div className="relative h-full">
              <div
                className={cn(
                  "rounded-[var(--radius-lg)] border p-6 h-full flex flex-col",
                  col.highlighted
                    ? "border-accent/30 bg-accent/5"
                    : "border-border bg-bg-card"
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-mono uppercase tracking-wide mb-3",
                    col.highlighted ? "text-accent" : "text-text-muted"
                  )}
                >
                  {col.stage}
                </span>
                <h3
                  className={cn(
                    "font-heading text-lg font-semibold mb-2",
                    col.highlighted ? "text-accent" : "text-text"
                  )}
                >
                  {col.title}
                </h3>
                <p className="text-sm text-text-secondary">{col.detail}</p>
              </div>

              {/* arrow between columns (desktop) */}
              {i < SHIFT.columns.length - 1 && (
                <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-accent/40">
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </Section>
  );
}
