import { NextResponse } from "next/server";
import {
  getCanvaService,
  PKCE_COOKIE_NAME,
} from "@/lib/canva/canva-service";

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
  const { authUrl, pkceCookie } = canva.getAuthorizationUrl(brandId);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(PKCE_COOKIE_NAME, pkceCookie, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  return response;
}
