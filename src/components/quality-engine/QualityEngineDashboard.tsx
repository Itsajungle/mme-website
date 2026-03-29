"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Pencil,
  ShieldCheck,
  Award,
  Send,
  Activity,
  Clock,
  XCircle,
  Radio,
  Share2,
  TrendingUp,
  PieChart,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { AgentNode } from "./AgentNode";
import { FlowConnector } from "./FlowConnector";
import { PipelineItem } from "./PipelineItem";
import {
  AGENT_DATA,
  PIPELINE_ITEMS,
  PERFORMANCE_METRICS,
  TIMELINE_ENTRIES,
  type TimelineEntry,
} from "@/lib/quality-engine-demo-data";

const AGENT_ICONS = [Brain, Pencil, ShieldCheck, Award, Send];

/* ── Animation variants ── */
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

/* ── Main Dashboard ── */
export function QualityEngineDashboard() {
  const metrics = PERFORMANCE_METRICS;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <ShieldCheck size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-text">
              MME Quality Engine
            </h1>
            <p className="text-sm text-text-secondary">
              Real-time agent pipeline — content quality monitoring
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <motion.div
              className="h-2 w-2 rounded-full bg-accent"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-text-muted">Live</span>
          </div>
        </div>
      </motion.div>

      {/* ── Pipeline Visualization (full width) ── */}
      <motion.section variants={fadeUp}>
        <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium mb-4">
          Agent Pipeline
        </h2>

        {/* Desktop: horizontal */}
        <div className="hidden lg:flex items-center justify-center">
          {AGENT_DATA.map((agent, i) => (
            <div key={agent.name} className="flex items-center">
              <AgentNode
                name={agent.name}
                role={agent.role}
                status={agent.status}
                icon={AGENT_ICONS[i]}
                stats={agent.stats}
                accentColor={agent.accentColor}
                index={i}
              />
              {i < AGENT_DATA.length - 1 && (
                <FlowConnector
                  fromColor={AGENT_DATA[i].accentColor}
                  toColor={AGENT_DATA[i + 1].accentColor}
                  direction="horizontal"
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden flex flex-col items-center">
          {AGENT_DATA.map((agent, i) => (
            <div key={agent.name} className="flex flex-col items-center">
              <AgentNode
                name={agent.name}
                role={agent.role}
                status={agent.status}
                icon={AGENT_ICONS[i]}
                stats={agent.stats}
                accentColor={agent.accentColor}
                index={i}
              />
              {i < AGENT_DATA.length - 1 && (
                <FlowConnector
                  fromColor={AGENT_DATA[i].accentColor}
                  toColor={AGENT_DATA[i + 1].accentColor}
                  direction="vertical"
                />
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── 4-Column Grid: Timeline | Pipeline List + Metrics | Agent Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Activity Timeline */}
        <motion.section
          variants={fadeUp}
          className="lg:col-span-3 order-2 lg:order-1"
        >
          <ActivityTimeline entries={TIMELINE_ENTRIES} />
        </motion.section>

        {/* Center: Pipeline List + Quality Metrics */}
        <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
          {/* Live Pipeline */}
          <motion.section variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium">
                Live Pipeline
              </h2>
              <span className="text-xs text-text-muted font-mono">
                {PIPELINE_ITEMS.length} items
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {PIPELINE_ITEMS.map((item, i) => (
                <PipelineItem key={item.id} item={item} index={i} />
              ))}
            </div>
          </motion.section>

          {/* Quality Metrics */}
          <motion.section variants={fadeUp}>
            <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">
              Quality Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Approval Pie Chart */}
              <div className="rounded-xl bg-bg-card border border-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PieChart size={14} className="text-accent" />
                  <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                    Approval Breakdown
                  </span>
                </div>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={metrics.approvalBreakdown}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {metrics.approvalBreakdown.map((entry) => (
                          <Cell key={entry.label} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F1528",
                          border: "1px solid rgba(0,255,150,0.1)",
                          borderRadius: 8,
                          fontSize: 11,
                          color: "#E2E8F0",
                        }}
                        formatter={(value) => [`${value}%`, ""]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-1">
                  {metrics.approvalBreakdown.map((entry) => (
                    <div key={entry.label} className="flex items-center gap-1.5">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-[10px] text-text-muted">
                        {entry.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Trend Line */}
              <div className="rounded-xl bg-bg-card border border-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-accent" />
                  <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                    Quality Trend
                  </span>
                </div>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.qualityTrend}>
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#64748B", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[80, 92]}
                        tick={{ fill: "#64748B", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F1528",
                          border: "1px solid rgba(0,255,150,0.1)",
                          borderRadius: 8,
                          fontSize: 11,
                          color: "#E2E8F0",
                        }}
                        formatter={(value) => [
                          `${Number(value).toFixed(1)}`,
                          "Score",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#00FF96"
                        strokeWidth={2}
                        dot={{ fill: "#00FF96", r: 3 }}
                        activeDot={{ r: 5, fill: "#00FF96" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Stats Cards */}
              <MetricCard
                icon={Activity}
                label="Content Processed"
                accentColor="#00FF96"
              >
                <div className="flex items-baseline gap-3">
                  <div>
                    <AnimatedNumber value={metrics.totalToday} />
                    <p className="text-[10px] text-text-muted">Today</p>
                  </div>
                  <div>
                    <AnimatedNumber value={metrics.totalWeek} />
                    <p className="text-[10px] text-text-muted">Week</p>
                  </div>
                  <div>
                    <AnimatedNumber value={metrics.totalAllTime} />
                    <p className="text-[10px] text-text-muted">All time</p>
                  </div>
                </div>
              </MetricCard>

              <MetricCard
                icon={Award}
                label="Avg Quality Score"
                accentColor="#8B5CF6"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-text">
                    {metrics.avgQualityScore}
                  </span>
                  <span className="text-sm text-text-muted">/ 100</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#8B5CF6" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.avgQualityScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </MetricCard>

              <MetricCard
                icon={Clock}
                label="Avg Pipeline Time"
                accentColor="#F59E0B"
              >
                <span className="font-mono text-2xl font-bold text-text">
                  {metrics.avgPipelineTime}
                </span>
              </MetricCard>

              <MetricCard
                icon={XCircle}
                label="Top Rejection Reasons"
                accentColor="#EF4444"
              >
                <div className="space-y-1">
                  {metrics.rejectionReasons.slice(0, 3).map((r) => (
                    <div
                      key={r.reason}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[10px] text-text-secondary truncate mr-2">
                        {r.reason}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted shrink-0">
                        {r.count}
                      </span>
                    </div>
                  ))}
                </div>
              </MetricCard>
            </div>
          </motion.section>
        </div>

        {/* Right: Agent Cards */}
        <motion.section
          variants={fadeUp}
          className="lg:col-span-3 order-3"
        >
          <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">
            Agent Status
          </h2>
          <div className="space-y-3">
            {AGENT_DATA.map((agent, i) => (
              <AgentStatusCard
                key={agent.name}
                agent={agent}
                icon={AGENT_ICONS[i]}
                index={i}
              />
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

/* ── Activity Timeline ── */
function ActivityTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">
        Activity Timeline
      </h2>
      <div className="space-y-0 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            variants={slideInLeft}
            initial="hidden"
            animate="show"
            transition={{ delay: i * 0.05 }}
            className="relative pl-6 pb-4"
          >
            {/* Vertical line */}
            {i < entries.length - 1 && (
              <div
                className="absolute left-[9px] top-5 bottom-0 w-px"
                style={{ backgroundColor: `${entry.agentColor}30` }}
              />
            )}

            {/* Dot */}
            <div
              className="absolute left-0 top-1 h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: entry.agentColor,
                backgroundColor: `${entry.agentColor}15`,
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.agentColor }}
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: entry.agentColor }}
                >
                  {entry.agent}
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  {entry.timestamp}
                </span>
              </div>
              <p className="text-xs font-semibold text-text">{entry.action}</p>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {entry.detail}
              </p>
              {entry.contentId && (
                <span className="inline-block mt-1 font-mono text-[9px] text-text-muted bg-white/5 rounded px-1.5 py-0.5">
                  {entry.contentId}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Agent Status Card (right sidebar) ── */
function AgentStatusCard({
  agent,
  icon: Icon,
  index,
}: {
  agent: (typeof AGENT_DATA)[number];
  icon: typeof Activity;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="rounded-xl bg-bg-card border border-border p-3 hover:border-border-hover transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
          style={{ backgroundColor: `${agent.accentColor}15` }}
        >
          <Icon size={16} style={{ color: agent.accentColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-heading text-sm font-semibold text-text">
              {agent.name}
            </p>
            <StatusBadge status={agent.status} color={agent.accentColor} />
          </div>
          <p className="text-[10px] text-text-muted">{agent.role}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border">
        <div>
          <p className="text-[9px] text-text-muted uppercase tracking-wider font-medium">
            Tasks
          </p>
          <p className="font-mono text-xs font-bold text-text">
            {agent.stats.tasksToday}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-text-muted uppercase tracking-wider font-medium">
            Avg
          </p>
          <p className="font-mono text-xs font-bold text-text">
            {agent.stats.avgTime}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-text-muted uppercase tracking-wider font-medium">
            Pass
          </p>
          <p
            className="font-mono text-xs font-bold"
            style={{ color: agent.accentColor }}
          >
            {agent.stats.approvalRate}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Status Badge ── */
function StatusBadge({
  status,
  color,
}: {
  status: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {status === "processing" && (
        <motion.div
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#F59E0B" }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      {status === "complete" && (
        <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
      )}
      {status === "idle" && (
        <div className="h-1.5 w-1.5 rounded-full bg-text-muted" />
      )}
      <span
        className={cn(
          "text-[9px] uppercase tracking-wider font-medium",
          status === "idle" && "text-text-muted",
          status === "complete" && "text-green-400",
          status === "processing" && "text-amber-400"
        )}
      >
        {status === "idle" ? "Idle" : status === "processing" ? "Active" : "Done"}
      </span>
    </div>
  );
}

/* ── Metric Card ── */
function MetricCard({
  icon: Icon,
  label,
  accentColor,
  children,
}: {
  icon: typeof Activity;
  label: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-bg-card border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon size={12} style={{ color: accentColor }} />
        </div>
        <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

/* ── Animated Number ── */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame: number;
    const duration = 800;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span ref={ref} className="font-mono text-2xl font-bold text-text block">
      {display.toLocaleString()}
    </span>
  );
}
