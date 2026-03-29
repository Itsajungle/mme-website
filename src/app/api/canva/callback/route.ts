import { NextResponse } from "next/server";
import { getCanvaService } from "@/lib/canva/canva-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=${encodeURIComponent(error)}`,
        request.url,
      ),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=missing_params",
        request.url,
      ),
    );
  }

  try {
    const canva = getCanvaService();
    await canva.exchangeCode(code, state);

    return NextResponse.redirect(
      new URL(
        "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=connected",
        request.url,
      ),
    );
  } catch {
    return NextResponse.redirect(
      new URL(
        "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=exchange_failed",
        request.url,
      ),
    );
  }
}
