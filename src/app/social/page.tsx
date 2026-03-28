import type { Metadata } from "next";
import { SocialHero } from "@/components/social/SocialHero";
import { SocialPipeline } from "@/components/social/SocialPipeline";
import { ContentTypes } from "@/components/social/ContentTypes";
import { SocialVerticals } from "@/components/social/SocialVerticals";
import { CrossMedia } from "@/components/social/CrossMedia";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "MME Social — Moment-Matched Social Content at Scale",
  description:
    "AI-generated social media content matched to real-world moments. Video, image, carousel, and stories — atomised for every platform.",
};

export default function SocialPage() {
  return (
    <>
      <SocialHero />
      <SocialPipeline />
      <ContentTypes />
      <SocialVerticals />
      <CrossMedia />
      <CTASection />
    </>
  );
}
