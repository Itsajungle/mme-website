"use client";

import { use } from "react";
import { redirect } from "next/navigation";

export default function BrandPage({
  params,
}: {
  params: Promise<{ slug: string; brandSlug: string }>;
}) {
  const { slug, brandSlug } = use(params);
  redirect(`/dashboard/station/${slug}/brand/${brandSlug}/radio`);
}
