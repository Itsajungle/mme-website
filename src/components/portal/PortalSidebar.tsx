"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Megaphone,
  Library,
  Music,
  PlusCircle,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type BrandClientUser } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

export function PortalSidebar({ brandClient }: { brandClient: BrandClientUser }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const basePath = `/portal/${brandClient.brandSlug}`;

  const links = [
    { label: "Dashboard", href: basePath, icon: LayoutDashboard },
    { label: "Analytics", href: `${basePath}/analytics`, icon: BarChart3 },
    { label: "Campaigns", href: `${basePath}/campaigns`, icon: Megaphone },
    { label: "Library", href: `${basePath}/library`, icon: Library },
    { label: "Brand Kit", href: `${basePath}/brand-kit`, icon: Music },
    { label: "Request Campaign", href: `${basePath}/request`, icon: PlusCircle },
  ];

  function handleLogout() {
    logout();
    router.push("/login");
  }

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

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-bg-card flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20">
              <span className="font-heading text-sm font-bold text-amber-400">B</span>
            </div>
            <span className="font-heading text-lg font-bold text-text">Brand Portal</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text truncate">{brandClient.brandName}</p>
            <p className="text-xs text-text-muted truncate italic">
              &ldquo;{brandClient.email}&rdquo;
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== basePath && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-text-secondary hover:text-text hover:bg-white/5",
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
          <div className="flex items-center gap-2 px-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-accent">
              <span className="text-[8px] font-bold text-bg">M</span>
            </div>
            <span className="text-[10px] text-text-muted">Powered by MME</span>
          </div>
        </div>
      </aside>
    </>
  );
}
