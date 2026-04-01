"use client";

import { motion } from "framer-motion";
import { Building2, Radio, Layers, Activity, Megaphone, Music } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StationCard } from "@/components/dashboard/StationCard";
import { DashboardAnalyticsSummary } from "@/components/analytics/DashboardAnalyticsSummary";
import { getStationGroups } from "@/lib/clients";
import { getBrandsByStation } from "@/lib/demo-data";

export default function DashboardPage() {
  const { client } = useAuth();

  if (!client) return null;

  const groups = getStationGroups(client.stations);
  const hasGroups = Object.keys(groups).length > 1 || !groups["Stations"];

  const allBrands = client.stations.flatMap((s) => getBrandsByStation(s.slug));
  const allCampaigns = allBrands.flatMap((b) =>
    b.campaigns.map((c) => ({ ...c, brandName: b.name, stationSlug: b.stationSlug }))
  );
  const activeCampaigns = allCampaigns.filter((c) => c.status === "active");
  const otherCampaigns = allCampaigns.filter((c) => c.status !== "active");

  const stats = [
    { label: "Total Stations", value: client.stations.length, icon: Radio },
    {
      label: "Active Pilots",
      value: client.stations.filter((s) => s.status === "pilot-active").length,
      icon: Activity,
    },
    {
      label: "Sectors Covered",
      value: [...new Set(client.stations.flatMap((s) => s.sectors))].length,
      icon: Layers,
    },
    {
      label: "Onboarding",
      value: client.stations.filter((s) => s.status === "onboarding").length,
      icon: Building2,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Station Overview</h1>
        <p className="text-sm text-text-secondary">
          Manage your stations, sectors, and campaigns across your network.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-bg-card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Icon size={18} className="text-accent" />
                </div>
              </div>
              <p className="font-heading text-2xl font-bold text-text">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics summary */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-text mb-4">Network Analytics</h2>
        <DashboardAnalyticsSummary clientId={client.id} />
      </div>

      {/* Campaigns */}
      <div id="campaigns">
        <h2 className="font-heading text-lg font-semibold text-text mb-4">Campaigns</h2>
        {allCampaigns.length > 0 ? (
          <div className="space-y-2">
            {[...activeCampaigns, ...otherCampaigns].map((c) => (
              <div
                key={`${c.brandName}-${c.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-bg-card px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-text">{c.name}</p>
                  <p className="text-xs text-text-muted">
                    {c.brandName} · {c.duration} · {c.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-heading text-sm font-bold ${
                      c.popScore >= 70
                        ? "text-green-400"
                        : c.popScore >= 40
                          ? "text-amber-400"
                          : "text-red-400"
                    }`}
                  >
                    POP {c.popScore}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      c.status === "active"
                        ? "bg-accent/10 text-accent"
                        : c.status === "completed"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-bg-card p-8 text-center">
            <Megaphone className="mx-auto mb-3 text-text-muted" size={24} />
            <p className="text-sm text-text-muted">No campaigns yet</p>
          </div>
        )}
      </div>

      {/* Audio Brand Kits */}
      <div id="kits">
        <h2 className="font-heading text-lg font-semibold text-text mb-4">Audio Brand Kits</h2>
        {allBrands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allBrands.map((b) => (
              <div
                key={b.slug}
                className="rounded-xl border border-border bg-bg-card p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10">
                    <Music size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{b.name}</p>
                    <p className="text-[11px] text-text-muted">{b.sectorName}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Voice</span>
                    <span className="text-text-secondary">{b.audioBrandKit.voiceName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Music</span>
                    <span className="text-text-secondary truncate max-w-[60%] text-right">{b.audioBrandKit.brandMusic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Logo Line</span>
                    <span className="text-text-secondary truncate max-w-[60%] text-right italic">&ldquo;{b.audioBrandKit.logoLine}&rdquo;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-bg-card p-8 text-center">
            <Music className="mx-auto mb-3 text-text-muted" size={24} />
            <p className="text-sm text-text-muted">No brand kits configured</p>
          </div>
        )}
      </div>

      {/* Station cards */}
      {hasGroups ? (
        Object.entries(groups).map(([group, stations]) => (
          <div key={group}>
            <h2 className="font-heading text-lg font-semibold text-text mb-4">{group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {stations.map((station) => (
                <StationCard key={station.slug} station={station} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>
          <h2 className="font-heading text-lg font-semibold text-text mb-4">Stations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {client.stations.map((station) => (
              <StationCard key={station.slug} station={station} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
