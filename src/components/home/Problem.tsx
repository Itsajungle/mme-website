"use client";

import { Check, X, Zap } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { PROBLEM } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Problem() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader title={PROBLEM.headline} subtitle={PROBLEM.subline} />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROBLEM.columns.map((col) => (
          <StaggerItem key={col.title}>
            <div
              className={cn(
                "rounded-[var(--radius-lg)] border p-6 h-full flex flex-col",
                col.highlighted
                  ? "border-accent/30 bg-accent/5"
                  : "border-border bg-bg-card"
              )}
            >
              <h3 className={cn(
                "font-heading text-lg font-semibold mb-4",
                col.highlighted ? "text-accent" : "text-text"
              )}>
                {col.title}
              </h3>
              <ul className="space-y-3 flex-1">
                {col.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    {col.highlighted ? (
                      <Check size={16} className="text-accent shrink-0 mt-0.5" />
                    ) : (
                      <X size={16} className="text-text-muted shrink-0 mt-0.5" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
              <div className={cn(
                "mt-6 pt-4 border-t text-sm font-medium font-mono flex items-center gap-2",
                col.highlighted
                  ? "border-accent/20 text-accent"
                  : "border-border text-text-muted"
              )}>
                {col.highlighted && <Zap size={14} />}
                {col.verdict}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </Section>
  );
}
