import { NextResponse } from "next/server";

interface HeyGenAvatar {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string;
  gender?: string;
}

export async function GET() {
  const apiKey = process.env.HEYGEN_API_KEY;

  if (!apiKey) {
    // Return demo presenters when API key is not configured
    return NextResponse.json({
      avatars: [
        { avatar_id: "demo-1", avatar_name: "Aria", preview_image_url: "", gender: "female" },
        { avatar_id: "demo-2", avatar_name: "Marcus", preview_image_url: "", gender: "male" },
        { avatar_id: "demo-3", avatar_name: "Sophie", preview_image_url: "", gender: "female" },
        { avatar_id: "demo-4", avatar_name: "James", preview_image_url: "", gender: "male" },
      ],
      source: "demo",
    });
  }

  try {
    const response = await fetch("https://api.heygen.com/v2/avatars", {
      headers: { "X-Api-Key": apiKey },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[list-presenters] API error:", response.status, text);
      return NextResponse.json(
        { error: `Presenter engine error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const avatars: HeyGenAvatar[] = (data?.data?.avatars ?? []).map(
      (a: Record<string, unknown>) => ({
        avatar_id: a.avatar_id,
        avatar_name: a.avatar_name,
        preview_image_url: a.preview_image_url ?? "",
        gender: a.gender ?? "unknown",
      })
    );

    return NextResponse.json({ avatars, source: "live" });
  } catch (err) {
    console.error("[list-presenters] Error:", err);
    return NextResponse.json(
      { error: "Failed to list presenters" },
      { status: 500 }
    );
  }
}
