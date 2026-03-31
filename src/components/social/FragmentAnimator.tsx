"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Download, Palette, Sparkles, Zap } from "lucide-react";

const GRID_SIZE = 30;

interface FragmentAnimatorProps {
  logoUrl?: string;
  onVideoRecorded?: (blob: Blob) => void;
  initialBgColor?: string;
  initialGlowColor?: string;
  compact?: boolean;
  targetAspectRatio?: string; // "9:16" | "16:9" | "1:1" | "4:5"
}

const CANVAS_SIZES: Record<string, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
};

interface Fragment {
  x: number; y: number;
  targetX: number; targetY: number;
  rotation: number; targetRotation: number;
  radius: number; sourceX: number; sourceY: number;
}

type PresetName = "spiral" | "explode" | "rain" | "vortex" | "wave" | "shatter" | "matrix";

const PRESETS: Record<PresetName, (img: HTMLImageElement, i: number, j: number) => { x: number; y: number; rotation: number }> = {
  spiral: (img, i, j) => {
    const cx = img.width / 2, cy = img.height / 2;
    const angle = (i * GRID_SIZE + j) * 0.15;
    const dist = Math.max(img.width, img.height) * 1.8;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, rotation: angle * 3 };
  },
  explode: (img) => ({
    x: Math.random() * img.width * 5 - img.width * 2,
    y: Math.random() * img.height * 5 - img.height * 2,
    rotation: Math.random() * Math.PI * 8 - Math.PI * 4,
  }),
  rain: (img, i) => ({
    x: (i / GRID_SIZE) * img.width + (Math.random() - 0.5) * 100,
    y: -Math.random() * img.height * 3,
    rotation: (Math.random() - 0.5) * 2,
  }),
  vortex: (img) => {
    const cx = img.width / 2, cy = img.height / 2;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.max(img.width, img.height) * (0.8 + Math.random() * 1.2);
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, rotation: angle * 6 };
  },
  wave: (img, i, j) => ({
    x: (i / GRID_SIZE) * img.width,
    y: -img.height * 0.5 - j * 40 - Math.random() * 200,
    rotation: Math.sin(i * 0.3) * 1.5,
  }),
  shatter: (img, i, j) => {
    const cx = img.width / 2, cy = img.height / 2;
    const dx = (i / GRID_SIZE) * img.width - cx;
    const dy = (j / GRID_SIZE) * img.height - cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.max(img.width, img.height) * (1.5 + Math.random());
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, rotation: (Math.random() - 0.5) * 10 };
  },
  matrix: (img, _i, j) => ({
    x: Math.random() * img.width,
    y: img.height + j * 60 + Math.random() * 400,
    rotation: 0,
  }),
};

const GLOW_PRESETS = [
  { name: "MME Green", color: "#00FF96" },
  { name: "Amber", color: "#F59E0B" },
  { name: "Blue", color: "#3B82F6" },
  { name: "Pink", color: "#EC4899" },
  { name: "White", color: "#FFFFFF" },
  { name: "Gold", color: "#FFD700" },
  { name: "Red", color: "#EF4444" },
  { name: "Purple", color: "#A855F7" },
];

const PRESET_NAMES: PresetName[] = ["spiral", "explode", "rain", "vortex", "wave", "shatter", "matrix"];

export default function FragmentAnimator({
  logoUrl,
  onVideoRecorded,
  initialBgColor = "#0A0F1E",
  initialGlowColor = "#00FF96",
  compact = false,
  targetAspectRatio = "9:16",
}: FragmentAnimatorProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preset, setPreset] = useState<PresetName>("spiral");
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [glowColor, setGlowColor] = useState(initialGlowColor);
  const [glowIntensity, setGlowIntensity] = useState(30);
  const [speed, setSpeed] = useState(0.04);
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fragmentsRef = useRef<Fragment[]>([]);
  const requestRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const holdCountRef = useRef(0);

  // Load logo from URL prop
  useEffect(() => {
    if (!logoUrl) return;
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setIsAnimating(false);
      setProgress(0);
      progressRef.current = 0;
    };
    img.onerror = () => {
      console.error('[FragmentAnimator] Failed to load logo:', logoUrl);
    };
    img.src = logoUrl;
  }, [logoUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setIsAnimating(false);
        setProgress(0);
        progressRef.current = 0;
        initFragments(img, preset);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const initFragments = useCallback((img: HTMLImageElement, presetName: PresetName) => {
    const fragments: Fragment[] = [];
    const stepX = img.width / GRID_SIZE;
    const stepY = img.height / GRID_SIZE;
    const presetFn = PRESETS[presetName];
    for (let i = 0; i <= GRID_SIZE; i++) {
      for (let j = 0; j <= GRID_SIZE; j++) {
        const sourceX = i * stepX, sourceY = j * stepY;
        const start = presetFn(img, i, j);
        fragments.push({
          x: start.x, y: start.y,
          targetX: sourceX, targetY: sourceY,
          rotation: start.rotation, targetRotation: 0,
          radius: (stepX / 2) * 1.6, sourceX, sourceY,
        });
      }
    }
    fragmentsRef.current = fragments;
  }, []);

  // Init fragments when image loads
  useEffect(() => {
    if (image) {
      initFragments(image, preset);
      setTimeout(() => draw(), 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !image) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (progressRef.current >= 0.99 && !isAnimating) {
      const { scaledW, scaledH, offsetX, offsetY } = calcLogoTransform(image);
      if (glowEnabled) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowIntensity;
      }
      ctx.drawImage(image, offsetX, offsetY, scaledW, scaledH);
      ctx.shadowBlur = 0;
      return;
    }

    const p = progressRef.current;
    fragmentsRef.current.forEach((frag) => {
      ctx.save();
      ctx.translate(frag.x, frag.y);
      ctx.rotate(frag.rotation);
      if (glowEnabled && p > 0.4) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowIntensity * 0.5 * ((p - 0.4) / 0.6);
      }
      ctx.globalAlpha = 0.25 + p * 0.75;
      ctx.beginPath();
      ctx.arc(0, 0, frag.radius, 0, Math.PI * 2);
      ctx.clip();
      // Map fragment source coords back to original image space for sampling
      const { scale, offsetX, offsetY } = calcLogoTransform(image);
      const origSrcX = (frag.sourceX - offsetX) / scale;
      const origSrcY = (frag.sourceY - offsetY) / scale;
      const origRadius = frag.radius / scale;
      ctx.drawImage(image,
        origSrcX - origRadius, origSrcY - origRadius, origRadius * 2, origRadius * 2,
        -frag.radius, -frag.radius, frag.radius * 2, frag.radius * 2);
      ctx.restore();
    });
  }, [image, isAnimating, glowEnabled, glowColor, glowIntensity, bgColor, calcLogoTransform]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, []);

  const animate = useCallback(() => {
    if (!isAnimating || !image) return;
    let totalDist = 0, maxDist = 0;
    fragmentsRef.current.forEach((frag) => {
      const dx = frag.targetX - frag.x, dy = frag.targetY - frag.y, dr = frag.targetRotation - frag.rotation;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalDist += dist;
      maxDist = Math.max(maxDist, dist);
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05 || Math.abs(dr) > 0.005) {
        const ef = speed * (1 + (1 - dist / (maxDist || 1)) * 0.02);
        frag.x += dx * ef; frag.y += dy * ef; frag.rotation += dr * ef;
      } else { frag.x = frag.targetX; frag.y = frag.targetY; frag.rotation = frag.targetRotation; }
    });
    const avg = totalDist / (fragmentsRef.current.length || 1);
    const maxInit = Math.max(image.width, image.height) * 2;
    progressRef.current = Math.min(1, 1 - avg / maxInit);
    setProgress(progressRef.current);
    draw();

    if (maxDist < 0.1) {
      progressRef.current = 1; setProgress(1); draw();
      if (isRecording) {
        holdCountRef.current = 0;
        const holdLoop = () => {
          holdCountRef.current++;
          draw();
          if (holdCountRef.current < 60) { requestRef.current = requestAnimationFrame(holdLoop); }
          else { stopRecording(); setIsAnimating(false); }
        };
        requestRef.current = requestAnimationFrame(holdLoop);
      } else { setIsAnimating(false); }
    } else { requestRef.current = requestAnimationFrame(animate); }
  }, [isAnimating, draw, speed, image, isRecording, stopRecording]);

  useEffect(() => {
    if (isAnimating) { requestRef.current = requestAnimationFrame(animate); }
    else if (requestRef.current) cancelAnimationFrame(requestRef.current);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isAnimating, animate]);

  const startAnimation = () => {
    if (!image) return;
    progressRef.current = 0;
    initFragments(image, preset);
    setTimeout(() => { setIsAnimating(true); setProgress(0); }, 50);
  };

  const resetAnimation = () => {
    if (!image) return;
    setIsAnimating(false); setIsRecording(false); setProgress(0); progressRef.current = 0;
    initFragments(image, preset);
    setTimeout(() => draw(), 50);
  };

  const changePreset = (p: PresetName) => {
    setPreset(p);
    if (image) {
      setIsAnimating(false); setProgress(0); progressRef.current = 0;
      initFragments(image, p);
      setTimeout(() => draw(), 50);
    }
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    chunksRef.current = [];
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 8000000 });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      if (onVideoRecorded) onVideoRecorded(blob);
      else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "logo-reveal.webm"; a.click();
        URL.revokeObjectURL(url);
      }
      setIsRecording(false);
    };
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    progressRef.current = 0;
    initFragments(image, preset);
    setTimeout(() => { setIsAnimating(true); setProgress(0); }, 100);
  };

  // Use target aspect ratio for canvas, scale logo to fit within it
  const targetSize = CANVAS_SIZES[targetAspectRatio] || CANVAS_SIZES["9:16"];
  const canvasW = targetSize.width;
  const canvasH = targetSize.height;

  // Logo scaling helper — centres logo within canvas at max 70% width, 40% height
  function calcLogoTransform(img: HTMLImageElement) {
    const maxW = canvasW * 0.7;
    const maxH = canvasH * 0.4;
    const scale = Math.min(maxW / img.width, maxH / img.height);
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;
    const offsetX = (canvasW - scaledW) / 2;
    const offsetY = (canvasH - scaledH) / 2;
    return { scale, scaledW, scaledH, offsetX, offsetY };
  }



  // Calculate logo scale and position to fit centred in canvas


  return (
    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Logo Animation Studio</span>
        </div>
        <div className="flex items-center gap-2">
          {isRecording && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-red-400 font-mono">REC</span>
            </span>
          )}
          <span className="text-[10px] text-white/30 font-mono">
            {progress >= 0.99 ? "COMPLETE" : isAnimating ? `${Math.round(progress * 100)}%` : "READY"}
          </span>
        </div>
      </div>

      <div className={`grid ${compact ? "grid-cols-1" : "lg:grid-cols-[1fr_320px]"}`}>
        {/* Canvas */}
        <div className="relative flex items-center justify-center p-6 min-h-[300px]" style={{ backgroundColor: bgColor }}>
          {!image ? (
            <div className="text-center">
              <div className="relative inline-block">
                <input type="file" accept="image/*" onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-emerald-500/40 flex items-center justify-center mb-4 mx-auto cursor-pointer hover:border-emerald-500/70 transition-colors">
                  <span className="text-3xl text-emerald-500/50">+</span>
                </div>
              </div>
              <p className="text-sm text-white/50">Upload a logo image</p>
              <p className="text-[10px] text-white/30 mt-1">or use the brand logo from your kit</p>
            </div>
          ) : (
            <div className="relative">
              <canvas ref={canvasRef} width={canvasW} height={canvasH}
                className="max-w-full max-h-[400px] object-contain block rounded" />
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${glowColor}, ${glowColor}88)` }} />
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="border-l border-white/10 p-4 space-y-4 bg-white/[0.02] overflow-y-auto max-h-[600px]">
          {/* Animation Style */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Animation Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_NAMES.map((p) => (
                <button key={p} onClick={() => changePreset(p)}
                  className={`px-3 py-2 rounded text-xs capitalize transition-all ${
                    preset === p
                      ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-semibold"
                      : "bg-white/[0.03] border border-white/10 text-white/50 hover:text-white/70 hover:border-white/20"
                  }`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Speed */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Speed</label>
            <input type="range" min="0.01" max="0.12" step="0.005" value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-emerald-500" />
            <div className="flex justify-between text-[10px] text-white/30 mt-1"><span>Slow</span><span>Fast</span></div>
          </div>

          {/* Background */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
              <Palette size={10} /> Background
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <div className="w-8 h-8 rounded border-2 border-emerald-500/50 cursor-pointer" style={{ backgroundColor: bgColor }} />
              </div>
              <div className="flex gap-1 flex-wrap">
                {["#040810", "#0A0F1E", "#000000", "#1a1a2e", "#1e293b", "#FFFFFF"].map((c) => (
                  <button key={c} onClick={() => setBgColor(c)}
                    className={`w-6 h-6 rounded transition-all ${bgColor === c ? "ring-2 ring-emerald-500 scale-110" : "ring-1 ring-white/15"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <span className="text-[10px] text-white/30 font-mono mt-1 block">{bgColor.toUpperCase()}</span>
          </div>

          {/* Glow */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
              <Zap size={10} /> Glow Effect
            </label>
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setGlowEnabled(!glowEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${glowEnabled ? "bg-emerald-500" : "bg-white/20"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${glowEnabled ? "left-5" : "left-0.5"}`} />
              </button>
              <span className="text-xs text-white/60">{glowEnabled ? "On" : "Off"}</span>
            </div>
            {glowEnabled && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <input type="color" value={glowColor} onChange={(e) => setGlowColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div className="w-7 h-7 rounded cursor-pointer border border-white/20" style={{ backgroundColor: glowColor, boxShadow: `0 0 12px ${glowColor}80` }} />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {GLOW_PRESETS.map((g) => (
                      <button key={g.color} onClick={() => setGlowColor(g.color)} title={g.name}
                        className={`w-5 h-5 rounded transition-all ${glowColor === g.color ? "ring-2 ring-white scale-110" : "ring-1 ring-white/20"}`}
                        style={{ backgroundColor: g.color }} />
                    ))}
                  </div>
                </div>
                <input type="range" min="5" max="80" value={glowIntensity}
                  onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                  className="w-full accent-emerald-500" />
                <div className="flex justify-between text-[10px] text-white/30 mt-1">
                  <span>Subtle</span><span>{glowIntensity}px</span><span>Intense</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={startAnimation} disabled={!image || isAnimating}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold uppercase bg-emerald-500 text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors">
                <Play size={12} fill="currentColor" /> Play
              </button>
              <button onClick={resetAnimation} disabled={!image || isAnimating}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase border border-emerald-500/50 text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-500/10 transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
            </div>
            <button onClick={startRecording} disabled={!image || isAnimating || isRecording}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase border border-amber-500/50 text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-500/10 transition-colors">
              <Download size={12} /> Record Video
            </button>
          </div>

          {/* Upload alternative */}
          {!logoUrl && image && (
            <div className="pt-2 border-t border-white/10">
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="text-center text-[10px] text-white/30 py-2 border border-dashed border-white/10 rounded cursor-pointer hover:border-white/20 transition-colors">
                  Upload different image
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
