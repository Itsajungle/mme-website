import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { Story } from "@/components/about/Story";
import { PopFactor } from "@/components/about/PopFactor";
import { Credentials } from "@/components/about/Credentials";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About — The Story Behind MME",
  description:
    "Built by Peter Stone, former Creative Director at Capital Radio Group. 25 years of broadcast experience meets AI-powered moment marketing.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Story />
      <PopFactor />
      <Credentials />
      <CTASection />
    </>
  );
}
