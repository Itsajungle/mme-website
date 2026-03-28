"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

const FLOATING_CARDS = [
  { label: "TikTok", color: "#ff0050", delay: 0, x: -120, y: 0 },
  { label: "Reels", color: "#e1306c", delay: 0.8, x: 80, y: -40 },
  { label: "Stories", color: "#833ab4", delay: 1.6, x: -60, y: -80 },
  { label: "Shorts", color: "#ff0000", delay: 2.4, x: 100, y: 40 },
  { label: "X / Twitter", color: "#1da1f2", delay: 3.2, x: -140, y: 60 },
  { label: "LinkedIn", color: "#0077b5", delay: 4.0, x: 140, y: -60 },
];

function FloatingFeed() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {FLOATING_CARDS.map((card) => (
        <motion.div
          key={card.label}
          className="absolute w-28 h-16 rounded-[var(--radius)] border border-border/40 bg-bg-card/60 backdrop-blur-sm flex items-center justify-center text-xs font-mono text-text-secondary"
          initial={{ opacity: 0, y: 60, x: card.x }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            y: [60 + card.y, -20 + card.y, -60 + card.y, -120 + card.y],
            x: card.x,
          }}
          transition={{
            duration: 6,
            delay: card.delay,
            repeat: Infinity,
            repeatDelay: FLOATING_CARDS.length * 0.8 - 6 + 0.8,
            ease: "easeInOut",
          }}
        >
          <span
            className="w-2 h-2 rounded-full mr-2 shrink-0"
            style={{ backgroundColor: card.color }}
          />
          {card.label}
        </motion.div>
      ))}

      {/* Central pulse */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-accent/20"
        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-accent/20"
        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
}

export function SocialHero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0, 255, 150, 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Floating social feed */}
      <FloatingFeed />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-border bg-bg-card/50 text-xs font-mono text-accent">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            MME SOCIAL
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text max-w-5xl mx-auto leading-[1.1]"
        >
          Moment-Matched Social Content at Scale
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto"
        >
          AI-generated content atomised for every platform. Detect a real-world moment, generate matched creative, and publish across TikTok, Reels, Stories, and more — while the moment still matters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#social-pipeline"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius)] border border-border text-text hover:bg-bg-card transition-colors"
          >
            <Zap size={16} />
            See How It Works
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius)] bg-accent text-bg hover:bg-accent-hover transition-colors"
          >
            Book a Demo
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 text-sm text-text-muted font-mono"
        >
          One moment. Six platforms. Zero manual production.
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  );
}
