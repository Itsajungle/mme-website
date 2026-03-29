import type {
  StoryboardFrame,
  TransitionBridge,
  TransitionType,
  ActLabel,
} from "./types";

const ACT_TRANSITION_MAP: Record<string, TransitionType> = {
  "hook→tension": "dissolve",
  "tension→climax": "zoom",
  "climax→resolution": "dissolve",
  "resolution→cta": "wipe",
};

const INTRA_ACT_TRANSITIONS: Record<ActLabel, TransitionType> = {
  hook: "cut",
  tension: "slide",
  climax: "glitch",
  resolution: "dissolve",
  cta: "cut",
};

const EASING_MAP: Record<TransitionType, string> = {
  cut: "linear",
  dissolve: "ease-in-out",
  wipe: "ease-out",
  zoom: "cubic-bezier(0.4, 0, 0.2, 1)",
  morph: "cubic-bezier(0.65, 0, 0.35, 1)",
  glitch: "steps(6, end)",
  slide: "ease-in-out",
  iris: "ease-out",
};

const EMOTIONAL_PURPOSE: Record<TransitionType, string> = {
  cut: "Maintain momentum — no pause between beats.",
  dissolve: "Gentle emotional bridge — let the feeling linger.",
  wipe: "Clean directional shift — signals new chapter.",
  zoom: "Intensify energy — pull the viewer in.",
  morph: "Transform context — connect two ideas visually.",
  glitch: "Disrupt expectations — add edge and energy.",
  slide: "Lateral progression — smooth forward motion.",
  iris: "Focus attention — classic narrative reveal.",
};

function transitionDuration(type: TransitionType): number {
  if (type === "cut") return 0;
  if (type === "glitch") return 150;
  if (type === "dissolve" || type === "morph") return 600;
  return 400;
}

export function generateTransitions(frames: StoryboardFrame[]): TransitionBridge[] {
  const bridges: TransitionBridge[] = [];

  for (let i = 0; i < frames.length - 1; i++) {
    const from = frames[i];
    const to = frames[i + 1];

    const crossAct = from.actLabel !== to.actLabel;
    const key = `${from.actLabel}→${to.actLabel}`;

    const type: TransitionType = crossAct
      ? ACT_TRANSITION_MAP[key] || "dissolve"
      : INTRA_ACT_TRANSITIONS[from.actLabel] || "cut";

    bridges.push({
      fromFrame: from.frameIndex,
      toFrame: to.frameIndex,
      type,
      durationMs: transitionDuration(type),
      easing: EASING_MAP[type],
      emotionalPurpose: EMOTIONAL_PURPOSE[type],
    });
  }

  return bridges;
}
