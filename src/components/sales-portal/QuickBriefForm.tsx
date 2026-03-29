"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown, Zap, Clock, MessageSquare, Building2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BUSINESS_TYPES,
  TONES,
  DURATIONS,
  type DemoAdBrief,
  type BusinessType,
  type Tone,
  type GenerationMode,
} from "@/lib/sales-portal/types";

interface QuickBriefFormProps {
  stationId: string;
  repId: string;
  onSubmit: (brief: DemoAdBrief) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

export function QuickBriefForm({ stationId, repId, onSubmit, loading, disabled }: QuickBriefFormProps) {
  const [advertiserName, setAdvertiserName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType | "">("");
  const [keyMessage, setKeyMessage] = useState("");
  const [duration, setDuration] = useState(30);
  const [tone, setTone] = useState<Tone>("friendly");
  const [mode, setMode] = useState<GenerationMode>("automated");
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);

  const canSubmit =
    advertiserName.trim().length > 0 &&
    businessType !== "" &&
    keyMessage.trim().length > 0 &&
    !loading &&
    !disabled;

  async function handleSubmit() {
    if (!canSubmit) return;
    await onSubmit({
      advertiserName: advertiserName.trim(),
      businessType: businessType as BusinessType,
      keyMessage: keyMessage.trim(),
      duration,
      tone,
      mode,
      stationId,
      repId,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-bg-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Zap size={18} className="text-accent" />
        </div>
        <div>
          <h3 className="font-heading text-base font-semibold text-text">Quick Brief</h3>
          <p className="text-xs text-text-muted">Fill in the details and generate a demo ad</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Advertiser Name */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            <Building2 size={12} className="inline mr-1" />
            Advertiser Name
          </label>
          <input
            type="text"
            value={advertiserName}
            onChange={(e) => setAdvertiserName(e.target.value)}
            placeholder="e.g. Tadg Riordan Motors"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            disabled={loading}
          />
        </div>

        {/* Business Type Dropdown */}
        <div className="relative">
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Business Type
          </label>
          <button
            onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-between rounded-lg border border-border bg-bg px-3 py-2 text-sm text-left transition-colors",
              businessType ? "text-text" : "text-text-muted",
              "hover:border-border-hover focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            )}
          >
            {businessType || "Select business type"}
            <ChevronDown size={14} className={cn("transition-transform", showBusinessDropdown && "rotate-180")} />
          </button>
          <AnimatePresence>
            {showBusinessDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-card shadow-lg max-h-48 overflow-y-auto"
              >
                {BUSINESS_TYPES.map((bt) => (
                  <button
                    key={bt}
                    onClick={() => {
                      setBusinessType(bt);
                      setShowBusinessDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/5",
                      bt === businessType ? "text-accent bg-accent/5" : "text-text-secondary"
                    )}
                  >
                    {bt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key Message */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            <MessageSquare size={12} className="inline mr-1" />
            Key Message
          </label>
          <textarea
            value={keyMessage}
            onChange={(e) => setKeyMessage(e.target.value.slice(0, 200))}
            placeholder="What's the main offer or message? e.g. '20% off all servicing this March'"
            rows={3}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 resize-none"
            disabled={loading}
          />
          <p className="text-[10px] text-text-muted mt-1">{keyMessage.length}/200</p>
        </div>

        {/* Duration pills */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            <Clock size={12} className="inline mr-1" />
            Duration
          </label>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDuration(d.value)}
                disabled={loading}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                  d.value === duration
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-secondary hover:border-border-hover hover:text-text"
                )}
              >
                <span className="block font-semibold">{d.label}</span>
                <span className="block text-[10px] opacity-60">{d.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone selector */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            <Mic size={12} className="inline mr-1" />
            Tone
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTone(t.key)}
                disabled={loading}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-xs font-medium transition-all text-center",
                  t.key === tone
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-secondary hover:border-border-hover hover:text-text"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode toggle */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Generation Mode</label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setMode("automated")}
              disabled={loading}
              className={cn(
                "flex-1 px-3 py-2 text-xs font-medium transition-all",
                mode === "automated"
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text hover:bg-white/5"
              )}
            >
              <Sparkles size={12} className="inline mr-1" />
              Automated
            </button>
            <button
              onClick={() => setMode("hybrid")}
              disabled={loading}
              className={cn(
                "flex-1 px-3 py-2 text-xs font-medium transition-all border-l border-border",
                mode === "hybrid"
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text hover:bg-white/5"
              )}
            >
              <MessageSquare size={12} className="inline mr-1" />
              Hybrid
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            {mode === "automated"
              ? "Kova generates script + audio automatically"
              : "Edit the script before audio generation"}
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all",
            canSubmit
              ? "bg-accent text-bg hover:bg-accent-hover shadow-lg shadow-accent/20"
              : "bg-white/5 text-text-muted cursor-not-allowed"
          )}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Demo Ad
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
