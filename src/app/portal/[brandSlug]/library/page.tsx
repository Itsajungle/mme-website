"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Radio, Share2, Play, Pause, Zap, Clock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getRadioAnalytics, getSocialAnalytics } from "@/lib/analytics-data";

type LibraryTab = "radio" | "social";

export default function PortalLibraryPage() {
  const { brandClient } = useAuth();
  const [tab, setTab] = useState<LibraryTab>("radio");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const radioAds = useMemo(
    () =>
      brandClient
        ? getRadioAnalytics(brandClient.brandSlug, brandClient.stationSlug)
        : [],
    [brandClient],
  );
  const socialPosts = useMemo(
    () =>
      brandClient
        ? getSocialAnalytics(brandClient.brandSlug, brandClient.stationSlug)
        : [],
    [brandClient],
  );

  if (!brandClient) return null;

  const tabs: { key: LibraryTab; label: string; icon: React.ElementType }[] = [
    { key: "radio", label: "Radio Ads", icon: Radio },
    { key: "social", label: "Social Content", icon: Share2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="font-heading text-2xl font-bold text-text">Content Library</h1>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex items-center gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="relative px-4 py-3"
              >
                <span
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    tab === t.key ? "text-amber-400" : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </span>
                {tab === t.key && (
                  <motion.div
                    layoutId="portal-library-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radio tab */}
      {tab === "radio" && (
        <div className="space-y-3">
          {radioAds.map((ad) => (
            <motion.div
              key={ad.adId}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-bg-card p-5"
            >
              <div className="flex items-start gap-4">
                {/* Mock audio player */}
                <button
                  onClick={() => setPlayingId(playingId === ad.adId ? null : ad.adId)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  {playingId === ad.adId ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-text truncate">{ad.adName}</p>
                    <span
                      className={`text-xs font-medium ml-2 ${
                        ad.popScore >= 70 ? "text-green-400" : ad.popScore >= 40 ? "text-amber-400" : "text-red-400"
                      }`}
                    >
                      POP {ad.popScore}
                    </span>
                  </div>

                  {/* Waveform placeholder */}
                  {playingId === ad.adId && (
                    <div className="flex items-center gap-0.5 h-6 mb-2">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-accent rounded-full"
                          initial={{ height: 4 }}
                          animate={{ height: 4 + Math.random() * 16 }}
                          transition={{
                            duration: 0.3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 0.03,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {ad.duration}s
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 bg-accent/10 text-accent">
                      <Zap size={10} />
                      {ad.triggerType}
                    </span>
                    <span>{ad.firstAired}</span>
                    <span>{ad.totalPlays.toLocaleString()} plays</span>
                    <span>{ad.totalResponses} responses</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Social tab */}
      {tab === "social" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {socialPosts.map((post) => (
            <motion.div
              key={post.postId}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-bg-card overflow-hidden"
            >
              {/* Preview thumbnail placeholder */}
              <div className="h-32 bg-gradient-to-br from-accent/10 to-amber-400/10 flex items-center justify-center">
                <Share2 size={24} className="text-text-muted" />
              </div>

              <div className="p-4">
                <p className="text-sm font-medium text-text mb-1 truncate">
                  {post.momentTitle}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-accent/10 text-accent">
                    {post.triggerType}
                  </span>
                  <span className="text-[10px] text-text-muted">{post.contentType}</span>
                  <span
                    className={`text-[10px] font-medium ${
                      post.popScore >= 70 ? "text-green-400" : "text-amber-400"
                    }`}
                  >
                    POP {post.popScore}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span>{post.totalImpressions.toLocaleString()} imp.</span>
                  <span>{(post.avgEngagementRate * 100).toFixed(1)}% eng.</span>
                  <span>{post.publishedAt.slice(0, 10)}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {post.platforms.map((p) => (
                    <span
                      key={p.platform}
                      className="inline-flex items-center rounded px-1 py-0.5 text-[9px] bg-white/5 text-text-muted"
                    >
                      {p.platform}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
