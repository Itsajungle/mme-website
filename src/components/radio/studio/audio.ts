"use client";

// Web Audio helpers for the studio: decoding, waveform peaks, live FX preview and playback.
import type { ClipFx, StudioClip, StudioTrack } from "./types";

let ctxSingleton: AudioContext | null = null;
export function getCtx(): AudioContext {
  if (!ctxSingleton) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctxSingleton = new AC();
  }
  return ctxSingleton;
}

const bufferCache = new Map<string, Promise<AudioBuffer>>();
export function loadBuffer(url: string): Promise<AudioBuffer> {
  let p = bufferCache.get(url);
  if (!p) {
    p = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Audio not available (${r.status})`);
        return r.arrayBuffer();
      })
      .then((ab) => getCtx().decodeAudioData(ab));
    p.catch(() => bufferCache.delete(url));
    bufferCache.set(url, p);
  }
  return p;
}

const peaksCache = new Map<string, Float32Array>();
/** Max-abs peaks at a fixed resolution of 200 points per second of source. */
export async function getPeaks(url: string): Promise<{ peaks: Float32Array; perSecond: number }> {
  const perSecond = 200;
  const cached = peaksCache.get(url);
  if (cached) return { peaks: cached, perSecond };
  const buf = await loadBuffer(url);
  const total = Math.max(1, Math.ceil(buf.duration * perSecond));
  const peaks = new Float32Array(total);
  const step = buf.sampleRate / perSecond;
  for (let ch = 0; ch < Math.min(2, buf.numberOfChannels); ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < total; i++) {
      const a = Math.floor(i * step);
      const b = Math.min(data.length, Math.floor((i + 1) * step));
      let m = 0;
      for (let j = a; j < b; j += 4) {
        const v = Math.abs(data[j]);
        if (v > m) m = v;
      }
      if (m > peaks[i]) peaks[i] = m;
    }
  }
  peaksCache.set(url, peaks);
  return { peaks, perSecond };
}

let impulseCache: Record<string, AudioBuffer> = {};
function impulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const key = `${seconds}-${decay}-${ctx.sampleRate}`;
  if (impulseCache[key]) return impulseCache[key];
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  impulseCache = { ...impulseCache, [key]: buf };
  return buf;
}

/** Build a preview FX chain. Returns [input, output]. Mirrors the server render roughly. */
function buildFx(ctx: AudioContext, fx: ClipFx): [AudioNode, AudioNode] {
  const bq = (type: BiquadFilterType, f: number, q = 0.7, gain = 0) => {
    const b = ctx.createBiquadFilter();
    b.type = type;
    b.frequency.value = f;
    b.Q.value = q;
    b.gain.value = gain;
    return b;
  };
  const chain = (...nodes: AudioNode[]): [AudioNode, AudioNode] => {
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]);
    return [nodes[0], nodes[nodes.length - 1]];
  };
  switch (fx) {
    case "telephone": return chain(bq("highpass", 400), bq("lowpass", 3200), ctx.createDynamicsCompressor());
    case "radio": return chain(bq("highpass", 250), bq("lowpass", 5000), ctx.createDynamicsCompressor());
    case "megaphone": {
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) { const x = (i / 128) - 1; curve[i] = Math.tanh(x * 3); }
      shaper.curve = curve;
      return chain(bq("highpass", 700), bq("lowpass", 2800), shaper);
    }
    case "warm": return chain(bq("peaking", 180, 1, 3), bq("peaking", 6000, 1, -2));
    case "bright": return chain(bq("highpass", 80), bq("peaking", 4500, 1, 3));
    case "room":
    case "hall":
    case "echo": {
      const input = ctx.createGain();
      const out = ctx.createGain();
      const dry = ctx.createGain();
      const wet = ctx.createGain();
      input.connect(dry).connect(out);
      if (fx === "echo") {
        const d = ctx.createDelay(2);
        d.delayTime.value = 0.3;
        const fb = ctx.createGain();
        fb.gain.value = 0.35;
        input.connect(d);
        d.connect(fb).connect(d);
        d.connect(wet);
        wet.gain.value = 0.5;
      } else {
        const conv = ctx.createConvolver();
        conv.buffer = fx === "room" ? impulse(ctx, 0.4, 3) : impulse(ctx, 2.2, 2.5);
        input.connect(conv).connect(wet);
        wet.gain.value = fx === "room" ? 0.3 : 0.45;
      }
      wet.connect(out);
      return [input, out];
    }
    default: {
      const g = ctx.createGain();
      return [g, g];
    }
  }
}

export interface Playback {
  stop: () => void;
  startedAt: number;   // ctx time when timeline position `from` played
  from: number;
}

/** Schedule every clip on the timeline from position `from` (seconds). */
export async function play(
  tracks: StudioTrack[],
  clips: StudioClip[],
  from: number,
  until: number
): Promise<Playback> {
  const ctx = getCtx();
  if (ctx.state === "suspended") await ctx.resume();
  const anySolo = tracks.some((t) => t.solo);
  const audible = (t?: StudioTrack) => !!t && !t.muted && (!anySolo || t.solo);

  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  // Voice activity windows for preview ducking
  const voiceWindows = clips
    .filter((c) => tracks.find((t) => t.id === c.trackId)?.role === "voice" && audible(tracks.find((t) => t.id === c.trackId)))
    .map((c) => [c.start, c.start + c.duration] as const)
    .sort((a, b) => a[0] - b[0]);

  const buffers = await Promise.all(clips.map((c) => loadBuffer(c.url).catch(() => null)));
  const t0 = ctx.currentTime + 0.08;
  const sources: AudioBufferSourceNode[] = [];
  const trackNodes = new Map<string, GainNode>();

  for (const t of tracks) {
    const g = ctx.createGain();
    g.gain.value = audible(t) ? t.gain : 0;
    g.connect(master);
    trackNodes.set(t.id, g);
    if (t.duck && audible(t)) {
      // Automate ducking around voice windows (preview only — the export uses a proper sidechain)
      const depth = 0.3;
      for (const [s, e] of voiceWindows) {
        if (e < from) continue;
        const a = t0 + Math.max(0, s - from);
        const b = t0 + Math.max(0, e - from);
        g.gain.setTargetAtTime(t.gain * depth, Math.max(t0, a - 0.05), 0.08);
        g.gain.setTargetAtTime(t.gain, b, 0.25);
      }
    }
  }

  clips.forEach((clip, i) => {
    const buf = buffers[i];
    const tn = trackNodes.get(clip.trackId);
    if (!buf || !tn) return;
    const clipEnd = clip.start + clip.duration;
    if (clipEnd <= from || clip.start >= until) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    const [fxIn, fxOut] = buildFx(ctx, clip.fx);
    src.connect(fxIn);
    fxOut.connect(g).connect(tn);

    const skip = Math.max(0, from - clip.start);       // part of clip already passed
    const when = t0 + Math.max(0, clip.start - from);
    const playLen = Math.min(clip.duration - skip, until - Math.max(clip.start, from));
    if (playLen <= 0) return;

    // Gain envelope with fades, in absolute ctx time
    const clipT0 = when - skip; // where clip time 0 would be
    g.gain.setValueAtTime(clip.gain, when);
    if (clip.fadeIn > 0 && skip < clip.fadeIn) {
      g.gain.setValueAtTime(clip.gain * (skip / clip.fadeIn), when);
      g.gain.linearRampToValueAtTime(clip.gain, clipT0 + clip.fadeIn);
    }
    if (clip.fadeOut > 0) {
      const fs = clipT0 + clip.duration - clip.fadeOut;
      if (fs > when) g.gain.setValueAtTime(clip.gain, fs);
      g.gain.linearRampToValueAtTime(0.0001, clipT0 + clip.duration);
    }
    src.start(when, clip.offset + skip, playLen);
    sources.push(src);
  });

  return {
    startedAt: t0,
    from,
    stop: () => {
      sources.forEach((s) => { try { s.stop(); } catch { /* already stopped */ } });
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
      setTimeout(() => master.disconnect(), 200);
    },
  };
}

/** One-shot preview of a single url (library browsing). */
let previewEl: HTMLAudioElement | null = null;
export function previewUrl(url: string | null) {
  if (previewEl) { previewEl.pause(); previewEl = null; }
  if (!url) return;
  previewEl = new Audio(url);
  previewEl.play().catch(() => {});
}
