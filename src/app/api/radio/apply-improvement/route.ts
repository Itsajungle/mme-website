import { NextResponse } from "next/server";

interface ApplyRequest {
  script: string;
  suggestionId: string;
  replacement?: string;
  brandName: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as ApplyRequest;
  const { script, replacement, brandName } = body;

  if (!script) {
    return NextResponse.json(
      { error: "script is required" },
      { status: 400 }
    );
  }

  // If a direct replacement was provided, use it
  if (replacement) {
    return NextResponse.json({ revisedScript: replacement });
  }

  // Otherwise apply a generic brand-name append
  const revisedScript = script.includes(brandName)
    ? script
    : `${script.trim()}\n\n${brandName} — always here for you.`;

  return NextResponse.json({ revisedScript });
}
