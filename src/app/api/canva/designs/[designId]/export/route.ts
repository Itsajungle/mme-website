import { NextResponse } from "next/server";
import { getCanvaService } from "@/lib/canva/canva-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ designId: string }> },
) {
  try {
    const { designId } = await params;
    const body = await request.json();
    const { brand_id, format } = body;

    if (!brand_id) {
      return NextResponse.json(
        { error: "brand_id is required" },
        { status: 400 },
      );
    }

    const canva = getCanvaService();
    const result = await canva.exportDesign(
      brand_id,
      designId,
      format ?? "png",
    );

    return NextResponse.json({
      export_id: result.exportId,
      status: result.status,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
