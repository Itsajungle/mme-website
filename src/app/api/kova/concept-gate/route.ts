import { evaluateConcept, saveConcept, getConcept } from "@/lib/kova";
import type { ConceptSubmission } from "@/lib/kova";

export async function POST(request: Request) {
  try {
    const body: ConceptSubmission = await request.json();

    if (!body.brandSlug || !body.title || !body.description) {
      return Response.json(
        { error: "brandSlug, title, and description are required." },
        { status: 400 }
      );
    }

    const result = evaluateConcept(body);
    await saveConcept(result);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: "Concept gate evaluation failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id query parameter is required." }, { status: 400 });
  }

  const concept = await getConcept(id);
  if (!concept) {
    return Response.json({ error: "Concept not found." }, { status: 404 });
  }

  return Response.json(concept);
}
