"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { PortalSidebar } from "@/components/portal/PortalSidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, brandClient, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (role !== "brand-client") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== "brand-client" || !brandClient) return null;

  return (
    <div className="min-h-screen bg-bg">
      <PortalSidebar brandClient={brandClient} />

      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/80 backdrop-blur-xl px-6 py-4">
          <div className="lg:block hidden">
            <h2 className="text-sm font-medium text-text">{brandClient.brandName}</h2>
            <p className="text-xs text-text-muted">Brand Portal</p>
          </div>
          <div className="lg:hidden w-10" />
          <div className="text-xs text-text-muted">
            Advertising on Sunshine Radio
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
