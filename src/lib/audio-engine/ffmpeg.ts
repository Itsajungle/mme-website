// Server-side ffmpeg helpers for the studio: probing, cleaning and rendering.
// Everything here runs inside the Next.js server (Node runtime) only.

import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";

const execFileAsync = promisify(execFile);

export const AUDIO_DIR = "/tmp/mme-audio";

export async function ensureAudioDir(): Promise<string> {
  await mkdir(AUDIO_DIR, { recursive: true });
  return AUDIO_DIR;
}

export async function hasFfmpeg(): Promise<boolean> {
  try {
    await execFileAsync("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

/** Duration in seconds, or null if it can't be read. */
export async function probeDuration(filePath: string): Promise<number | null> {
  try {
    const { stdout } = await execFileAsync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", filePath],
      { timeout: 15000 }
    );
    const d = parseFloat(stdout.trim());
    return Number.isFinite(d) ? d : null;
  } catch {
    return null;
  }
}

/**
 * Re-encode any audio file to a clean 44.1kHz stereo MP3 with ALL metadata removed
 * (no encoder tags, titles or vendor IDs survive). Returns the new file name.
 */
export async function cleanToMp3(inputPath: string, prefix: string): Promise<{ filename: string; path: string; duration: number | null }> {
  const dir = await ensureAudioDir();
  const filename = `${prefix}-${randomUUID().slice(0, 8)}.mp3`;
  const out = join(dir, filename);
  await execFileAsync(
    "ffmpeg",
    [
      "-y", "-i", inputPath,
      "-map", "0:a:0",
      "-map_metadata", "-1",
      "-fflags", "+bitexact", "-flags:a", "+bitexact",
      "-id3v2_version", "0", "-write_xing", "0",
      "-ac", "2", "-ar", "44100",
      "-c:a", "libmp3lame", "-b:a", "192k",
      out,
    ],
    { timeout: 120000 }
  );
  return { filename, path: out, duration: await probeDuration(out) };
}

/** Save raw bytes, then clean them. The raw temp file is removed. */
export async function saveCleanAudio(bytes: ArrayBuffer | Buffer, prefix: string, ext = "bin") {
  const dir = await ensureAudioDir();
  const tmp = join(dir, `raw-${randomUUID().slice(0, 8)}.${ext}`);
  await writeFile(tmp, Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes));
  try {
    return await cleanToMp3(tmp, prefix);
  } finally {
    unlink(tmp).catch(() => {});
  }
}

/** Resolve a studio audio URL (our /api/audio/serve links, /public paths or http) to a local file. */
export async function resolveAudioUrl(audioUrl: string): Promise<string> {
  const dir = await ensureAudioDir();
  if (audioUrl.startsWith("/api/audio/serve")) {
    const file = new URL(audioUrl, "http://localhost").searchParams.get("file") || "";
    const safe = file.replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safe || safe !== file) throw new Error("Invalid audio reference");
    return join(dir, safe);
  }
  if (audioUrl.startsWith("/")) {
    const clean = audioUrl.split("?")[0];
    if (clean.includes("..")) throw new Error("Invalid audio reference");
    return join(process.cwd(), "public", clean);
  }
  if (/^https?:\/\//.test(audioUrl)) {
    const res = await fetch(audioUrl);
    if (!res.ok) throw new Error(`Could not fetch audio (${res.status})`);
    const tmp = join(dir, `fetch-${randomUUID().slice(0, 8)}.audio`);
    await writeFile(tmp, Buffer.from(await res.arrayBuffer()));
    return tmp;
  }
  throw new Error("Unsupported audio reference");
}

// ───────────────────────────── Studio render ─────────────────────────────

export type ClipFx = "none" | "telephone" | "radio" | "megaphone" | "room" | "hall" | "echo" | "warm" | "bright";

export interface RenderClip {
  audioUrl: string;
  track: string;          // track id, e.g. "voice-1"
  role: "voice" | "music" | "bed" | "jingle" | "sfx";
  start: number;          // position on the timeline (s)
  offset: number;         // trim from the start of the source (s)
  duration: number;       // length used (s)
  gain: number;           // 0..2 (1 = unity)
  fadeIn: number;         // s
  fadeOut: number;        // s
  fx?: ClipFx;
  muted?: boolean;
}

export interface RenderTrack {
  id: string;
  gain: number;           // 0..2
  muted?: boolean;
  duckUnderVoice?: boolean; // sidechain-duck this track whenever any voice track plays
  duckDepth?: number;       // 0..1 how far to duck (0.7 = -10dB-ish)
}

export interface RenderRequest {
  clips: RenderClip[];
  tracks: RenderTrack[];
  totalDuration: number;
  loudness?: number;          // LUFS target, default -16 (broadcast spots typically -16..-23)
  formats?: ("mp3" | "wav")[];
  name?: string;              // neutral base name for the file
}

function fxFilter(fx: ClipFx | undefined): string {
  switch (fx) {
    case "telephone": return "highpass=f=400,lowpass=f=3200,acompressor=threshold=-20dB:ratio=4,volume=1.4";
    case "radio": return "highpass=f=250,lowpass=f=5000,acompressor=threshold=-18dB:ratio=3";
    case "megaphone": return "highpass=f=700,lowpass=f=2800,acrusher=bits=10:mix=0.25,volume=1.3";
    case "room": return "aecho=0.8:0.6:25|45:0.25|0.15";
    case "hall": return "aecho=0.8:0.7:60|120|180:0.35|0.25|0.15";
    case "echo": return "aecho=0.8:0.7:300|600:0.35|0.18";
    case "warm": return "equalizer=f=180:t=q:w=1:g=3,equalizer=f=6000:t=q:w=1:g=-2";
    case "bright": return "equalizer=f=4500:t=q:w=1:g=3,highpass=f=80";
    default: return "";
  }
}

const n = (v: number) => (Math.round(v * 1000) / 1000).toString();

/**
 * Build the ffmpeg arguments for a multitrack render. Voice tracks are summed into a
 * sidechain key so music/bed/jingle tracks can duck smoothly under speech.
 */
export function buildRenderArgs(req: RenderRequest, files: string[], outPath: string, outFmt: "mp3" | "wav"): string[] {
  const total = Math.max(1, Math.min(req.totalDuration, 180));
  const trackById = new Map(req.tracks.map((t) => [t.id, t]));
  const filters: string[] = [];
  const perTrack = new Map<string, string[]>();

  req.clips.forEach((clip, i) => {
    const tr = trackById.get(clip.track);
    if (clip.muted || tr?.muted) return;
    const dur = Math.max(0.05, clip.duration);
    const chain: string[] = [
      `atrim=start=${n(Math.max(0, clip.offset))}:duration=${n(dur)}`,
      "asetpts=PTS-STARTPTS",
      "aformat=sample_rates=44100:channel_layouts=stereo",
    ];
    const fx = fxFilter(clip.fx);
    if (fx) chain.push(fx);
    if (clip.fadeIn > 0) chain.push(`afade=t=in:st=0:d=${n(Math.min(clip.fadeIn, dur))}`);
    if (clip.fadeOut > 0) chain.push(`afade=t=out:st=${n(Math.max(0, dur - clip.fadeOut))}:d=${n(Math.min(clip.fadeOut, dur))}`);
    chain.push(`volume=${n(Math.max(0, clip.gain))}`);
    const delay = Math.round(Math.max(0, clip.start) * 1000);
    chain.push(`adelay=${delay}|${delay}`, `apad=whole_dur=${n(total)}`, `atrim=duration=${n(total)}`);
    filters.push(`[${i}:a]${chain.join(",")}[c${i}]`);
    const list = perTrack.get(clip.track) || [];
    list.push(`[c${i}]`);
    perTrack.set(clip.track, list);
  });

  if (perTrack.size === 0) throw new Error("Nothing to render — every clip is muted");

  // Sum clips per track, apply track gain.
  const trackOut: { id: string; label: string; role: "voice" | "other"; duck: boolean; depth: number }[] = [];
  for (const [id, labels] of perTrack) {
    const tr = trackById.get(id);
    const lbl = `t_${id.replace(/[^a-zA-Z0-9]/g, "")}`;
    const sum = labels.length > 1 ? `${labels.join("")}amix=inputs=${labels.length}:normalize=0:duration=longest,` : `${labels[0]}`;
    filters.push(labels.length > 1 ? `${sum}volume=${n(tr?.gain ?? 1)}[${lbl}]` : `${labels[0]}volume=${n(tr?.gain ?? 1)}[${lbl}]`);
    const isVoice = req.clips.some((c) => c.track === id && c.role === "voice");
    trackOut.push({ id, label: lbl, role: isVoice ? "voice" : "other", duck: !!tr?.duckUnderVoice, depth: tr?.duckDepth ?? 0.7 });
  }

  const voices = trackOut.filter((t) => t.role === "voice");
  const finalLabels: string[] = [];

  if (voices.length && trackOut.some((t) => t.duck && t.role !== "voice")) {
    // Build a voice key: sum voices, split into "to mix" + "key" copies
    const vSum = voices.length > 1 ? `${voices.map((v) => `[${v.label}]`).join("")}amix=inputs=${voices.length}:normalize=0` : `[${voices[0].label}]anull`;
    const duckers = trackOut.filter((t) => t.duck && t.role !== "voice");
    filters.push(`${vSum},asplit=${duckers.length + 1}[vmix]${duckers.map((_, k) => `[vkey${k}]`).join("")}`);
    finalLabels.push("[vmix]");
    duckers.forEach((d, k) => {
      // ratio from depth: 0.7 depth ~ ratio 8 with low threshold
      const ratio = Math.max(2, Math.min(20, Math.round(2 + d.depth * 12)));
      filters.push(`[${d.label}][vkey${k}]sidechaincompress=threshold=0.02:ratio=${ratio}:attack=40:release=450:makeup=1[d${k}]`);
      finalLabels.push(`[d${k}]`);
    });
    trackOut.filter((t) => !t.duck && t.role !== "voice").forEach((t) => finalLabels.push(`[${t.label}]`));
  } else {
    trackOut.forEach((t) => finalLabels.push(`[${t.label}]`));
  }

  // Pre-master: sum everything, trim to length. Loudness is applied afterwards in two passes.
  const master = `${finalLabels.join("")}amix=inputs=${finalLabels.length}:normalize=0:duration=longest,` +
    `atrim=duration=${n(total)}[out]`;
  filters.push(master);
  void outFmt;

  const args = ["-y"];
  files.forEach((f) => args.push("-i", f));
  args.push("-filter_complex", filters.join(";"), "-map", "[out]", "-map_metadata", "-1", "-c:a", "pcm_f32le", "-ar", "48000");
  args.push(outPath);
  return args;
}

/** Two-pass EBU R128 loudness normalisation with a true-peak ceiling. */
async function masterLoudness(input: string, output: string, lufs: number, fmt: "mp3" | "wav") {
  const target = `I=${lufs}:TP=-1.0:LRA=11`;
  const { stderr } = await execFileAsync("ffmpeg", ["-hide_banner", "-i", input, "-af", `loudnorm=${target}:print_format=json`, "-f", "null", "-"], { timeout: 120000, maxBuffer: 10 * 1024 * 1024 });
  const json = stderr.slice(stderr.lastIndexOf("{"), stderr.lastIndexOf("}") + 1);
  let second = `loudnorm=${target}`;
  try {
    const m = JSON.parse(json);
    second = `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  } catch { /* fall back to single pass */ }
  const args = ["-y", "-i", input, "-af", `${second},alimiter=limit=0.89:level=false`, "-map_metadata", "-1"];
  if (fmt === "mp3") args.push("-ar", "44100", "-c:a", "libmp3lame", "-b:a", "320k", "-id3v2_version", "0");
  else args.push("-ar", "48000", "-c:a", "pcm_s24le");
  args.push(output);
  await execFileAsync("ffmpeg", args, { timeout: 120000, maxBuffer: 10 * 1024 * 1024 });
}

export async function renderStudio(req: RenderRequest): Promise<{ mp3Url?: string; wavUrl?: string; duration: number }> {
  const dir = await ensureAudioDir();
  const active = req.clips.filter((c) => c.audioUrl);
  const files = await Promise.all(active.map((c) => resolveAudioUrl(c.audioUrl)));
  const base = (req.name || "radio-ad").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "radio-ad";
  const id = randomUUID().slice(0, 6);
  const formats: ("mp3" | "wav")[] = req.formats?.length ? req.formats : ["mp3"];
  const out: { mp3Url?: string; wavUrl?: string; duration: number } = { duration: req.totalDuration };
  const premaster = join(dir, `pre-${id}.wav`);
  await execFileAsync("ffmpeg", buildRenderArgs({ ...req, clips: active }, files, premaster, "wav"), { timeout: 120000, maxBuffer: 10 * 1024 * 1024 });
  const lufs = Math.max(-30, Math.min(-9, req.loudness ?? -16));
  try {
    for (const fmt of formats) {
      const filename = `${base}-${id}.${fmt}`;
      await masterLoudness(premaster, join(dir, filename), lufs, fmt);
      if (fmt === "mp3") out.mp3Url = `/api/audio/serve?file=${filename}`;
      else out.wavUrl = `/api/audio/serve?file=${filename}`;
    }
  } finally {
    unlink(premaster).catch(() => {});
  }
  return out;
}
