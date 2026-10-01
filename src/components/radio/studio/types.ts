export type TrackRole = "voice" | "jingle" | "bed" | "sfx";

export type ClipFx = "none" | "telephone" | "radio" | "megaphone" | "room" | "hall" | "echo" | "warm" | "bright";

export const FX_OPTIONS: { key: ClipFx; label: string; hint: string }[] = [
  { key: "none", label: "Clean", hint: "No effect" },
  { key: "telephone", label: "Telephone", hint: "Narrow band, like a phone call" },
  { key: "radio", label: "Old radio", hint: "Boxy, small-speaker sound" },
  { key: "megaphone", label: "Megaphone / tannoy", hint: "Harsh, gritty PA" },
  { key: "room", label: "Small room", hint: "Short natural room" },
  { key: "hall", label: "Big hall", hint: "Large, spacious reverb" },
  { key: "echo", label: "Echo", hint: "Distinct repeats" },
  { key: "warm", label: "Warm EQ", hint: "Fuller low end, softer top" },
  { key: "bright", label: "Bright EQ", hint: "Crisper, more presence" },
];

export interface StudioTrack {
  id: string;
  name: string;
  role: TrackRole;
  gain: number;      // linear 0..2
  muted: boolean;
  solo: boolean;
  duck: boolean;     // duck under voice (music-type tracks)
}

export interface StudioClip {
  id: string;
  trackId: string;
  name: string;
  url: string;
  sourceDuration: number; // full length of the source file (s)
  start: number;          // timeline position (s)
  offset: number;         // trimmed from the start of source (s)
  duration: number;       // playing length (s)
  gain: number;           // linear 0..2
  fadeIn: number;
  fadeOut: number;
  fx: ClipFx;
}

export interface StudioState {
  tracks: StudioTrack[];
  clips: StudioClip[];
  length: number; // target ad length in seconds
}

export const ROLE_STYLE: Record<TrackRole, { label: string; clip: string; border: string; dot: string }> = {
  voice: { label: "Voice", clip: "bg-accent/25", border: "border-accent", dot: "bg-accent" },
  jingle: { label: "Jingle", clip: "bg-fuchsia-500/25", border: "border-fuchsia-400", dot: "bg-fuchsia-400" },
  bed: { label: "Music bed", clip: "bg-blue-500/25", border: "border-blue-400", dot: "bg-blue-400" },
  sfx: { label: "SFX", clip: "bg-amber-500/25", border: "border-amber-400", dot: "bg-amber-400" },
};

export function defaultTracks(): StudioTrack[] {
  return [
    { id: "voice-1", name: "Voice 1", role: "voice", gain: 1, muted: false, solo: false, duck: false },
    { id: "voice-2", name: "Voice 2", role: "voice", gain: 1, muted: false, solo: false, duck: false },
    { id: "jingle", name: "Jingle", role: "jingle", gain: 1, muted: false, solo: false, duck: false },
    { id: "bed", name: "Music bed", role: "bed", gain: 0.6, muted: false, solo: false, duck: true },
    { id: "sfx-1", name: "SFX 1", role: "sfx", gain: 1, muted: false, solo: false, duck: false },
    { id: "sfx-2", name: "SFX 2", role: "sfx", gain: 1, muted: false, solo: false, duck: false },
  ];
}

export const uid = (p = "c") => `${p}-${Math.random().toString(36).slice(2, 9)}`;

export const toDb = (g: number) => (g <= 0.0001 ? -60 : 20 * Math.log10(g));
export const fromDb = (db: number) => (db <= -60 ? 0 : Math.pow(10, db / 20));

export function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, "0")}`;
}
