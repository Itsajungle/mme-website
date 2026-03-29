"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radio, Megaphone, Music, BarChart3, Settings, Menu, X, Workflow, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Stations", href: "/dashboard#stations", icon: Radio },
  { label: "Campaigns", href: "/dashboard#campaigns", icon: Megaphone },
  { label: "Audio Brand Kits", href: "/dashboard#kits", icon: Music },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard#settings", icon: Settings },
] as const;

function getStationSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/dashboard\/station\/([^/]+)/);
  return match ? match[1] : null;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { client } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const stationSlug = getStationSlugFromPath(pathname);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-bg-card flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="font-heading text-sm font-bold text-bg">M</span>
            </div>
            <span className="font-heading text-lg font-bold text-text">MME</span>
          </Link>
          {client && (
            <div>
              <p className="text-sm font-medium text-text truncate">{client.name}</p>
              <p className="text-xs text-text-muted truncate">{client.contact}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href === "/dashboard" && pathname === "/dashboard");
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}

          {/* Station-specific links — only shown when viewing a station */}
          {stationSlug && (
            <div className="mt-4 pt-4 border-t border-border space-y-1">
              <p className="px-3 text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">
                Station Tools
              </p>
              <Link
                href={`/dashboard/station/${stationSlug}/sales-portal`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  pathname.includes("/sales-portal")
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text hover:bg-white/5"
                )}
              >
                <Zap size={18} />
                Demo Ad Studio
              </Link>
              <Link
                href={`/dashboard/station/${stationSlug}/quality-engine`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  pathname.includes("/quality-engine")
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text hover:bg-white/5"
                )}
              >
                <Workflow size={18} />
                Quality Engine
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-text-muted">MME Platform v1.0</p>
        </div>
      </aside>
    </>
  );
}
