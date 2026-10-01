"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AudioWaveform, Copy, Download, Loader2, Magnet, Pause, Play, Plus, Redo2, Scissors,
  Square, Trash2, Undo2, Volume2, VolumeX, ZoomIn, ZoomOut, ArrowDownToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddPanel } from "./AddPanel";
import { Waveform } from "./Waveform";
import { loadBuffer, play, getCtx, type Playback } from "./audio";
import { onStudioIncoming, type IncomingClip } from "./bus";
import {
  FX_OPTIONS, ROLE_STYLE, defaultTracks, fmtTime, fromDb, toDb, uid,
  type StudioClip, type StudioState, type StudioTrack,
} from "./types";

const TRACK_H = 64;
const HEADER_W = 176;
const SNAP = 0.1;
const LENGTHS = [15, 20, 30, 40, 60];

type Drag =
  | { kind: "move"; id: string; startX: number; origStart: number; origTrack: string; moved: boolean }
  | { kind: "trim-l"; id: string; startX: number; orig: StudioClip }
  | { kind: "trim-r"; id: string; startX: number; orig: StudioClip }
  | { kind: "scrub"; startX: number };

export function Studio({ title = "Studio", defaultLength = 30, adName = "radio-ad" }: { title?: string; defaultLength?: number; adName?: string }) {
  const [state, setState] = useState<StudioState>({ tracks: defaultTracks(), clips: [], length: defaultLength });
  const [past, setPast] = useState<StudioState[]>([]);
  const [future, setFuture] = useState<StudioState[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [snap, setSnap] = useState(true);
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [addTab, setAddTab] = useState<"sfx" | "voice" | "import">("sfx");
  const [showAdd, setShowAdd] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState<{ mp3Url?: string; wavUrl?: string } | null>(null);
  const [exportErr, setExportErr] = useState("");
  const [loudness, setLoudness] = useState(-16);

  const pbRef = useRef<Playback | null>(null);
  const rafRef = useRef<number>(0);
  const laneRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const dragSnapshot = useRef<StudioState | null>(null);

  const pxPerSec = 22 * zoom;
  const contentEnd = Math.max(state.length + 4, ...state.clips.map((c) => c.start + c.duration + 2));
  const laneWidth = Math.ceil(contentEnd * pxPerSec);
  const q = useCallback((v: number) => (snap ? Math.round(v / SNAP) * SNAP : Math.round(v * 1000) / 1000), [snap]);

  // ───────── history ─────────
  const commit = useCallback((next: StudioState | ((s: StudioState) => StudioState), record = true) => {
    setState((prev) => {
      const n = typeof next === "function" ? next(prev) : next;
      if (record && n !== prev) {
        setPast((p) => [...p.slice(-60), prev]);
        setFuture([]);
      }
      return n;
    });
  }, []);
  const undo = useCallback(() => {
    setPast((p) => {
      if (!p.length) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [stateRef.current, ...f]);
      setState(prev);
      return p.slice(0, -1);
    });
  }, []);
  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const nxt = f[0];
      setPast((p) => [...p, stateRef.current]);
      setState(nxt);
      return f.slice(1);
    });
  }, []);

  const updateClip = (id: string, patch: Partial<StudioClip>, record = true) =>
    commit((s) => ({ ...s, clips: s.clips.map((c) => (c.id === id ? { ...c, ...patch } : c)) }), record);
  const updateTrack = (id: string, patch: Partial<StudioTrack>) =>
    commit((s) => ({ ...s, tracks: s.tracks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  // ───────── adding clips ─────────
  const addClips = useCallback(async (incoming: IncomingClip[], replace = false, length?: number) => {
    const base = replace ? { tracks: defaultTracks(), clips: [] as StudioClip[], length: length ?? stateRef.current.length } : stateRef.current;
    const made: StudioClip[] = [];
    for (const inc of incoming) {
      let srcDur = inc.duration ?? 0;
      try { srcDur = (await loadBuffer(inc.url)).duration; } catch { /* keep given duration */ }
      if (!srcDur) srcDur = 3;
      const start = inc.start ?? (replace ? 0 : playheadRef.current);
      const dur = Math.min(srcDur, inc.duration ?? srcDur);
      // choose track: explicit, else first track of that role with free space at `start`
      const all = [...base.clips, ...made];
      let trackId = inc.trackId;
      if (!trackId || !base.tracks.some((t) => t.id === trackId)) {
        const candidates = base.tracks.filter((t) => t.role === inc.role);
        trackId = (candidates.find((t) => !all.some((c) => c.trackId === t.id && c.start < start + dur && c.start + c.duration > start)) || candidates[0] || base.tracks[0]).id;
      }
      made.push({
        id: uid(), trackId, name: inc.name, url: inc.url, sourceDuration: srcDur,
        start: Math.max(0, start), offset: 0, duration: dur,
        gain: inc.gain ?? 1, fadeIn: inc.fadeIn ?? 0, fadeOut: inc.fadeOut ?? (inc.role === "bed" || inc.role === "jingle" ? 0.8 : 0.05),
        fx: inc.fx ?? "none",
      });
    }
    commit({ ...base, clips: [...base.clips, ...made] });
    if (made.length) setSelected(made[made.length - 1].id);
    setExported(null);
  }, [commit]);

  const playheadRef = useRef(0);
  playheadRef.current = playhead;

  useEffect(() => onStudioIncoming((s) => { void addClips(s.clips, s.replace, s.length); }), [addClips]);

  // ───────── transport ─────────
  const stop = useCallback(() => {
    pbRef.current?.stop();
    pbRef.current = null;
    cancelAnimationFrame(rafRef.current);
    setPlaying(false);
  }, []);

  const start = useCallback(async (from?: number) => {
    stop();
    const s = stateRef.current;
    const pos = from ?? playheadRef.current;
    const end = Math.max(s.length, ...s.clips.map((c) => c.start + c.duration));
    const pb = await play(s.tracks, s.clips, pos >= end ? 0 : pos, end);
    pbRef.current = pb;
    setPlaying(true);
    const ctx = getCtx();
    const tick = () => {
      const t = pb.from + (ctx.currentTime - pb.startedAt);
      if (t >= end) { stop(); setPlayhead(0); return; }
      setPlayhead(Math.max(pb.from, t));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  // ───────── keyboard ─────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!document.getElementById("mme-studio")?.matches(":hover") && e.key !== " ") return;
      if (e.key === " ") { e.preventDefault(); if (playing) stop(); else void start(); }
      else if ((e.key === "Delete" || e.key === "Backspace") && selected) { e.preventDefault(); commit((s) => ({ ...s, clips: s.clips.filter((c) => c.id !== selected) })); setSelected(null); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      else if (e.key.toLowerCase() === "s" && selected) { e.preventDefault(); splitAt(selected, playheadRef.current); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ───────── editing ops ─────────
  function splitAt(id: string, t: number) {
    const c = stateRef.current.clips.find((x) => x.id === id);
    if (!c || t <= c.start + 0.05 || t >= c.start + c.duration - 0.05) return;
    const leftDur = t - c.start;
    const a: StudioClip = { ...c, duration: leftDur, fadeOut: Math.min(c.fadeOut, leftDur / 2) };
    const b: StudioClip = { ...c, id: uid(), start: t, offset: c.offset + leftDur, duration: c.duration - leftDur, fadeIn: 0 };
    commit((s) => ({ ...s, clips: s.clips.flatMap((x) => (x.id === id ? [a, b] : [x])) }));
    setSelected(b.id);
  }
  function duplicate(id: string) {
    const c = stateRef.current.clips.find((x) => x.id === id);
    if (!c) return;
    const d = { ...c, id: uid(), start: c.start + c.duration };
    commit((s) => ({ ...s, clips: [...s.clips, d] }));
    setSelected(d.id);
  }

  // ───────── pointer handling ─────────
  const xToTime = (clientX: number) => {
    const r = laneRef.current?.getBoundingClientRect();
    if (!r) return 0;
    return Math.max(0, (clientX - r.left + (laneRef.current?.scrollLeft || 0) - HEADER_W) / pxPerSec);
  };

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX - drag.startX) / pxPerSec;
      if (drag.kind === "scrub") { if (!playing) setPlayhead(q(xToTime(e.clientX))); return; }
      if (drag.kind === "move") {
        let trackId = drag.origTrack;
        const el = document.elementsFromPoint(e.clientX, e.clientY).find((n) => (n as HTMLElement).dataset?.trackId) as HTMLElement | undefined;
        if (el?.dataset.trackId) trackId = el.dataset.trackId;
        if (Math.abs(e.clientX - drag.startX) > 2) drag.moved = true;
        updateClip(drag.id, { start: Math.max(0, q(drag.origStart + dx)), trackId }, false);
      } else if (drag.kind === "trim-l") {
        const o = drag.orig;
        const delta = Math.min(Math.max(q(dx), -o.offset), o.duration - 0.1);
        updateClip(drag.id, { start: o.start + delta, offset: o.offset + delta, duration: o.duration - delta }, false);
      } else if (drag.kind === "trim-r") {
        const o = drag.orig;
        const dur = Math.min(Math.max(0.1, q(o.duration + dx)), o.sourceDuration - o.offset);
        updateClip(drag.id, { duration: dur }, false);
      }
    };
    const onUp = () => {
      // fold the whole drag into one undo step
      if (drag.kind !== "scrub" && dragSnapshot.current) {
        const snapState = dragSnapshot.current;
        if (JSON.stringify(snapState.clips) !== JSON.stringify(stateRef.current.clips)) {
          setPast((p) => [...p.slice(-60), snapState]);
          setFuture([]);
          setExported(null);
        }
      }
      dragSnapshot.current = null;
      setDrag(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  });

  const beginDrag = (e: React.PointerEvent, d: Drag) => {
    e.stopPropagation();
    e.preventDefault();
    dragSnapshot.current = stateRef.current;
    setDrag(d);
  };

  // ───────── export ─────────
  async function exportMix() {
    setExporting(true); setExportErr(""); setExported(null);
    try {
      const s = stateRef.current;
      const anySolo = s.tracks.some((t) => t.solo);
      const roleOf = (id: string) => s.tracks.find((t) => t.id === id)?.role ?? "sfx";
      const res = await fetch("/api/audio/studio-render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adName,
          loudness,
          formats: ["mp3", "wav"],
          totalDuration: Math.max(s.length, ...s.clips.map((c) => c.start + c.duration)),
          tracks: s.tracks.map((t) => ({ id: t.id, gain: t.gain, muted: t.muted || (anySolo && !t.solo), duckUnderVoice: t.duck, duckDepth: 0.7 })),
          clips: s.clips.map((c) => ({
            audioUrl: c.url, track: c.trackId, role: roleOf(c.trackId), start: c.start, offset: c.offset,
            duration: c.duration, gain: c.gain, fadeIn: c.fadeIn, fadeOut: c.fadeOut, fx: c.fx,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details ? `${data.error}: ${data.details}` : data.error || "Export failed");
      setExported(data);
    } catch (e) {
      setExportErr(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  const sel = state.clips.find((c) => c.id === selected) || null;
  const selTrack = sel ? state.tracks.find((t) => t.id === sel.trackId) : null;
  const totalLen = Math.max(...state.clips.map((c) => c.start + c.duration), 0);
  const overLength = totalLen > state.length + 0.25;

  const ticks = useMemo(() => {
    const step = zoom < 0.8 ? 5 : zoom < 1.6 ? 1 : 0.5;
    const out: number[] = [];
    for (let t = 0; t <= contentEnd; t += step) out.push(Math.round(t * 10) / 10);
    return out;
  }, [contentEnd, zoom]);

  const btn = "flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs text-text-muted transition-colors hover:border-border-hover hover:text-text disabled:opacity-30";

  return (
    <div id="mme-studio" className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <AudioWaveform size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-text">{title}</h2>
            <p className="text-sm text-text-muted">
              Multitrack edit · {state.clips.length} clip{state.clips.length === 1 ? "" : "s"} · {fmtTime(totalLen)} of {state.length}s
              {overLength && <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">Over length</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Spot length</span>
          <div className="flex rounded-lg border border-border bg-bg-deep p-0.5">
            {LENGTHS.map((l) => (
              <button key={l} onClick={() => commit((s) => ({ ...s, length: l }))} className={cn("rounded-md px-2.5 py-1 text-xs", state.length === l ? "bg-accent text-bg" : "text-text-muted hover:text-text")}>
                {l}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-bg-card px-3 py-2">
        <button onClick={() => (playing ? stop() : start())} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-bg hover:bg-accent-hover" title="Play / pause (space)">
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
        <button onClick={() => { stop(); setPlayhead(0); }} className={btn} title="Stop and return to start"><Square size={12} /></button>
        <span className="w-16 font-mono text-sm text-text">{fmtTime(playhead)}</span>
        <div className="mx-1 h-6 w-px bg-border" />
        <button onClick={undo} disabled={!past.length} className={btn} title="Undo (⌘Z)"><Undo2 size={13} /></button>
        <button onClick={redo} disabled={!future.length} className={btn} title="Redo (⇧⌘Z)"><Redo2 size={13} /></button>
        <button onClick={() => setSnap(!snap)} className={cn(btn, snap && "border-accent/50 text-accent")} title="Snap to 0.1s"><Magnet size={13} /> Snap</button>
        <div className="mx-1 h-6 w-px bg-border" />
        <button onClick={() => setZoom((z) => Math.max(0.4, z / 1.25))} className={btn}><ZoomOut size={13} /></button>
        <button onClick={() => setZoom((z) => Math.min(6, z * 1.25))} className={btn}><ZoomIn size={13} /></button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {(["voice", "sfx", "import"] as const).map((t) => (
            <button key={t} onClick={() => { setAddTab(t); setShowAdd(true); }} className={cn(btn, showAdd && addTab === t && "border-accent/50 text-accent")}>
              <Plus size={13} /> {t === "voice" ? "Voice line" : t === "sfx" ? "Sound effect" : "Import audio"}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div ref={laneRef} className="relative overflow-x-auto rounded-xl border border-border bg-bg-deep select-none">
        <div style={{ width: laneWidth + HEADER_W }} className="relative">
          {/* Ruler */}
          <div className="sticky top-0 z-20 flex h-7 border-b border-border bg-bg-card" >
            <div style={{ width: HEADER_W }} className="sticky left-0 z-30 shrink-0 border-r border-border bg-bg-card" />
            <div
              className="relative flex-1 cursor-pointer"
              onPointerDown={(e) => { const t = q(xToTime(e.clientX)); setPlayhead(t); if (playing) void start(t); else beginDrag(e, { kind: "scrub", startX: e.clientX }); }}
            >
              {ticks.map((t) => (
                <div key={t} className="absolute top-0 h-full border-l border-border/60" style={{ left: t * pxPerSec }}>
                  {Number.isInteger(t) && <span className="ml-1 font-mono text-[9px] text-text-muted">{t}s</span>}
                </div>
              ))}
              <div className="absolute top-0 h-full border-l-2 border-dashed border-red-400/70" style={{ left: state.length * pxPerSec }} title="Spot length" />
            </div>
          </div>

          {/* Tracks */}
          {state.tracks.map((t) => {
            const style = ROLE_STYLE[t.role];
            const anySolo = state.tracks.some((x) => x.solo);
            const dim = t.muted || (anySolo && !t.solo);
            return (
              <div key={t.id} className="flex border-b border-border/70" style={{ height: TRACK_H }}>
                {/* Track header */}
                <div style={{ width: HEADER_W }} className="sticky left-0 z-10 flex shrink-0 flex-col justify-center gap-1 border-r border-border bg-bg-card px-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                    <span className="flex-1 truncate text-xs font-medium text-text">{t.name}</span>
                    <button onClick={() => updateTrack(t.id, { muted: !t.muted })} className={cn("rounded px-1 text-[10px] font-bold", t.muted ? "bg-red-500/20 text-red-400" : "text-text-muted hover:text-text")} title="Mute">M</button>
                    <button onClick={() => updateTrack(t.id, { solo: !t.solo })} className={cn("rounded px-1 text-[10px] font-bold", t.solo ? "bg-amber-500/25 text-amber-300" : "text-text-muted hover:text-text")} title="Solo">S</button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.gain > 0 ? <Volume2 size={11} className="text-text-muted" /> : <VolumeX size={11} className="text-text-muted" />}
                    <input
                      type="range" min={-30} max={6} step={0.5} value={Math.max(-30, toDb(t.gain))}
                      onChange={(e) => setState((s) => ({ ...s, tracks: s.tracks.map((x) => (x.id === t.id ? { ...x, gain: Number(e.target.value) <= -30 ? 0 : fromDb(Number(e.target.value)) } : x)) }))}
                      onPointerDown={() => setPast((p) => [...p.slice(-60), stateRef.current])}
                      className="h-1 w-full accent-[var(--green)]"
                      title={`${toDb(t.gain).toFixed(1)} dB`}
                    />
                    {(t.role === "bed" || t.role === "jingle") && (
                      <button onClick={() => updateTrack(t.id, { duck: !t.duck })} className={cn("rounded px-1 text-[9px] font-bold", t.duck ? "bg-blue-500/20 text-blue-300" : "text-text-muted hover:text-text")} title="Duck under voice">
                        DUCK
                      </button>
                    )}
                  </div>
                </div>

                {/* Lane */}
                <div
                  data-track-id={t.id}
                  className={cn("relative flex-1", dim && "opacity-40")}
                  onPointerDown={(e) => { setSelected(null); const tt = q(xToTime(e.clientX)); setPlayhead(tt); if (playing) void start(tt); }}
                >
                  {state.clips.filter((c) => c.trackId === t.id).map((c) => {
                    const w = Math.max(6, c.duration * pxPerSec);
                    const isSel = c.id === selected;
                    return (
                      <div
                        key={c.id}
                        className={cn(
                          "absolute top-1.5 overflow-hidden rounded-md border text-[10px]",
                          style.clip, isSel ? `${style.border} ring-2 ring-white/40` : "border-white/10",
                          drag?.kind === "move" && drag.id === c.id ? "cursor-grabbing" : "cursor-grab"
                        )}
                        style={{ left: c.start * pxPerSec, width: w, height: TRACK_H - 12 }}
                        onPointerDown={(e) => { setSelected(c.id); beginDrag(e, { kind: "move", id: c.id, startX: e.clientX, origStart: c.start, origTrack: c.trackId, moved: false }); }}
                      >
                        <div className="absolute inset-0 opacity-90">
                          <Waveform url={c.url} offset={c.offset} duration={c.duration} width={w} height={TRACK_H - 12} color="rgba(255,255,255,0.55)" />
                        </div>
                        {/* fade overlays */}
                        {c.fadeIn > 0 && <div className="pointer-events-none absolute left-0 top-0 h-full bg-gradient-to-r from-black/50 to-transparent" style={{ width: c.fadeIn * pxPerSec }} />}
                        {c.fadeOut > 0 && <div className="pointer-events-none absolute right-0 top-0 h-full bg-gradient-to-l from-black/50 to-transparent" style={{ width: c.fadeOut * pxPerSec }} />}
                        <div className="pointer-events-none absolute left-1.5 top-0.5 right-1.5 flex items-center gap-1 truncate font-medium text-white drop-shadow">
                          <span className="truncate">{c.name}</span>
                          {c.fx !== "none" && <span className="rounded bg-black/40 px-1 text-[9px]">{FX_OPTIONS.find((f) => f.key === c.fx)?.label}</span>}
                        </div>
                        {/* trim handles */}
                        <div className="absolute left-0 top-0 h-full w-1.5 cursor-ew-resize hover:bg-white/40" onPointerDown={(e) => { setSelected(c.id); beginDrag(e, { kind: "trim-l", id: c.id, startX: e.clientX, orig: c }); }} />
                        <div className="absolute right-0 top-0 h-full w-1.5 cursor-ew-resize hover:bg-white/40" onPointerDown={(e) => { setSelected(c.id); beginDrag(e, { kind: "trim-r", id: c.id, startX: e.clientX, orig: c }); }} />
                      </div>
                    );
                  })}
                  {/* spot length marker */}
                  <div className="pointer-events-none absolute top-0 h-full border-l-2 border-dashed border-red-400/40" style={{ left: state.length * pxPerSec }} />
                </div>
              </div>
            );
          })}

          {/* Playhead */}
          <div className="pointer-events-none absolute top-0 z-20 h-full w-px bg-white" style={{ left: HEADER_W + playhead * pxPerSec }}>
            <div className="-ml-1.5 h-2 w-3 rounded-b bg-white" />
          </div>

          {state.clips.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ left: HEADER_W }}>
              <p className="rounded-lg bg-bg-card/80 px-4 py-2 text-xs text-text-muted">
                Generate an ad above, send a jingle from Jingle Studio, or use the + buttons to add voice lines, sound effects and your own audio.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inspector */}
      {sel && selTrack && (
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 rounded-xl border border-border bg-bg-card px-4 py-3">
          <div className="min-w-[160px]">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Selected clip · {selTrack.name}</p>
            <input value={sel.name} onChange={(e) => updateClip(sel.id, { name: e.target.value }, false)} className="mt-0.5 w-full bg-transparent text-sm font-medium text-text focus:outline-none" />
            <p className="font-mono text-[10px] text-text-muted">{fmtTime(sel.start)} → {fmtTime(sel.start + sel.duration)} ({sel.duration.toFixed(2)}s)</p>
          </div>
          <Slider label="Level" value={Math.max(-30, toDb(sel.gain))} min={-30} max={12} step={0.5} fmt={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)} dB`}
            onStart={() => setPast((p) => [...p.slice(-60), stateRef.current])}
            onChange={(v) => updateClip(sel.id, { gain: v <= -30 ? 0 : fromDb(v) }, false)} />
          <Slider label="Fade in" value={sel.fadeIn} min={0} max={Math.min(5, sel.duration)} step={0.05} fmt={(v) => `${v.toFixed(2)}s`}
            onStart={() => setPast((p) => [...p.slice(-60), stateRef.current])}
            onChange={(v) => updateClip(sel.id, { fadeIn: v }, false)} />
          <Slider label="Fade out" value={sel.fadeOut} min={0} max={Math.min(5, sel.duration)} step={0.05} fmt={(v) => `${v.toFixed(2)}s`}
            onStart={() => setPast((p) => [...p.slice(-60), stateRef.current])}
            onChange={(v) => updateClip(sel.id, { fadeOut: v }, false)} />
          <label className="text-xs text-text-muted">
            <span className="block text-[10px] uppercase tracking-wider">Effect</span>
            <select value={sel.fx} onChange={(e) => updateClip(sel.id, { fx: e.target.value as StudioClip["fx"] })} className="mt-1 rounded-lg border border-border bg-bg-deep px-2 py-1.5 text-xs text-text">
              {FX_OPTIONS.map((f) => <option key={f.key} value={f.key}>{f.label} — {f.hint}</option>)}
            </select>
          </label>
          <div className="ml-auto flex flex-wrap gap-1.5">
            <button onClick={() => splitAt(sel.id, playhead)} className={btn} title="Split at playhead (S)"><Scissors size={13} /> Split</button>
            <button onClick={() => duplicate(sel.id)} className={btn}><Copy size={13} /> Duplicate</button>
            <button onClick={() => updateClip(sel.id, { start: q(playhead) })} className={btn} title="Move clip to the playhead"><ArrowDownToLine size={13} /> To playhead</button>
            <button onClick={() => { commit((s) => ({ ...s, clips: s.clips.filter((c) => c.id !== sel.id) })); setSelected(null); }} className={cn(btn, "hover:border-red-400 hover:text-red-400")}><Trash2 size={13} /> Remove</button>
          </div>
        </div>
      )}

      {/* Add panel */}
      {showAdd && <AddPanel key={addTab} tracks={state.tracks} onAdd={(c) => void addClips([c])} defaultTab={addTab} />}

      {/* Export */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text">Export the finished spot</p>
          <p className="text-[11px] text-text-muted">Broadcast-ready mix with level-matched loudness, MP3 and WAV</p>
        </div>
        <select value={loudness} onChange={(e) => setLoudness(Number(e.target.value))} className="rounded-lg border border-border bg-bg-deep px-2 py-1.5 text-xs text-text">
          <option value={-16}>Radio spot (−16 LUFS)</option>
          <option value={-23}>EBU R128 (−23 LUFS)</option>
          <option value={-14}>Streaming / social (−14 LUFS)</option>
        </select>
        <button
          onClick={exportMix}
          disabled={exporting || !state.clips.length}
          className="ml-auto flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-bg disabled:opacity-40"
        >
          {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} {exporting ? "Mixing…" : "Mix & export"}
        </button>
        {exportErr && <p className="w-full text-xs text-red-400">{exportErr}</p>}
        {exported?.mp3Url && (
          <div className="flex w-full flex-wrap items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2">
            <audio controls src={exported.mp3Url} className="h-9 flex-1 min-w-[240px]" />
            <a href={exported.mp3Url} download={`${adName}.mp3`} className="text-xs font-medium text-accent hover:underline">MP3</a>
            {exported.wavUrl && <a href={exported.wavUrl} download={`${adName}.wav`} className="text-xs font-medium text-accent hover:underline">WAV (broadcast)</a>}
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, fmt, onChange, onStart }: {
  label: string; value: number; min: number; max: number; step: number;
  fmt: (v: number) => string; onChange: (v: number) => void; onStart?: () => void;
}) {
  return (
    <label className="w-36 text-xs text-text-muted">
      <span className="flex justify-between text-[10px] uppercase tracking-wider">{label}<span className="font-mono normal-case text-text">{fmt(value)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onPointerDown={onStart} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5 w-full accent-[var(--green)]" />
    </label>
  );
}
