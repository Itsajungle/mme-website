"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  ChevronDown,
  Clock,
  Sparkles,
  Volume2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import { useAudioEngine } from "@/lib/audio-engine/engine-provider";
import { generateScript, type GeneratedScript } from "@/lib/audio-engine/script-generator";
import { ScriptEditor } from "./ScriptEditor";
import { AudioPreview } from "./AudioPreview";
import { ComProdScore } from "./ComProdScore";

const TRIGGER_TYPES = [
  "Weather", "Sport", "News", "Culture", "Traffic", "Seasonal", "Industry", "Breaking",
];

const DURATIONS = ["15s", "30s", "60s"];

const TONES = [
  { key: "friendly", label: "Friendly" },
  { key: "urgent", label: "Urgent" },
  { key: "professional", label: "Professional" },
  { key: "humorous", label: "Humorous" },
  { key: "emotional", label: "Emotional" },
] as const;

type Tone = typeof TONES[number]["key"];

// Production pipeline status
type PipelineStep = "idle" | "script" | "voice" | "music" | "sfx" | "mixing" | "complete";

const PIPELINE_LABELS: Record<PipelineStep, string> = {
  idle: "",
  script: "Generating Script...",
  voice: "Synthesising Voice...",
  music: "Placing Music...",
  sfx: "Adding Sound Effects...",
  mixing: "Mixing Final Production...",
  complete: "Complete",
};

interface RadioAdGeneratorProps {
  brand: Brand;
  mode: "automated" | "hybrid";
}

export function RadioAdGenerator({ brand, mode }: RadioAdGeneratorProps) {
  const engine = useAudioEngine();

  // Step wizard state
  const [step, setStep] = useState(1);
  const [promotion, setPromotion] = useState("");
  const [triggerType, setTriggerType] = useState("");
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [duration, setDuration] = useState("30s");
  const [tone, setTone] = useState<Tone>("friendly");

  // Generation state
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("idle");
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [scriptText, setScriptText] = useState("");
  const [scriptApproved, setScriptApproved] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState(brand.audioBrandKit.voiceId);
  const [musicUrl, setMusicUrl] = useState("");
  const [sfxUrls, setSfxUrls] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState("");

  const durationSeconds = parseInt(duration) || 30;

  // Generate script
  const handleGenerateScript = useCallback(() => {
    setPipelineStep("script");
    // Small delay for visual feedback
    setTimeout(() => {
      const result = generateScript({
        brand: {
          name: brand.name,
          locations: brand.locations,
          logoLine: brand.logoLine,
          sector: brand.sectorName,
          voiceName: brand.audioBrandKit.voiceName,
          voiceDescription: brand.audioBrandKit.voiceDescription,
        },
        promotion,
        triggerType,
        duration: durationSeconds,
        tone,
      });
      setScript(result);
      setScriptText(result.fullText);
      setPipelineStep("idle");

      if (mode === "automated") {
        // Auto-approve and continue to audio generation
        setScriptApproved(true);
        handleGenerateAudio(result.fullText);
      }
    }, 800);
  }, [brand, promotion, triggerType, durationSeconds, tone, mode]);

  // Generate audio
  const handleGenerateAudio = useCallback(
    async (overrideScript?: string) => {
      const scriptToUse = overrideScript || scriptText;
      setGenerationError("");

      // Extract voice-only text (remove directions)
      const voiceOnlyText = scriptToUse
        .replace(/\[.*?\]/g, "")
        .replace(/VOICE.*?:\n/g, "")
        .replace(/"/g, "")
        .replace(/\n{2,}/g, " ")
        .trim();

      if (!voiceOnlyText) return;

      // Step 1: Voice synthesis (required — blocks on failure)
      setPipelineStep("voice");
      let voiceUrl: string;
      let voiceDuration: number;
      try {
        const voiceResult = await engine.generateSpeech(voiceOnlyText, selectedVoiceId);
        voiceUrl = voiceResult.url;
        voiceDuration = voiceResult.duration;
        setAudioUrl(voiceUrl);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Voice generation failed";
        setGenerationError(msg);
        setPipelineStep("idle");
        return;
      }

      // Step 2: Music generation (non-blocking — continue without if it fails)
      setPipelineStep("music");
      let generatedMusicUrl = "";
      try {
        const musicRes = await fetch("/api/audio/music-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Background music bed for a ${tone} ${brand.sectorName} radio ad, ${durationSeconds} seconds, ${brand.name} brand`,
            durationSeconds: durationSeconds + 4,
          }),
        });
        const musicData = await musicRes.json();
        if (musicRes.ok && musicData.url) {
          generatedMusicUrl = musicData.url;
          setMusicUrl(musicData.url);
        }
      } catch {
        // Music generation failed — continue without music
      }

      // Step 3: SFX generation (non-blocking — continue without if it fails)
      setPipelineStep("sfx");
      let generatedSfxUrl = "";
      try {
        const sfxRes = await fetch("/api/audio/sfx-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Sound effect for ${brand.sectorName} ${triggerType} radio ad intro`,
            durationSeconds: 3,
          }),
        });
        const sfxData = await sfxRes.json();
        if (sfxRes.ok && sfxData.url) {
          generatedSfxUrl = sfxData.url;
          setSfxUrls([sfxData.url]);
        }
      } catch {
        // SFX generation failed — continue without SFX
      }

      // Step 4: Mix all tracks together
      setPipelineStep("mixing");
      try {
        const segments: Array<{
          audioUrl: string;
          startTime: number;
          duration: number;
          volume: number;
          track: "voice" | "music" | "sfx";
          ducking?: { underVoice: boolean; duckLevel: number; fadeMs: number };
        }> = [
          {
            audioUrl: voiceUrl,
            startTime: 2,
            duration: voiceDuration,
            volume: 100,
            track: "voice",
          },
        ];

        if (generatedMusicUrl) {
          segments.push({
            audioUrl: generatedMusicUrl,
            startTime: 0,
            duration: durationSeconds + 4,
            volume: 15,
            track: "music",
            ducking: { underVoice: true, duckLevel: 30, fadeMs: 500 },
          });
        }

        if (generatedSfxUrl) {
          segments.push({
            audioUrl: generatedSfxUrl,
            startTime: 0.5,
            duration: 3,
            volume: 50,
            track: "sfx",
          });
        }

        const mixResult = await engine.mixAudio({
          segments,
          totalDuration: durationSeconds,
          loudnessTarget: -23,
          outputFormat: "both",
        });

        if (mixResult.mp3Url) {
          setAudioUrl(mixResult.mp3Url);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Audio mixing failed";
        setGenerationError(msg);
        // Voice-only audio is still set from step 1
      }

      setAudioGenerated(true);
      setPipelineStep("complete");
    },
    [scriptText, selectedVoiceId, engine, durationSeconds, brand, tone, triggerType]
  );

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
            <span className={cn(
              "ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold",
              mode === "automated" ? "bg-accent/10 text-accent" : "bg-blue-500/10 text-blue-400"
            )}>
              {mode === "automated" ? "Automated" : "Hybrid"}
            </span>
          </p>
        </div>
      </div>

      {/* Pipeline Status */}
      {pipelineStep !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-5 py-3",
            pipelineStep === "complete" ? "border-accent/30 bg-accent/5" : "border-border bg-bg-card"
          )}
        >
          {pipelineStep === "complete" ? (
            <CheckCircle2 size={18} className="text-accent" />
          ) : (
            <Loader2 size={18} className="animate-spin text-accent" />
          )}
          <span className="text-sm font-medium text-text">
            {PIPELINE_LABELS[pipelineStep]}
          </span>
        </motion.div>
      )}

      {/* Generation Error */}
      {generationError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-3"
        >
          <span className="text-sm font-medium text-red-400">{generationError}</span>
        </motion.div>
      )}

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
          {step === 3 && "Choose duration & tone"}
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
                className={cn("text-text-muted transition-transform", triggerOpen && "rotate-180")}
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

      {/* Step 3: Duration & Tone */}
      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-border bg-bg-card p-5 space-y-4"
        >
          <div>
            <label className="mb-3 block text-sm font-medium text-text">Ad Duration</label>
            <div className="grid grid-cols-3 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
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
                  <span className={cn("text-lg font-heading font-bold", duration === d ? "text-accent" : "text-text")}>
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTone(t.key);
                    if (step === 3) setStep(4);
                  }}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                    tone === t.key
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-muted hover:border-border-hover hover:text-text"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Generate Script Button */}
      {step >= 4 && !script && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={handleGenerateScript}
            disabled={pipelineStep !== "idle"}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold text-bg transition-all hover:bg-accent-hover",
              pipelineStep !== "idle" && "opacity-60 cursor-not-allowed"
            )}
          >
            <Sparkles size={18} />
            Generate Script
          </button>
        </motion.div>
      )}

      {/* Script Output */}
      {script && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Script Editor (Hybrid mode) or Read-only (Automated) */}
          {mode === "hybrid" && !scriptApproved ? (
            <>
              <ScriptEditor
                script={scriptText}
                onChange={setScriptText}
                duration={duration}
                brandName={brand.name}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setScript(null);
                    setScriptText("");
                    handleGenerateScript();
                  }}
                  className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-text-secondary hover:border-border-hover transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={() => {
                    setScriptApproved(true);
                    handleGenerateAudio();
                  }}
                  className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-bg hover:bg-accent-hover transition-colors"
                >
                  Approve Script
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold text-text">Generated Script</h3>
                <span className="text-xs text-text-muted font-mono">
                  {duration} &middot; {triggerType} trigger &middot; {tone}
                </span>
              </div>
              <pre className="whitespace-pre-wrap rounded-lg border border-border bg-bg-deep p-4 font-mono text-xs leading-relaxed text-text-secondary">
                {scriptText}
              </pre>
            </div>
          )}

          {/* ComProd Director Score */}
          <ComProdScore
            script={scriptText}
            duration={durationSeconds}
            triggerType={triggerType}
            logoLine={brand.logoLine}
            brandName={brand.name}
            hasMusic={true}
            hasSFX={true}
          />

          {/* Generate Audio Button (Hybrid, after script approval) */}
          {mode === "hybrid" && scriptApproved && !audioGenerated && pipelineStep === "idle" && (
            <button
              onClick={() => handleGenerateAudio()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/30 px-6 py-4 text-sm font-bold text-accent transition-all hover:bg-accent/5"
            >
              <Volume2 size={18} />
              Generate Audio
            </button>
          )}

          {/* Audio Preview */}
          <AudioPreview
            title={`${brand.name} — ${triggerType} Ad`}
            duration={duration}
            isGenerated={audioGenerated}
            audioUrl={audioUrl}
          />

          {/* Schedule button */}
          {pipelineStep === "complete" && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold text-bg transition-all hover:bg-accent-hover"
            >
              <CheckCircle2 size={18} />
              {mode === "automated" ? "Schedule to Air" : "Export & Schedule"}
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
