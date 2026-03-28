"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function PortalRequestPage() {
  const { brandClient } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    dates: "",
    budget: "",
    notes: "",
  });

  if (!brandClient) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-6">
          <CheckCircle size={32} className="text-accent" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-text mb-2">
          Request Submitted
        </h2>
        <p className="text-text-secondary text-center max-w-md mb-6">
          Your campaign request has been sent to Sunshine Radio.
          They&apos;ll be in touch shortly to discuss your brief.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", description: "", dates: "", budget: "", notes: "" });
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text hover:border-border-hover transition-colors"
        >
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">
          Request New Campaign
        </h1>
        <p className="text-sm text-text-secondary">
          Submit a campaign brief to your station team
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-border bg-bg-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Summer Sale 2026"
              required
              className="w-full rounded-lg border border-border bg-bg-deep px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell us about your campaign goals, target audience, and key messages..."
              rows={4}
              required
              className="w-full rounded-lg border border-border bg-bg-deep px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Preferred Dates
              </label>
              <input
                type="text"
                value={form.dates}
                onChange={(e) => setForm({ ...form, dates: e.target.value })}
                placeholder="e.g. June 1 – June 30"
                className="w-full rounded-lg border border-border bg-bg-deep px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Budget Range
              </label>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full rounded-lg border border-border bg-bg-deep px-4 py-3 text-sm text-text focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
              >
                <option value="">Select range</option>
                <option value="under-1k">Under €1,000</option>
                <option value="1k-3k">€1,000 – €3,000</option>
                <option value="3k-5k">€3,000 – €5,000</option>
                <option value="5k-10k">€5,000 – €10,000</option>
                <option value="over-10k">Over €10,000</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Additional Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any specific triggers, moments, or conditions you'd like to target..."
              rows={3}
              className="w-full rounded-lg border border-border bg-bg-deep px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-amber-300 transition-colors"
        >
          <Send size={16} />
          Submit Request
        </button>
      </form>
    </motion.div>
  );
}
