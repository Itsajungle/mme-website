import { NextResponse } from "next/server";

interface ApplyCDFixRequest {
  script: string;
  critiqueId: string;
  suggestedFix: string;
  brandName: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as ApplyCDFixRequest;
  const { script, critiqueId, suggestedFix, brandName } = body;

  if (!script || !critiqueId) {
    return NextResponse.json(
      { error: "script and critiqueId are required" },
      { status: 400 }
    );
  }

  let revisedScript = script;

  // Apply fixes based on critique area
  if (critiqueId === "cd-1" && !script.toLowerCase().includes(brandName.toLowerCase())) {
    revisedScript = `${script.trim()}\n\n${brandName} — always here for you.`;
  } else if (critiqueId === "cd-2" && !/\b(call|visit|pop|come|book|order|find|get)\b/i.test(script)) {
    revisedScript = `${script.trim()}\n\nVisit ${brandName} today.`;
  } else if (critiqueId === "cd-3") {
    revisedScript = `${script.trim()}\n\nImagine the possibilities with ${brandName}.`;
  }

  return NextResponse.json({ revisedScript });
}
