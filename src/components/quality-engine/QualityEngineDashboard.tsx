"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Pencil,
  ShieldCheck,
  Award,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Radio,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentNode } from "./AgentNode";
import { FlowConnector } from "./FlowConnector";
import { PipelineItem } from "./PipelineItem";
import {
  AGENT_DATA,
  PIPELINE_ITEMS,
  PERFORMANCE_METRICS,
} from "@/lib/quality-engine-demo-data";

const AGENT_ICONS = [Brain, Pencil, ShieldCheck, Award];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function QualityEngineDashboard() {
  const metrics = PERFORMANCE_METRICS;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-8"
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
              Real-time content pipeline — agent chain monitoring
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── A) Agent Org Chart ── */}
      <motion.section variants={fadeUp}>
        <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium mb-4">
          Agent Chain
        </h2>

        {/* Desktop: horizontal */}
        <div className="hidden lg:flex items-center justify-center gap-0">
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
        <div className="lg:hidden flex flex-col items-center gap-0">
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

      {/* ── B) Live Pipeline View ── */}
      <motion.section variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium">
            Live Pipeline
          </h2>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="h-2 w-2 rounded-full bg-accent"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-text-muted">
              {PIPELINE_ITEMS.length} items in pipeline
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {PIPELINE_ITEMS.map((item, i) => (
            <PipelineItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </motion.section>

      {/* ── C) Performance Metrics ── */}
      <motion.section variants={fadeUp}>
        <h2 className="text-xs text-text-muted uppercase tracking-wider font-medium mb-4">
          Performance Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Total processed */}
          <MetricCard
            icon={Activity}
            label="Content Processed"
            accentColor="#00FF96"
          >
            <div className="flex items-baseline gap-3">
              <div>
                <AnimatedNumber value={metrics.totalToday} />
                <p className="text-xs text-text-muted">Today</p>
              </div>
              <div>
                <AnimatedNumber value={metrics.totalWeek} />
                <p className="text-xs text-text-muted">This week</p>
              </div>
              <div>
                <AnimatedNumber value={metrics.totalAllTime} />
                <p className="text-xs text-text-muted">All time</p>
              </div>
            </div>
          </MetricCard>

          {/* Quality score */}
          <MetricCard
            icon={Award}
            label="Average Quality Score"
            accentColor="#8B5CF6"
          >
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold text-text">
                {metrics.avgQualityScore}
              </span>
              <span className="text-sm text-text-muted">/ 100</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "#8B5CF6" }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.avgQualityScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </MetricCard>

          {/* Approval rates */}
          <MetricCard
            icon={CheckCircle2}
            label="Approval Rates"
            accentColor="#00FF96"
          >
            <div className="flex gap-4">
              <div>
                <span className="font-mono text-2xl font-bold text-accent">
                  {metrics.firstPassApproval}%
                </span>
                <p className="text-xs text-text-muted">First pass</p>
              </div>
              <div>
                <span className="font-mono text-2xl font-bold text-accent">
                  {metrics.afterRevisionApproval}%
                </span>
                <p className="text-xs text-text-muted">After revision</p>
              </div>
            </div>
          </MetricCard>

          {/* Pipeline time */}
          <MetricCard
            icon={Clock}
            label="Avg Pipeline Time"
            accentColor="#F59E0B"
          >
            <span className="font-mono text-2xl font-bold text-text">
              {metrics.avgPipelineTime}
            </span>
          </MetricCard>

          {/* Content by type */}
          <MetricCard
            icon={BarChart3}
            label="Content by Type"
            accentColor="#3B82F6"
          >
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Radio size={12} className="text-purple-400" />
                    <span className="text-xs text-text-secondary">Radio</span>
                  </div>
                  <span className="font-mono text-xs text-text-secondary">{metrics.radioCount}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(metrics.radioCount / (metrics.radioCount + metrics.socialCount)) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Share2 size={12} className="text-blue-400" />
                    <span className="text-xs text-text-secondary">Social</span>
                  </div>
                  <span className="font-mono text-xs text-text-secondary">{metrics.socialCount}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(metrics.socialCount / (metrics.radioCount + metrics.socialCount)) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
            </div>
          </MetricCard>

          {/* Rejection reasons */}
          <MetricCard
            icon={XCircle}
            label="Rejection Reasons"
            accentColor="#EF4444"
          >
            <div className="space-y-1.5">
              {metrics.rejectionReasons.map((r) => (
                <div key={r.reason} className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary truncate mr-2">{r.reason}</span>
                  <span className="font-mono text-xs text-text-muted shrink-0">{r.count}</span>
                </div>
              ))}
            </div>
          </MetricCard>
        </div>
      </motion.section>
    </motion.div>
  );
}

/* ── Helper components ── */

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
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon size={14} style={{ color: accentColor }} />
        </div>
        <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      className="font-mono text-2xl font-bold text-text block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}
