import type { Metadata } from "next";
import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { DetectionLayer } from "@/components/how-it-works/DetectionLayer";
import { BrandSafety } from "@/components/how-it-works/BrandSafety";
import { MatchingEngine } from "@/components/how-it-works/MatchingEngine";
import { ContentAtomizer } from "@/components/how-it-works/ContentAtomizer";
import { ReviewWorkflow } from "@/components/how-it-works/ReviewWorkflow";
import { DistributionLayer } from "@/components/how-it-works/DistributionLayer";
import { AnalyticsTracking } from "@/components/how-it-works/AnalyticsTracking";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "How It Works — The MME Pipeline",
  description:
    "From moment detection to content generation to broadcast distribution — a technical deep-dive into how MME works.",
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksHero />
      <DetectionLayer />
      <BrandSafety />
      <MatchingEngine />
      <ContentAtomizer />
      <ReviewWorkflow />
      <DistributionLayer />
      <AnalyticsTracking />
      <CTASection />
    </>
  );
}
