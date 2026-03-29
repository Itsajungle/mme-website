import type {
  StyleProfile,
  StyleApplication,
  Storyboard,
  StyledFrame,
} from "./types";

export const DEFAULT_STYLE_PROFILES: StyleProfile[] = [
  {
    id: "sp_cinematic_warm",
    name: "Cinematic Warm",
    description: "Rich, warm tones with filmic grain — ideal for storytelling and brand emotion.",
    colorPalette: ["#1a0f0a", "#c4713b", "#f5deb3", "#faf0e6", "#2c1810"],
    typography: { headingFont: "Outfit", bodyFont: "Inter" },
    motionStyle: "cinematic",
    grainLevel: 0.3,
    contrastRatio: 1.4,
    tags: ["warm", "filmic", "emotional"],
  },
  {
    id: "sp_kinetic_bold",
    name: "Kinetic Bold",
    description: "High-energy motion with saturated colour and punchy cuts.",
    colorPalette: ["#0d0d0d", "#ff3c00", "#00e5ff", "#ffffff", "#1a1a2e"],
    typography: { headingFont: "Outfit", bodyFont: "Inter", accentFont: "JetBrains Mono" },
    motionStyle: "kinetic",
    grainLevel: 0.05,
    contrastRatio: 1.8,
    tags: ["energetic", "bold", "dynamic"],
  },
  {
    id: "sp_minimal_clean",
    name: "Minimal Clean",
    description: "Restrained palette with ample whitespace — lets the message breathe.",
    colorPalette: ["#fafafa", "#111111", "#e0e0e0", "#6b6b6b", "#ffffff"],
    typography: { headingFont: "Outfit", bodyFont: "Inter" },
    motionStyle: "minimal",
    grainLevel: 0,
    contrastRatio: 1.1,
    tags: ["clean", "minimal", "modern"],
  },
  {
    id: "sp_organic_earth",
    name: "Organic Earth",
    description: "Natural textures and earthy hues — wellness, food, sustainability.",
    colorPalette: ["#2d4a22", "#8b6f47", "#d4c5a9", "#f0ead6", "#1a1a1a"],
    typography: { headingFont: "Outfit", bodyFont: "Inter" },
    motionStyle: "organic",
    grainLevel: 0.15,
    contrastRatio: 1.2,
    tags: ["natural", "earthy", "calm"],
  },
  {
    id: "sp_editorial_sharp",
    name: "Editorial Sharp",
    description: "Magazine-grade precision — high contrast, structured layouts.",
    colorPalette: ["#000000", "#ffffff", "#c8102e", "#f5f5f5", "#333333"],
    typography: { headingFont: "Outfit", bodyFont: "Inter", accentFont: "JetBrains Mono" },
    motionStyle: "editorial",
    grainLevel: 0.08,
    contrastRatio: 1.6,
    tags: ["editorial", "sharp", "premium"],
  },
];

export function getStyleProfile(profileId: string): StyleProfile | undefined {
  return DEFAULT_STYLE_PROFILES.find((p) => p.id === profileId);
}

export function applyStyle(
  storyboard: Storyboard,
  profile: StyleProfile
): StyleApplication {
  const appliedFrames: StyledFrame[] = storyboard.frames.map((frame) => {
    const isHero = frame.actLabel === "climax";
    const isCta = frame.actLabel === "cta";

    return {
      ...frame,
      styleOverrides: {
        colorGrade: profile.colorPalette[1],
        filterName: profile.grainLevel > 0.1 ? "film_grain" : undefined,
        motionIntensity:
          profile.motionStyle === "kinetic"
            ? 0.9
            : profile.motionStyle === "minimal"
              ? 0.2
              : 0.5,
        textPlacement: isCta
          ? "center"
          : isHero
            ? "lower-third"
            : undefined,
      },
    };
  });

  return {
    profileId: profile.id,
    storyboardId: storyboard.id,
    appliedFrames,
    appliedAt: new Date().toISOString(),
  };
}
