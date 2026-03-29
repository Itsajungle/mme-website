import type {
  ConceptSubmission,
  ConceptGateResult,
  ConceptFeedback,
} from "./types";

const DIMENSION_WEIGHTS: Record<ConceptFeedback["dimension"], number> = {
  clarity: 0.25,
  brand_alignment: 0.25,
  audience_fit: 0.2,
  originality: 0.15,
  feasibility: 0.15,
};

const PASS_THRESHOLD = 0.65;

function evaluateDimension(
  concept: ConceptSubmission,
  dimension: ConceptFeedback["dimension"]
): ConceptFeedback {
  switch (dimension) {
    case "clarity":
      return {
        dimension,
        score: concept.description.length >= 20 ? 0.85 : 0.4,
        note:
          concept.description.length >= 20
            ? "Concept description is clear and actionable."
            : "Description needs more detail to guide production.",
      };
    case "brand_alignment":
      return {
        dimension,
        score: concept.tone ? 0.8 : 0.5,
        note: concept.tone
          ? `Tone "${concept.tone}" aligns with brand voice.`
          : "No tone specified — risk of off-brand output.",
      };
    case "audience_fit":
      return {
        dimension,
        score: concept.targetAudience ? 0.8 : 0.45,
        note: concept.targetAudience
          ? `Target audience "${concept.targetAudience}" is well-defined.`
          : "Target audience is vague or missing.",
      };
    case "originality":
      return {
        dimension,
        score: concept.references && concept.references.length > 0 ? 0.75 : 0.6,
        note:
          concept.references && concept.references.length > 0
            ? "References provided — originality can be benchmarked."
            : "No references; originality is assumed but unverified.",
      };
    case "feasibility":
      return {
        dimension,
        score: concept.duration && concept.duration <= 120000 ? 0.85 : 0.6,
        note:
          concept.duration && concept.duration <= 120000
            ? "Duration is within standard production bounds."
            : "Duration may stretch production resources.",
      };
  }
}

export function evaluateConcept(concept: ConceptSubmission): ConceptGateResult {
  const feedback: ConceptFeedback[] = (
    Object.keys(DIMENSION_WEIGHTS) as ConceptFeedback["dimension"][]
  ).map((dim) => evaluateDimension(concept, dim));

  const score = feedback.reduce(
    (sum, fb) => sum + fb.score * DIMENSION_WEIGHTS[fb.dimension],
    0
  );

  const lowDimensions = feedback.filter((fb) => fb.score < 0.5);

  let status: ConceptGateResult["status"];
  if (score >= PASS_THRESHOLD && lowDimensions.length === 0) {
    status = "approved";
  } else if (score >= PASS_THRESHOLD * 0.8) {
    status = "revision_needed";
  } else {
    status = "rejected";
  }

  return {
    id: `cg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status,
    score: Math.round(score * 100) / 100,
    feedback,
    approvedAt: status === "approved" ? new Date().toISOString() : undefined,
  };
}
