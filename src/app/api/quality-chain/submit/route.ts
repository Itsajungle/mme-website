import { saveQualityVerdict } from "@/lib/kova";
import type { QualitySubmission, QualityVerdict, QualityCheck } from "@/lib/kova";

function runQualityChecks(submission: QualitySubmission): QualityCheck[] {
  const checks: QualityCheck[] = [];

  // Brand alignment check
  checks.push({
    name: "brand_alignment",
    pass: !!submission.brandSlug,
    score: submission.brandSlug ? 0.85 : 0,
    details: submission.brandSlug
      ? `Content linked to brand "${submission.brandSlug}".`
      : "No brand association — cannot verify alignment.",
  });

  // Content completeness check
  const payloadKeys = Object.keys(submission.payload || {});
  const completeness = Math.min(payloadKeys.length / 3, 1);
  checks.push({
    name: "content_completeness",
    pass: completeness >= 0.6,
    score: Math.round(completeness * 100) / 100,
    details:
      completeness >= 0.6
        ? "Content payload has sufficient data."
        : "Content payload is sparse — may be incomplete.",
  });

  // Format validity check
  const validTypes = ["video", "audio", "image", "copy"];
  const typeValid = validTypes.includes(submission.contentType);
  checks.push({
    name: "format_validity",
    pass: typeValid,
    score: typeValid ? 1 : 0,
    details: typeValid
      ? `Content type "${submission.contentType}" is supported.`
      : `Unknown content type "${submission.contentType}".`,
  });

  // Metadata presence check
  const hasId = !!submission.contentId;
  checks.push({
    name: "metadata_presence",
    pass: hasId,
    score: hasId ? 1 : 0,
    details: hasId
      ? "Content ID present for traceability."
      : "Missing content ID — cannot track through pipeline.",
  });

  return checks;
}

export async function POST(request: Request) {
  try {
    const body: QualitySubmission = await request.json();

    if (!body.contentId || !body.contentType || !body.brandSlug) {
      return Response.json(
        { error: "contentId, contentType, and brandSlug are required." },
        { status: 400 }
      );
    }

    const checks = runQualityChecks(body);
    const overallScore =
      Math.round(
        (checks.reduce((s, c) => s + c.score, 0) / checks.length) * 100
      ) / 100;
    const pass = checks.every((c) => c.pass);

    const verdict: QualityVerdict = {
      submissionId: `qv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      pass,
      overallScore,
      checks,
      reviewedAt: new Date().toISOString(),
    };

    await saveQualityVerdict(verdict);

    return Response.json(verdict);
  } catch (error) {
    return Response.json(
      { error: "Quality chain submission failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
