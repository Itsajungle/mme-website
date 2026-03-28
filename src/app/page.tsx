import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Pipeline } from "@/components/home/Pipeline";
import { Verticals } from "@/components/home/Verticals";
import { MediaCommerce } from "@/components/home/MediaCommerce";
import { Stats } from "@/components/home/Stats";
import { UseCaseSpotlight } from "@/components/home/UseCaseSpotlight";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Pipeline />
      <Verticals />
      <MediaCommerce />
      <Stats />
      <UseCaseSpotlight />
      <Testimonials />
      <CTASection />
    </>
  );
}
