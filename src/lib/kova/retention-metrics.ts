import type {
  FiveActStructure,
  RetentionAnalysis,
  RetentionDataPoint,
  DropOffPoint,
  RetentionRecommendation,
} from "./types";

function simulateRetentionCurve(totalMs: number): RetentionDataPoint[] {
  const points: RetentionDataPoint[] = [];
  const steps = 20;
  const interval = totalMs / steps;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Natural decay with engagement bumps at ~40% (climax) and ~85% (CTA)
    const baseRetention = Math.exp(-1.2 * t);
    const climaxBump = Math.exp(-50 * Math.pow(t - 0.4, 2)) * 0.08;
    const ctaBump = Math.exp(-80 * Math.pow(t - 0.85, 2)) * 0.05;
    const retention = Math.min(1, baseRetention + climaxBump + ctaBump);

    points.push({
      timestampMs: Math.round(i * interval),
      retentionPct: Math.round(retention * 100) / 100,
      engagementScore: Math.round((retention * 0.7 + climaxBump * 3 + ctaBump * 2) * 100) / 100,
    });
  }

  return points;
}

function detectDropOffs(curve: RetentionDataPoint[]): DropOffPoint[] {
  const drops: DropOffPoint[] = [];

  for (let i = 1; i < curve.length; i++) {
    const delta = curve[i - 1].retentionPct - curve[i].retentionPct;
    if (delta > 0.06) {
      drops.push({
        timestampMs: curve[i].timestampMs,
        dropPct: Math.round(delta * 100) / 100,
        likelyReason:
          i <= 2
            ? "Hook failed to capture attention."
            : i <= curve.length * 0.4
              ? "Tension section lacks compelling progression."
              : "Content fatigue after climax — resolution too slow.",
      });
    }
  }

  return drops;
}

function generateRecommendations(
  structure: FiveActStructure,
  drops: DropOffPoint[]
): RetentionRecommendation[] {
  const recommendations: RetentionRecommendation[] = [];

  for (const drop of drops) {
    const act = structure.acts.find(
      (a) => {
        const actStart = structure.acts
          .filter((prev) => prev.order < a.order)
          .reduce((sum, prev) => sum + prev.durationMs, 0);
        return drop.timestampMs >= actStart && drop.timestampMs < actStart + a.durationMs;
      }
    );

    if (act) {
      recommendations.push({
        actLabel: act.label,
        issue: drop.likelyReason,
        suggestion: getSuggestion(act.label),
        priority: drop.dropPct > 0.1 ? "high" : drop.dropPct > 0.07 ? "medium" : "low",
        expectedLift: Math.round(drop.dropPct * 0.4 * 100) / 100,
      });
    }
  }

  return recommendations;
}

function getSuggestion(act: string): string {
  switch (act) {
    case "hook":
      return "Shorten hook or front-load a more provocative visual.";
    case "tension":
      return "Add a mid-act micro-reveal to sustain curiosity.";
    case "climax":
      return "Ensure the climax delivers a clear emotional payoff.";
    case "resolution":
      return "Tighten resolution — cut 20% and move to CTA faster.";
    case "cta":
      return "Make CTA more urgent with a time or scarcity cue.";
    default:
      return "Review pacing in this section.";
  }
}

export function analyzeRetention(
  contentId: string,
  structure: FiveActStructure,
  platform: string = "all"
): RetentionAnalysis {
  const curve = simulateRetentionCurve(structure.totalDurationMs);
  const drops = detectDropOffs(curve);
  const recommendations = generateRecommendations(structure, drops);

  const avgWatch = curve.reduce((s, p) => s + p.retentionPct, 0) / curve.length;

  return {
    contentId,
    platform,
    totalViews: 0, // populated from real analytics
    avgWatchPct: Math.round(avgWatch * 100) / 100,
    dropOffPoints: drops,
    retentionCurve: curve,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}
