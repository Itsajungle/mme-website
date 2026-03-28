"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  Search,
  Play,
  Pause,
  Plus,
  Upload,
  Loader2,
  Sparkles,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngine } from "@/lib/audio-engine/engine-provider";
import type { SoundEffect, GeneratedAudio } from "@/lib/audio-engine/types";

const CATEGORY_FILTERS = [
  { key: "motoring", label: "Motoring" },
  { key: "hospitality", label: "Hospitality" },
  { key: "retail", label: "Retail" },
  { key: "weather", label: "Weather" },
  { key: "sport", label: "Sport" },
  { key: "nature", label: "Nature" },
  { key: "urban", label: "Urban" },
  { key: "transitions", label: "Transitions" },
];

const SUGGESTED_PROMPTS: Record<string, string[]> = {
  motoring: ["car engine starting", "tyre screech", "car door close", "keys jingle", "honk horn"],
  hospitality: ["sizzling pan", "cork pop", "restaurant ambience", "clinking glasses", "happy diners"],
  retail: ["cash register ding", "shopping bag rustle", "door chime", "crowd murmur"],
  default: ["whoosh transition", "notification chime", "crowd cheering", "applause"],
};

interface SFXBankProps {
  brandName: string;
  sector?: string;
  savedSFX?: SoundEffect[];
  onAddSFX?: (sfx: SoundEffect) => void;
  onAddToTimeline?: (sfx: SoundEffect) => void;
}

export function SFXBank({ brandName, sector, savedSFX = [], onAddSFX, onAddToTimeline }: SFXBankProps) {
  const engine = useAudioEngine();
  const [activeTab, setActiveTab] = useState<"generate" | "library">("generate");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(sector || "");
  const [libraryResults, setLibraryResults] = useState<SoundEffect[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generation state
  const [genPrompt, setGenPrompt] = useState("");
  const [genDuration, setGenDuration] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [generatedSFX, setGeneratedSFX] = useState<GeneratedAudio | null>(null);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const results = await engine.searchSFX(searchQuery, selectedCategory);
      setLibraryResults(results);
    } catch {
      setLibraryResults([]);
    }
    setLoading(false);
  }, [engine, searchQuery, selectedCategory]);

  const handleGenerate = useCallback(async () => {
    if (!genPrompt) return;
    setGenerating(true);
    try {
      const result = await engine.generateSFX(genPrompt, genDuration);
      setGeneratedSFX(result);
    } catch {
      // Failed
    }
    setGenerating(false);
  }, [engine, genPrompt, genDuration]);

  function playSFX(url: string, id: string) {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.play();
    setPlayingId(id);
  }

  const suggestedPrompts = SUGGESTED_PROMPTS[sector || ""] || SUGGESTED_PROMPTS.default;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Volume2 size={20} className="text-amber-400" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-text">SFX Bank</h2>
          <p className="text-sm text-text-muted">Sound effects for {brandName}</p>
        </div>
      </div>

      {/* Brand SFX Section */}
      {savedSFX.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
            Your Brand SFX
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {savedSFX.map((sfx) => (
              <button
                key={sfx.id}
                onClick={() => playSFX(sfx.previewUrl, sfx.id)}
                onDoubleClick={() => onAddToTimeline?.(sfx)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition-colors",
                  playingId === sfx.id
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-border bg-bg-deep text-text-secondary hover:border-border-hover"
                )}
              >
                <Play size={10} className="shrink-0 text-amber-400" />
                <span className="truncate">{sfx.name}</span>
                <span className="ml-auto text-[9px] text-text-muted font-mono">{sfx.duration}s</span>
              </button>
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
          Generate SFX
        </button>
        <button
          onClick={() => setActiveTab("library")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
            activeTab === "library" ? "bg-bg-card text-text shadow-sm" : "text-text-muted hover:text-text"
          )}
        >
          <Library size={14} />
          SFX Library
        </button>
      </div>

      {/* Generate Tab */}
      {activeTab === "generate" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-bg-card p-5">
            <label className="mb-2 block text-sm font-medium text-text">
              Describe the sound effect
            </label>
            <input
              type="text"
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder="e.g. car engine starting, cash register ding"
              className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />

            {/* Suggested prompts */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setGenPrompt(p)}
                  className="rounded-full border border-border px-2.5 py-1 text-[10px] text-text-muted hover:border-amber-500/40 hover:text-amber-400 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="mb-2 block text-xs text-text-muted">
                Duration: {genDuration}s
              </label>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.5}
                value={genDuration}
                onChange={(e) => setGenDuration(Number(e.target.value))}
                className="h-1.5 w-full appearance-none rounded-full bg-bg-deep accent-amber-500 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !genPrompt}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-amber-400",
                (generating || !genPrompt) && "opacity-60 cursor-not-allowed"
              )}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating SFX...
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
          {generatedSFX && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => playSFX(generatedSFX.url, "generated-sfx")}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                    playingId === "generated-sfx"
                      ? "bg-amber-500 text-black"
                      : "bg-amber-500/20 text-amber-400"
                  )}
                >
                  {playingId === "generated-sfx" ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">Generated SFX</p>
                  <p className="text-xs text-text-muted">{genDuration}s &middot; {genPrompt}</p>
                </div>
                <button
                  onClick={() =>
                    onAddSFX?.({
                      id: `gen-sfx-${Date.now()}`,
                      name: genPrompt,
                      description: `Generated: ${genPrompt}`,
                      tags: [],
                      duration: genDuration,
                      previewUrl: generatedSFX.url,
                    })
                  }
                  className="flex items-center gap-1 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search sound effects..."
                className="w-full rounded-lg border border-border bg-bg-input pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-amber-400 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(selectedCategory === c.key ? "" : c.key)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  selectedCategory === c.key
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "border border-border text-text-muted hover:border-border-hover"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-amber-400" />
              <span className="ml-2 text-sm text-text-muted">Searching...</span>
            </div>
          )}

          {!loading && libraryResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {libraryResults.map((sfx) => (
                <motion.button
                  key={sfx.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => playSFX(sfx.previewUrl, sfx.id)}
                  onDoubleClick={() => onAddToTimeline?.(sfx)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-left transition-all group",
                    playingId === sfx.id
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-border bg-bg-card hover:border-border-hover"
                  )}
                >
                  <Play size={12} className="shrink-0 text-amber-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text truncate">{sfx.name}</p>
                    <p className="text-[10px] text-text-muted font-mono">{sfx.duration}s</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSFX?.(sfx);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-amber-400 hover:text-amber-300 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </motion.button>
              ))}
            </div>
          )}

          {!loading && libraryResults.length === 0 && (
            <div className="py-8 text-center">
              <Volume2 size={28} className="mx-auto mb-2 text-text-muted" />
              <p className="text-sm text-text-muted">Search the SFX library</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
