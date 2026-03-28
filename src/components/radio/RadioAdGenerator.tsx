"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  ChevronDown,
  Clock,
  Sparkles,
  Volume2,
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import { AudioPreview } from "./AudioPreview";

const TRIGGER_TYPES = [
  "Weather",
  "Sport",
  "News",
  "Culture",
  "Traffic",
  "Seasonal",
  "Industry",
  "Breaking",
];

const DURATIONS = ["15s", "30s", "60s"];

const PLACEHOLDER_SCRIPT = `[MUSIC BED: Upbeat, feel-good jingle — 3s intro]

VOICE (Tadg — warm, friendly):
"Spring is here and the sun is shining across Meath this weekend!
There's never been a better time to get behind the wheel of your next car.

At Tadg Riordan Motors in Ashbourne, we've got over fifty
pre-owned cars ready to go — all serviced, NCT'd, and
waiting for you to take them for a spin.

This weekend only — zero deposit finance on selected models,
plus a free first service with every purchase.

Pop into the showroom on Main Street, Ashbourne,
or call us on 01 835 xxxx.

Tell them Tadg sent you."

[SFX: Car engine start — 1s]
[MUSIC BED: Jingle resolve — 2s out]`;

export function RadioAdGenerator({ brand }: { brand: Brand }) {
  const [step, setStep] = useState(1);
  const [promotion, setPromotion] = useState("");
  const [triggerType, setTriggerType] = useState("");
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [duration, setDuration] = useState("30s");
  const [scriptGenerated, setScriptGenerated] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  function handleGenerateScript() {
    setGenerating(true);
    setTimeout(() => {
      setScriptGenerated(true);
      setGenerating(false);
    }, 1500);
  }

  function handleGenerateAudio() {
    setGenerating(true);
    setTimeout(() => {
      setAudioGenerated(true);
      setGenerating(false);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Mic size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-text">
            Radio Ad Generator
          </h2>
          <p className="text-sm text-text-muted">
            Create broadcast-ready ads for {brand.name}
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            onClick={() => s <= step && setStep(s)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-bold transition-all",
              step >= s
                ? "bg-accent text-bg"
                : "border border-border text-text-muted"
            )}
          >
            {s}
          </button>
        ))}
        <div className="ml-2 text-sm text-text-secondary">
          {step === 1 && "Describe your promotion"}
          {step === 2 && "Select trigger type"}
          {step === 3 && "Choose duration"}
          {step === 4 && "Generate"}
        </div>
      </div>

      {/* Step 1: Promotion Description */}
      <AnimatePresence mode="wait">
        {step >= 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border bg-bg-card p-5"
          >
            <label className="mb-2 block text-sm font-medium text-text">
              What are you promoting?
            </label>
            <textarea
              value={promotion}
              onChange={(e) => {
                setPromotion(e.target.value);
                if (e.target.value.length > 10 && step === 1) setStep(2);
              }}
              placeholder="e.g. Spring sale — zero deposit finance on all pre-owned cars this weekend only. Free first service included."
              rows={3}
              className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none resize-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Trigger Type */}
      {step >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-border bg-bg-card p-5"
        >
          <label className="mb-2 block text-sm font-medium text-text">
            Trigger Type
          </label>
          <div className="relative">
            <button
              onClick={() => setTriggerOpen(!triggerOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-text hover:border-border-hover transition-colors"
            >
              <span className={triggerType ? "text-text" : "text-text-muted"}>
                {triggerType || "Select a trigger type..."}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-text-muted transition-transform",
                  triggerOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {triggerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-card shadow-xl"
                >
                  {TRIGGER_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTriggerType(t);
                        setTriggerOpen(false);
                        if (step === 2) setStep(3);
                      }}
                      className={cn(
                        "block w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                        triggerType === t
                          ? "bg-accent/10 text-accent"
                          : "text-text-secondary hover:bg-bg-card-hover hover:text-text"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Step 3: Duration Selector */}
      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-border bg-bg-card p-5"
        >
          <label className="mb-3 block text-sm font-medium text-text">
            Ad Duration
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDuration(d);
                  if (step === 3) setStep(4);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-4 transition-all",
                  duration === d
                    ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(0,255,150,0.08)]"
                    : "border-border bg-bg-deep hover:border-border-hover"
                )}
              >
                <Clock
                  size={20}
                  className={duration === d ? "text-accent" : "text-text-muted"}
                />
                <span
                  className={cn(
                    "text-lg font-heading font-bold",
                    duration === d ? "text-accent" : "text-text"
                  )}
                >
                  {d}
                </span>
                <span className="text-xs text-text-muted">
                  {d === "15s" && "Quick spot"}
                  {d === "30s" && "Standard"}
                  {d === "60s" && "Feature"}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Generate Script Button */}
      {step >= 4 && !scriptGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleGenerateScript}
            disabled={generating}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold text-bg transition-all hover:bg-accent-hover",
              generating && "opacity-60 cursor-not-allowed"
            )}
          >
            {generating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles size={18} />
                </motion.div>
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Script
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Script Output */}
      {scriptGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Script Card */}
          <div className="rounded-xl border border-border bg-bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-text">
                Generated Script
              </h3>
              <span className="text-xs text-text-muted font-mono">
                {duration} &middot; {triggerType} trigger
              </span>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg border border-border bg-bg-deep p-4 font-mono text-xs leading-relaxed text-text-secondary">
              {PLACEHOLDER_SCRIPT}
            </pre>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Readability Score */}
            <div className="rounded-xl border border-border bg-bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-accent" />
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Readability
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-2xl font-bold text-text">
                  8.2
                </span>
                <span className="text-sm text-text-muted">/10</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-bg-deep overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
            </div>

            {/* CTA Strength */}
            <div className="rounded-xl border border-border bg-bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-accent" />
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  CTA Strength
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl font-bold text-text">
                  Strong
                </span>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                  Good
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Clear call-to-action with location and phone
              </p>
            </div>

            {/* ComProd Director Score */}
            <div className="rounded-xl border border-border bg-bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-accent" />
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  ComProd Director
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-2xl font-bold text-text">
                  87
                </span>
                <span className="text-sm text-text-muted">/100</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-bg-deep overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
            </div>
          </div>

          {/* Generate Audio Button */}
          {!audioGenerated && (
            <button
              onClick={handleGenerateAudio}
              disabled={generating}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl border border-accent/30 px-6 py-4 text-sm font-bold text-accent transition-all hover:bg-accent/5",
                generating && "opacity-60 cursor-not-allowed"
              )}
            >
              {generating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Volume2 size={18} />
                  </motion.div>
                  Generating Audio...
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  Generate Audio
                </>
              )}
            </button>
          )}

          {/* Audio Preview */}
          <AudioPreview
            title={`${brand.name} — ${triggerType} Ad`}
            duration={duration}
            isGenerated={audioGenerated}
          />
        </motion.div>
      )}
    </div>
  );
}
