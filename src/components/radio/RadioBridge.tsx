"use client";

import { Radio, Wifi, ArrowRight, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";

const paths = [
  {
    icon: Radio,
    title: "FM / DAB Broadcast",
    subtitle: "Playout System Integration",
    description:
      "Moment-ads are delivered directly into your station's playout system — Myriad, OmniPlayer, Zetta, or any major platform. They slot into existing ad breaks with zero manual intervention.",
    features: [
      "Direct playout API integration",
      "Automated scheduling & rotation",
      "Compliance-checked before broadcast",
      "Real-time swap for live moments",
    ],
  },
  {
    icon: Wifi,
    title: "Streaming Radio",
    subtitle: "Digital Distribution",
    description:
      "For online streams and DAB+ IP services, moment-ads are injected server-side with dynamic ad insertion. Listeners hear contextually relevant ads matched to their location and conditions.",
    features: [
      "Server-side ad insertion (SSAI)",
      "Geo-targeted delivery",
      "Listener-level analytics",
      "Companion banner sync",
    ],
  },
];

export function RadioBridge() {
  return (
    <Section id="radio-bridge">
      <FadeIn>
        <SectionHeader
          title="From AI to Airwaves"
          subtitle="Two paths to reach every listener — whether they're tuned in on FM, DAB, or streaming online."
        />
      </FadeIn>

      <div className="relative max-w-5xl mx-auto">
        {/* Center source node */}
        <FadeIn className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-accent/40 bg-accent/5">
            <Cpu size={20} className="text-accent" />
            <span className="text-sm font-mono font-medium text-accent">
              MME Generation Engine
            </span>
          </div>
        </FadeIn>

        {/* Arrow down */}
        <FadeIn delay={0.1} className="flex justify-center mb-10">
          <div className="flex flex-col items-center gap-1 text-accent/40">
            <div className="w-px h-8 bg-accent/30" />
            <ArrowRight size={16} className="rotate-90" />
          </div>
        </FadeIn>

        {/* Two paths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paths.map((path, i) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="rounded-[var(--radius-lg)] bg-bg-card border border-border p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-text">
                      {path.title}
                    </h3>
                    <p className="text-xs font-mono text-accent">{path.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {path.description}
                </p>

                <ul className="space-y-2">
                  {path.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-text-muted"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
