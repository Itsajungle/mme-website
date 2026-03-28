"use client";

import { Bot, Eye, CheckCircle, XCircle, Pencil, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Bot,
    label: "AI Generates",
    description:
      "The content atomizer produces platform-specific variants from the approved brand-moment match.",
    accent: false,
  },
  {
    icon: Eye,
    label: "Human Reviews",
    description:
      "A brand manager or agency reviewer sees every piece of content before it goes live. Full preview across formats.",
    accent: true,
  },
  {
    icon: CheckCircle,
    label: "Approve",
    description:
      "One click to approve. Content is queued for immediate distribution across all target channels.",
    accent: false,
  },
  {
    icon: Pencil,
    label: "Edit",
    description:
      "Tweak copy, swap an image, adjust the CTA. Inline editing with instant re-preview.",
    accent: false,
  },
  {
    icon: XCircle,
    label: "Reject",
    description:
      "Kill the piece entirely. Rejection data feeds back into the AI to improve future generations.",
    accent: false,
  },
  {
    icon: Send,
    label: "Publish",
    description:
      "Approved content is dispatched to the distribution layer — radio playout and social APIs simultaneously.",
    accent: false,
  },
];

export function ReviewWorkflow() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          title="Human-in-the-Loop Review"
          subtitle="AI generates at machine speed. Humans approve with full context. Nothing goes live without explicit sign-off."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-center text-sm font-mono text-accent mb-12">
          LAYER 5 — APPROVAL
        </p>
      </FadeIn>

      {/* Timeline flow */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-5 sm:pl-0"
              >
                {/* Icon node */}
                <div
                  className={cn(
                    "relative z-10 shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full border",
                    step.accent
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg-card"
                  )}
                >
                  <step.icon
                    size={20}
                    className={step.accent ? "text-accent" : "text-text-secondary"}
                  />
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="font-heading text-lg font-bold text-text">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <FadeIn delay={0.4}>
        <p className="mt-12 text-center text-text-muted text-sm max-w-xl mx-auto">
          Average review-to-publish time: under 90 seconds. Fast enough to catch the moment, considered enough to protect the brand.
        </p>
      </FadeIn>
    </Section>
  );
}
