// Publishing provider: X (formerly Twitter) API v2
// Requires X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET env vars
// Uses OAuth 1.0a with HMAC-SHA1 signing

import crypto from "crypto";

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

function buildOAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessSecret: string
): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  // Build signature base string from sorted oauth params only (body is JSON, not form)
  const sortedParams = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
    .join("&");

  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams),
  ].join("&");

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessSecret)}`;
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  const headerParts = {
    ...oauthParams,
    oauth_signature: signature,
  };

  const headerString = Object.entries(headerParts)
    .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
    .join(", ");

  return `OAuth ${headerString}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return Response.json(
      { status: "not_configured", error: "Platform not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { text } = body as { text: string; imageUrl?: string };

    if (!text) {
      return Response.json({ error: "Missing required field: text" }, { status: 400 });
    }

    const tweetUrl = "https://api.x.com/2/tweets";
    const authHeader = buildOAuthHeader(
      "POST",
      tweetUrl,
      apiKey,
      apiSecret,
      accessToken,
      accessSecret
    );

    const res = await fetch(tweetUrl, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { status: "failed", error: data.detail ?? data.title ?? "Post creation failed" },
        { status: 502 }
      );
    }

    const postId: string = data.data?.id ?? "unknown";
    const postUrl = postId !== "unknown" ? `https://x.com/i/web/status/${postId}` : undefined;

    return Response.json({ status: "published", postId, postUrl });
  } catch {
    return Response.json(
      { status: "failed", error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
