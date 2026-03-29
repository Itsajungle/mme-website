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
  const brandId = searchParams.get("brand_id");
  const stationId = searchParams.get("station_id");

  if (!brandId) {
    return NextResponse.json(
      { error: "brand_id is required" },
      { status: 400 },
    );
  }

  let query = `/social_brand_kits?brand_id=eq.${encodeURIComponent(brandId)}`;
  if (stationId) {
    query += `&station_id=eq.${encodeURIComponent(stationId)}`;
  }
  query += "&limit=1";

  const res = await fetch(supabaseUrl(query), { headers: supabaseHeaders() });

  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ brand_kit: null });
  }

  return NextResponse.json({ brand_kit: rows[0] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { brand_id, station_id, ...kitData } = body;

  if (!brand_id) {
    return NextResponse.json(
      { error: "brand_id is required" },
      { status: 400 },
    );
  }

  const payload: Record<string, unknown> = {
    brand_id,
    ...kitData,
    updated_at: new Date().toISOString(),
  };
  if (station_id) {
    payload.station_id = station_id;
  }

  // Try update first
  let patchQuery = `/social_brand_kits?brand_id=eq.${encodeURIComponent(brand_id)}`;
  if (station_id) {
    patchQuery += `&station_id=eq.${encodeURIComponent(station_id)}`;
  }

  const updateRes = await fetch(supabaseUrl(patchQuery), {
    method: "PATCH",
    headers: supabaseHeaders(),
    body: JSON.stringify(payload),
  });

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
