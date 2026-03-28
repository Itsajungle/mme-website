"use client";

import { Radar, Brain, Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PIPELINE_STEPS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Radar,
  Brain,
  Sparkles,
  Send,
};

export function Pipeline() {
  return (
    <Section id="how-it-works">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader
          title="How MME Works"
          subtitle="From real-world moment to broadcast-ready content in seconds — not weeks."
        />
      </motion.div>

      <div className="relative">
        {/* Connection line (desktop) */}
        <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Step number */}
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
      </div>
    </Section>
  );
}
