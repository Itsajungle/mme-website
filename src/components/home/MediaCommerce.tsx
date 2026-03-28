"use client";

import { motion } from "framer-motion";
import { Car, Radio, BarChart3, ArrowRight, Zap } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";

const steps = [
  {
    icon: Car,
    label: "Dealer Inventory",
    sublabel: "ELLA network",
    description: "Live vehicle stock & offers",
  },
  {
    icon: Zap,
    label: "MME Engine",
    sublabel: "AI matching",
    description: "Moment + Brand + Creative",
  },
  {
    icon: Radio,
    label: "Radio Audience",
    sublabel: "Nation Radio",
    description: "FM/DAB + streaming listeners",
  },
  {
    icon: BarChart3,
    label: "Performance",
    sublabel: "Tracked results",
    description: "Calls, visits, conversions",
  },
];

export function MediaCommerce() {
  return (
    <Section className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader
          title="The Media-Commerce Model"
          subtitle="Performance-based, not slot-based. MME connects dealer inventory directly to radio audiences with full attribution tracking."
        />
      </FadeIn>

      <div className="relative max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg p-5 text-center h-full">
                <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <step.icon size={24} className="text-accent" />
                </div>
                <h4 className="font-heading font-semibold text-text text-sm">
                  {step.label}
                </h4>
                <p className="text-xs font-mono text-accent mt-1">{step.sublabel}</p>
                <p className="text-xs text-text-muted mt-2">{step.description}</p>
              </div>

              {/* Arrow connector (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-accent/40">
                  <ArrowRight size={16} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
