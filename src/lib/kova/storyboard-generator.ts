import type {
  FiveActStructure,
  Storyboard,
  StoryboardFrame,
} from "./types";

const CAMERA_DIRECTIONS: Record<string, string[]> = {
  hook: ["Wide establishing shot", "Quick zoom-in", "Dramatic low-angle"],
  tension: ["Slow dolly forward", "Over-the-shoulder tracking", "Shallow DOF rack focus"],
  climax: ["Dynamic crane shot", "Snap zoom to hero", "360° orbit"],
  resolution: ["Gentle pull-back", "Steady medium shot", "Soft rack to background"],
  cta: ["Lock-off center frame", "Slow push-in to logo", "Static full-frame"],
};

function pickCamera(actLabel: string, index: number): string {
  const options = CAMERA_DIRECTIONS[actLabel] || CAMERA_DIRECTIONS.hook;
  return options[index % options.length];
}

function framesPerAct(durationMs: number): number {
  if (durationMs <= 3000) return 1;
  if (durationMs <= 8000) return 2;
  return 3;
}

export function generateStoryboard(
  structure: FiveActStructure,
  aspectRatio: Storyboard["aspectRatio"] = "16:9"
): Storyboard {
  const frames: StoryboardFrame[] = [];
  let cursor = 0;
  let frameIndex = 0;

  for (const act of structure.acts) {
    const count = framesPerAct(act.durationMs);
    const frameDuration = Math.round(act.durationMs / count);

    for (let i = 0; i < count; i++) {
      frames.push({
        frameIndex,
        actLabel: act.label,
        timestamp: cursor,
        durationMs: frameDuration,
        visualPrompt: `${act.visualDirection} — Frame ${i + 1} of ${act.label}.`,
        cameraDirection: pickCamera(act.label, i),
        overlayText: act.label === "cta" && i === count - 1 ? "[ Call-to-Action ]" : undefined,
        transitionIn: frameIndex === 0 ? "fade_from_black" : undefined,
        transitionOut: frameIndex === frames.length ? undefined : undefined,
      });
      cursor += frameDuration;
      frameIndex++;
    }
  }

  return {
    id: `sb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    structureId: structure.id,
    frames,
    aspectRatio,
    generatedAt: new Date().toISOString(),
  };
}
