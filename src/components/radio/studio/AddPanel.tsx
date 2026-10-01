"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Mic, Play, Plus, Search, Sparkles, Upload, Volume2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IRISH_VOICES } from "@/lib/audio-engine/irish-voices";
import { SFX_PACK, sfxUrl } from "./sfx-pack";
import { previewUrl } from "./audio";
import type { IncomingClip } from "./bus";
import type { StudioTrack, TrackRole } from "./types";

type Tab = "sfx" | "voice" | "import";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ? `${data.error}${data.details ? ` (${data.details})` : ""}` : `Request failed (${res.status})`);
  return data as T;
}

export function AddPanel({
  tracks,
  onAdd,
  defaultTab = "sfx",
}: {
  tracks: StudioTrack[];
  onAdd: (c: IncomingClip) => void;
  defaultTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div className="rounded-xl border border-border bg-bg-deep">
      <div className="flex gap-1 border-b border-border p-1.5">
        {([
          ["sfx", "Sound effects", Volume2],
          ["voice", "Voice line", Mic],
          ["import", "Import audio", Upload],
        ] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === key ? "bg-bg-card text-text" : "text-text-muted hover:text-text"
            )}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tab === "sfx" && <SfxTab onAdd={onAdd} />}
        {tab === "voice" && <VoiceTab tracks={tracks} onAdd={onAdd} />}
        {tab === "import" && <ImportTab tracks={tracks} onAdd={onAdd} />}
      </div>
    </div>
  );
}

// ───────────────────────────── Sound effects ─────────────────────────────

function SfxTab({ onAdd }: { onAdd: (c: IncomingClip) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [available, setAvailable] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [made, setMade] = useState<Record<string, string>>({}); // id -> generated url
  const [describe, setDescribe] = useState("");
  const [seconds, setSeconds] = useState(2);
  const [err, setErr] = useState("");

  useEffect(() => {
    // Which starter files are present on this server?
    SFX_PACK.forEach((s) => {
      fetch(sfxUrl(s.id), { method: "HEAD" })
        .then((r) => setAvailable((a) => ({ ...a, [s.id]: r.ok })))
        .catch(() => setAvailable((a) => ({ ...a, [s.id]: false })));
    });
  }, []);

  const cats = ["All", ...Array.from(new Set(SFX_PACK.map((s) => s.category)))];
  const list = useMemo(
    () =>
      SFX_PACK.filter(
        (s) => (cat === "All" || s.category === cat) && (!q || `${s.name} ${s.prompt}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, cat]
  );

  async function create(prompt: string, secs: number, key: string, name: string) {
    setBusy(key);
    setErr("");
    try {
      const r = await postJson<{ url: string; duration: number }>("/api/audio/sfx-generate", { prompt, durationSeconds: secs });
      setMade((m) => ({ ...m, [key]: r.url }));
      return r.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't create that sound");
      return null;
    } finally {
      setBusy(null);
    }
    void name;
  }

  const urlFor = (id: string) => made[id] || (available[id] ? sfxUrl(id) : null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sounds…"
            className="w-full rounded-lg border border-border bg-bg-card py-1.5 pl-8 pr-3 text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] transition-colors",
                cat === c ? "bg-amber-500/20 text-amber-300" : "text-text-muted hover:text-text"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const url = urlFor(s.id);
          return (
            <div key={s.id} className="flex items-center gap-2 rounded-lg border border-border bg-bg-card px-2.5 py-1.5">
              <button
                disabled={!url}
                onClick={() => url && previewUrl(url)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 disabled:opacity-30"
                title="Preview"
              >
                <Play size={10} className="ml-0.5" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-text">{s.name}</p>
                <p className="text-[10px] text-text-muted">{s.category}</p>
              </div>
              {url ? (
                <button
                  onClick={() => onAdd({ url, name: s.name, role: "sfx" })}
                  className="flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-1 text-[11px] font-medium text-amber-300 hover:bg-amber-500/25"
                >
                  <Plus size={11} /> Add
                </button>
              ) : (
                <button
                  disabled={busy === s.id}
                  onClick={async () => {
                    const u = await create(s.prompt, s.seconds, s.id, s.name);
                    if (u) previewUrl(u);
                  }}
                  className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-text-muted hover:text-text"
                >
                  {busy === s.id ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />} Create
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text">
          <Wand2 size={13} className="text-amber-300" /> Describe a sound
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            value={describe}
            onChange={(e) => setDescribe(e.target.value)}
            placeholder="e.g. a sausage sizzling on a barbecue, then a happy sigh"
            className="min-w-[220px] flex-1 rounded-lg border border-border bg-bg-card px-3 py-1.5 text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
          <select
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="rounded-lg border border-border bg-bg-card px-2 py-1.5 text-xs text-text"
          >
            {[1, 2, 3, 5, 8, 12].map((s) => (
              <option key={s} value={s}>{s}s</option>
            ))}
          </select>
          <button
            disabled={!describe.trim() || busy === "custom"}
            onClick={async () => {
              const u = await create(describe.trim(), seconds, "custom", describe.trim());
              if (u) onAdd({ url: u, name: describe.trim().slice(0, 40), role: "sfx" });
            }}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-bg disabled:opacity-40"
          >
            {busy === "custom" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Create & add
          </button>
        </div>
      </div>
      {err && <p className="text-xs text-red-400">{err}</p>}
    </div>
  );
}

// ───────────────────────────── Voice line ─────────────────────────────

const DELIVERY_TAGS = ["[excited]", "[warmly]", "[whispers]", "[laughs]", "[sighs]", "[shouting]", "[sarcastic]", "[pause]"];

function VoiceTab({ tracks, onAdd }: { tracks: StudioTrack[]; onAdd: (c: IncomingClip) => void }) {
  const voiceTracks = tracks.filter((t) => t.role === "voice");
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState(IRISH_VOICES[0].id);
  const [trackId, setTrackId] = useState(voiceTracks[0]?.id || "");
  const [speed, setSpeed] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [gender, setGender] = useState<"all" | "male" | "female">("all");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const voices = IRISH_VOICES.filter((v) => gender === "all" || v.gender === gender);
  const voice = IRISH_VOICES.find((v) => v.id === voiceId);

  function insertTag(tag: string) {
    const ta = taRef.current;
    if (!ta) return setText((t) => `${t} ${tag} `);
    const a = ta.selectionStart, b = ta.selectionEnd;
    const next = text.slice(0, a) + tag + " " + text.slice(b);
    setText(next);
    requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = a + tag.length + 1; });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="space-y-2">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Type the line… e.g. [excited] This weekend only at O'Reilly's of Rathfarnham!"
          className="w-full rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[10px] uppercase tracking-wider text-text-muted">Delivery</span>
          {DELIVERY_TAGS.map((t) => (
            <button key={t} onClick={() => insertTag(t)} className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-muted hover:border-accent hover:text-accent">
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <label className="flex items-center gap-2 text-xs text-text-muted">
            Pace
            <input type="range" min={0.8} max={1.2} step={0.05} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-24 accent-[var(--green)]" />
            <span className="w-8 font-mono">{speed.toFixed(2)}×</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-text-muted">
            Onto
            <select value={trackId} onChange={(e) => setTrackId(e.target.value)} className="rounded-md border border-border bg-bg-card px-2 py-1 text-xs text-text">
              {voiceTracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <button
            disabled={!text.trim() || busy}
            onClick={async () => {
              setBusy(true); setErr("");
              try {
                const r = await postJson<{ url: string; duration: number }>("/api/audio/voice-generate", {
                  text: text.trim(), voiceId, settings: speed !== 1 ? { speed } : undefined,
                });
                onAdd({ url: r.url, name: `${voice?.name ?? "Voice"}: ${text.replace(/\[[^\]]*\]/g, "").trim().slice(0, 32)}`, role: "voice", trackId });
                setText("");
              } catch (e) {
                setErr(e instanceof Error ? e.message : "Voice generation failed");
              } finally {
                setBusy(false);
              }
            }}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-bg disabled:opacity-40"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Mic size={13} />} Voice it & add
          </button>
        </div>
        {err && <p className="text-xs text-red-400">{err}</p>}
      </div>

      <div>
        <div className="mb-2 flex gap-1">
          {(["all", "female", "male"] as const).map((g) => (
            <button key={g} onClick={() => setGender(g)} className={cn("rounded-full px-2.5 py-0.5 text-[11px] capitalize", gender === g ? "bg-accent/15 text-accent" : "text-text-muted hover:text-text")}>
              {g}
            </button>
          ))}
        </div>
        <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
          {voices.map((v) => (
            <button
              key={v.id}
              onClick={() => setVoiceId(v.id)}
              className={cn(
                "w-full rounded-lg border px-2.5 py-1.5 text-left transition-colors",
                v.id === voiceId ? "border-accent bg-accent/10" : "border-border bg-bg-card hover:border-border-hover"
              )}
            >
              <p className="text-xs font-medium text-text">
                {v.name}
                {v.featured && <span className="ml-1.5 rounded bg-accent/15 px-1 text-[9px] uppercase text-accent">Top pick</span>}
              </p>
              <p className="truncate text-[10px] text-text-muted">{v.style}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── Import ─────────────────────────────

function ImportTab({ tracks, onAdd }: { tracks: StudioTrack[]; onAdd: (c: IncomingClip) => void }) {
  const [role, setRole] = useState<TrackRole>("jingle");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true); setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", role);
      const res = await fetch("/api/audio/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onAdd({ url: data.url, name: data.name || file.name, role });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
        Put it on the
        {(["jingle", "voice", "bed", "sfx"] as TrackRole[]).map((r) => (
          <button key={r} onClick={() => setRole(r)} className={cn("rounded-full px-2.5 py-1 capitalize", role === r ? "bg-accent/15 text-accent" : "hover:text-text")}>
            {r === "bed" ? "music bed" : r}
          </button>
        ))}
        track
        <span className="ml-auto text-[10px]">{tracks.filter((t) => t.role === role).length} track(s) available</span>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
          drag ? "border-accent bg-accent/5" : "border-border hover:border-border-hover"
        )}
      >
        {busy ? <Loader2 size={22} className="animate-spin text-accent" /> : <Upload size={22} className="text-text-muted" />}
        <p className="text-sm text-text">{busy ? "Bringing it in…" : "Drop an audio file here, or click to choose"}</p>
        <p className="text-[11px] text-text-muted">MP3, WAV, M4A, AIFF — a studio jingle take, a client voice, a sound effect</p>
        <input ref={inputRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.aif,.aiff,.ogg,.flac" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      </div>
      {err && <p className="text-xs text-red-400">{err}</p>}
    </div>
  );
}
