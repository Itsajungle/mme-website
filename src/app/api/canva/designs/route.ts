import { NextResponse } from "next/server";
import { getCanvaService } from "@/lib/canva/canva-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brand_id, title, design_type } = body;

    if (!brand_id || !title) {
      return NextResponse.json(
        { error: "brand_id and title are required" },
        { status: 400 },
      );
    }

    const canva = getCanvaService();
    const result = await canva.createDesign(brand_id, title, design_type);

    return NextResponse.json({
      design_id: result.designId,
      edit_url: result.editUrl,
      view_url: result.viewUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
