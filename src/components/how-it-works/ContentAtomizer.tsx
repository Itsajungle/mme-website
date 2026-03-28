"use client";

import { Radio, Film, Image, LayoutGrid, Smartphone, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";

const OUTPUTS = [
  {
    icon: Radio,
    label: "30s Radio Ad",
    detail: "Broadcast-ready audio with voiceover, music bed, and brand tags",
  },
  {
    icon: Film,
    label: "15s Social Clip",
    detail: "Vertical video optimised for Reels, TikTok, and Shorts",
  },
  {
    icon: Image,
    label: "Static Image",
    detail: "High-impact display creative for feed and story placements",
  },
  {
    icon: LayoutGrid,
    label: "Carousel",
    detail: "Multi-slide format for Instagram and LinkedIn engagement",
  },
  {
    icon: Smartphone,
    label: "Story Format",
    detail: "Full-screen vertical with swipe-up CTA and brand overlay",
  },
  {
    icon: FileText,
    label: "Ad Copy",
    detail: "Platform-specific captions, headlines, and hashtag sets",
  },
];

export function ContentAtomizer() {
  return (
    <Section className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader
          title="Content Atomizer"
          subtitle="One creative brief enters. Six platform-specific content variants emerge. Every piece tailored to the moment, the brand, and the channel."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-center text-sm font-mono text-accent mb-10">
          LAYER 4 — GENERATION
        </p>
      </FadeIn>

      {/* Visual: one input -> many outputs */}
      <FadeIn delay={0.15}>
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col items-center gap-6">
            {/* Input */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="px-6 py-4 rounded-[var(--radius-lg)] border-2 border-accent/40 bg-accent/5 text-center max-w-sm w-full"
            >
              <p className="text-xs font-mono text-accent mb-1">INPUT</p>
              <p className="text-sm font-bold text-text">Creative Brief + Moment Data + Brand Assets</p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-px h-10 bg-accent/30 origin-top"
            />

            {/* Atomizer label */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="px-4 py-2 rounded-full border border-border bg-bg-card text-xs font-mono text-text-secondary"
            >
              AI CONTENT ATOMIZER
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="w-px h-10 bg-accent/30 origin-top"
            />
          </div>
        </div>
      </FadeIn>

      {/* Output cards */}
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {OUTPUTS.map((output) => (
          <StaggerItem key={output.label}>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-5 text-center h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius)] bg-accent/10 mb-3">
                <output.icon size={24} className="text-accent" />
              </div>
              <h3 className="font-heading text-base font-bold text-text">
                {output.label}
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                {output.detail}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </Section>
  );
}
