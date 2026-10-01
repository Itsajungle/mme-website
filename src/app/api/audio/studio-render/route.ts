import { hasFfmpeg, renderStudio, type RenderRequest } from "@/lib/audio-engine/ffmpeg";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RenderRequest;
    if (!body?.clips?.length) {
      return Response.json({ error: "Add at least one clip before exporting" }, { status: 400 });
    }
    if (!(await hasFfmpeg())) {
      return Response.json({ error: "The mix engine is unavailable on this server" }, { status: 503 });
    }
    const result = await renderStudio(body);
    return Response.json(result);
  } catch (error) {
    console.error("[studio-render]", error);
    return Response.json(
      { error: "Export failed", details: error instanceof Error ? error.message.split("\n")[0].slice(0, 200) : "Unknown error" },
      { status: 500 }
    );
  }
}
