"use client";

import { use } from "react";
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
import { ProductionTimeline } from "@/components/radio/ProductionTimeline";
export default function RadioTabPage({
  params,
}: {
  params: Promise<{ slug: string; brandSlug: string }>;
}) {
  const { slug, brandSlug } = use(params);
  const { client } = useAuth();
  const router = useRouter();

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

  return (
    <BrandWorkspace brand={brand} activeTab="radio">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Brand Overview + Campaign History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BrandOverview brand={brand} />
          </div>
          <div>
            <CampaignHistory campaigns={brand.campaigns} />
          </div>
        </div>

        {/* Audio Brand Kit */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <AudioBrandKitEditor kit={brand.audioBrandKit} brandName={brand.name} />
        </div>

        {/* Radio Ad Generator */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <RadioAdGenerator brand={brand} />
        </div>

        {/* Production Timeline */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <ProductionTimeline duration="30s" />
        </div>

        {/* Ad Library */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <AdLibrary campaigns={brand.campaigns} brandName={brand.name} />
        </div>
      </motion.div>
    </BrandWorkspace>
  );
}
