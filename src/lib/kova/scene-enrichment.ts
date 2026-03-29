import type {
  StoryboardFrame,
  SceneEnrichment,
  SoundLayer,
  MotionElement,
  ActLabel,
} from "./types";

const SOUND_TEMPLATES: Record<ActLabel, SoundLayer[]> = {
  hook: [
    { type: "sfx", description: "Impact whoosh or riser", volume: 0.8, startMs: 0, endMs: 800 },
    { type: "music_bed", description: "Sparse percussive intro", volume: 0.4, startMs: 0, endMs: 0 },
  ],
  tension: [
    { type: "music_bed", description: "Building rhythmic loop", volume: 0.5, startMs: 0, endMs: 0 },
    { type: "ambient", description: "Low atmospheric hum", volume: 0.2, startMs: 0, endMs: 0 },
  ],
  climax: [
    { type: "music_bed", description: "Full arrangement — peak energy", volume: 0.7, startMs: 0, endMs: 0 },
    { type: "sfx", description: "Climactic boom or reveal sting", volume: 0.85, startMs: 0, endMs: 600 },
  ],
  resolution: [
    { type: "music_bed", description: "Resolving chord progression", volume: 0.45, startMs: 0, endMs: 0 },
    { type: "foley", description: "Soft ambient detail — room tone", volume: 0.15, startMs: 0, endMs: 0 },
  ],
  cta: [
    { type: "sfx", description: "Sonic logo or brand sting", volume: 0.75, startMs: 0, endMs: 1200 },
    { type: "music_bed", description: "Gentle fade-out pad", volume: 0.3, startMs: 0, endMs: 0 },
  ],
};

const MOTION_TEMPLATES: Record<ActLabel, MotionElement[]> = {
  hook: [
    { type: "reveal", description: "Brand element reveal animation", intensity: 0.8, trigger: "on_enter" },
  ],
  tension: [
    { type: "parallax", description: "Subtle depth parallax on layers", intensity: 0.4, trigger: "on_enter" },
    { type: "text_animate", description: "Kinetic typography entrance", intensity: 0.6, trigger: "mid_scene" },
  ],
  climax: [
    { type: "particle", description: "Particle burst at peak moment", intensity: 0.9, trigger: "mid_scene" },
    { type: "shape_morph", description: "Shape morphs into product", intensity: 0.7, trigger: "on_enter" },
  ],
  resolution: [
    { type: "text_animate", description: "Smooth type settle", intensity: 0.3, trigger: "on_enter" },
  ],
  cta: [
    { type: "text_animate", description: "CTA text pop-in", intensity: 0.5, trigger: "on_enter" },
    { type: "reveal", description: "Logo lockup reveal", intensity: 0.6, trigger: "mid_scene" },
  ],
};

function adjustSoundTiming(
  layers: SoundLayer[],
  frame: StoryboardFrame
): SoundLayer[] {
  return layers.map((layer) => ({
    ...layer,
    startMs: frame.timestamp + layer.startMs,
    endMs: layer.endMs === 0 ? frame.timestamp + frame.durationMs : frame.timestamp + layer.endMs,
  }));
}

export function enrichScene(frame: StoryboardFrame): SceneEnrichment {
  const soundTemplates = SOUND_TEMPLATES[frame.actLabel] || [];
  const motionTemplates = MOTION_TEMPLATES[frame.actLabel] || [];

  return {
    frameIndex: frame.frameIndex,
    soundDesign: adjustSoundTiming(soundTemplates, frame),
    motionGraphics: motionTemplates,
    environmentalCues: buildEnvironmentalCues(frame.actLabel),
  };
}

export function enrichAllScenes(frames: StoryboardFrame[]): SceneEnrichment[] {
  return frames.map(enrichScene);
}

function buildEnvironmentalCues(act: ActLabel): string[] {
  switch (act) {
    case "hook":
      return ["High contrast lighting", "Shallow depth of field"];
    case "tension":
      return ["Directional light shifts", "Background motion blur"];
    case "climax":
      return ["Peak brightness", "Dynamic shadow play"];
    case "resolution":
      return ["Warm diffused light", "Soft focus edges"];
    case "cta":
      return ["Clean, even lighting", "Minimal background"];
  }
}
