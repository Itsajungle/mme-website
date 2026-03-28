"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Trophy, CloudRain, Radio, ArrowRight, ChevronDown } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";
import { USE_CASES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  weather: Sun,
  sport: Trophy,
  culture: Radio,
  traffic: Radio,
  news: Radio,
};

const categoryColors: Record<string, string> = {
  weather: "text-yellow-400",
  sport: "text-green-400",
  culture: "text-purple-400",
  traffic: "text-red-400",
  news: "text-blue-400",
};

export function UseCaseSpotlight() {
  const [active, setActive] = useState(0);
  const uc = USE_CASES[active];
  const Icon = categoryIcons[uc.category] || Sun;

  return (
    <Section className="bg-bg-card/30">
      <FadeIn>
        <SectionHeader
          title="See It In Action"
          subtitle="Real-world examples of moment marketing — from trigger to broadcast to tracked result."
        />
      </FadeIn>

      <div className="max-w-4xl mx-auto">
        {/* Selector tabs */}
        <FadeIn>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {USE_CASES.map((u, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  i === active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-muted hover:text-text hover:border-border"
                )}
              >
                {u.brand}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Active use case */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="rounded-[var(--radius-lg)] border border-border bg-bg p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={cn("w-8 h-8 rounded-lg bg-bg-card flex items-center justify-center", categoryColors[uc.category])}>
                <Icon size={16} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-text">
                  {uc.brand} × {uc.station}
                </h3>
                <span className="text-xs font-mono text-accent uppercase">{uc.category} moment</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Moment Trigger", value: uc.trigger, step: "1" },
                { label: "MME Response", value: uc.response, step: "2" },
                { label: "Result", value: uc.result, step: "3" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-bg-card border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold font-mono flex items-center justify-center">
                      {item.step}
                    </span>
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
