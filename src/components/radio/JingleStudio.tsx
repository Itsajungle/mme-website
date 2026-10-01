"use client";

import { useRef, useState } from "react";
import { Check, ClipboardCopy, Loader2, Music2, PenLine, Send, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendToStudio } from "./studio/bus";

interface Draft {
  title: string;
  style: string;
  lyrics: string;
  durationSeconds: number;
  notes?: string;
}

interface Take {
  id: string;
  url: string;
  label: string;
  source: "generated" | "imported";
}

const EXAMPLE =
  "Need a jingle for O'Reilly's Butchers in Rathfarnham. Make it upbeat and jolly with multiple male voices and one female voice. Make it rhyme with all sorts of puns about how they source fantastic meat and then how competitive they are. Do it in a traditional Irish pub singalong style.";

export function JingleStudio({ brandName }: { brandName?: string }) {
  const [brief, setBrief] = useState("");
  const [secs, setSecs] = useState(30);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [writing, setWriting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [takes, setTakes] = useState<Take[]>([]);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function write() {
    setWriting(true); setErr("");
    try {
      const res = await fetch("/api/radio/jingle-write", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, durationSeconds: secs, brandName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't write the jingle");
      setDraft(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't write the jingle");
    } finally {
      setWriting(false);
    }
  }

  async function generate() {
    if (!draft) return;
    setGenerating(true); setErr("");
    try {
      const res = await fetch("/api/audio/jingle-generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: draft.style, lyrics: draft.lyrics, durationSeconds: draft.durationSeconds + 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Jingle generation failed");
      setTakes((t) => [{ id: crypto.randomUUID(), url: data.url, label: `Take ${t.length + 1}`, source: "generated" }, ...t]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Jingle generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function importTake(file: File) {
    setImporting(true); setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "jingle");
      const res = await fetch("/api/audio/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setTakes((t) => [{ id: crypto.randomUUID(), url: data.url, label: `Studio take ${t.filter((x) => x.source === "imported").length + 1}`, source: "imported" }, ...t]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  async function copyForStudio() {
    if (!draft) return;
    const text = `STYLE\n${draft.style}\n\nLYRICS\n${draft.lyrics}\n\nTITLE\n${draft.title}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  }

  const title = draft?.title || brandName || "Jingle";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/15">
          <Music2 size={20} className="text-fuchsia-300" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-text">Jingle Studio</h2>
          <p className="text-sm text-text-muted">Describe it in plain English — get sung, broadcast-ready jingles</p>
        </div>
      </div>

      {/* Brief */}
      <div className="space-y-2">
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={4}
          placeholder={EXAMPLE}
          className="w-full rounded-xl border border-border bg-bg-deep px-4 py-3 text-sm text-text placeholder:text-text-muted/70 focus:border-fuchsia-400 focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          {!brief && (
            <button onClick={() => setBrief(EXAMPLE)} className="text-[11px] text-text-muted underline-offset-2 hover:text-text hover:underline">Use the example</button>
          )}
          <div className="ml-auto flex rounded-lg border border-border bg-bg-deep p-0.5">
            {[15, 30, 60].map((s) => (
              <button key={s} onClick={() => setSecs(s)} className={cn("rounded-md px-3 py-1 text-xs", secs === s ? "bg-fuchsia-500 text-white" : "text-text-muted hover:text-text")}>{s}s</button>
            ))}
          </div>
          <button
            onClick={write}
            disabled={brief.trim().length < 10 || writing}
            className="flex items-center gap-2 rounded-lg bg-fuchsia-500 px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
          >
            {writing ? <Loader2 size={15} className="animate-spin" /> : <PenLine size={15} />} {draft ? "Rewrite" : "Write the jingle"}
          </button>
        </div>
      </div>

      {/* Draft */}
      {draft && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Title</span>
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-bg-deep px-3 py-2 text-sm text-text focus:border-fuchsia-400 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Musical style</span>
              <textarea value={draft.style} onChange={(e) => setDraft({ ...draft, style: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-border bg-bg-deep px-3 py-2 text-sm text-text focus:border-fuchsia-400 focus:outline-none" />
            </label>
            {draft.notes && <p className="text-xs italic text-text-muted">{draft.notes}</p>}
            <div className="flex flex-wrap gap-2">
              <button onClick={generate} disabled={generating} className="flex items-center gap-2 rounded-lg bg-fuchsia-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
                {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {generating ? "Composing… (about a minute)" : "Generate now"}
              </button>
              <button onClick={() => fileRef.current?.click()} disabled={importing} className="flex items-center gap-2 rounded-lg border border-fuchsia-400/50 px-4 py-2 text-sm font-medium text-fuchsia-200 hover:bg-fuchsia-500/10 disabled:opacity-40">
                {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Import studio take
              </button>
              <button onClick={copyForStudio} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-text-muted hover:text-text" title="Copy lyrics and style">
                {copied ? <Check size={14} className="text-accent" /> : <ClipboardCopy size={14} />} {copied ? "Copied" : "Copy lyrics & style"}
              </button>
              <input ref={fileRef} type="file" accept="audio/*,.mp3,.wav,.m4a" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importTake(f); e.target.value = ""; }} />
            </div>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Lyrics</span>
            <textarea value={draft.lyrics} onChange={(e) => setDraft({ ...draft, lyrics: e.target.value })} rows={16} className="mt-1 w-full rounded-lg border border-border bg-bg-deep px-3 py-2 font-mono text-[13px] leading-relaxed text-text focus:border-fuchsia-400 focus:outline-none" />
          </label>
        </div>
      )}

      {/* Takes */}
      {takes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Takes</p>
          {takes.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-deep px-3 py-2">
              <span className="w-28 text-xs font-medium text-text">{t.label}</span>
              <audio controls src={t.url} className="h-9 min-w-[220px] flex-1" />
              <button
                onClick={() => sendToStudio({ replace: false, clips: [{ url: t.url, name: `${title} — ${t.label}`, role: "jingle", start: 0 }] })}
                className="flex items-center gap-1.5 rounded-lg bg-fuchsia-500/15 px-3 py-1.5 text-xs font-medium text-fuchsia-200 hover:bg-fuchsia-500/25"
              >
                <Send size={12} /> Use in studio
              </button>
            </div>
          ))}
        </div>
      )}

      {err && <p className="text-xs text-red-400">{err}</p>}
    </div>
  );
}
