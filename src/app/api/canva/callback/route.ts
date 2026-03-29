import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getCanvaService,
  decryptPKCE,
  PKCE_COOKIE_NAME,
} from "@/lib/canva/canva-service";

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "https://momentmarketingengine.com"
  );
}

function redirectUrl(path: string): string {
  return `${getBaseUrl()}${path}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      redirectUrl(
        `/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=${encodeURIComponent(error)}`,
      ),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      redirectUrl(
        "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=missing_params",
      ),
    );
  }

  try {
    // Read PKCE data from encrypted cookie
    const cookieStore = await cookies();
    const pkceCookie = cookieStore.get(PKCE_COOKIE_NAME)?.value;

    if (!pkceCookie) {
      console.error("[Canva OAuth] PKCE cookie not found");
      return NextResponse.redirect(
        redirectUrl(
          "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=missing_pkce",
        ),
      );
    }

    const pkceData = decryptPKCE(pkceCookie);
    if (!pkceData) {
      console.error("[Canva OAuth] Failed to decrypt PKCE cookie");
      return NextResponse.redirect(
        redirectUrl(
          "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=invalid_pkce",
        ),
      );
    }

    // Verify state matches
    if (pkceData.state !== state) {
      console.error("[Canva OAuth] State mismatch");
      return NextResponse.redirect(
        redirectUrl(
          "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=state_mismatch",
        ),
      );
    }

    const canva = getCanvaService();
    const { brandId } = await canva.exchangeCode(
      code,
      state,
      pkceData.codeVerifier,
      pkceData.brandId,
    );
    console.log(
      `[Canva OAuth] Token exchange succeeded for brand: ${brandId}`,
    );

    // Clear the PKCE cookie and redirect
    const response = NextResponse.redirect(
      redirectUrl(
        "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=connected",
      ),
    );
    response.cookies.delete(PKCE_COOKIE_NAME);
    return response;
  } catch (err) {
    console.error("[Canva OAuth] Token exchange failed:", err);
    return NextResponse.redirect(
      redirectUrl(
        "/dashboard/station/sunshine-radio/brand/riordan-motors/social?canva=error&reason=exchange_failed",
      ),
    );
  }
}
