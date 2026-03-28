"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic2,
  Music,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  Square,
  Repeat,
  Wand2,
  Download,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngine } from "@/lib/audio-engine/engine-provider";

export interface TimelineSegment {
  id: string;
  label: string;
  start: number;
  end: number;
  volume: number; // 0-100
  track: "voice" | "music" | "sfx";
  audioUrl?: string;
  ducking?: {
    underVoice: boolean;
    duckLevel: number;
    fadeMs: number;
  };
}

interface TrackConfig {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  key: "voice" | "music" | "sfx";
  defaultVolume: number;
  muted: boolean;
  solo: boolean;
}

const GRID_SNAP = 0.25; // 0.25s grid
const MIN_SEGMENT_LENGTH = 0.5;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SNAP) * GRID_SNAP;
}

interface ProductionTimelineProps {
  duration: string;
  segments?: TimelineSegment[];
  onSegmentsChange?: (segments: TimelineSegment[]) => void;
  readOnly?: boolean;
}

export function ProductionTimeline({
  duration,
  segments: externalSegments,
  onSegmentsChange,
  readOnly = false,
}: ProductionTimelineProps) {
  const engine = useAudioEngine();
  const totalSeconds = parseInt(duration) || 30;
  const [zoom, setZoom] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(0);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Track state
  const [tracks, setTracks] = useState<TrackConfig[]>([
    { name: "Voice", icon: Mic2, color: "bg-accent", key: "voice", defaultVolume: 100, muted: false, solo: false },
    { name: "Music", icon: Music, color: "bg-blue-500", key: "music", defaultVolume: 40, muted: false, solo: false },
    { name: "SFX", icon: Volume2, color: "bg-amber-500", key: "sfx", defaultVolume: 90, muted: false, solo: false },
  ]);

  // Default segments for demo
  const defaultSegments: TimelineSegment[] = [
    { id: "v1", label: "Intro line", start: 3, end: 10, volume: 100, track: "voice" },
    { id: "v2", label: "Body copy", start: 10.5, end: 22, volume: 100, track: "voice" },
    { id: "v3", label: "CTA + Logo", start: 22.5, end: 28, volume: 100, track: "voice" },
    { id: "m1", label: "Jingle intro", start: 0, end: 3, volume: 80, track: "music" },
    { id: "m2", label: "Music bed (ducked)", start: 3, end: 28, volume: 30, track: "music", ducking: { underVoice: true, duckLevel: 30, fadeMs: 200 } },
    { id: "m3", label: "Jingle out", start: 28, end: 30, volume: 80, track: "music" },
    { id: "s1", label: "Engine start", start: 1, end: 2.5, volume: 90, track: "sfx" },
    { id: "s2", label: "Keys jingle", start: 14, end: 15, volume: 70, track: "sfx" },
    { id: "s3", label: "Door close", start: 27, end: 28, volume: 90, track: "sfx" },
  ];

  const [segments, setSegments] = useState<TimelineSegment[]>(externalSegments || defaultSegments);

  useEffect(() => {
    if (externalSegments) {
      setSegments(externalSegments);
    }
  }, [externalSegments]);

  // Drag state
  const [dragging, setDragging] = useState<{
    segId: string;
    type: "move" | "resize-left" | "resize-right";
    startX: number;
    origStart: number;
    origEnd: number;
  } | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<number | null>(null);
  const playStartRef = useRef(0);

  // Ruler ticks
  const tickInterval = totalSeconds <= 15 ? 1 : totalSeconds <= 30 ? 2 : 5;
  const ticks: number[] = [];
  for (let i = 0; i <= totalSeconds; i += tickInterval) {
    ticks.push(i);
  }

  function toPercent(seconds: number): number {
    return (seconds / totalSeconds) * 100;
  }

  function percentToSeconds(percent: number): number {
    return (percent / 100) * totalSeconds;
  }

  // Playback
  const startPlayback = useCallback(() => {
    setPlaying(true);
    playStartRef.current = performance.now() - playheadPos * 1000;

    function tick() {
      const elapsed = (performance.now() - playStartRef.current) / 1000;
      if (elapsed >= totalSeconds) {
        if (looping) {
          playStartRef.current = performance.now();
          setPlayheadPos(0);
        } else {
          setPlaying(false);
          setPlayheadPos(0);
          return;
        }
      } else {
        setPlayheadPos(elapsed);
      }
      playbackRef.current = requestAnimationFrame(tick);
    }
    playbackRef.current = requestAnimationFrame(tick);
  }, [playheadPos, totalSeconds, looping]);

  const stopPlayback = useCallback(() => {
    setPlaying(false);
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
    }
  }, []);

  const togglePlayback = useCallback(() => {
    if (playing) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }, [playing, startPlayback, stopPlayback]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setPlayheadPos(0);
  }, [stopPlayback]);

  // Drag handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, segId: string, type: "move" | "resize-left" | "resize-right") => {
      if (readOnly) return;
      e.preventDefault();
      e.stopPropagation();
      const seg = segments.find((s) => s.id === segId);
      if (!seg) return;
      setDragging({
        segId,
        type,
        startX: e.clientX,
        origStart: seg.start,
        origEnd: seg.end,
      });
      setSelectedSegmentId(segId);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [segments, readOnly]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const pixelsPerSecond = (rect.width * zoom) / totalSeconds;
      const dx = e.clientX - dragging.startX;
      const dt = dx / pixelsPerSecond;

      setSegments((prev) =>
        prev.map((seg) => {
          if (seg.id !== dragging.segId) return seg;
          if (dragging.type === "move") {
            const duration = dragging.origEnd - dragging.origStart;
            let newStart = snapToGrid(dragging.origStart + dt);
            newStart = Math.max(0, Math.min(totalSeconds - duration, newStart));
            return { ...seg, start: newStart, end: newStart + duration };
          } else if (dragging.type === "resize-left") {
            let newStart = snapToGrid(dragging.origStart + dt);
            newStart = Math.max(0, Math.min(dragging.origEnd - MIN_SEGMENT_LENGTH, newStart));
            return { ...seg, start: newStart };
          } else {
            let newEnd = snapToGrid(dragging.origEnd + dt);
            newEnd = Math.max(dragging.origStart + MIN_SEGMENT_LENGTH, Math.min(totalSeconds, newEnd));
            return { ...seg, end: newEnd };
          }
        })
      );
    },
    [dragging, totalSeconds, zoom]
  );

  const handlePointerUp = useCallback(() => {
    if (dragging) {
      setDragging(null);
      onSegmentsChange?.(segments);
    }
  }, [dragging, segments, onSegmentsChange]);

  // Ruler click to set playhead
  const handleRulerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      const seconds = pct * totalSeconds;
      setPlayheadPos(Math.max(0, Math.min(totalSeconds, seconds)));
      if (playing) {
        playStartRef.current = performance.now() - seconds * 1000;
      }
    },
    [totalSeconds, playing]
  );

  // Export mix
  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const mixSegments = segments
        .filter((s) => s.audioUrl)
        .map((s) => ({
          audioUrl: s.audioUrl!,
          startTime: s.start,
          duration: s.end - s.start,
          volume: s.volume,
          track: s.track,
          ducking: s.ducking,
        }));

      if (mixSegments.length > 0) {
        await engine.mixAudio({
          segments: mixSegments,
          totalDuration: totalSeconds,
          loudnessTarget: -23,
          outputFormat: "both",
        });
      }
    } catch {
      // Export failed
    }
    setExporting(false);
  }, [segments, totalSeconds, engine]);

  // Volume change for selected segment
  const selectedSegment = segments.find((s) => s.id === selectedSegmentId);

  // Get track color class
  function getSegmentColor(track: "voice" | "music" | "sfx", isDucked?: boolean): string {
    if (track === "voice") return isDucked ? "bg-accent/60" : "bg-accent";
    if (track === "music") return isDucked ? "bg-blue-500/30" : "bg-blue-500";
    return isDucked ? "bg-amber-500/60" : "bg-amber-500";
  }

  function getSegmentBorderColor(track: "voice" | "music" | "sfx"): string {
    if (track === "voice") return "border-accent";
    if (track === "music") return "border-blue-500";
    return "border-amber-500";
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Maximize2 size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-text">
              Production Timeline
            </h2>
            <p className="text-sm text-text-muted">
              Multi-track view &middot; {duration}
              {readOnly && (
                <span className="ml-2 rounded-full bg-text-muted/10 px-2 py-0.5 text-[10px] font-bold text-text-muted">
                  Read Only
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text hover:border-border-hover transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="px-2 text-xs font-mono text-text-muted">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text hover:border-border-hover transition-colors"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-2.5">
        <button
          onClick={togglePlayback}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-bg hover:bg-accent-hover transition-colors"
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        <button
          onClick={handleStop}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text transition-colors"
        >
          <Square size={12} />
        </button>
        <button
          onClick={() => setLooping(!looping)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
            looping ? "border-accent text-accent bg-accent/10" : "border-border text-text-muted hover:text-text"
          )}
        >
          <Repeat size={12} />
        </button>
        <div className="mx-2 h-5 w-px bg-border" />
        <span className="font-mono text-xs text-text-secondary">
          {formatTime(playheadPos)} / {formatTime(totalSeconds)}
        </span>
        <div className="flex-1" />
        {!readOnly && (
          <>
            <button
              onClick={() => {
                setSegments(externalSegments || defaultSegments);
                onSegmentsChange?.(externalSegments || defaultSegments);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text hover:border-border-hover transition-colors"
            >
              <Wand2 size={12} />
              Auto-Mix
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className={cn(
                "flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-bg hover:bg-accent-hover transition-colors",
                exporting && "opacity-60 cursor-not-allowed"
              )}
            >
              <Download size={12} />
              {exporting ? "Exporting..." : "Export Mix"}
            </button>
          </>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
        {/* Timeline Ruler */}
        <div className="flex border-b border-border">
          <div className="w-28 shrink-0 border-r border-border bg-bg-deep" />
          <div
            ref={timelineRef}
            className="relative flex-1 h-8 bg-bg-deep cursor-pointer"
            style={{ minWidth: `${zoom * 100}%` }}
            onClick={handleRulerClick}
          >
            {ticks.map((tick) => (
              <div
                key={tick}
                className="absolute top-0 h-full flex flex-col items-center"
                style={{ left: `${toPercent(tick)}%` }}
              >
                <div className="h-2 w-px bg-border" />
                <span className="text-[9px] font-mono text-text-muted mt-0.5">
                  {tick}s
                </span>
              </div>
            ))}

            {/* Playhead on ruler */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent z-10 pointer-events-none"
              style={{ left: `${toPercent(playheadPos)}%` }}
            >
              <div className="absolute -top-0.5 -left-1.5 w-3.5 h-3.5 bg-accent" style={{ clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)" }} />
            </div>
          </div>
        </div>

        {/* Tracks */}
        {tracks.map((track, trackIdx) => {
          const Icon = track.icon;
          const trackSegments = segments.filter((s) => s.track === track.key);

          return (
            <div
              key={track.name}
              className={cn("flex", trackIdx < tracks.length - 1 && "border-b border-border")}
            >
              {/* Track Label */}
              <div className="w-28 shrink-0 border-r border-border bg-bg-deep flex items-center gap-2 px-3 py-4">
                <Icon size={14} className="text-text-muted" />
                <span className="text-xs font-medium text-text-secondary">{track.name}</span>
                <div className="ml-auto flex items-center gap-0.5">
                  <button
                    onClick={() =>
                      setTracks((prev) =>
                        prev.map((t) =>
                          t.key === track.key ? { ...t, muted: !t.muted } : t
                        )
                      )
                    }
                    className={cn(
                      "text-[9px] font-bold rounded px-1 py-0.5 transition-colors",
                      track.muted ? "bg-red-500/20 text-red-400" : "text-text-muted hover:text-text"
                    )}
                  >
                    M
                  </button>
                  <button
                    onClick={() =>
                      setTracks((prev) =>
                        prev.map((t) =>
                          t.key === track.key ? { ...t, solo: !t.solo } : { ...t, solo: false }
                        )
                      )
                    }
                    className={cn(
                      "text-[9px] font-bold rounded px-1 py-0.5 transition-colors",
                      track.solo ? "bg-amber-500/20 text-amber-400" : "text-text-muted hover:text-text"
                    )}
                  >
                    S
                  </button>
                </div>
              </div>

              {/* Track Content */}
              <div
                className="relative flex-1 py-2 px-1 min-h-[52px]"
                style={{ minWidth: `${zoom * 100}%` }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {trackSegments.map((segment) => {
                  const isDucked = segment.ducking?.underVoice;
                  const segHeight = `${Math.max(30, (segment.volume / 100) * 100)}%`;
                  const isSelected = selectedSegmentId === segment.id;

                  return (
                    <div
                      key={segment.id}
                      style={{
                        left: `${toPercent(segment.start)}%`,
                        width: `${toPercent(segment.end - segment.start)}%`,
                        height: segHeight,
                      }}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 rounded-md flex items-center justify-center transition-shadow",
                        getSegmentColor(segment.track, isDucked),
                        isSelected && `ring-2 ${getSegmentBorderColor(segment.track)} ring-offset-1 ring-offset-bg-card shadow-lg`,
                        !readOnly && "cursor-grab active:cursor-grabbing"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSegmentId(segment.id);
                      }}
                      onPointerDown={(e) => handlePointerDown(e, segment.id, "move")}
                    >
                      {/* Left resize handle */}
                      {!readOnly && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-white/20 rounded-l-md"
                          onPointerDown={(e) => handlePointerDown(e, segment.id, "resize-left")}
                        />
                      )}

                      <span className="text-[9px] font-medium text-bg truncate px-2 select-none">
                        {segment.label}
                      </span>

                      {/* Right resize handle */}
                      {!readOnly && (
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-white/20 rounded-r-md"
                          onPointerDown={(e) => handlePointerDown(e, segment.id, "resize-right")}
                        />
                      )}

                      {/* Ducking overlay */}
                      {isDucked && (
                        <div className="absolute inset-0 bg-black/20 rounded-md pointer-events-none" />
                      )}
                    </div>
                  );
                })}

                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-accent z-10 pointer-events-none"
                  style={{ left: `${toPercent(playheadPos)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Volume control for selected segment */}
      {selectedSegment && !readOnly && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-border bg-bg-card p-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-text-muted w-24">
              {selectedSegment.label}
            </span>
            <span className="text-xs text-text-muted">Volume</span>
            <input
              type="range"
              min={0}
              max={100}
              value={selectedSegment.volume}
              onChange={(e) => {
                const newVol = Number(e.target.value);
                setSegments((prev) =>
                  prev.map((s) =>
                    s.id === selectedSegment.id ? { ...s, volume: newVol } : s
                  )
                );
              }}
              className="flex-1 h-1.5 appearance-none rounded-full bg-bg-deep accent-accent [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
            />
            <span className="font-mono text-xs text-text-secondary w-10 text-right">
              {selectedSegment.volume}%
            </span>
            {selectedSegment.ducking && (
              <>
                <div className="mx-2 h-5 w-px bg-border" />
                <span className="text-xs text-text-muted">Duck Level</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selectedSegment.ducking.duckLevel}
                  onChange={(e) => {
                    const newLevel = Number(e.target.value);
                    setSegments((prev) =>
                      prev.map((s) =>
                        s.id === selectedSegment.id
                          ? { ...s, ducking: { ...s.ducking!, duckLevel: newLevel } }
                          : s
                      )
                    );
                  }}
                  className="w-24 h-1.5 appearance-none rounded-full bg-bg-deep accent-blue-500 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <span className="font-mono text-xs text-text-secondary w-10 text-right">
                  {selectedSegment.ducking.duckLevel}%
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${m}:${s.toString().padStart(2, "0")}.${ms}`;
}
