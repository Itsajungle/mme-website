import { NextResponse } from "next/server";

interface CDReviewRequest {
  script: string;
  score: number;
  brandName: string;
}

interface Critique {
  id: string;
  severity: "high" | "medium" | "low";
  area: string;
  issue: string;
  suggestedFix: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as CDReviewRequest;
  const { script, score, brandName } = body;

  if (!script || score === undefined) {
    return NextResponse.json(
      { error: "script and score are required" },
      { status: 400 }
    );
  }

  const critiques: Critique[] = [];
  const lower = script.toLowerCase();

  if (score < 75) {
    if (!lower.includes(brandName.toLowerCase())) {
      critiques.push({
        id: "cd-1",
        severity: "high",
        area: "Brand Voice",
        issue: `Script does not mention "${brandName}" — fails brand recall requirement`,
        suggestedFix: `Add "${brandName}" in the closing line for brand reinforcement`,
      });
    }

    if (!/\b(call|visit|pop|come|book|order|find|get)\b/i.test(script)) {
      critiques.push({
        id: "cd-2",
        severity: "high",
        area: "Call to Action",
        issue: "No clear action verb — listener has no direction",
        suggestedFix: "End with a direct CTA: 'Visit us today' or 'Call now'",
      });
    }

    if (!/\b(feel|love|heart|dream|imagine|trust|family|community)\b/i.test(script)) {
      critiques.push({
        id: "cd-3",
        severity: "medium",
        area: "Emotional Hook",
        issue: "Script lacks emotional language — feels flat",
        suggestedFix: "Add emotional words like 'imagine', 'love', or 'family' to connect with listeners",
      });
    }
  }

  if (critiques.length === 0) {
    critiques.push({
      id: "cd-0",
      severity: "low",
      area: "Overall",
      issue: "Script meets quality threshold — minor polish only",
      suggestedFix: "Consider tightening sentence structure for punchier delivery",
    });
  }

  return NextResponse.json({
    critiques,
    overallVerdict: score >= 75 ? "approved" : "revision-required",
    reviewerNote:
      score >= 75
        ? "Script meets creative standards."
        : "Script needs revision before scheduling.",
  });
}
