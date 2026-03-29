import type {
  ConceptSubmission,
  FiveActStructure,
  Act,
  ActLabel,
} from "./types";

const ACT_TEMPLATES: Record<
  ActLabel,
  { emotionalTarget: string; visualHint: string; audioHint: string; pctOfTotal: number }
> = {
  hook: {
    emotionalTarget: "curiosity",
    visualHint: "Bold opening visual — movement, contrast, or surprise.",
    audioHint: "Attention-grabbing sound hit or silence break.",
    pctOfTotal: 0.12,
  },
  tension: {
    emotionalTarget: "anticipation",
    visualHint: "Build visual complexity — layering, reveal, or close-up.",
    audioHint: "Rising music bed with subtle tension cues.",
    pctOfTotal: 0.25,
  },
  climax: {
    emotionalTarget: "impact",
    visualHint: "Peak visual moment — hero shot, transformation, or payoff.",
    audioHint: "Full music swell, cymbal hit, or bass drop.",
    pctOfTotal: 0.28,
  },
  resolution: {
    emotionalTarget: "satisfaction",
    visualHint: "Visual settle — product shot, smile, or wide reveal.",
    audioHint: "Music resolves; warm tonal pad or gentle fade.",
    pctOfTotal: 0.2,
  },
  cta: {
    emotionalTarget: "urgency",
    visualHint: "Clean frame with brand lockup and action prompt.",
    audioHint: "Sonic logo or final voice-over with conviction.",
    pctOfTotal: 0.15,
  },
};

const ACT_ORDER: ActLabel[] = ["hook", "tension", "climax", "resolution", "cta"];

function buildNarrativeArc(concept: ConceptSubmission): string {
  return (
    `Open with a ${concept.tone || "compelling"} hook that connects to ` +
    `"${concept.targetAudience}". Build tension through the core proposition of ` +
    `"${concept.title}". Climax delivers the emotional or rational payoff. ` +
    `Resolve with brand warmth, then close with a clear call-to-action.`
  );
}

export function generateFiveActStructure(
  conceptId: string,
  concept: ConceptSubmission
): FiveActStructure {
  const totalMs = concept.duration || 30000;

  const acts: Act[] = ACT_ORDER.map((label, i) => {
    const template = ACT_TEMPLATES[label];
    return {
      label,
      order: i + 1,
      durationMs: Math.round(totalMs * template.pctOfTotal),
      description: `${concept.title} — ${label} beat.`,
      emotionalTarget: template.emotionalTarget,
      visualDirection: template.visualHint,
      audioDirection: template.audioHint,
    };
  });

  // Adjust rounding so durations sum to totalMs exactly
  const sumMs = acts.reduce((s, a) => s + a.durationMs, 0);
  if (sumMs !== totalMs) {
    acts[2].durationMs += totalMs - sumMs; // absorb remainder into climax
  }

  return {
    id: `fa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    conceptId,
    acts,
    totalDurationMs: totalMs,
    narrativeArc: buildNarrativeArc(concept),
    generatedAt: new Date().toISOString(),
  };
}
