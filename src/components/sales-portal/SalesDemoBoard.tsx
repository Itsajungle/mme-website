"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
  Music,
  Mic,
  Wand2,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickBriefForm } from "./QuickBriefForm";
import { ScriptEditor } from "./ScriptEditor";
import { SalesActivityFeed } from "./SalesActivityFeed";
import type {
  DemoAdBrief,
  GenerateResponse,
  DemoAdActivity,
  PipelineStep,
} from "@/lib/sales-portal/types";
import { PIPELINE_LABELS } from "@/lib/sales-portal/types";

interface SalesDemoBoardProps {
  stationId: string;
  stationName: string;
}

export function SalesDemoBoard({ stationId, stationName }: SalesDemoBoardProps) {
  // Pipeline state
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("idle");
  const [generating, setGenerating] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [currentAd, setCurrentAd] = useState<GenerateResponse | null>(null);
  const [showScriptEditor, setShowScriptEditor] = useState(false);

  // Audio player state
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Activity feed
  const [activities, setActivities] = useState<DemoAdActivity[]>([]);

  // ── Pipeline simulation ─────────────────────────────────

  function simulatePipeline(steps: PipelineStep[], onComplete: () => void) {
    let i = 0;
    function next() {
      if (i >= steps.length) {
        onComplete();
        return;
      }
      setPipelineStep(steps[i]);
      i++;
      setTimeout(next, 800 + Math.random() * 600);
    }
    next();
  }

  // ── Generate Demo Ad ────────────────────────────────────

  const handleGenerate = useCallback(async (brief: DemoAdBrief) => {
    setGenerating(true);
    setError(null);
    setCurrentAd(null);
    setShowScriptEditor(false);

    const pipelineSteps: PipelineStep[] =
      brief.mode === "automated"
        ? ["concept-gate", "script", "voice", "music", "sfx", "mixing", "metrics"]
        : ["concept-gate", "script"];

    simulatePipeline(pipelineSteps, () => {});

    try {
      const res = await fetch("/api/sales-portal/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Generation failed");
      }

      setCurrentAd(data as GenerateResponse);

      if (data.mode === "hybrid") {
        setShowScriptEditor(true);
        setPipelineStep("complete");
      } else {
        setPipelineStep("complete");
      }

      // Add to activity feed
      setActivities((prev) => [
        {
          id: data.adId,
          adId: data.adId,
          advertiserName: data.advertiserName,
          businessType: data.businessType,
          tone: data.tone,
          duration: data.duration,
          mode: data.mode,
          comptrodScore: data.comptrodScore,
          status: data.status,
          createdAt: new Date().toISOString(),
          audioUrl: data.audioUrl ?? undefined,
        },
        ...prev,
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setError(msg);
      setPipelineStep("error");
    } finally {
      setGenerating(false);
    }
  }, []);

  // ── Generate Audio (Hybrid) ─────────────────────────────

  const handleGenerateAudio = useCallback(
    async (editedScript: string, voiceId: string) => {
      if (!currentAd) return;
      setGeneratingAudio(true);
      setError(null);

      simulatePipeline(["voice", "music", "sfx", "mixing", "metrics"], () => {});

      try {
        const res = await fetch("/api/sales-portal/generate-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adId: currentAd.adId,
            editedScript,
            voiceId,
            duration: currentAd.duration,
            tone: currentAd.tone,
            businessType: currentAd.businessType,
            stationId,
            repId: "demo-rep",
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error ?? "Audio generation failed");
        }

        setCurrentAd((prev) =>
          prev
            ? {
                ...prev,
                audioUrl: data.audioUrl,
                comptrodScore: data.comptrodScore,
                scoreReason: data.scoreReason,
                script: editedScript,
                voiceId,
                status: "complete",
              }
            : null
        );

        setShowScriptEditor(false);
        setPipelineStep("complete");

        // Update activity feed
        setActivities((prev) =>
          prev.map((a) =>
            a.adId === currentAd.adId
              ? { ...a, status: "complete" as const, comptrodScore: data.comptrodScore, audioUrl: data.audioUrl }
              : a
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Audio generation failed";
        setError(msg);
        setPipelineStep("error");
      } finally {
        setGeneratingAudio(false);
      }
    },
    [currentAd, stationId]
  );

  // ── Audio Controls ──────────────────────────────────────

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  function handlePlayActivity(audioUrl: string) {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function handleReset() {
    setCurrentAd(null);
    setShowScriptEditor(false);
    setPipelineStep("idle");
    setError(null);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  // ── Render ──────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-text">Demo Ad Studio</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Kova-powered demo ad generation for {stationName}
          </p>
        </div>
        {currentAd && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
          >
            <RotateCcw size={12} />
            New Ad
          </button>
        )}
      </div>

      {/* Pipeline Status Bar */}
      <AnimatePresence>
        {pipelineStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "rounded-lg border px-4 py-3 flex items-center gap-3",
                pipelineStep === "error"
                  ? "border-red-500/30 bg-red-500/5"
                  : pipelineStep === "complete"
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-accent/30 bg-accent/5"
              )}
            >
              {pipelineStep === "error" ? (
                <AlertCircle size={16} className="text-red-400" />
              ) : pipelineStep === "complete" ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <Loader2 size={16} className="text-accent animate-spin" />
              )}
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    pipelineStep === "error" ? "text-red-400" : pipelineStep === "complete" ? "text-green-400" : "text-accent"
                  )}
                >
                  {PIPELINE_LABELS[pipelineStep]}
                </p>
                {error && <p className="text-xs text-red-300 mt-0.5">{error}</p>}
              </div>

              {/* Pipeline step indicators */}
              <div className="hidden sm:flex items-center gap-1">
                {(["concept-gate", "script", "voice", "music", "sfx", "mixing", "metrics"] as const).map((step) => {
                  const stepOrder = ["concept-gate", "script", "voice", "music", "sfx", "mixing", "metrics"];
                  const currentIdx = stepOrder.indexOf(pipelineStep);
                  const stepIdx = stepOrder.indexOf(step);
                  const isComplete = pipelineStep === "complete" || stepIdx < currentIdx;
                  const isCurrent = step === pipelineStep;

                  return (
                    <div
                      key={step}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-all duration-300",
                        isComplete ? "bg-accent" : isCurrent ? "bg-accent/50 animate-pulse" : "bg-white/10"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Brief Form or Script Editor */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {showScriptEditor && currentAd ? (
              <ScriptEditor
                key="editor"
                script={currentAd.script}
                voiceId={currentAd.voiceId}
                tone={currentAd.tone}
                onSubmit={handleGenerateAudio}
                onCancel={() => {
                  setShowScriptEditor(false);
                  setPipelineStep("idle");
                }}
                loading={generatingAudio}
              />
            ) : (
              <QuickBriefForm
                key="form"
                stationId={stationId}
                repId="demo-rep"
                onSubmit={handleGenerate}
                loading={generating}
                disabled={generating}
              />
            )}
          </AnimatePresence>

          {/* Result Card */}
          <AnimatePresence>
            {currentAd && !showScriptEditor && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="rounded-xl border border-border bg-bg-card overflow-hidden"
              >
                {/* Ad Details Header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-text">
                      {currentAd.advertiserName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-text-muted">{currentAd.businessType}</span>
                      <span className="text-[10px] text-text-muted">·</span>
                      <span className="text-[10px] text-text-muted">{currentAd.duration}s</span>
                      <span className="text-[10px] text-text-muted">·</span>
                      <span className="text-[10px] text-text-muted capitalize">{currentAd.tone}</span>
                      <span className="text-[10px] text-text-muted">·</span>
                      <span className="text-[10px] text-text-muted capitalize">{currentAd.mode}</span>
                    </div>
                  </div>
                  {currentAd.status === "complete" && currentAd.comptrodScore > 0 && (
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">ComProd</p>
                      <p
                        className={cn(
                          "text-lg font-mono font-bold",
                          currentAd.comptrodScore >= 85
                            ? "text-green-400"
                            : currentAd.comptrodScore >= 70
                              ? "text-accent"
                              : "text-amber-400"
                        )}
                      >
                        {currentAd.comptrodScore}
                      </p>
                    </div>
                  )}
                </div>

                {/* Script Preview */}
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={13} className="text-text-muted" />
                    <span className="text-xs font-medium text-text-secondary">Script</span>
                  </div>
                  <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {currentAd.script}
                  </pre>
                </div>

                {/* Production Details */}
                <div className="px-5 py-3 border-b border-border flex items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Mic size={11} />
                    {currentAd.voiceId ? "Voice selected" : "No voice"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Music size={11} />
                    {currentAd.musicStyle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wand2 size={11} />
                    {currentAd.sfxSpots.length} SFX
                  </span>
                </div>

                {/* Audio Player */}
                {currentAd.audioUrl && (
                  <div className="px-5 py-4 flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg hover:bg-accent-hover transition-colors shrink-0"
                    >
                      {playing ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    {/* Waveform bars */}
                    <div className="flex-1 flex items-end gap-[2px] h-8">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex-1 rounded-full transition-all duration-150",
                            playing ? "bg-accent" : "bg-white/10"
                          )}
                          style={{
                            height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 50}%`,
                            animationDelay: playing ? `${i * 30}ms` : undefined,
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setMuted(!muted)}
                      className="p-2 text-text-muted hover:text-text transition-colors"
                    >
                      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>

                    <a
                      href={currentAd.audioUrl}
                      download={`${currentAd.advertiserName.replace(/\s+/g, "-")}-demo.mp3`}
                      className="p-2 text-text-muted hover:text-accent transition-colors"
                    >
                      <Download size={16} />
                    </a>

                    <audio
                      ref={audioRef}
                      src={currentAd.audioUrl}
                      muted={muted}
                      onEnded={() => setPlaying(false)}
                    />
                  </div>
                )}

                {/* Score breakdown */}
                {currentAd.comptrodScore > 0 && (
                  <div className="px-5 py-3 border-t border-border">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BarChart3 size={13} className="text-text-muted" />
                      <span className="text-xs font-medium text-text-secondary">Score Analysis</span>
                    </div>
                    <p className="text-xs text-text-muted">{currentAd.scoreReason}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="space-y-6">
          <SalesActivityFeed activities={activities} onPlayAudio={handlePlayActivity} />
        </div>
      </div>
    </div>
  );
}
