import type { Metadata } from "next";
import { UseCasesHero } from "@/components/use-cases/UseCasesHero";
import { UseCaseGrid } from "@/components/use-cases/UseCaseGrid";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Use Cases — Moment Marketing in Action",
  description:
    "See how MME turns weather events, sports results, breaking news, and cultural trends into targeted radio ads and social content.",
};

export default function UseCasesPage() {
  return (
    <>
      <UseCasesHero />
      <UseCaseGrid />
      <CTASection />
    </>
  );
}
