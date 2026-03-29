import { NextResponse } from "next/server";

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function supabaseUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandSlug = searchParams.get("brand_slug");

  if (!brandSlug) {
    return NextResponse.json(
      { error: "brand_slug is required" },
      { status: 400 },
    );
  }

  const res = await fetch(
    supabaseUrl(
      `/social_brand_kits?brand_slug=eq.${encodeURIComponent(brandSlug)}&limit=1`,
    ),
    { headers: supabaseHeaders() },
  );

  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ brand_kit: null });
  }

  return NextResponse.json({ brand_kit: rows[0] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { brand_slug, ...kitData } = body;

  if (!brand_slug) {
    return NextResponse.json(
      { error: "brand_slug is required" },
      { status: 400 },
    );
  }

  const payload = {
    brand_slug,
    ...kitData,
    updated_at: new Date().toISOString(),
  };

  // Try update first
  const updateRes = await fetch(
    supabaseUrl(
      `/social_brand_kits?brand_slug=eq.${encodeURIComponent(brand_slug)}`,
    ),
    {
      method: "PATCH",
      headers: supabaseHeaders(),
      body: JSON.stringify(payload),
    },
  );

  const updated = await updateRes.json();
  if (Array.isArray(updated) && updated.length > 0) {
    return NextResponse.json({ brand_kit: updated[0] });
  }

  // Insert new
  const insertRes = await fetch(supabaseUrl("/social_brand_kits"), {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({
      ...payload,
      created_at: new Date().toISOString(),
    }),
  });

  const inserted = await insertRes.json();
  const result = Array.isArray(inserted) ? inserted[0] : inserted;
  return NextResponse.json({ brand_kit: result }, { status: 201 });
}
