"use client";

import type { ClipFx, TrackRole } from "./types";

// Anything on the page (Jingle Studio, the ad generator) can drop audio into the studio.
export interface IncomingClip {
  url: string;
  name: string;
  role: TrackRole;      // the studio picks the first free track of this role
  trackId?: string;     // or a specific track
  start?: number;       // defaults to the playhead
  gain?: number;
  fx?: ClipFx;
  fadeIn?: number;
  fadeOut?: number;
  duration?: number;    // play length; defaults to the full file
}

export interface IncomingSession {
  replace: boolean;     // true = start a fresh session with these clips
  clips: IncomingClip[];
  length?: number;
}

const EVT = "mme-studio-incoming";

export function sendToStudio(session: IncomingSession) {
  window.dispatchEvent(new CustomEvent<IncomingSession>(EVT, { detail: session }));
  document.getElementById("mme-studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function onStudioIncoming(fn: (s: IncomingSession) => void) {
  const h = (e: Event) => fn((e as CustomEvent<IncomingSession>).detail);
  window.addEventListener(EVT, h);
  return () => window.removeEventListener(EVT, h);
}
