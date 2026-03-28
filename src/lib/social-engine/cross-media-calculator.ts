// Cross-media lift calculator — reach amplification and POP score enhancement

import type { CrossMediaLift } from "./types";

// ─── Cross-media lift ─────────────────────────────────────────────────────────

// The 0.15 multiplier represents the cross-media amplification effect:
// audiences exposed to both channels engage at a higher rate than the sum of parts.
const CROSS_MEDIA_AMPLIFICATION = 0.15;

/**
 * Calculates the combined reach and percentage lift when a brand runs
 * both radio and social campaigns around the same moment.
 *
 * Formula: combinedReach = radioReach + socialReach + (radioReach * socialReach * 0.15)
 */
export function calculateCrossMediaLift(
  radioReach: number,
  socialReach: number
): CrossMediaLift {
  const amplification = radioReach * socialReach * CROSS_MEDIA_AMPLIFICATION;
  const combinedReach = radioReach + socialReach + amplification;

  const singleChannelMax = Math.max(radioReach, socialReach);
  const liftPercentage =
    singleChannelMax > 0
      ? Math.round(((combinedReach - singleChannelMax) / singleChannelMax) * 100)
      : 0;

  return {
    radioReach: Math.round(radioReach),
    socialReach: Math.round(socialReach),
    combinedReach: Math.round(combinedReach),
    liftPercentage,
  };
}

/**
 * Formats the lift percentage for display.
 * e.g. "+34% vs single channel"
 */
export function formatLiftLabel(lift: CrossMediaLift): string {
  return `+${lift.liftPercentage}% vs single channel`;
}

// ─── Enhanced POP score ────────────────────────────────────────────────────────

// How quickly the moment relevance decays (half-life in milliseconds)
// 6 hours — moments are time-sensitive; score halves every 6 hours
const TEMPORAL_HALF_LIFE_MS = 6 * 60 * 60 * 1000;

// Cross-media multiplier applied when brand has both radio and social active
const CROSS_MEDIA_POP_MULTIPLIER = 1.3;

// Score ceiling — enhanced score never exceeds 100
const MAX_POP_SCORE = 100;

/**
 * Calculates an enhanced POP (Point of Peak) score incorporating:
 * - Base score from moment detection
 * - Temporal proximity decay (score reduces as moment ages)
 * - Cross-media multiplier (1.3x when both radio + social are active)
 *
 * @param baseScore     Raw moment score from detection pipeline (0-100)
 * @param timestamp     ISO 8601 timestamp of when the moment was detected
 * @param hasRadio      Whether a radio campaign is active for this moment
 * @param hasSocial     Whether a social campaign is active for this moment
 */
export function calculateEnhancedPopScore(
  baseScore: number,
  timestamp: string,
  hasRadio: boolean,
  hasSocial: boolean
): number {
  // 1. Temporal proximity — decay based on how old the moment is
  const momentAge = Date.now() - new Date(timestamp).getTime();
  // Exponential decay: score halves every TEMPORAL_HALF_LIFE_MS
  const temporalMultiplier = Math.pow(0.5, momentAge / TEMPORAL_HALF_LIFE_MS);
  const temporalScore = baseScore * temporalMultiplier;

  // 2. Cross-media multiplier — reward simultaneous radio + social activation
  const crossMediaMultiplier = hasRadio && hasSocial ? CROSS_MEDIA_POP_MULTIPLIER : 1;

  const enhanced = temporalScore * crossMediaMultiplier;

  // 3. Cap at 100
  return Math.min(Math.round(enhanced), MAX_POP_SCORE);
}
