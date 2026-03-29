import { NextResponse } from "next/server";
import { getCanvaService } from "@/lib/canva/canva-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ exportId: string }> },
) {
  try {
    const { exportId } = await params;
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");

    if (!brandId) {
      return NextResponse.json(
        { error: "brand_id is required" },
        { status: 400 },
      );
    }

    const canva = getCanvaService();
    const result = await canva.getExportStatus(brandId, exportId);

    return NextResponse.json({
      status: result.status,
      download_urls: result.downloadUrls ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
