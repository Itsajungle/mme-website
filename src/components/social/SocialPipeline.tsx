"use client";

import { Radar, Brain, Sparkles, Layers, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";

const SOCIAL_PIPELINE_STEPS = [
  {
    key: "detect",
    title: "Detect",
    description:
      "Monitor trending topics, weather shifts, sports results, cultural moments, and news events across every channel in real-time.",
    icon: Radar,
  },
  {
    key: "match",
    title: "Match",
    description:
      "AI scores each moment against your brand guidelines, audience profile, and content strategy to find the perfect match.",
    icon: Brain,
  },
  {
    key: "generate",
    title: "Generate",
    description:
      "Create platform-native content — video, image, carousel, and stories — with on-brand copy, visuals, and hashtags in seconds.",
    icon: Sparkles,
  },
  {
    key: "atomise",
    title: "Atomise",
    description:
      "Automatically adapt each piece of content for the requirements of TikTok, Reels, Shorts, Stories, LinkedIn, and X — aspect ratios, captions, and all.",
    icon: Layers,
  },
  {
    key: "distribute",
    title: "Distribute",
    description:
      "Publish across all platforms simultaneously or schedule for optimal engagement windows — with full analytics and performance tracking.",
    icon: Send,
  },
];

export function SocialPipeline() {
  return (
    <Section id="social-pipeline">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader
          title="How MME Social Works"
          subtitle="Five steps from real-world moment to published social content — fully automated, fully on-brand."
        />
      </motion.div>

      <div className="relative">
        {/* Connection line (desktop) */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-6">
          {SOCIAL_PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-bg-card border border-border relative">
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold font-mono text-bg">
                    {i + 1}
                  </div>
                  <Icon size={32} className="text-accent" />
                </div>

                <h3 className="mt-5 font-heading text-xl font-bold text-text uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Arrow indicators between steps (desktop) */}
        <div className="hidden lg:flex justify-between mt-4 px-[10%]">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              className="text-accent/40 text-lg"
            >
              &rarr;
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
