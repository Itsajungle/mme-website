import type { Metadata } from "next";
import { RadioHero } from "@/components/radio/RadioHero";
import { StationHierarchy } from "@/components/radio/StationHierarchy";
import { AudioBrandKit } from "@/components/radio/AudioBrandKit";
import { RadioBridge } from "@/components/radio/RadioBridge";
import { ForStations } from "@/components/radio/ForStations";
import { ForAdvertisers } from "@/components/radio/ForAdvertisers";
import { RadioPricing } from "@/components/radio/RadioPricing";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "MME Radio — AI-Powered Moment Ads for FM, DAB & Streaming",
  description:
    "Generate broadcast-ready radio ads in seconds with AI voice cloning, brand music, and moment-matched creative. Integrated with FM/DAB playout systems.",
};

export default function RadioPage() {
  return (
    <>
      <RadioHero />
      <StationHierarchy />
      <AudioBrandKit />
      <RadioBridge />
      <ForStations />
      <ForAdvertisers />
      <RadioPricing />
      <CTASection />
    </>
  );
}
