import type { PublishAllRequest, PublishResult } from "@/lib/social-engine/types";

export async function POST(request: Request) {
  try {
    const body: PublishAllRequest = await request.json();
    const { platforms, content } = body;

    if (!platforms?.length || !content) {
      return Response.json(
        { error: "Missing required fields: platforms, content" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const publishPromises = platforms.map(async (platform): Promise<PublishResult> => {
      const platformContent = content[platform];
      if (!platformContent) {
        return { platform, status: "failed", error: "No content provided for platform" };
      }

      const endpoint = `${baseUrl}/api/social/publish/${platform}`;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: platformContent.text,
            imageUrl: platformContent.imageUrl,
            hashtags: platformContent.hashtags,
          }),
        });

        const data = await res.json();

        if (res.status === 503) {
          return { platform, status: "not_configured", error: data.error };
        }

        if (!res.ok) {
          return { platform, status: "failed", error: data.error ?? "Publish failed" };
        }

        return {
          platform,
          status: data.status ?? "published",
          postId: data.postId,
          postUrl: data.postUrl,
          error: data.error,
        };
      } catch (err) {
        return {
          platform,
          status: "failed",
          error: err instanceof Error ? err.message : "Network error",
        };
      }
    });

    const settled = await Promise.allSettled(publishPromises);
    const results: PublishResult[] = settled.map((outcome) => {
      if (outcome.status === "fulfilled") return outcome.value;
      return {
        platform: "unknown",
        status: "failed",
        error: outcome.reason instanceof Error ? outcome.reason.message : "Unknown error",
      };
    });

    return Response.json({ results, timestamp: new Date().toISOString() });
  } catch {
    return Response.json(
      { error: "Publish-all request failed. Please try again." },
      { status: 500 }
    );
  }
}
