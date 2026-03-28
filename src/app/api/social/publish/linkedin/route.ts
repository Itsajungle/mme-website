// Publishing provider: LinkedIn REST API
// Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN env vars

export async function POST(request: Request) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
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

    const payload: Record<string, unknown> = {
      author: personUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    // Attach image content if provided
    if (imageUrl) {
      payload.content = {
        media: {
          title: "Image",
          id: imageUrl,
        },
      };
    }

    const res = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorMsg = "Post creation failed";
      try {
        const errData = await res.json();
        errorMsg = errData.message ?? errData.error ?? errorMsg;
      } catch {
        // ignore parse error
      }
      return Response.json({ status: "failed", error: errorMsg }, { status: 502 });
    }

    // LinkedIn returns the post URN in the x-restli-id header
    const postId = res.headers.get("x-restli-id") ?? res.headers.get("x-linkedin-id") ?? "unknown";

    return Response.json({ status: "published", postId });
  } catch {
    return Response.json(
      { status: "failed", error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
