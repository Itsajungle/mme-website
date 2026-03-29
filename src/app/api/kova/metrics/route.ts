import {
  analyzeRetention,
  getStructure,
  saveRetention,
  getRetention,
} from "@/lib/kova";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contentId, structureId, platform } = body as {
      contentId: string;
      structureId: string;
      platform?: string;
    };

    if (!contentId || !structureId) {
      return Response.json(
        { error: "contentId and structureId are required." },
        { status: 400 }
      );
    }

    const structure = await getStructure(structureId);
    if (!structure) {
      return Response.json(
        { error: "Structure not found. Run the generate pipeline first." },
        { status: 404 }
      );
    }

    const analysis = analyzeRetention(contentId, structure, platform);
    await saveRetention(analysis);

    return Response.json(analysis);
  } catch (error) {
    return Response.json(
      { error: "Retention analysis failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");

  if (!contentId) {
    return Response.json({ error: "contentId query parameter is required." }, { status: 400 });
  }

  const analysis = await getRetention(contentId);
  if (!analysis) {
    return Response.json({ error: "No retention data found for this content." }, { status: 404 });
  }

  return Response.json(analysis);
}
