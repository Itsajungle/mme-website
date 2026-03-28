import { DEMO_BRANDS } from "@/lib/demo-data";
import type { MomentItem } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandSlug = searchParams.get("brandSlug");

  // If Supabase credentials are present, this is where a live query would go.
  // For now, always fall back to enriched demo data.
  const useSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  interface MomentWithMeta extends MomentItem {
    brandSlug: string;
    brandName: string;
    stationSlug: string;
  }

  if (useSupabase) {
    // Placeholder: Supabase client not yet implemented — fall through to demo data
  }

  // Collect moments from all brands (optionally filtered by brandSlug)
  const brands = brandSlug
    ? DEMO_BRANDS.filter((b) => b.slug === brandSlug)
    : DEMO_BRANDS;

  const moments: MomentWithMeta[] = brands.flatMap((brand) =>
    brand.moments.map((moment) => ({
      ...moment,
      brandSlug: brand.slug,
      brandName: brand.name,
      stationSlug: brand.stationSlug,
    }))
  );

  // Sort by popScore descending
  moments.sort((a, b) => b.popScore - a.popScore);

  return Response.json({ moments, source: "demo" as const });
}
