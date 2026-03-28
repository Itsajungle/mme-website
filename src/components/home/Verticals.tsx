"use client";

import Link from "next/link";
import { Radio, Share2, ArrowRight, Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { VERTICALS } from "@/lib/constants";

const icons = {
  radio: Radio,
  social: Share2,
};

export function Verticals() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          title="Two Channels. One Platform."
          subtitle="MME is the only platform that bridges AI-powered moment marketing across radio broadcast and social media simultaneously."
        />
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {(Object.entries(VERTICALS) as [keyof typeof VERTICALS, typeof VERTICALS[keyof typeof VERTICALS]][]).map(
          ([key, vertical]) => {
            const Icon = icons[key];
            return (
              <StaggerItem key={key}>
                <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-8 h-full flex flex-col group hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon size={20} className="text-accent" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-text">
                      {vertical.title}
                    </h3>
                  </div>

                  <p className="text-text-secondary mb-6">{vertical.description}</p>

                  <ul className="space-y-2 flex-1 mb-6">
                    {vertical.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                        <Check size={14} className="text-accent shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={vertical.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    Learn more
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </StaggerItem>
            );
          }
        )}
      </StaggerChildren>
    </Section>
  );
}
