"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Mic2,
  Music,
  Volume2,
  Wifi,
  WifiOff,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngine } from "@/lib/audio-engine/engine-provider";

export function AudioEngineStatus() {
  const { status, refreshStatus } = useAudioEngine();
  const [showPanel, setShowPanel] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const services = [
    { key: "voice", label: "Voice Engine", icon: Mic2, status: status.voice },
    { key: "music", label: "Music Library", icon: Music, status: status.music },
    { key: "sfx", label: "SFX Library", icon: Volume2, status: status.sfx },
  ];

  const allLive = services.every((s) => s.status === "live");
  const anyLive = services.some((s) => s.status === "live");

  async function testConnection(key: string) {
    setTesting(key);
    await refreshStatus();
    await new Promise((r) => setTimeout(r, 1000));
    setTesting(null);
  }

  return (
    <>
      {/* Compact status indicator */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
          allLive
            ? "border-accent/30 text-accent hover:bg-accent/5"
            : anyLive
            ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/5"
            : "border-border text-text-muted hover:bg-bg-card-hover"
        )}
      >
        {allLive ? (
          <Wifi size={14} className="text-accent" />
        ) : (
          <WifiOff size={14} className={anyLive ? "text-amber-400" : "text-text-muted"} />
        )}
        {allLive ? "Live" : anyLive ? "Partial" : "Demo Mode"}
        <Settings size={12} className="ml-1" />
      </button>

      {/* Slide-out panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setShowPanel(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-border bg-bg-primary shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-primary px-6 py-4">
                <h2 className="font-heading text-lg font-bold text-text">Audio Engine</h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status overview */}
                <div className={cn(
                  "rounded-xl border p-4",
                  allLive ? "border-accent/30 bg-accent/5" : "border-amber-500/30 bg-amber-500/5"
                )}>
                  <p className={cn("text-sm font-medium", allLive ? "text-accent" : "text-amber-400")}>
                    {allLive
                      ? "All engines connected — live audio generation enabled"
                      : "Running in Demo Mode — configure API keys to enable live audio generation"}
                  </p>
                </div>

                {/* Service status cards */}
                {services.map((service) => {
                  const Icon = service.icon;
                  const isLive = service.status === "live";
                  return (
                    <div key={service.key} className="rounded-xl border border-border bg-bg-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={isLive ? "text-accent" : "text-text-muted"} />
                          <span className="text-sm font-medium text-text">{service.label}</span>
                        </div>
                        <span className={cn(
                          "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                          isLive ? "bg-accent/10 text-accent" : "bg-text-muted/10 text-text-muted"
                        )}>
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isLive ? "bg-accent" : "bg-text-muted"
                          )} />
                          {isLive ? "Connected" : "Not Configured"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-text-muted">
                          {service.key === "voice" && "Powers voice synthesis, SFX generation, and music generation"}
                          {service.key === "music" && "Provides royalty-free music library browsing"}
                          {service.key === "sfx" && "Provides sound effects library browsing"}
                        </p>
                        <button
                          onClick={() => testConnection(service.key)}
                          disabled={testing === service.key}
                          className={cn(
                            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                            isLive
                              ? "border-accent/30 text-accent hover:bg-accent/5"
                              : "border-border text-text-muted hover:border-border-hover"
                          )}
                        >
                          {testing === service.key ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : isLive ? (
                            <CheckCircle2 size={12} />
                          ) : null}
                          Test Connection
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Instructions */}
                <div className="rounded-xl border border-border bg-bg-deep p-5">
                  <h3 className="mb-2 text-sm font-bold text-text">Configuration</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    API keys are configured via environment variables in <code className="rounded bg-bg-card px-1 py-0.5 text-[10px] font-mono">.env.local</code>.
                    Set <code className="rounded bg-bg-card px-1 py-0.5 text-[10px] font-mono">ELEVENLABS_API_KEY</code> for voice generation,
                    <code className="rounded bg-bg-card px-1 py-0.5 text-[10px] font-mono"> JAMENDO_CLIENT_ID</code> for music library, and
                    <code className="rounded bg-bg-card px-1 py-0.5 text-[10px] font-mono"> FREESOUND_API_KEY</code> for SFX library.
                  </p>
                  <p className="mt-2 text-xs text-text-muted">
                    Restart the development server after adding keys.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
