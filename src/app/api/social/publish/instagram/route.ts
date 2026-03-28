// Publishing provider: Instagram Graph API (Meta)
// Requires INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID env vars

export async function POST(request: Request) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !igUserId) {
    return Response.json(
      { status: "not_configured", error: "Platform not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { text, imageUrl, hashtags } = body as {
      text: string;
      imageUrl?: string;
      hashtags?: string[];
    };

    if (!text) {
      return Response.json({ error: "Missing required field: text" }, { status: 400 });
    }

    const caption = hashtags?.length
      ? `${text}\n\n${hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`
      : text;

    // Step 1: Create media container
    const containerParams = new URLSearchParams({
      caption,
      access_token: accessToken,
    });

    if (imageUrl) {
      containerParams.set("image_url", imageUrl);
      containerParams.set("media_type", "IMAGE");
    } else {
      // Text-only posts require a media_type of REELS or IMAGE with a placeholder
      containerParams.set("media_type", "IMAGE");
      containerParams.set("image_url", "https://placehold.co/1080x1080.jpg");
    }

    const containerRes = await fetch(
      `https://graph.instagram.com/v18.0/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: containerParams.toString(),
      }
    );

    const containerData = await containerRes.json();
    if (!containerRes.ok || !containerData.id) {
      return Response.json(
        { status: "failed", error: containerData.error?.message ?? "Failed to create media container" },
        { status: 502 }
      );
    }

    const containerId: string = containerData.id;

    // Step 2: Poll status until FINISHED (max 10 attempts, 2s apart)
    let statusCode = "IN_PROGRESS";
    let attempts = 0;
    while (statusCode !== "FINISHED" && attempts < 10) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(
        `https://graph.instagram.com/v18.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();
      statusCode = statusData.status_code ?? "ERROR";
      if (statusCode === "ERROR") {
        return Response.json(
          { status: "failed", error: "Media container processing failed" },
          { status: 502 }
        );
      }
      attempts++;
    }

    if (statusCode !== "FINISHED") {
      return Response.json(
        { status: "failed", error: "Media container processing timed out" },
        { status: 502 }
      );
    }

    // Step 3: Publish
    const publishParams = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken,
    });

    const publishRes = await fetch(
      `https://graph.instagram.com/v18.0/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: publishParams.toString(),
      }
    );

    const publishData = await publishRes.json();
    if (!publishRes.ok || !publishData.id) {
      return Response.json(
        { status: "failed", error: publishData.error?.message ?? "Publish step failed" },
        { status: 502 }
      );
    }

    return Response.json({ status: "published", postId: publishData.id });
  } catch {
    return Response.json(
      { status: "failed", error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
