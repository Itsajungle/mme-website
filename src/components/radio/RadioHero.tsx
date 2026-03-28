"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

function Waveform() {
  const bars = 40;
  return (
    <svg
      viewBox={`0 0 ${bars * 10} 120`}
      className="w-full max-w-2xl h-24 mx-auto"
      preserveAspectRatio="none"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const baseHeight = 20 + Math.sin(i * 0.5) * 15 + Math.cos(i * 0.3) * 10;
        return (
          <motion.rect
            key={i}
            x={i * 10 + 2}
            width={6}
            rx={3}
            fill="var(--accent)"
            initial={{ height: 4, y: 58 }}
            animate={{
              height: [4, baseHeight, baseHeight * 1.6, baseHeight * 0.7, baseHeight, 4],
              y: [58, 60 - baseHeight / 2, 60 - (baseHeight * 1.6) / 2, 60 - (baseHeight * 0.7) / 2, 60 - baseHeight / 2, 58],
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.06,
              ease: "easeInOut",
            }}
            style={{ opacity: 0.5 + Math.sin(i * 0.4) * 0.3 }}
          />
        );
      })}
    </svg>
  );
}

export function RadioHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0, 255, 150, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-border bg-bg-card/50 text-xs font-mono text-accent">
            <Radio size={14} />
            MME RADIO
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text max-w-5xl mx-auto leading-[1.1]"
        >
          AI-Powered Moment Ads for Radio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto"
        >
          Detect real-world moments, generate broadcast-ready radio ads with cloned brand voices, and push to FM, DAB, and streaming — all in seconds, not weeks.
        </motion.p>

        {/* Waveform visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12"
        >
          <Waveform />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#station-hierarchy"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius)] border border-border text-text hover:bg-bg-card transition-colors"
          >
            Explore the Platform
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius)] bg-accent text-bg hover:bg-accent-hover transition-colors"
          >
            Book a Demo
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  );
}
