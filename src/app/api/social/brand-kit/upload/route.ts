import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "brand-assets";

async function ensureBucket() {
  // Try to create — 409 means it already exists, which is fine
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category"); // logo | product | hero
  const brandId = searchParams.get("brand_id");
  const stationId = searchParams.get("station_id");

  if (!category || !brandId || !stationId) {
    return NextResponse.json(
      { error: "category, brand_id, and station_id are required" },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  await ensureBucket();

  // Sanitise filename and build storage path
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ts = Date.now();
  const storagePath = `${stationId}/${brandId}/${category}/${ts}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();

  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: arrayBuffer,
    },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return NextResponse.json(
      { error: "Upload failed", detail: err },
      { status: 500 },
    );
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;

  return NextResponse.json({ url: publicUrl, name: file.name });
}
