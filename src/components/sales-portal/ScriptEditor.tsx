"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Play, Pause, ChevronDown, Mic, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VOICE_ROSTER, TONE_VOICE_MAP } from "@/lib/sales-portal/types";

interface ScriptEditorProps {
  script: string;
  voiceId: string;
  tone: string;
  onSubmit: (editedScript: string, voiceId: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ScriptEditor({ script, voiceId, tone, onSubmit, onCancel, loading }: ScriptEditorProps) {
  const [editedScript, setEditedScript] = useState(script);
  const [selectedVoiceId, setSelectedVoiceId] = useState(voiceId);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [playingSample, setPlayingSample] = useState(false);

  // Filter voices by tone compatibility, but show all
  const preferredNames = TONE_VOICE_MAP[tone] ?? [];
  const sortedVoices = [
    ...VOICE_ROSTER.filter((v) => preferredNames.includes(v.name)),
    ...VOICE_ROSTER.filter((v) => !preferredNames.includes(v.name)),
  ];

  const selectedVoice = VOICE_ROSTER.find((v) => v.id === selectedVoiceId) ?? VOICE_ROSTER[0];

  function handlePlaySample() {
    setPlayingSample(true);
    // Simulate 2-second sample playback
    setTimeout(() => setPlayingSample(false), 2000);
  }

  async function handleSubmit() {
    if (!editedScript.trim() || loading) return;
    await onSubmit(editedScript.trim(), selectedVoiceId);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-accent/20 bg-bg-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
            <Mic size={18} className="text-amber-400" />
          </div>
          <div>
            <h3 className="font-heading text-base font-semibold text-text">Edit Your Script</h3>
            <p className="text-xs text-text-muted">Review and refine before generating audio</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Script Textarea */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Script</label>
          <textarea
            value={editedScript}
            onChange={(e) => setEditedScript(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 resize-none"
            disabled={loading}
          />
          <p className="text-[10px] text-text-muted mt-1">
            {editedScript.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {/* Voice Selector */}
        <div className="relative">
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Voice</label>
          <div className="flex gap-2">
            <button
              onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
              disabled={loading}
              className="flex-1 flex items-center justify-between rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text hover:border-border-hover focus:border-accent focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <Volume2 size={14} className="text-accent" />
                {selectedVoice.name}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">Irish</span>
              </span>
              <ChevronDown size={14} className={cn("transition-transform", showVoiceDropdown && "rotate-180")} />
            </button>
            <button
              onClick={handlePlaySample}
              disabled={playingSample || loading}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                playingSample
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:border-border-hover hover:text-text"
              )}
            >
              {playingSample ? <Pause size={12} /> : <Play size={12} />}
              Preview
            </button>
          </div>

          {showVoiceDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-card shadow-lg max-h-56 overflow-y-auto"
            >
              {preferredNames.length > 0 && (
                <p className="px-3 py-1.5 text-[10px] text-text-muted uppercase tracking-wider border-b border-border">
                  Recommended for {tone}
                </p>
              )}
              {sortedVoices.map((v, i) => {
                const isRecommended = preferredNames.includes(v.name);
                const isFirst = i === preferredNames.length && preferredNames.length > 0;
                return (
                  <div key={v.id}>
                    {isFirst && (
                      <p className="px-3 py-1.5 text-[10px] text-text-muted uppercase tracking-wider border-t border-border">
                        All Voices
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedVoiceId(v.id);
                        setShowVoiceDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/5 flex items-center justify-between",
                        v.id === selectedVoiceId ? "text-accent bg-accent/5" : "text-text-secondary"
                      )}
                    >
                      <span>
                        {v.name}
                        {isRecommended && (
                          <span className="ml-1.5 text-[10px] text-accent">recommended</span>
                        )}
                      </span>
                      <span className="text-[10px] text-text-muted">{v.gender}</span>
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!editedScript.trim() || loading}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
              editedScript.trim() && !loading
                ? "bg-accent text-bg hover:bg-accent-hover shadow-lg shadow-accent/20"
                : "bg-white/5 text-text-muted cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating Audio...
              </>
            ) : (
              <>
                <Volume2 size={14} />
                Generate Audio
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
