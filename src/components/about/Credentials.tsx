"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, Clock, Mic, Cpu } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { ABOUT } from "@/lib/constants";

const CREDENTIAL_ICONS = [Briefcase, Award, Clock, Mic, Cpu];

export function Credentials() {
  return (
    <Section>
      <SectionHeader
        title="Credentials"
        subtitle="A career built at the intersection of broadcast, creativity, and technology."
      />

      <StaggerChildren className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          {ABOUT.credentials.map((credential, i) => {
            const Icon = CREDENTIAL_ICONS[i % CREDENTIAL_ICONS.length];
            return (
              <StaggerItem key={i}>
                <div className="relative flex items-start gap-5 pb-8 last:pb-0">
                  {/* Timeline dot */}
                  <motion.div
                    whileInView={{ scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border border-accent/30 bg-bg-card flex items-center justify-center"
                  >
                    <Icon size={18} className="text-accent" />
                  </motion.div>

                  {/* Content */}
                  <div className="pt-2">
                    <p className="text-text font-medium text-lg">
                      {credential}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerChildren>
    </Section>
  );
}
