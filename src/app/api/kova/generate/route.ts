import {
  evaluateConcept,
  generateFiveActStructure,
  generateStoryboard,
  applyStyle,
  getStyleProfile,
  enrichAllScenes,
  generateTransitions,
  saveConcept,
  saveStructure,
  saveStoryboard,
  saveStyleApplication,
} from "@/lib/kova";
import type { KovaPipelineRequest, KovaPipelineResult } from "@/lib/kova";

export async function POST(request: Request) {
  try {
    const body: KovaPipelineRequest = await request.json();
    const { concept, styleProfileId, aspectRatio, includeEnrichment } = body;

    if (!concept?.brandSlug || !concept?.title || !concept?.description) {
      return Response.json(
        { error: "concept.brandSlug, concept.title, and concept.description are required." },
        { status: 400 }
      );
    }

    // Step 1 — Concept Gate
    const gateResult = evaluateConcept(concept);
    await saveConcept(gateResult);

    const result: KovaPipelineResult = { concept: gateResult };

    if (gateResult.status === "rejected") {
      return Response.json(result);
    }

    // Step 2 — Five-Act Structure
    const structure = generateFiveActStructure(gateResult.id, concept);
    await saveStructure(structure);
    result.structure = structure;

    // Step 3 — Storyboard
    const storyboard = generateStoryboard(structure, aspectRatio);
    await saveStoryboard(storyboard);
    result.storyboard = storyboard;

    // Step 4 — Style Application
    if (styleProfileId) {
      const profile = getStyleProfile(styleProfileId);
      if (profile) {
        const styleApp = applyStyle(storyboard, profile);
        await saveStyleApplication(styleApp);
        result.style = styleApp;
      }
    }

    // Step 5 — Scene Enrichment & Transitions
    if (includeEnrichment !== false) {
      result.enrichments = enrichAllScenes(storyboard.frames);
      result.transitions = generateTransitions(storyboard.frames);
    }

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: "Pipeline generation failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
