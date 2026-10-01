"use client";

import { useEffect, useRef } from "react";
import { getPeaks } from "./audio";

/** Draws the visible slice [offset, offset+duration] of a source file's waveform. */
export function Waveform({
  url,
  offset,
  duration,
  width,
  height,
  color,
}: {
  url: string;
  offset: number;
  duration: number;
  width: number;
  height: number;
  color: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    getPeaks(url)
      .then(({ peaks, perSecond }) => {
        const cv = ref.current;
        if (cancelled || !cv) return;
        const dpr = window.devicePixelRatio || 1;
        const w = Math.max(1, Math.floor(width));
        cv.width = w * dpr;
        cv.height = height * dpr;
        const g = cv.getContext("2d");
        if (!g) return;
        g.scale(dpr, dpr);
        g.clearRect(0, 0, w, height);
        g.fillStyle = color;
        const mid = height / 2;
        const a = offset * perSecond;
        const span = duration * perSecond;
        for (let x = 0; x < w; x++) {
          const i0 = Math.floor(a + (x / w) * span);
          const i1 = Math.max(i0 + 1, Math.floor(a + ((x + 1) / w) * span));
          let m = 0;
          for (let i = i0; i < i1 && i < peaks.length; i++) if (peaks[i] > m) m = peaks[i];
          const h = Math.max(1, m * (height - 4));
          g.fillRect(x, mid - h / 2, 1, h);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, offset, duration, width, height, color]);

  return <canvas ref={ref} style={{ width, height }} className="pointer-events-none block" />;
}
