"use client";

import { Section } from "@/components/layout/Section";
import { FadeIn } from "@/components/shared/AnimatedSection";
import { ABOUT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Story() {
  return (
    <Section>
      <div className="max-w-3xl mx-auto">
        {ABOUT.story.map((paragraph, i) => {
          const isPullQuote = paragraph.includes("POP Factor");
          const isFirst = i === 0;

          if (isPullQuote) {
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <blockquote
                  className={cn(
                    "my-10 pl-6 border-l-4 border-accent py-4",
                    "text-xl sm:text-2xl font-heading font-semibold text-text leading-relaxed",
                    "relative"
                  )}
                >
                  <div
                    className="absolute -left-2 -top-2 text-accent/20 text-6xl font-serif select-none"
                    aria-hidden
                  >
                    &ldquo;
                  </div>
                  <p>{paragraph}</p>
                </blockquote>
              </FadeIn>
            );
          }

          return (
            <FadeIn key={i} delay={i * 0.08}>
              <p
                className={cn(
                  "mb-6 leading-relaxed",
                  isFirst
                    ? "text-xl sm:text-2xl text-text font-medium"
                    : "text-lg text-text-secondary"
                )}
              >
                {paragraph}
              </p>
            </FadeIn>
          );
        })}
      </div>
    </Section>
  );
}
