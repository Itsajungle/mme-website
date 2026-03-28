"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  Repeat2,
  Send,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentPreviewProps {
  platform: string;
  content: string;
  imageUrl?: string;
}

const PLATFORM_LIMITS: Record<string, number> = {
  tiktok: 2200,
  instagram: 2200,
  facebook: 63206,
  x: 280,
  linkedin: 3000,
};

const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "#ff0050",
  instagram: "#e1306c",
  facebook: "#1877f2",
  x: "#000000",
  linkedin: "#0077b5",
};

function InstagramFrame({ content, imageUrl }: { content: string; imageUrl?: string }) {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-text">brand_name</p>
          <p className="text-[10px] text-text-muted">Sponsored</p>
        </div>
        <MoreHorizontal size={16} className="text-text-muted" />
      </div>
      {/* Image */}
      <div className="aspect-square bg-bg-deep flex items-center justify-center border-y border-border/30">
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <ImageIcon size={32} />
            <span className="text-xs">Image Preview</span>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="px-3 py-2 flex items-center gap-4">
        <Heart size={18} className="text-text" />
        <MessageCircle size={18} className="text-text" />
        <Share2 size={18} className="text-text" />
        <div className="flex-1" />
        <Bookmark size={18} className="text-text" />
      </div>
      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-xs text-text">
          <span className="font-semibold">brand_name</span>{" "}
          {content || "Your caption here..."}
        </p>
      </div>
    </div>
  );
}

function TwitterFrame({ content }: { content: string }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-bg-deep shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-text">Brand Name</span>
            <span className="text-xs text-text-muted">@brand</span>
            <span className="text-xs text-text-muted">· now</span>
          </div>
          <p className="text-sm text-text mt-1 whitespace-pre-wrap">
            {content || "What's happening?"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pl-13 text-text-muted">
        <MessageCircle size={15} />
        <Repeat2 size={15} />
        <Heart size={15} />
        <Share2 size={15} />
      </div>
    </div>
  );
}

function LinkedInFrame({ content }: { content: string }) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#0077b5]/20" />
        <div>
          <p className="text-sm font-semibold text-text">Brand Name</p>
          <p className="text-[10px] text-text-muted">1,234 followers</p>
          <p className="text-[10px] text-text-muted">Just now</p>
        </div>
      </div>
      <p className="text-sm text-text whitespace-pre-wrap">
        {content || "Share an update..."}
      </p>
      <div className="border-t border-border pt-2 flex items-center justify-around text-text-muted">
        <div className="flex items-center gap-1 text-xs">
          <ThumbsUp size={14} /> Like
        </div>
        <div className="flex items-center gap-1 text-xs">
          <MessageCircle size={14} /> Comment
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Repeat2 size={14} /> Repost
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Send size={14} /> Send
        </div>
      </div>
    </div>
  );
}

function GenericFrame({
  content,
  platform,
  imageUrl,
}: {
  content: string;
  platform: string;
  imageUrl?: string;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: PLATFORM_COLORS[platform] || "#666" }}
        >
          {platform.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-text capitalize">{platform}</span>
      </div>
      {imageUrl ? (
        <div className="aspect-video bg-bg-deep rounded-lg overflow-hidden">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video bg-bg-deep rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <ImageIcon size={28} />
            <span className="text-xs">Media Preview</span>
          </div>
        </div>
      )}
      <p className="text-sm text-text whitespace-pre-wrap">
        {content || "Your content here..."}
      </p>
    </div>
  );
}

export function ContentPreview({ platform, content, imageUrl }: ContentPreviewProps) {
  const limit = PLATFORM_LIMITS[platform.toLowerCase()] ?? 2200;
  const charCount = content.length;
  const isOverLimit = charCount > limit;

  const renderFrame = () => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <InstagramFrame content={content} imageUrl={imageUrl} />;
      case "x":
        return <TwitterFrame content={content} />;
      case "linkedin":
        return <LinkedInFrame content={content} />;
      default:
        return (
          <GenericFrame content={content} platform={platform} imageUrl={imageUrl} />
        );
    }
  };

  return (
    <motion.div
      className="rounded-xl border border-border bg-bg-card overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Platform header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg-deep/50">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: PLATFORM_COLORS[platform.toLowerCase()] || "#666" }}
          />
          <span className="text-xs font-mono text-text-secondary capitalize">
            {platform} Preview
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-mono",
            isOverLimit ? "text-red-400" : "text-text-muted"
          )}
        >
          {charCount}/{limit}
        </span>
      </div>

      {/* Frame */}
      {renderFrame()}
    </motion.div>
  );
}
