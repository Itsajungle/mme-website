"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandBySlug } from "@/lib/demo-data";
import BrandWorkspace from "@/components/brand/BrandWorkspace";
import BrandOverview from "@/components/brand/BrandOverview";
import CampaignHistory from "@/components/brand/CampaignHistory";
import { RadioAdGenerator } from "@/components/radio/RadioAdGenerator";
import { AudioBrandKitEditor } from "@/components/radio/AudioBrandKitEditor";
import { AdLibrary } from "@/components/radio/AdLibrary";
import { ProductionTimeline, type TimelineSegment } from "@/components/radio/ProductionTimeline";
import { VoiceBank } from "@/components/radio/VoiceBank";
import { MusicBank } from "@/components/radio/MusicBank";
import { SFXBank } from "@/components/radio/SFXBank";
import { AudioEngineStatus } from "@/components/radio/AudioEngineStatus";
import { AudioEngineProvider } from "@/lib/audio-engine/engine-provider";
import type { VoiceProfile } from "@/lib/audio-engine/types";
import { cn } from "@/lib/utils";

type RadioTab = "generate" | "voices" | "music" | "sfx" | "brand-kit" | "library";

export default function RadioTabPage({
  params,
}: {
  params: Promise<{ slug: string; brandSlug: string }>;
}) {
  const { slug, brandSlug } = use(params);
  const { client } = useAuth();
  const router = useRouter();
  const [activeRadioTab, setActiveRadioTab] = useState<RadioTab>("generate");
  const [mode, setMode] = useState<"automated" | "hybrid">("hybrid");
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | null>(null);
  const [generatedSegments, setGeneratedSegments] = useState<TimelineSegment[] | undefined>(undefined);
  const [generatedDuration, setGeneratedDuration] = useState("30s");

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

  const RADIO_TABS: { key: RadioTab; label: string }[] = [
    { key: "generate", label: "Ad Generator" },
    { key: "voices", label: "Voices" },
    { key: "music", label: "Music" },
    { key: "sfx", label: "SFX" },
    { key: "brand-kit", label: "Brand Kit" },
    { key: "library", label: "Ad Library" },
  ];

  return (
    <AudioEngineProvider>
      <BrandWorkspace brand={brand} activeTab="radio">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Top Controls: Mode Toggle + Engine Status */}
          <div className="flex items-center justify-between">
            {/* Mode Toggle */}
            <div className="flex rounded-lg border border-border bg-bg-deep p-1">
              <button
                onClick={() => setMode("automated")}
                className={cn(
                  "rounded-md px-4 py-2 text-xs font-medium transition-all",
                  mode === "automated"
                    ? "bg-accent text-bg shadow-sm"
                    : "text-text-muted hover:text-text"
                )}
              >
                Automated
              </button>
              <button
                onClick={() => setMode("hybrid")}
                className={cn(
                  "rounded-md px-4 py-2 text-xs font-medium transition-all",
                  mode === "hybrid"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-text-muted hover:text-text"
                )}
              >
                Hybrid
              </button>
            </div>

            <AudioEngineStatus />
          </div>

          {/* Radio sub-tabs */}
          <div className="flex gap-1 rounded-xl border border-border bg-bg-deep p-1 overflow-x-auto">
            {RADIO_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveRadioTab(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all",
                  activeRadioTab === tab.key
                    ? "bg-bg-card text-text shadow-sm"
                    : "text-text-muted hover:text-text"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeRadioTab === "generate" && (
            <div className="space-y-6">
              {/* Brand Overview + Campaign History */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <BrandOverview brand={brand} />
                </div>
                <div>
                  <CampaignHistory campaigns={brand.campaigns} />
                </div>
              </div>

              {/* Radio Ad Generator */}
              <div className="rounded-xl border border-border bg-bg-card p-6">
                <RadioAdGenerator brand={brand} mode={mode} onAudioGenerated={(segs, dur) => { setGeneratedSegments(segs); setGeneratedDuration(dur); }} />
              </div>

              {/* Production Timeline — Hybrid mode only */}
              {mode === "hybrid" && (
                <div className="rounded-xl border border-border bg-bg-card p-6">
                  <ProductionTimeline
                    duration={generatedDuration}
                    segments={generatedSegments}
                  />
                </div>
              )}
            </div>
          )}

          {activeRadioTab === "voices" && (
            <div className="rounded-xl border border-border bg-bg-card p-6">
              <VoiceBank
                brandName={brand.name}
                selectedVoiceId={selectedVoice?.id}
                onSelectVoice={setSelectedVoice}
              />
            </div>
          )}

          {activeRadioTab === "music" && (
            <div className="rounded-xl border border-border bg-bg-card p-6">
              <MusicBank brandName={brand.name} />
            </div>
          )}

          {activeRadioTab === "sfx" && (
            <div className="rounded-xl border border-border bg-bg-card p-6">
              <SFXBank brandName={brand.name} sector={brand.sectorName.toLowerCase()} />
            </div>
          )}

          {activeRadioTab === "brand-kit" && (
            <div className="rounded-xl border border-border bg-bg-card p-6">
              <AudioBrandKitEditor kit={brand.audioBrandKit} brandName={brand.name} />
            </div>
          )}

          {activeRadioTab === "library" && (
            <div className="rounded-xl border border-border bg-bg-card p-6">
              <AdLibrary campaigns={brand.campaigns} brandName={brand.name} />
            </div>
          )}
        </motion.div>
      </BrandWorkspace>
    </AudioEngineProvider>
  );
}
