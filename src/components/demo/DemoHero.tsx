"use client";

import { motion } from "framer-motion";
import { Presentation } from "lucide-react";

export function DemoHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-24 pb-8">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(0, 255, 150, 0.08) 0%, transparent 60%)",
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
            <Presentation size={14} />
            BOOK A DEMO
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text max-w-4xl mx-auto leading-[1.1]"
        >
          See MME In Action
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-4 text-lg text-text-secondary max-w-xl mx-auto"
        >
          Book a personalised walkthrough and see how moment marketing can
          transform your radio and social advertising.
        </motion.p>
      </div>
    </section>
  );
}
