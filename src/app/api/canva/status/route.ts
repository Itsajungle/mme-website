import { NextResponse } from "next/server";
import { getCanvaService } from "@/lib/canva/canva-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brand_id");

  if (!brandId) {
    return NextResponse.json(
      { error: "brand_id is required" },
      { status: 400 },
    );
  }

  const canva = getCanvaService();
  const connected = await canva.isConnected(brandId);

  return NextResponse.json({ connected });
}
