// Audio Engine type definitions

export interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  accent: string;
  gender: "male" | "female" | "neutral";
  age: string;
  previewUrl?: string;
  isCloned?: boolean;
  tags: string[];
}

export interface VoiceSettings {
  stability: number; // 0-1
  similarityBoost: number; // 0-1
  style: number; // 0-1
  useSpeakerBoost: boolean;
  speed: number; // 0.5-2.0
}

export interface GeneratedAudio {
  url: string;
  duration: number;
  format: string;
  filename: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  description: string;
  tags: string[];
  duration: number;
  previewUrl: string;
  downloadUrl?: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  duration: number;
  tags: string[];
  mood: string;
  streamUrl: string;
  downloadUrl?: string;
  license: string;
}

export interface MixSegment {
  audioUrl: string;
  startTime: number;
  duration: number;
  volume: number; // 0-100
  track: "voice" | "music" | "sfx";
  ducking?: {
    underVoice: boolean;
    duckLevel: number; // 0-100
    fadeMs: number;
  };
}

export interface MixRequest {
  segments: MixSegment[];
  totalDuration: number;
  loudnessTarget: number; // LUFS, e.g. -23
  outputFormat: "wav" | "mp3" | "both";
}

export interface MixResult {
  wavUrl?: string;
  mp3Url?: string;
  loudness: number;
  duration: number;
}

export interface EngineStatus {
  voice: "live" | "demo";
  music: "live" | "demo";
  sfx: "live" | "demo";
  mixing: "live" | "demo";
}

export interface AudioEngine {
  getVoices(): Promise<VoiceProfile[]>;
  generateSpeech(text: string, voiceId: string, settings?: Partial<VoiceSettings>): Promise<GeneratedAudio>;
  cloneVoice(name: string, files: File[], labels?: Record<string, string>): Promise<VoiceProfile>;
  generateSFX(prompt: string, durationSeconds: number): Promise<GeneratedAudio>;
  searchSFX(query: string, limit?: number): Promise<SoundEffect[]>;
  generateMusic(prompt: string, durationSeconds: number): Promise<GeneratedAudio>;
  searchMusic(query: string, mood?: string, sector?: string, limit?: number): Promise<MusicTrack[]>;
  getStatus(): EngineStatus;
}
