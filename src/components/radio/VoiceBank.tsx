"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2,
  Play,
  Pause,
  Upload,
  X,
  Star,
  Search,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngine } from "@/lib/audio-engine/engine-provider";
import type { VoiceProfile, VoiceSettings } from "@/lib/audio-engine/types";

// Irish sample phrases
const IRISH_SAMPLE_PHRASES = [
  "Good morning Meath! Pop into the showroom today.",
  "Sure, there's never been a better time to call in.",
  "This weekend only — don't miss out, it'll be grand.",
  "Just down the road in Ashbourne, we're waiting for you.",
];

const GENERAL_SAMPLE_PHRASES = [
  "Welcome to the show! We've got a great offer for you today.",
  "Don't miss this special weekend event.",
  "Come see us — you won't be disappointed.",
];

interface VoiceBankProps {
  brandName: string;
  selectedVoiceId?: string;
  onSelectVoice: (voice: VoiceProfile) => void;
  onSettingsChange?: (settings: Partial<VoiceSettings>) => void;
}

export function VoiceBank({
  brandName,
  selectedVoiceId,
  onSelectVoice,
  onSettingsChange,
}: VoiceBankProps) {
  const engine = useAudioEngine();
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [previewCache, setPreviewCache] = useState<Record<string, string>>({});
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Voice settings
  const [settings, setSettings] = useState<Partial<VoiceSettings>>({
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.3,
    useSpeakerBoost: true,
    speed: 1.0,
  });

  useEffect(() => {
    loadVoices();
  }, []);

  async function loadVoices() {
    setLoading(true);
    try {
      const voiceList = await engine.getVoices();
      if (voiceList.length === 0) {
        setIsDemo(true);
      }
      setVoices(voiceList);
    } catch {
      setIsDemo(true);
    }
    setLoading(false);
  }

  const handlePreview = useCallback(
    async (voice: VoiceProfile) => {
      if (playingId === voice.id) {
        audioRef.current?.pause();
        setPlayingId(null);
        return;
      }

      // Check cache
      if (previewCache[voice.id]) {
        playAudio(previewCache[voice.id], voice.id);
        return;
      }

      // Generate preview via TTS
      setPlayingId(voice.id);
      setError(null);
      try {
        const isIrish = voice.tags.includes("irish");
        const phrases = isIrish ? IRISH_SAMPLE_PHRASES : GENERAL_SAMPLE_PHRASES;
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];

        const result = await engine.generateSpeech(phrase, voice.id, settings);
        setPreviewCache((prev) => ({ ...prev, [voice.id]: result.url }));
        playAudio(result.url, voice.id);
      } catch (err) {
        setPlayingId(null);
        const msg = err instanceof Error ? err.message : "Voice preview failed";
        setError(msg);
        console.error("[VoiceBank] Preview error:", msg);
      }
    },
    [playingId, previewCache, engine, settings]
  );

  function playAudio(url: string, voiceId: string) {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (!url) {
      setError("No audio URL returned from server");
      setPlayingId(null);
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.onerror = (e) => {
      console.error("[VoiceBank] Audio playback error:", e);
      setError(`Failed to play audio from: ${url}`);
      setPlayingId(null);
    };
    audio.play().catch((err) => {
      console.error("[VoiceBank] Audio play() rejected:", err);
      setError(`Playback blocked: ${err.message}`);
      setPlayingId(null);
    });
    setPlayingId(voiceId);
  }

  function updateSetting(key: keyof VoiceSettings, value: number | boolean) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    onSettingsChange?.(updated);
  }

  // Filter voices
  const filteredVoices = voices.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.accent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split into Irish recommended and others
  const irishVoices = filteredVoices.filter((v) => v.tags.includes("irish"));
  const otherVoices = filteredVoices.filter((v) => !v.tags.includes("irish"));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Mic2 size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-text">
              Voice Bank
            </h2>
            <p className="text-sm text-text-muted">
              {isDemo && (
                <span className="mr-2 inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  Demo Mode
                </span>
              )}
              Select a voice for {brandName}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCloneModal(true)}
          className="flex items-center gap-2 rounded-lg border border-accent/30 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5 transition-colors"
        >
          <Upload size={14} />
          Clone Voice
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search voices by name, accent, or description..."
          className="w-full rounded-lg border border-border bg-bg-input pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <span className="font-medium">Audio Error:</span> {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-300 hover:text-red-200 underline text-xs">dismiss</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-accent" />
          <span className="ml-3 text-sm text-text-muted">Loading voices...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Irish voices — Recommended */}
          {irishVoices.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Star size={14} className="text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Recommended for Sunshine 106.8
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {irishVoices.map((voice) => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    isSelected={selectedVoiceId === voice.id}
                    isPlaying={playingId === voice.id}
                    isDemo={isDemo}
                    onSelect={() => onSelectVoice(voice)}
                    onPreview={() => handlePreview(voice)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other voices */}
          {otherVoices.length > 0 && (
            <div>
              {irishVoices.length > 0 && (
                <div className="mb-3 mt-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    All Voices
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {otherVoices.map((voice) => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    isSelected={selectedVoiceId === voice.id}
                    isPlaying={playingId === voice.id}
                    isDemo={isDemo}
                    onSelect={() => onSelectVoice(voice)}
                    onPreview={() => handlePreview(voice)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredVoices.length === 0 && !loading && (
            <div className="py-12 text-center">
              <Mic2 size={32} className="mx-auto mb-3 text-text-muted" />
              <p className="text-sm text-text-muted">No voices found</p>
            </div>
          )}
        </>
      )}

      {/* Voice Settings (when a voice is selected) */}
      {selectedVoiceId && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-border bg-bg-card p-5"
        >
          <h3 className="mb-4 font-heading text-sm font-bold text-text">
            Voice Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SliderSetting
              label="Stability"
              value={settings.stability ?? 0.5}
              onChange={(v) => updateSetting("stability", v)}
            />
            <SliderSetting
              label="Clarity"
              value={settings.similarityBoost ?? 0.8}
              onChange={(v) => updateSetting("similarityBoost", v)}
            />
            <SliderSetting
              label="Style"
              value={settings.style ?? 0.3}
              onChange={(v) => updateSetting("style", v)}
            />
            <SliderSetting
              label="Speed"
              value={(settings.speed ?? 1.0) / 2}
              onChange={(v) => updateSetting("speed", v * 2)}
              displayValue={`${((settings.speed ?? 1.0) * 100).toFixed(0)}%`}
            />
          </div>
        </motion.div>
      )}

      {/* Clone Voice Modal */}
      <AnimatePresence>
        {showCloneModal && (
          <CloneVoiceModal
            onClose={() => setShowCloneModal(false)}
            onCloned={(voice) => {
              setVoices((prev) => [voice, ...prev]);
              setShowCloneModal(false);
              onSelectVoice(voice);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function VoiceCard({
  voice,
  isSelected,
  isPlaying,
  isDemo,
  onSelect,
  onPreview,
}: {
  voice: VoiceProfile;
  isSelected: boolean;
  isPlaying: boolean;
  isDemo: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className={cn(
        "group cursor-pointer rounded-xl border p-4 transition-all",
        isSelected
          ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(0,255,150,0.08)]"
          : "border-border bg-bg-card hover:border-border-hover"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-text truncate">{voice.name}</h4>
            {voice.isCloned && (
              <span className="rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold text-purple-400">
                Cloned
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-text-muted truncate">{voice.description}</p>
        </div>
        {!isDemo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
              isPlaying
                ? "bg-accent text-bg"
                : "bg-accent/10 text-accent hover:bg-accent/20"
            )}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold",
            voice.tags.includes("irish")
              ? "bg-accent/10 text-accent"
              : voice.tags.includes("british")
              ? "bg-blue-500/10 text-blue-400"
              : "bg-text-muted/10 text-text-muted"
          )}
        >
          {voice.accent}
        </span>
        <span className="text-[10px] text-text-muted capitalize">{voice.gender}</span>
      </div>
    </motion.div>
  );
}

function SliderSetting({
  label,
  value,
  onChange,
  displayValue,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  displayValue?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-text-muted">{label}</span>
        <span className="font-mono text-xs text-text-secondary">
          {displayValue || `${Math.round(value * 100)}%`}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="h-1.5 w-full appearance-none rounded-full bg-bg-deep accent-accent [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
      />
    </div>
  );
}

function CloneVoiceModal({
  onClose,
  onCloned,
}: {
  onClose: () => void;
  onCloned: (voice: VoiceProfile) => void;
}) {
  const engine = useAudioEngine();
  const [name, setName] = useState("");
  const [accent, setAccent] = useState("Irish");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleClone() {
    if (!name || files.length === 0) {
      setError("Please provide a name and at least one audio file.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const voice = await engine.cloneVoice(name, files, { accent, description });
      onCloned(voice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Clone failed");
    }
    setUploading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-bg-primary p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-text">Clone Voice</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Voice Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tadg"
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">Accent</label>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text focus:border-border-focus focus:outline-none"
            >
              <option value="Irish">Irish</option>
              <option value="British">British</option>
              <option value="American">American</option>
              <option value="Australian">Australian</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Warm, friendly tone"
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">
              Audio Samples (.mp3, .wav, .m4a)
            </label>
            <div className="rounded-lg border border-dashed border-border bg-bg-deep p-6 text-center">
              <input
                type="file"
                multiple
                accept=".mp3,.wav,.m4a"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="clone-files"
              />
              <label htmlFor="clone-files" className="cursor-pointer">
                <Upload size={24} className="mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">
                  {files.length > 0
                    ? `${files.length} file(s) selected`
                    : "Click to upload audio samples"}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Minimum 1 minute of clear speech required
                </p>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            onClick={handleClone}
            disabled={uploading}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-bg transition-all hover:bg-accent-hover",
              uploading && "opacity-60 cursor-not-allowed"
            )}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Cloning Voice...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload & Clone
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
