"use client";

import { motion } from "framer-motion";
import { Building2, Radio, Layers, Activity } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StationCard } from "@/components/dashboard/StationCard";
import { DashboardAnalyticsSummary } from "@/components/analytics/DashboardAnalyticsSummary";
import { getStationGroups } from "@/lib/clients";

export default function DashboardPage() {
  const { client } = useAuth();

  if (!client) return null;

  const groups = getStationGroups(client.stations);
  const hasGroups = Object.keys(groups).length > 1 || !groups["Stations"];

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
