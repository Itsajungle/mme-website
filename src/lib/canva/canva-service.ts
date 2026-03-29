import crypto from "crypto";

const CANVA_API_BASE = "https://api.canva.com/rest/v1";
const CANVA_AUTH_URL = "https://www.canva.com/api/oauth/authorize";
const CANVA_TOKEN_URL = `${CANVA_API_BASE}/oauth/token`;

// In-memory PKCE store (state → { codeVerifier, brandId, createdAt })
const pkceStore = new Map<
  string,
  { codeVerifier: string; brandId: string; createdAt: number }
>();
const PKCE_TTL = 600_000; // 10 minutes

function cleanupExpiredPKCE() {
  const now = Date.now();
  for (const [state, entry] of pkceStore) {
    if (now - entry.createdAt > PKCE_TTL) pkceStore.delete(state);
  }
}

function generatePKCE(): { codeVerifier: string; codeChallenge: string } {
  const verifier = crypto.randomBytes(48).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return { codeVerifier: verifier, codeChallenge: challenge };
}

// Supabase REST helpers (avoids adding @supabase/supabase-js dependency)
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

export class CanvaService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scopes =
    "app:read asset:read asset:write design:content:read design:content:write design:meta:read folder:read profile:read";

  constructor() {
    this.clientId = process.env.CANVA_CLIENT_ID!;
    this.clientSecret = process.env.CANVA_CLIENT_SECRET!;
    this.redirectUri = process.env.CANVA_REDIRECT_URI!;
  }

  getAuthorizationUrl(brandId: string): string {
    cleanupExpiredPKCE();
    const { codeVerifier, codeChallenge } = generatePKCE();
    const state = crypto.randomBytes(24).toString("base64url");
    pkceStore.set(state, { codeVerifier, brandId, createdAt: Date.now() });

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    return `${CANVA_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCode(
    code: string,
    state: string,
  ): Promise<{ brandId: string }> {
    const entry = pkceStore.get(state);
    if (!entry) throw new Error("Invalid or expired state parameter");
    pkceStore.delete(state);

    const basicAuth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString("base64");

    const res = await fetch(CANVA_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
        code_verifier: entry.codeVerifier,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Token exchange failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    await this.storeTokens(
      entry.brandId,
      data.access_token,
      data.refresh_token,
      expiresAt,
    );

    return { brandId: entry.brandId };
  }

  async getValidToken(brandId: string): Promise<string> {
    const tokens = await this.getTokens(brandId);
    if (!tokens) throw new Error("Canva not connected for this brand");

    const expiresAt = new Date(tokens.expires_at);
    if (expiresAt.getTime() - Date.now() < 60_000) {
      return this.refreshToken(brandId);
    }
    return tokens.access_token;
  }

  async refreshToken(brandId: string): Promise<string> {
    const tokens = await this.getTokens(brandId);
    if (!tokens?.refresh_token)
      throw new Error("No refresh token available");

    const basicAuth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString("base64");

    const res = await fetch(CANVA_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokens.refresh_token,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Token refresh failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    await this.storeTokens(
      brandId,
      data.access_token,
      data.refresh_token ?? tokens.refresh_token,
      expiresAt,
    );

    return data.access_token;
  }

  async isConnected(brandId: string): Promise<boolean> {
    const tokens = await this.getTokens(brandId);
    return !!tokens;
  }

  async apiRequest(
    brandId: string,
    method: string,
    endpoint: string,
    data?: unknown,
  ): Promise<unknown> {
    let token = await this.getValidToken(brandId);
    let res = await fetch(`${CANVA_API_BASE}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    // Auto-refresh on 401
    if (res.status === 401) {
      token = await this.refreshToken(brandId);
      res = await fetch(`${CANVA_API_BASE}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });
    }

    // Rate limit handling
    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get("retry-after") ?? "2", 10);
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      res = await fetch(`${CANVA_API_BASE}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Canva API error: ${res.status} ${text}`);
    }

    return res.json();
  }

  async createDesign(
    brandId: string,
    title: string,
    designType = "doc",
  ): Promise<{ designId: string; editUrl: string; viewUrl: string }> {
    const result = (await this.apiRequest(brandId, "POST", "/designs", {
      design_type: designType,
      title,
    })) as {
      design: { id: string; urls: { edit_url: string; view_url: string } };
    };

    return {
      designId: result.design.id,
      editUrl: result.design.urls.edit_url,
      viewUrl: result.design.urls.view_url,
    };
  }

  async exportDesign(
    brandId: string,
    designId: string,
    format: "png" | "pdf" = "png",
  ): Promise<{ exportId: string; status: string }> {
    const result = (await this.apiRequest(brandId, "POST", "/exports", {
      design_id: designId,
      format: { type: format },
    })) as { job: { id: string; status: string } };

    return {
      exportId: result.job.id,
      status: result.job.status,
    };
  }

  async getExportStatus(
    brandId: string,
    exportId: string,
  ): Promise<{ status: string; downloadUrls?: string[] }> {
    const result = (await this.apiRequest(
      brandId,
      "GET",
      `/exports/${exportId}`,
    )) as { job: { status: string; urls?: string[] } };

    return {
      status: result.job.status,
      downloadUrls: result.job.urls,
    };
  }

  // Token storage via Supabase REST API
  private async storeTokens(
    brandId: string,
    accessToken: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void> {
    // Upsert: try update, then insert if not found
    const body = {
      brand_id: brandId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updateRes = await fetch(
      supabaseUrl(`/canva_tokens?brand_id=eq.${encodeURIComponent(brandId)}`),
      {
        method: "PATCH",
        headers: supabaseHeaders(),
        body: JSON.stringify(body),
      },
    );

    const updated = await updateRes.json();
    if (!Array.isArray(updated) || updated.length === 0) {
      await fetch(supabaseUrl("/canva_tokens"), {
        method: "POST",
        headers: supabaseHeaders(),
        body: JSON.stringify({ ...body, created_at: new Date().toISOString() }),
      });
    }
  }

  private async getTokens(brandId: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_at: string;
  } | null> {
    const res = await fetch(
      supabaseUrl(
        `/canva_tokens?brand_id=eq.${encodeURIComponent(brandId)}&select=access_token,refresh_token,expires_at&limit=1`,
      ),
      { headers: supabaseHeaders() },
    );
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  async deleteTokens(brandId: string): Promise<void> {
    await fetch(
      supabaseUrl(`/canva_tokens?brand_id=eq.${encodeURIComponent(brandId)}`),
      { method: "DELETE", headers: supabaseHeaders() },
    );
  }
}

// Singleton
let _instance: CanvaService | null = null;
export function getCanvaService(): CanvaService {
  if (!_instance) _instance = new CanvaService();
  return _instance;
}
