"use client";

import { Radio, Wifi, Headphones, Share2, MonitorPlay, MessageCircle, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";

const RADIO_STEPS = [
  { label: "Playout System API", sub: "Direct integration with broadcast automation" },
  { label: "FM / DAB Broadcast", sub: "Traditional radio reaching millions of listeners" },
  { label: "Streaming Simulcast", sub: "Digital streams on Global Player, BBC Sounds, and more" },
];

const SOCIAL_STEPS = [
  { label: "Platform APIs", sub: "Authenticated connections to every major social network" },
  { label: "Multi-Platform Push", sub: "Instagram, TikTok, YouTube Shorts, X, LinkedIn — simultaneously" },
  { label: "Programmatic Display", sub: "Extend reach via DSP integrations for banner and native ads" },
];

function FlowPath({
  title,
  icon: Icon,
  steps,
  delay,
}: {
  title: string;
  icon: React.ElementType;
  steps: { label: string; sub: string }[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius)] bg-accent/10">
          <Icon size={20} className="text-accent" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text">{title}</h3>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-8 h-8 rounded-full border border-accent/30 bg-accent/5 flex items-center justify-center text-xs font-mono text-accent">
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px h-6 bg-border mt-1" />
              )}
            </div>
            <div className="pt-1">
              <p className="text-sm font-bold text-text">{step.label}</p>
              <p className="text-xs text-text-secondary mt-0.5">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function DistributionLayer() {
  return (
    <Section className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader
          title="Distribution Layer"
          subtitle="Two parallel paths, one unified system. Approved content reaches radio airwaves and social feeds simultaneously."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-center text-sm font-mono text-accent mb-10">
          LAYER 6 — DISTRIBUTION
        </p>
      </FadeIn>

      {/* Two-path layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <FlowPath
          title="Radio Path"
          icon={Radio}
          steps={RADIO_STEPS}
          delay={0.15}
        />
        <FlowPath
          title="Social Path"
          icon={Share2}
          steps={SOCIAL_STEPS}
          delay={0.25}
        />
      </div>

      <FadeIn delay={0.35}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-text-muted">
          {[Radio, Wifi, Headphones, MonitorPlay, MessageCircle, Globe].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
            >
              <Icon size={20} className="opacity-40 hover:opacity-100 hover:text-accent transition-all" />
            </motion.div>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
