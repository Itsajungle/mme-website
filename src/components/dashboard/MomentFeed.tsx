"use client";

import { Sun, Trophy, CloudRain, TrendingUp, Newspaper } from "lucide-react";

const SIMULATED_MOMENTS = [
  { icon: Sun, label: "Sunny weekend forecast", time: "2 hours ago", type: "weather" },
  { icon: Trophy, label: "Local sports result", time: "5 hours ago", type: "sport" },
  { icon: CloudRain, label: "Rain warning issued", time: "1 day ago", type: "weather" },
  { icon: TrendingUp, label: "Trending local event", time: "1 day ago", type: "culture" },
  { icon: Newspaper, label: "Breaking local news", time: "2 days ago", type: "news" },
];

export function MomentFeed() {
  return (
    <div className="space-y-3">
      {SIMULATED_MOMENTS.map((moment, i) => {
        const Icon = moment.icon;
        return (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg-deep px-4 py-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Icon size={16} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text">{moment.label}</p>
              <p className="text-xs text-text-muted">{moment.time}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-text-muted px-2 py-0.5 rounded bg-white/5">
              {moment.type}
            </span>
          </div>
        );
      })}
    </div>
  );
}
