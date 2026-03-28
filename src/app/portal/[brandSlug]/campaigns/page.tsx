"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Radio, Share2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandBySlug } from "@/lib/demo-data";
import {
  getRadioAnalytics,
  getSocialAnalytics,
} from "@/lib/analytics-data";

export default function PortalCampaignsPage() {
  const { brandClient } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);

  const brand = brandClient
    ? getBrandBySlug(brandClient.stationSlug, brandClient.brandSlug)
    : null;
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

  if (!brandClient || !brand) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="font-heading text-2xl font-bold text-text">Campaigns</h1>

      <div className="space-y-4">
        {brand.campaigns.map((campaign) => {
          const isExpanded = expanded === campaign.id;
          const campaignAds = radioAds.filter((a) => a.campaignId === campaign.id);
          const campaignPosts = socialPosts.filter((p) => p.campaignId === campaign.id);

          return (
            <div
              key={campaign.id}
              className="rounded-xl border border-border bg-bg-card overflow-hidden"
            >
              {/* Campaign header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : campaign.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-text font-medium text-left">{campaign.name}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                      <span>{campaign.date}</span>
                      <span>{campaign.duration}</span>
                      <span
                        className={`font-medium ${
                          campaign.popScore >= 70
                            ? "text-green-400"
                            : campaign.popScore >= 40
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        POP {campaign.popScore}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      campaign.status === "active"
                        ? "bg-accent/10 text-accent"
                        : campaign.status === "completed"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {campaign.status}
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-text-muted" />
                  ) : (
                    <ChevronRight size={16} className="text-text-muted" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-border"
                >
                  <div className="p-5 space-y-4">
                    {/* Radio ads */}
                    {campaignAds.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Radio size={14} className="text-accent" />
                          <p className="text-sm font-medium text-text">Radio Ads ({campaignAds.length})</p>
                        </div>
                        <div className="space-y-2">
                          {campaignAds.map((ad) => (
                            <div
                              key={ad.adId}
                              className="rounded-lg border border-border bg-bg-deep px-4 py-3"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm text-text">{ad.adName}</p>
                                <span
                                  className={`text-xs font-medium ${
                                    ad.popScore >= 70 ? "text-green-400" : ad.popScore >= 40 ? "text-amber-400" : "text-red-400"
                                  }`}
                                >
                                  POP {ad.popScore}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-[11px] text-text-muted">
                                <span>{ad.totalPlays.toLocaleString()} plays</span>
                                <span>{ad.totalResponses} responses</span>
                                <span>{ad.duration}s</span>
                                <span className="inline-flex items-center rounded-full px-1.5 py-0.5 bg-accent/10 text-accent text-[10px]">
                                  {ad.triggerType}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social posts */}
                    {campaignPosts.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Share2 size={14} className="text-amber-400" />
                          <p className="text-sm font-medium text-text">Social Posts ({campaignPosts.length})</p>
                        </div>
                        <div className="space-y-2">
                          {campaignPosts.map((post) => (
                            <div
                              key={post.postId}
                              className="rounded-lg border border-border bg-bg-deep px-4 py-3"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm text-text">{post.momentTitle}</p>
                                <span
                                  className={`text-xs font-medium ${
                                    post.popScore >= 70 ? "text-green-400" : post.popScore >= 40 ? "text-amber-400" : "text-red-400"
                                  }`}
                                >
                                  POP {post.popScore}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-[11px] text-text-muted">
                                <span>{post.totalImpressions.toLocaleString()} impressions</span>
                                <span>{(post.avgEngagementRate * 100).toFixed(1)}% engagement</span>
                                <span>{post.contentType}</span>
                                <span className="inline-flex items-center rounded-full px-1.5 py-0.5 bg-accent/10 text-accent text-[10px]">
                                  {post.triggerType}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {campaignAds.length === 0 && campaignPosts.length === 0 && (
                      <p className="text-sm text-text-muted text-center py-4">
                        No detailed data available for this campaign
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
