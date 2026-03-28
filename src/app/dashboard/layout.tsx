"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { client, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg">
        <DashboardSidebar />

        <div className="lg:ml-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/80 backdrop-blur-xl px-6 py-4">
            <div className="lg:block hidden">
              <h2 className="text-sm font-medium text-text">{client?.name}</h2>
              <p className="text-xs text-text-muted">{client?.phase}</p>
            </div>
            {/* Spacer for mobile (sidebar toggle is positioned absolutely) */}
            <div className="lg:hidden w-10" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:text-text hover:border-border-hover transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </header>

          {/* Content */}
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
