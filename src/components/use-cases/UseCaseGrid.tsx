"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Trophy,
  Palette,
  Car,
  Newspaper,
  ArrowRight,
  X,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { USE_CASES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ElementType }
> = {
  weather: {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    icon: Cloud,
  },
  sport: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    icon: Trophy,
  },
  culture: {
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
    icon: Palette,
  },
  traffic: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    icon: Car,
  },
  news: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    icon: Newspaper,
  },
};

type UseCase = (typeof USE_CASES)[number];

function UseCaseCard({
  useCase,
  index,
  onSelect,
}: {
  useCase: UseCase;
  index: number;
  onSelect: (index: number) => void;
}) {
  const config = CATEGORY_CONFIG[useCase.category] ?? CATEGORY_CONFIG.news;
  const Icon = config.icon;

  return (
    <StaggerItem>
      <motion.button
        onClick={() => onSelect(index)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "w-full text-left rounded-[var(--radius-lg)] border bg-bg-card p-6 transition-colors cursor-pointer",
          config.border,
          "hover:bg-bg-input"
        )}
      >
        {/* Category badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase",
              config.bg,
              config.color
            )}
          >
            <Icon size={12} />
            {useCase.category}
          </span>
          <ArrowRight size={16} className="text-text-muted" />
        </div>

        {/* Brand x Station */}
        <h3 className="text-lg font-bold text-text mb-1">
          {useCase.brand}
        </h3>
        <p className="text-sm text-text-muted mb-4 font-mono">
          {useCase.station}
        </p>

        {/* Trigger */}
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
            Trigger
          </p>
          <p className="text-sm text-text-secondary">{useCase.trigger}</p>
        </div>

        {/* Result preview */}
        <div
          className={cn(
            "mt-4 pt-4 border-t",
            config.border
          )}
        >
          <p className={cn("text-sm font-semibold", config.color)}>
            {useCase.result}
          </p>
        </div>
      </motion.button>
    </StaggerItem>
  );
}

function UseCaseModal({
  useCase,
  onClose,
}: {
  useCase: UseCase;
  onClose: () => void;
}) {
  const config = CATEGORY_CONFIG[useCase.category] ?? CATEGORY_CONFIG.news;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-lg rounded-[var(--radius-lg)] border bg-bg-card p-8",
          config.border
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
        >
          <X size={20} />
        </button>

        {/* Category badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase mb-6",
            config.bg,
            config.color
          )}
        >
          <Icon size={12} />
          {useCase.category}
        </span>

        {/* Brand x Station */}
        <h3 className="text-2xl font-bold text-text mb-1">
          {useCase.brand}
        </h3>
        <p className="text-sm text-text-muted font-mono mb-6">
          {useCase.station}
        </p>

        {/* Detail rows */}
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1.5">
              Moment Trigger
            </p>
            <p className="text-text-secondary">{useCase.trigger}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1.5">
              MME Response
            </p>
            <p className="text-text-secondary">{useCase.response}</p>
          </div>

          <div
            className={cn("pt-5 border-t", config.border)}
          >
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1.5">
              Result
            </p>
            <p className={cn("text-lg font-semibold", config.color)}>
              {useCase.result}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function UseCaseGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <Section>
      <SectionHeader
        title="Six Moments. Six Wins."
        subtitle="Each use case follows the same pattern: a real-world moment is detected, MME generates matched creative, and the brand sees measurable impact."
      />

      <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((uc, i) => (
          <UseCaseCard
            key={i}
            useCase={uc}
            index={i}
            onSelect={setSelectedIndex}
          />
        ))}
      </StaggerChildren>

      <AnimatePresence>
        {selectedIndex !== null && (
          <UseCaseModal
            useCase={USE_CASES[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
