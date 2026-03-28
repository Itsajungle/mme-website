"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  ImageIcon,
  Shield,
  Send,
  Briefcase,
  AtSign,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceStatus } from "@/lib/social-engine/types";

interface ServiceRow {
  key: keyof ServiceStatus;
  label: string;
  icon: typeof Sparkles;
}

const SERVICE_ROWS: ServiceRow[] = [
  { key: "contentAI", label: "Content AI", icon: Sparkles },
  { key: "imageAI", label: "Image AI", icon: ImageIcon },
  { key: "qualityChain", label: "Advanced Review", icon: Shield },
  { key: "instagram", label: "Instagram", icon: Send },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase },
  { key: "x", label: "X", icon: AtSign },
  { key: "facebook", label: "Facebook", icon: Globe },
];

export function SocialEngineStatus() {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/social/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      const data = await res.json();
      setStatus(data.status as ServiceStatus);
    } catch {
      setError("Could not load engine status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const isDemoMode =
    status != null &&
    Object.values(status).filter((v) => v === "demo").length >= 4;

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Wifi size={16} className="text-accent" />
        </div>
        <span className="font-semibold text-sm text-text flex-1">Engine Status</span>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-deep border border-border text-xs text-text-muted hover:text-text transition-colors disabled:opacity-40"
        >
          <RefreshCw size={11} className={cn(loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Demo mode banner */}
      {isDemoMode && (
        <div className="px-5 py-2.5 bg-amber-400/10 border-b border-amber-400/20 flex items-center gap-2">
          <AlertCircle size={13} className="text-amber-400 shrink-0" />
          <span className="text-[11px] text-amber-400 font-mono">
            Demo Mode — most services are not yet configured
          </span>
        </div>
      )}

      {/* Status rows */}
      <div className="divide-y divide-border">
        {loading && !status && (
          <div className="px-5 py-8 flex items-center justify-center">
            <RefreshCw size={16} className="text-text-muted animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-5 py-4 flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        {status &&
          SERVICE_ROWS.map((row) => {
            const Icon = row.icon;
            const isLive = status[row.key] === "live";

            return (
              <div
                key={row.key}
                className="flex items-center gap-3 px-5 py-3"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-deep border border-border shrink-0">
                  <Icon size={13} className="text-text-muted" />
                </div>

                <span className="flex-1 text-sm text-text">{row.label}</span>

                {isLive ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                    <CheckCircle2 size={11} className="text-accent" />
                    <span className="text-[11px] font-mono text-accent">Connected</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-[11px] font-mono text-amber-400">Not Configured</span>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
