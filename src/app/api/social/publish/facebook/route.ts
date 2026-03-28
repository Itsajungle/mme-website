// Publishing provider: Facebook Graph API (Meta)
// Requires FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID env vars

export async function POST(request: Request) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    return Response.json(
      { status: "not_configured", error: "Platform not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { text, imageUrl } = body as { text: string; imageUrl?: string };

    if (!text) {
      return Response.json({ error: "Missing required field: text" }, { status: 400 });
    }

    let res: Response;

    if (imageUrl) {
      // Post with image via /photos endpoint
      const params = new URLSearchParams({
        url: imageUrl,
        caption: text,
        access_token: accessToken,
      });

      res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    } else {
      // Text-only post via /feed endpoint
      const params = new URLSearchParams({
        message: text,
        access_token: accessToken,
      });

      res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { status: "failed", error: data.error?.message ?? "Post creation failed" },
        { status: 502 }
      );
    }

    const postId: string = data.id ?? data.post_id ?? "unknown";
    return Response.json({ status: "published", postId });
  } catch {
    return Response.json(
      { status: "failed", error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
