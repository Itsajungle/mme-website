"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandBySlug } from "@/lib/demo-data";
import BrandWorkspace from "@/components/brand/BrandWorkspace";
import { SocialStudioApp } from "@/components/social/SocialStudioApp";
import { MomentMarketingApp } from "@/components/social/MomentMarketingApp";
import { ProductionComposerApp } from "@/components/social/ProductionComposerApp";

export default function SocialTabPage({
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
    <BrandWorkspace brand={brand} activeTab="social">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Social Studio */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <SocialStudioApp brand={brand} />
        </div>

        {/* Moment Marketing Engine */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <MomentMarketingApp brand={brand} />
        </div>

        {/* Production Composer */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <ProductionComposerApp brand={brand} />
        </div>
      </motion.div>
    </BrandWorkspace>
  );
}
