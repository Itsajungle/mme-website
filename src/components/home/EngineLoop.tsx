"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  Radar,
  Sparkles,
  ShieldCheck,
  Send,
  MessagesSquare,
  TrendingUp,
  Search,
  CheckCircle2,
  Mic,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ENGINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Radar,
  Sparkles,
  ShieldCheck,
  Send,
  MessagesSquare,
  TrendingUp,
  Search,
  CheckCircle2,
  Mic,
};

const STEP_MS = 1900;

type LogLine = { id: number; time: string; msg: string; hot: boolean };

function logMessage(stageKey: string, topic: string): string {
  switch (stageKey) {
    case "detect":
      return `Trend spotted: ${topic}`;
    case "produce":
      return `Drafting posts, image and video for ${topic}`;
    case "check":
      return "Agents reviewing — brand, quality & voice";
    case "distribute":
      return "Published to the right channels";
    case "engage":
      return "Engagement: replies in, members connecting";
    case "learn":
      return "Learned what worked — fed back into Detect ↺";
    default:
      return topic;
  }
}

/** A KPI counter that count-ups when in view and re-animates whenever its
 *  target ticks up as a piece moves through the engine. */
function KpiCounter({
  target,
  active,
  comma,
}: {
  target: number;
  active: boolean;
  comma?: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const from = fromRef.current;
    const start = performance.now();
    const duration = 1000;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  const rounded = Math.round(display);
  return <>{comma ? rounded.toLocaleString() : rounded}</>;
}

export function EngineLoop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: "-120px" });
  const reduce = useReducedMotion();

  const stages = ENGINE.stages;
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<string>(ENGINE.topics[0]);
  const [log, setLog] = useState<LogLine[]>([]);
  const [kpis, setKpis] = useState<number[]>(ENGINE.kpis.map((k) => k.value));

  // refs to dodge stale closures inside the interval
  const stepRef = useRef(0);
  const topicRef = useRef<string>(ENGINE.topics[0]);
  const logIdRef = useRef(0);

  useEffect(() => {
    if (!inView) return;

    const advance = () => {
      const i = stepRef.current;
      const stage = stages[i];
      const currentTopic = topicRef.current;

      setStep(i);
      setLog((prev) => {
        const next: LogLine = {
          id: logIdRef.current++,
          time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          msg: logMessage(stage.key, currentTopic),
          hot: stage.key === "detect",
        };
        return [next, ...prev].slice(0, 7);
      });

      // live counters react as the piece travels
      setKpis((prev) => {
        const next = [...prev];
        if (stage.key === "check") next[2] += 5; // checks passed
        if (stage.key === "distribute")
          next[3] += Math.floor(Math.random() * 900) + 300; // reach
        if (stage.key === "engage")
          next[3] += Math.floor(Math.random() * 500) + 120; // reach
        if (stage.key === "learn") next[4] += 1; // insights
        return next;
      });

      // step on; loop back to Detect and pick a fresh topic
      let nextStep = i + 1;
      if (nextStep >= stages.length) {
        nextStep = 0;
        const t = ENGINE.topics[Math.floor(Math.random() * ENGINE.topics.length)];
        topicRef.current = t;
        setTopic(t);
      }
      stepRef.current = nextStep;
    };

    advance();
    const id = setInterval(advance, STEP_MS);
    return () => clearInterval(id);
  }, [inView, stages]);

  const current = stages[step];
  const agentsActive = current.key === "check";

  return (
    <Section id="how-it-works">
      <div ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader title={ENGINE.headline} subtitle={ENGINE.body} />
        </motion.div>

        {/* Status + self-narrating caption */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-bg-card/60 text-xs font-mono text-accent mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            ENGINE RUNNING
          </div>
          <div className="min-h-[3.5rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.key}
                initial={{ opacity: 0, y: reduce ? 0 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : 6 }}
                transition={{ duration: 0.35 }}
                className="font-heading text-lg sm:text-xl font-semibold text-text"
              >
                <span className="text-accent font-mono mr-2">{current.num}</span>
                {current.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {ENGINE.kpis.map((k, i) => (
            <div
              key={k.key}
              className="rounded-[var(--radius)] border border-border bg-bg-card p-4"
            >
              <div className="text-[11px] uppercase tracking-wide font-mono text-text-muted">
                {k.label}
              </div>
              <div className="text-2xl font-bold text-text mt-1 tabular-nums">
                <KpiCounter
                  target={kpis[i]}
                  active={inView}
                  comma={k.value >= 1000}
                />
              </div>
              <div className="text-[11px] text-accent font-medium mt-0.5">
                ▲ {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((s, i) => {
            const Icon = iconMap[s.icon];
            const isActive = i === step;
            const isDone = i < step;
            return (
              <motion.div
                key={s.key}
                animate={{
                  y: isActive && !reduce ? -5 : 0,
                  borderColor: isActive
                    ? "var(--green)"
                    : "var(--border)",
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative rounded-[var(--radius-lg)] border bg-bg-card p-4 text-center flex flex-col items-center",
                  isActive && "shadow-[0_10px_30px_-12px_var(--green-glow)]"
                )}
              >
                <span className="absolute top-2 left-3 text-[10px] font-mono font-bold text-text-muted">
                  {s.num}
                </span>
                <motion.div
                  animate={{ scale: isActive && !reduce ? 1.06 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                    isActive
                      ? "bg-accent text-bg"
                      : isDone
                        ? "bg-accent/15 text-accent"
                        : "bg-bg-card-hover text-text-muted"
                  )}
                >
                  <Icon size={22} />
                </motion.div>
                <h4
                  className={cn(
                    "font-heading text-sm font-bold uppercase tracking-wide",
                    isActive ? "text-text" : "text-text-secondary"
                  )}
                >
                  {s.title}
                </h4>
                <p className="hidden sm:block text-[11px] text-text-muted mt-1 leading-snug">
                  {s.blurb}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Feedback loop */}
        <div className="relative my-5 h-14">
          <svg
            viewBox="0 0 1200 56"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <marker
                id="engine-arrow"
                markerWidth="10"
                markerHeight="10"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--green)" />
              </marker>
            </defs>
            <path
              d="M1192,2 C1192,44 1192,52 1110,52 L90,52 C8,52 8,44 8,4"
              fill="none"
              stroke="var(--green)"
              strokeWidth="2"
              strokeDasharray="7 6"
              markerEnd="url(#engine-arrow)"
              opacity="0.55"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-1.5 text-xs font-medium text-accent whitespace-nowrap">
            <RefreshCw size={13} className={reduce ? "" : "animate-spin-slow"} />
            {ENGINE.loopLabel}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Agent band */}
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold text-text">
                Inside the Check stage
              </h3>
              <span className="text-[11px] font-mono text-text-muted">
                {agentsActive
                  ? "reviewing… all roles passing ✓"
                  : "idle · waiting for content"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ENGINE.agents.map((a, idx) => {
                const Icon = iconMap[a.icon];
                return (
                  <motion.div
                    key={a.key}
                    animate={{
                      borderColor: agentsActive
                        ? "var(--green)"
                        : "var(--border)",
                      backgroundColor: agentsActive
                        ? "rgba(0,255,150,0.06)"
                        : "rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.3, delay: agentsActive ? idx * 0.12 : 0 }}
                    className="flex items-center gap-3 rounded-lg border p-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text leading-tight">
                        {a.title}
                      </div>
                      <div
                        className={cn(
                          "text-[11px] mt-0.5 transition-colors",
                          agentsActive
                            ? "text-accent font-medium"
                            : "text-text-muted"
                        )}
                      >
                        {agentsActive ? "passed ✓" : a.role}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Live log */}
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-deep p-5">
            <div className="flex items-center gap-2 mb-3 text-[11px] uppercase tracking-wide font-mono font-bold text-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Live engine log
            </div>
            <div className="font-mono text-xs leading-relaxed min-h-[150px]">
              <AnimatePresence initial={false}>
                {log.map((line) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: reduce ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex gap-3 py-0.5"
                  >
                    <span className="text-text-muted shrink-0">{line.time}</span>
                    <span className={line.hot ? "text-accent" : "text-text-secondary"}>
                      {line.msg}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
