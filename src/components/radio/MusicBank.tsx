"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Music,
  Search,
  Play,
  Pause,
  Plus,
  Upload,
  Loader2,
  Sparkles,
  Library,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngine } from "@/lib/audio-engine/engine-provider";
import type { MusicTrack, GeneratedAudio } from "@/lib/audio-engine/types";

const MOOD_FILTERS = [
  { key: "upbeat", label: "Upbeat" },
  { key: "urgent", label: "Urgent" },
  { key: "relaxed", label: "Relaxed" },
  { key: "premium", label: "Premium" },
  { key: "dramatic", label: "Dramatic" },
  { key: "warm", label: "Warm" },
  { key: "festive", label: "Festive" },
];

const SECTOR_FILTERS = [
  { key: "motoring", label: "Motoring" },
  { key: "hospitality", label: "Hospitality" },
  { key: "financial", label: "Financial" },
  { key: "retail", label: "Retail" },
  { key: "sport", label: "Sport" },
];

const DURATION_PRESETS = [
  { seconds: 8, label: "8s Jingle" },
  { seconds: 15, label: "15s" },
  { seconds: 30, label: "30s" },
  { seconds: 60, label: "60s" },
];

interface MusicBankProps {
  brandName: string;
  savedTracks?: MusicTrack[];
  onAddTrack?: (track: MusicTrack) => void;
}

export function MusicBank({ brandName, savedTracks = [], onAddTrack }: MusicBankProps) {
  const engine = useAudioEngine();
  const [activeTab, setActiveTab] = useState<"generate" | "library">("generate");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [libraryResults, setLibraryResults] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generation state
  const [genPrompt, setGenPrompt] = useState("");
  const [genDuration, setGenDuration] = useState(30);
  const [generating, setGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedAudio | null>(null);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const results = await engine.searchMusic(searchQuery, selectedMood, selectedSector);
      setLibraryResults(results);
    } catch {
      setLibraryResults([]);
    }
    setLoading(false);
  }, [engine, searchQuery, selectedMood, selectedSector]);

  const handleGenerate = useCallback(async () => {
    if (!genPrompt) return;
    setGenerating(true);
    try {
      const result = await engine.generateMusic(genPrompt, genDuration);
      setGeneratedTrack(result);
    } catch {
      // Generation failed — handled by UI
    }
    setGenerating(false);
  }, [engine, genPrompt, genDuration]);

  function playTrack(url: string, id: string) {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (!url) {
      setError("No audio URL available for this track");
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    setError(null);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => {
      setError(`Failed to load audio: ${url}`);
      setPlayingId(null);
    };
    audio.play().catch((err) => {
      setError(`Playback failed: ${err.message}`);
      setPlayingId(null);
    });
    setPlayingId(id);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Music size={20} className="text-blue-400" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-text">Music Bank</h2>
          <p className="text-sm text-text-muted">Browse and generate music for {brandName}</p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <span className="font-medium">Audio Error:</span> {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-300 hover:text-red-200 underline text-xs">dismiss</button>
        </div>
      )}

      {/* Brand Music Section */}
      {savedTracks.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
            Your Brand Music
          </h3>
          <div className="space-y-2">
            {savedTracks.map((track, i) => (
              <div key={track.id} className="flex items-center gap-3 rounded-lg border border-border bg-bg-deep px-3 py-2">
                <GripVertical size={14} className="text-text-muted cursor-grab" />
                <button
                  onClick={() => playTrack(track.streamUrl, track.id)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                    playingId === track.id ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-400"
                  )}
                >
                  {playingId === track.id ? <Pause size={10} /> : <Play size={10} className="ml-0.5" />}
                </button>
                <span className="flex-1 text-sm text-text-secondary truncate">{track.name}</span>
                <span className="text-xs text-text-muted font-mono">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-lg border border-border bg-bg-deep p-1">
        <button
          onClick={() => setActiveTab("generate")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
            activeTab === "generate" ? "bg-bg-card text-text shadow-sm" : "text-text-muted hover:text-text"
          )}
        >
          <Sparkles size={14} />
          Generate Music
        </button>
        <button
          onClick={() => setActiveTab("library")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
            activeTab === "library" ? "bg-bg-card text-text shadow-sm" : "text-text-muted hover:text-text"
          )}
        >
          <Library size={14} />
          Music Library
        </button>
      </div>

      {/* Generate Tab */}
      {activeTab === "generate" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-bg-card p-5">
            <label className="mb-2 block text-sm font-medium text-text">
              Describe the music you want
            </label>
            <textarea
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder="e.g. Upbeat feel-good jingle for a car dealership, bright and energetic with a memorable melody"
              rows={3}
              className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none resize-none"
            />

            <div className="mt-3">
              <label className="mb-2 block text-xs text-text-muted">Duration</label>
              <div className="flex gap-2">
                {DURATION_PRESETS.map((d) => (
                  <button
                    key={d.seconds}
                    onClick={() => setGenDuration(d.seconds)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      genDuration === d.seconds
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-border text-text-muted hover:border-border-hover"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !genPrompt}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600",
                (generating || !genPrompt) && "opacity-60 cursor-not-allowed"
              )}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating Music...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate
                </>
              )}
            </button>
          </div>

          {/* Generated result */}
          {generatedTrack && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => playTrack(generatedTrack.url, "generated")}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                    playingId === "generated" ? "bg-blue-500 text-white" : "bg-blue-500/20 text-blue-400"
                  )}
                >
                  {playingId === "generated" ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">Generated Track</p>
                  <p className="text-xs text-text-muted">{genDuration}s &middot; {generatedTrack.format}</p>
                </div>
                <button
                  onClick={() =>
                    onAddTrack?.({
                      id: `gen-${Date.now()}`,
                      name: `Generated: ${genPrompt.slice(0, 30)}...`,
                      artist: "MME Generated",
                      duration: genDuration,
                      tags: [],
                      mood: "custom",
                      streamUrl: generatedTrack.url,
                      license: "MME Generated",
                    })
                  }
                  className="flex items-center gap-1 rounded-lg border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Plus size={12} />
                  Save to Brand Kit
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Library Tab */}
      {activeTab === "library" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search music..."
                className="w-full rounded-lg border border-border bg-bg-input pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Mood Filters */}
          <div>
            <span className="mb-2 block text-xs text-text-muted">Mood</span>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_FILTERS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setSelectedMood(selectedMood === m.key ? "" : m.key);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all",
                    selectedMood === m.key
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      : "border border-border text-text-muted hover:border-border-hover"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Filters */}
          <div>
            <span className="mb-2 block text-xs text-text-muted">Sector</span>
            <div className="flex flex-wrap gap-1.5">
              {SECTOR_FILTERS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    setSelectedSector(selectedSector === s.key ? "" : s.key);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all",
                    selectedSector === s.key
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      : "border border-border text-text-muted hover:border-border-hover"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-blue-400" />
              <span className="ml-2 text-sm text-text-muted">Searching...</span>
            </div>
          )}

          {!loading && libraryResults.length > 0 && (
            <div className="space-y-2">
              {libraryResults.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-bg-card p-3 group hover:border-border-hover transition-colors"
                >
                  <button
                    onClick={() => playTrack(track.streamUrl, track.id)}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                      playingId === track.id ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                    )}
                  >
                    {playingId === track.id ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{track.name}</p>
                    <p className="text-xs text-text-muted truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {track.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-bg-deep px-2 py-0.5 text-[9px] text-text-muted">
                        {tag}
                      </span>
                    ))}
                    <span className="font-mono text-xs text-text-muted">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => onAddTrack?.(track)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 rounded-lg border border-blue-500/30 px-2 py-1 text-[10px] font-medium text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Plus size={10} />
                      Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && libraryResults.length === 0 && (
            <div className="py-8 text-center">
              <Music size={28} className="mx-auto mb-2 text-text-muted" />
              <p className="text-sm text-text-muted">Search the music library to find tracks</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
