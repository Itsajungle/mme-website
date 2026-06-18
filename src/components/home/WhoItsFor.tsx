"use client";

import { FadeIn } from "@/components/shared/AnimatedSection";
import { WHO_ITS_FOR } from "@/lib/constants";

export function WhoItsFor() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
            {WHO_ITS_FOR.headline}
          </h2>
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">
            {WHO_ITS_FOR.body}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
