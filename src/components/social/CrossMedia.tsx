"use client";

import { Radio, Share2, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";

export function CrossMedia() {
  return (
    <Section id="cross-media" className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader
          title="The Radio + Social Advantage"
          subtitle="MME is the only platform that bridges broadcast radio and social media from a single moment-detection engine. One trigger, two channels, total market coverage."
        />
      </FadeIn>

      <div className="max-w-4xl mx-auto">
        {/* Visual diagram */}
        <FadeIn delay={0.15}>
          <div className="relative rounded-[var(--radius-lg)] border border-border bg-bg p-8 sm:p-12">
            {/* Centre: MME Engine */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
              {/* Left: Radio channel */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 text-center lg:text-right"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
                  <Radio size={28} className="text-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text">
                  MME Radio
                </h3>
                <p className="mt-2 text-sm text-text-secondary max-w-xs mx-auto lg:ml-auto lg:mr-0">
                  AI-generated moment-ads broadcast on FM, DAB, and streaming radio with full voice cloning and audio branding.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-end">
                  {["FM", "DAB", "Streaming"].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-mono bg-bg-card border border-border text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Centre connector */}
              <div className="flex flex-col items-center gap-3 lg:mx-10 shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
                  className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20"
                >
                  <Zap size={32} className="text-bg" />
                </motion.div>
                <span className="text-xs font-mono font-bold text-accent tracking-widest uppercase">
                  MME
                </span>
                <span className="text-xs text-text-muted">
                  One moment triggers both
                </span>
              </div>

              {/* Right: Social channel */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
                  <Share2 size={28} className="text-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text">
                  MME Social
                </h3>
                <p className="mt-2 text-sm text-text-secondary max-w-xs mx-auto lg:mr-auto lg:ml-0">
                  Platform-native video, image, carousel, and story content published across every major social network.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-start">
                  {["TikTok", "Reels", "Stories", "X"].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-mono bg-bg-card border border-border text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Connection lines (desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-[25%] right-[25%] -translate-y-1/2 pointer-events-none">
              <div className="h-px bg-gradient-to-r from-accent/30 via-transparent to-accent/30" />
            </div>
          </div>
        </FadeIn>

        {/* Benefits */}
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {[
              {
                title: "Unified Moment Detection",
                description:
                  "A single AI engine detects moments and simultaneously triggers content for radio broadcast and social publishing.",
              },
              {
                title: "Consistent Brand Voice",
                description:
                  "The same brand kit powers both channels — your audio identity and visual identity stay aligned across every touchpoint.",
              },
              {
                title: "Cross-Channel Attribution",
                description:
                  "Track the combined impact of radio and social moment-marketing with unified analytics and ROI reporting.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="p-5 rounded-[var(--radius-lg)] border border-border bg-bg-card"
              >
                <h4 className="font-heading text-base font-bold text-text">
                  {benefit.title}
                </h4>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius)] bg-accent text-bg hover:bg-accent-hover transition-colors"
            >
              See the Cross-Media Advantage
              <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
