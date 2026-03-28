"use client";

import { Video, Image, LayoutGrid, Clock } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { SOCIAL_FEATURES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  "Short Video": Video,
  "Image Posts": Image,
  Carousel: LayoutGrid,
  Stories: Clock,
};

export function ContentTypes() {
  return (
    <Section id="content-types">
      <StaggerChildren>
        <StaggerItem>
          <SectionHeader
            title="Content for Every Format"
            subtitle="MME Social generates platform-native content across every major social format — each one optimised for engagement, not just resized."
          />
        </StaggerItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOCIAL_FEATURES.contentTypes.map((content) => {
            const Icon = iconMap[content.type] ?? Video;
            const platforms = content.platforms.split(", ");

            return (
              <StaggerItem key={content.type}>
                <div className="group relative p-6 rounded-[var(--radius-lg)] bg-bg-card border border-border hover:border-accent/40 transition-colors h-full">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius)] bg-accent/10 mb-4">
                    <Icon size={24} className="text-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-text">
                    {content.type}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {content.description}
                  </p>

                  {/* Platform badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-bg border border-border text-text-muted"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerChildren>
    </Section>
  );
}
