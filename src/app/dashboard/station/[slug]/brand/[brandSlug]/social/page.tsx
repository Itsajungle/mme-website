"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Zap, Film, Wifi, BarChart3, Layers } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandBySlug } from "@/lib/demo-data";
import BrandWorkspace from "@/components/brand/BrandWorkspace";
import { SocialStudioApp } from "@/components/social/SocialStudioApp";
import { MomentMarketingApp } from "@/components/social/MomentMarketingApp";
import { ProductionComposerApp } from "@/components/social/ProductionComposerApp";
import { SocialEngineStatus } from "@/components/social/SocialEngineStatus";
import { CrossMediaFeed } from "@/components/shared/CrossMediaFeed";
import { CrossMediaBridge } from "@/components/shared/CrossMediaBridge";
import { AudioEngineProvider } from "@/lib/audio-engine/engine-provider";
import type { MomentItem } from "@/lib/demo-data";
import type { GeneratedCopy } from "@/lib/social-engine/types";
import { cn } from "@/lib/utils";

type SocialSubTab = "studio" | "moments" | "production" | "status" | "feed";

const SUB_TABS: {
  key: SocialSubTab;
  label: string;
  icon: typeof Palette;
}[] = [
  { key: "studio",     label: "Social Studio",   icon: Palette   },
  { key: "moments",    label: "Moment Engine",    icon: Zap       },
  { key: "production", label: "Production",       icon: Film      },
  { key: "status",     label: "Engine Status",    icon: Wifi      },
  { key: "feed",       label: "Activity Feed",    icon: BarChart3 },
];

export default function SocialTabPage({
  params,
}: {
  params: Promise<{ slug: string; brandSlug: string }>;
}) {
  const { slug, brandSlug } = use(params);
  const { client } = useAuth();
  const router = useRouter();

  const [activeSubTab, setActiveSubTab] = useState<SocialSubTab>("studio");
  const [showCrossMedia, setShowCrossMedia] = useState(false);
  const [crossMediaMoment, setCrossMediaMoment] = useState<MomentItem | null>(null);
  const [crossMediaContent, setCrossMediaContent] = useState<GeneratedCopy | null>(null);

  if (!client) return null;

  const brand = getBrandBySlug(slug, brandSlug);

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-secondary mb-4">Brand not found</p>
        <button
          onClick={() => router.push(`/dashboard/station/${slug}`)}
          className="text-accent hover:text-accent-hover text-sm"
        >
          Back to Station
        </button>
      </div>
    );
  }

  function handleCreateInStudio(_content: GeneratedCopy, _momentId: string) {
    setActiveSubTab("studio");
  }

  function handleCreateBoth(moment: MomentItem, content: GeneratedCopy) {
    setCrossMediaMoment(moment);
    setCrossMediaContent(content);
    setShowCrossMedia(true);
  }

  return (
    <AudioEngineProvider>
      <BrandWorkspace brand={brand} activeTab="social">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header row: sub-tabs + Cross-Media button */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Sub-tab bar */}
            <div className="flex gap-1 p-1 rounded-lg bg-bg-deep border border-border overflow-x-auto flex-1 min-w-0">
              {SUB_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSubTab(tab.key)}
                    className={cn(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-all",
                      activeSubTab === tab.key
                        ? "bg-accent/10 text-accent"
                        : "text-text-muted hover:text-text"
                    )}
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Cross-Media button */}
            <button
              onClick={() => {
                // Open bridge with the first available moment, or null
                const firstMoment = brand.moments[0] ?? null;
                setCrossMediaMoment(firstMoment);
                setCrossMediaContent(null);
                setShowCrossMedia(true);
              }}
              className="flex items-center gap-1.5 shrink-0 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/10 hover:border-accent/50 transition-all"
            >
              <Layers size={12} />
              Cross-Media
            </button>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeSubTab === "studio" && (
                <div className="rounded-xl border border-border bg-bg-card p-6">
                  <SocialStudioApp brand={brand} />
                </div>
              )}

              {activeSubTab === "moments" && (
                <div className="rounded-xl border border-border bg-bg-card p-6">
                  <MomentMarketingApp
                    brand={brand}
                    onCreateInStudio={handleCreateInStudio}
                    onCreateBoth={handleCreateBoth}
                  />
                </div>
              )}

              {activeSubTab === "production" && (
                <div className="rounded-xl border border-border bg-bg-card p-6">
                  <ProductionComposerApp brand={brand} />
                </div>
              )}

              {activeSubTab === "status" && (
                <div className="rounded-xl border border-border bg-bg-card p-6">
                  <SocialEngineStatus />
                </div>
              )}

              {activeSubTab === "feed" && (
                <CrossMediaFeed brandSlug={brand.slug} brandName={brand.name} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </BrandWorkspace>

      {/* CrossMediaBridge modal overlay */}
      <AnimatePresence>
        {showCrossMedia && crossMediaMoment && (
          <CrossMediaBridge
            brand={brand}
            moment={crossMediaMoment}
            socialContent={crossMediaContent ?? undefined}
            onClose={() => {
              setShowCrossMedia(false);
              setCrossMediaMoment(null);
              setCrossMediaContent(null);
            }}
          />
        )}
      </AnimatePresence>
    </AudioEngineProvider>
  );
}
