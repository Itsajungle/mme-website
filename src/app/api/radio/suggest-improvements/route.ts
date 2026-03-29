import { NextResponse } from "next/server";

interface SuggestRequest {
  script: string;
  brandName: string;
  duration: string;
  triggerType?: string;
}

interface Suggestion {
  id: string;
  category: string;
  text: string;
  replacement?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as SuggestRequest;
  const { script, brandName, duration, triggerType } = body;

  if (!script || !brandName) {
    return NextResponse.json(
      { error: "script and brandName are required" },
      { status: 400 }
    );
  }

  const suggestions: Suggestion[] = [];
  const lower = script.toLowerCase();

  if (!lower.includes(brandName.toLowerCase())) {
    suggestions.push({
      id: "sug-1",
      category: "Brand Voice",
      text: `Add "${brandName}" mention for stronger brand recall`,
      replacement: `${script.trim()}\n\n${brandName} — where it all comes together.`,
    });
  }

  if (!/\b(call|visit|pop|come|book|order|find|get)\b/i.test(script)) {
    suggestions.push({
      id: "sug-2",
      category: "Call to Action",
      text: "Add a clear action verb to drive listener response",
      replacement: `${script.trim()}\n\nVisit ${brandName} today.`,
    });
  }

  if (!/\b(today|now|this weekend|don't miss|limited|hurry)\b/i.test(script)) {
    suggestions.push({
      id: "sug-3",
      category: "Urgency",
      text: "Add urgency to encourage immediate action",
    });
  }

  if (triggerType && !lower.includes(triggerType.toLowerCase())) {
    suggestions.push({
      id: "sug-4",
      category: "Moment Relevance",
      text: `Reference the ${triggerType} trigger for stronger contextual connection`,
    });
  }

  const words = script.trim().split(/\s+/).length;
  const targetSeconds = parseInt(duration) || 30;
  const targetWords = Math.round(targetSeconds * 2.5);
  if (words > targetWords * 1.15) {
    suggestions.push({
      id: "sug-5",
      category: "Timing",
      text: `Script is ${words} words — trim to ~${targetWords} for ${duration} delivery`,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: "sug-0",
      category: "Quality",
      text: "Script looks strong — no major improvements needed",
    });
  }

  return NextResponse.json({ suggestions });
}
