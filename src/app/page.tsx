import { Hero } from "@/components/home/Hero";
import { TheShift } from "@/components/home/TheShift";
import { EngineLoop } from "@/components/home/EngineLoop";
import { CommunityLayer } from "@/components/home/CommunityLayer";
import { AgentTeam } from "@/components/home/AgentTeam";
import { ProofVerticals } from "@/components/home/ProofVerticals";
import { WhoItsFor } from "@/components/home/WhoItsFor";
import { Plans } from "@/components/home/Plans";
import { ConnectionCTA } from "@/components/home/ConnectionCTA";

export default function Home() {
  return (
    <>
      {/* Content → Community → Connection spine */}
      <Hero />
      <TheShift />
      <EngineLoop />
      <CommunityLayer />
      <AgentTeam />
      <ProofVerticals />
      <WhoItsFor />
      <Plans />
      <ConnectionCTA />
    </>
  );
}
