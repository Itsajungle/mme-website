"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type {
  VoiceProfile,
  VoiceSettings,
  GeneratedAudio,
  SoundEffect,
  MusicTrack,
  EngineStatus,
  MixRequest,
  MixResult,
} from "./types";

interface AudioEngineContextType {
  status: EngineStatus;
  refreshStatus: () => Promise<void>;
  // Voice
  getVoices: () => Promise<VoiceProfile[]>;
  generateSpeech: (text: string, voiceId: string, settings?: Partial<VoiceSettings>) => Promise<GeneratedAudio>;
  cloneVoice: (name: string, files: File[], labels?: Record<string, string>) => Promise<VoiceProfile>;
  // SFX
  generateSFX: (prompt: string, durationSeconds: number) => Promise<GeneratedAudio>;
  searchSFX: (query: string, category?: string, limit?: number) => Promise<SoundEffect[]>;
  // Music
  generateMusic: (prompt: string, durationSeconds: number) => Promise<GeneratedAudio>;
  searchMusic: (query: string, mood?: string, sector?: string, limit?: number) => Promise<MusicTrack[]>;
  // Mix
  mixAudio: (request: MixRequest) => Promise<MixResult>;
}

const AudioEngineContext = createContext<AudioEngineContextType | null>(null);

// Mock data for demo mode
const MOCK_VOICES: VoiceProfile[] = [
  { id: "mock-irish-male-1", name: "Conor", description: "Warm, friendly Irish male voice", accent: "Irish (Connacht)", gender: "male", age: "middle-aged", tags: ["irish", "recommended", "warm"], isCloned: false },
  { id: "mock-irish-female-1", name: "Siobhán", description: "Clear, professional Irish female voice", accent: "Irish (Dublin)", gender: "female", age: "young-adult", tags: ["irish", "recommended", "professional"], isCloned: false },
  { id: "mock-irish-male-2", name: "Pádraig", description: "Energetic, youthful Irish male voice", accent: "Irish (Munster)", gender: "male", age: "young-adult", tags: ["irish", "recommended", "energetic"], isCloned: false },
  { id: "mock-british-male-1", name: "James", description: "Authoritative British male voice", accent: "British (RP)", gender: "male", age: "middle-aged", tags: ["british", "authoritative"], isCloned: false },
  { id: "mock-british-female-1", name: "Emma", description: "Warm British female voice", accent: "British (Standard)", gender: "female", age: "young-adult", tags: ["british", "warm"], isCloned: false },
  { id: "mock-american-male-1", name: "Mike", description: "Classic American male voice", accent: "American (General)", gender: "male", age: "middle-aged", tags: ["american"], isCloned: false },
];

const MOCK_SFX: SoundEffect[] = [
  { id: "mock-sfx-1", name: "Car Engine Start", description: "Smooth car engine starting", tags: ["car", "engine", "motoring"], duration: 2.5, previewUrl: "" },
  { id: "mock-sfx-2", name: "Cash Register", description: "Classic cash register ding", tags: ["retail", "shopping"], duration: 1.0, previewUrl: "" },
  { id: "mock-sfx-3", name: "Restaurant Ambience", description: "Warm restaurant background", tags: ["hospitality", "dining"], duration: 5.0, previewUrl: "" },
  { id: "mock-sfx-4", name: "Crowd Cheering", description: "Enthusiastic crowd cheer", tags: ["sport", "crowd"], duration: 3.0, previewUrl: "" },
  { id: "mock-sfx-5", name: "Door Close", description: "Car door closing", tags: ["car", "door"], duration: 1.0, previewUrl: "" },
  { id: "mock-sfx-6", name: "Keys Jingle", description: "Car keys jingling", tags: ["keys", "motoring"], duration: 1.5, previewUrl: "" },
];

const MOCK_MUSIC: MusicTrack[] = [
  { id: "mock-music-1", name: "Feel-Good Driving", artist: "MME Library", duration: 30, tags: ["upbeat", "driving"], mood: "upbeat", streamUrl: "", license: "MME Licensed" },
  { id: "mock-music-2", name: "Morning Sunshine", artist: "MME Library", duration: 30, tags: ["warm", "happy"], mood: "warm", streamUrl: "", license: "MME Licensed" },
  { id: "mock-music-3", name: "Corporate Trust", artist: "MME Library", duration: 30, tags: ["corporate", "professional"], mood: "premium", streamUrl: "", license: "MME Licensed" },
  { id: "mock-music-4", name: "Weekend Vibes", artist: "MME Library", duration: 30, tags: ["relaxed", "acoustic"], mood: "relaxed", streamUrl: "", license: "MME Licensed" },
  { id: "mock-music-5", name: "Action Sports", artist: "MME Library", duration: 30, tags: ["energetic", "dynamic"], mood: "urgent", streamUrl: "", license: "MME Licensed" },
];

async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `API call failed: ${res.status}`);
  }
  return data;
}

export function AudioEngineProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<EngineStatus>({
    voice: "demo",
    music: "demo",
    sfx: "demo",
    mixing: "demo",
  });

  const refreshStatus = useCallback(async () => {
    try {
      const data = await apiCall<{ status: EngineStatus }>("/api/audio/voices?statusOnly=true");
      setStatus(data.status);
    } catch {
      setStatus({ voice: "demo", music: "demo", sfx: "demo", mixing: "demo" });
    }
  }, []);

  const getVoices = useCallback(async (): Promise<VoiceProfile[]> => {
    try {
      const data = await apiCall<{ voices: VoiceProfile[]; status: EngineStatus }>("/api/audio/voices");
      setStatus((prev) => ({ ...prev, voice: data.status.voice }));
      return data.voices;
    } catch {
      return MOCK_VOICES;
    }
  }, []);

  const generateSpeech = useCallback(
    async (text: string, voiceId: string, settings?: Partial<VoiceSettings>): Promise<GeneratedAudio> => {
      return apiCall<GeneratedAudio>("/api/audio/voice-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId, settings }),
      });
    },
    []
  );

  const cloneVoice = useCallback(
    async (name: string, files: File[], labels?: Record<string, string>): Promise<VoiceProfile> => {
      const formData = new FormData();
      formData.append("name", name);
      files.forEach((f) => formData.append("files", f));
      if (labels) formData.append("labels", JSON.stringify(labels));
      return apiCall<VoiceProfile>("/api/audio/voice-clone", {
        method: "POST",
        body: formData,
      });
    },
    []
  );

  const generateSFX = useCallback(
    async (prompt: string, durationSeconds: number): Promise<GeneratedAudio> => {
      return apiCall<GeneratedAudio>("/api/audio/sfx-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, durationSeconds }),
      });
    },
    []
  );

  const searchSFX = useCallback(
    async (query: string, category?: string, limit?: number): Promise<SoundEffect[]> => {
      try {
        const params = new URLSearchParams({ q: query, ...(category && { category }), ...(limit && { limit: String(limit) }) });
        const data = await apiCall<{ results: SoundEffect[]; status: string }>(`/api/audio/sfx-library?${params}`);
        if (data.status === "demo") return MOCK_SFX.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || !query);
        return data.results;
      } catch {
        return MOCK_SFX.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || !query);
      }
    },
    []
  );

  const generateMusic = useCallback(
    async (prompt: string, durationSeconds: number): Promise<GeneratedAudio> => {
      return apiCall<GeneratedAudio>("/api/audio/music-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, durationSeconds }),
      });
    },
    []
  );

  const searchMusic = useCallback(
    async (query: string, mood?: string, sector?: string, limit?: number): Promise<MusicTrack[]> => {
      try {
        const params = new URLSearchParams({
          ...(query && { q: query }),
          ...(mood && { mood }),
          ...(sector && { sector }),
          ...(limit && { limit: String(limit) }),
        });
        const data = await apiCall<{ results: MusicTrack[]; status: string }>(`/api/audio/music-library?${params}`);
        if (data.status === "demo") return MOCK_MUSIC;
        return data.results;
      } catch {
        return MOCK_MUSIC;
      }
    },
    []
  );

  const mixAudio = useCallback(async (request: MixRequest): Promise<MixResult> => {
    return apiCall<MixResult>("/api/audio/mix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  }, []);

  return (
    <AudioEngineContext.Provider
      value={{
        status,
        refreshStatus,
        getVoices,
        generateSpeech,
        cloneVoice,
        generateSFX,
        searchSFX,
        generateMusic,
        searchMusic,
        mixAudio,
      }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudioEngine() {
  const ctx = useContext(AudioEngineContext);
  if (!ctx) {
    throw new Error("useAudioEngine must be used within an AudioEngineProvider");
  }
  return ctx;
}
