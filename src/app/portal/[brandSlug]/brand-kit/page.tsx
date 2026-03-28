"use client";

import { motion } from "framer-motion";
import { Mic2, Music, Volume2, Quote } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandBySlug } from "@/lib/demo-data";

export default function PortalBrandKitPage() {
  const { brandClient } = useAuth();

  const brand = brandClient
    ? getBrandBySlug(brandClient.stationSlug, brandClient.brandSlug)
    : null;

  if (!brandClient || !brand) return null;

  const kit = brand.audioBrandKit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Audio Brand Kit</h1>
        <p className="text-sm text-text-secondary">
          Your brand&apos;s audio identity for radio advertising
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Mic2 size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-text">Brand Voice</h2>
              <p className="text-xs text-text-muted">AI voice profile</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-bg-deep px-4 py-3">
              <p className="text-xs text-text-muted mb-1">Voice Name</p>
              <p className="text-sm text-text font-medium">{kit.voiceName}</p>
            </div>
            <div className="rounded-lg border border-border bg-bg-deep px-4 py-3">
              <p className="text-xs text-text-muted mb-1">Description</p>
              <p className="text-sm text-text">{kit.voiceDescription}</p>
            </div>
          </div>
        </div>

        {/* Music */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10">
              <Music size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-text">Brand Music</h2>
              <p className="text-xs text-text-muted">Background music selections</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-bg-deep px-4 py-3">
              <p className="text-xs text-text-muted mb-1">Primary Track</p>
              <p className="text-sm text-text">{kit.brandMusic}</p>
            </div>
            {kit.additionalMusic.length > 0 && (
              <div className="rounded-lg border border-border bg-bg-deep px-4 py-3">
                <p className="text-xs text-text-muted mb-2">Additional Tracks</p>
                <div className="space-y-1">
                  {kit.additionalMusic.map((track, i) => (
                    <p key={i} className="text-sm text-text-secondary">
                      {track}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SFX */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/10">
              <Volume2 size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-text">Sound Effects</h2>
              <p className="text-xs text-text-muted">Branded SFX library</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {kit.sfx.map((sfx, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-border bg-bg-deep px-3 py-1.5 text-xs text-text-secondary"
              >
                {sfx}
              </span>
            ))}
          </div>
        </div>

        {/* Logo Line */}
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10">
              <Quote size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-text">Logo Line</h2>
              <p className="text-xs text-text-muted">Signature sign-off</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-bg-deep px-4 py-4">
            <p className="text-lg text-text italic text-center">
              &ldquo;{kit.logoLine}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
