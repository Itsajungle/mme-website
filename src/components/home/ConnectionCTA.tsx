"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { FINAL_CTA } from "@/lib/constants";

export function ConnectionCTA() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0, 255, 150, 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
            {FINAL_CTA.headline}
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium rounded-[var(--radius)] bg-accent text-bg hover:bg-accent-hover transition-colors"
            >
              {FINAL_CTA.cta1}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium rounded-[var(--radius)] border border-border text-text hover:bg-bg-card transition-colors"
            >
              <Play size={16} />
              {FINAL_CTA.cta2}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
