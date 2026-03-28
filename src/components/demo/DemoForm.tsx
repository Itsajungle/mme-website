"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  Radio,
  Zap,
  BarChart3,
  Mail,
  Phone,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = [
  "Radio Station",
  "Advertiser",
  "Agency",
  "Other",
] as const;

const SELLING_POINTS = [
  {
    icon: Zap,
    title: "Real-time moment detection",
    description: "Weather, sport, news, culture, and traffic triggers",
  },
  {
    icon: Radio,
    title: "AI-generated radio ads",
    description: "Brand voice cloning, music, and SFX in seconds",
  },
  {
    icon: BarChart3,
    title: "Full attribution",
    description: "Track every call, visit, and conversion driven by MME",
  },
];

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClasses = cn(
    "w-full rounded-[var(--radius)] bg-bg-input border border-border px-4 py-3 text-text text-sm",
    "placeholder:text-text-muted",
    "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus",
    "transition-colors"
  );

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-5">
        {/* Form column */}
        <FadeIn className="lg:col-span-3">
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <CheckCircle size={48} className="text-green-400 mb-4" />
                  <h3 className="text-2xl font-heading font-bold text-text mb-2">
                    We&apos;ll be in touch
                  </h3>
                  <p className="text-text-secondary max-w-md">
                    Thank you for your interest in MME. We&apos;ll review your
                    details and get back to you within 24 hours to arrange your
                    personalised demo.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-accent hover:text-accent-hover transition-colors underline underline-offset-4"
                  >
                    Submit another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-heading font-bold text-text mb-6">
                    Request a Demo
                  </h2>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-text-secondary mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className={inputClasses}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text-secondary mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className={inputClasses}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-text-secondary mb-1.5"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      placeholder="Your company or station name"
                      className={inputClasses}
                    />
                  </div>

                  {/* Role selector */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-text-secondary mb-1.5"
                    >
                      I&apos;m a...
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={cn(inputClasses, "appearance-none cursor-pointer")}
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-secondary mb-1.5"
                    >
                      Message{" "}
                      <span className="text-text-muted">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us about your needs, audience size, or any specific questions..."
                      className={cn(inputClasses, "resize-none")}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-medium rounded-[var(--radius)] bg-accent text-bg hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    <Send size={16} />
                    Request Demo
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* Side panel */}
        <FadeIn delay={0.2} className="lg:col-span-2">
          <div className="space-y-8">
            {/* Why MME */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6">
              <h3 className="text-lg font-heading font-bold text-text mb-5">
                Why Book a Demo?
              </h3>
              <div className="space-y-5">
                {SELLING_POINTS.map((point) => {
                  const Icon = point.icon;
                  return (
                    <div key={point.title} className="flex gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-[var(--radius)] bg-accent/10 flex items-center justify-center">
                        <Icon size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {point.title}
                        </p>
                        <p className="text-sm text-text-muted">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact info */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-6">
              <h3 className="text-lg font-heading font-bold text-text mb-4">
                Get in Touch
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:hello@momentmarketingengine.com"
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  <Mail size={16} className="text-text-muted" />
                  hello@momentmarketingengine.com
                </a>
                <a
                  href="tel:+44"
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  <Phone size={16} className="text-text-muted" />
                  Available upon request
                </a>
              </div>
              <p className="mt-4 text-xs text-text-muted">
                Based in the UK. We typically respond within one business day.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
