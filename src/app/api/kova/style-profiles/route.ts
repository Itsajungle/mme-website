import { DEFAULT_STYLE_PROFILES, getStyleProfile } from "@/lib/kova";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const profile = getStyleProfile(id);
    if (!profile) {
      return Response.json({ error: "Style profile not found." }, { status: 404 });
    }
    return Response.json(profile);
  }

  return Response.json({ profiles: DEFAULT_STYLE_PROFILES });
}
