// Kova Creative Intelligence — Type Definitions

// ── Concept Gate ──────────────────────────────────────────────

export type ConceptStatus = "pending" | "approved" | "rejected" | "revision_needed";

export interface ConceptSubmission {
  brandSlug: string;
  title: string;
  description: string;
  targetAudience: string;
  tone: string;
  medium: "video" | "audio" | "image" | "mixed";
  duration?: number;
  references?: string[];
}

export interface ConceptGateResult {
  id: string;
  status: ConceptStatus;
  score: number;
  feedback: ConceptFeedback[];
  approvedAt?: string;
  revisedFrom?: string;
}

export interface ConceptFeedback {
  dimension: "clarity" | "brand_alignment" | "audience_fit" | "originality" | "feasibility";
  score: number;
  note: string;
}

// ── Five-Act Structure ────────────────────────────────────────

export type ActLabel = "hook" | "tension" | "climax" | "resolution" | "cta";

export interface Act {
  label: ActLabel;
  order: number;
  durationMs: number;
  description: string;
  emotionalTarget: string;
  visualDirection: string;
  audioDirection: string;
}

export interface FiveActStructure {
  id: string;
  conceptId: string;
  acts: Act[];
  totalDurationMs: number;
  narrativeArc: string;
  generatedAt: string;
}

// ── Storyboard ────────────────────────────────────────────────

export interface StoryboardFrame {
  frameIndex: number;
  actLabel: ActLabel;
  timestamp: number;
  durationMs: number;
  visualPrompt: string;
  cameraDirection: string;
  overlayText?: string;
  transitionIn?: string;
  transitionOut?: string;
}

export interface Storyboard {
  id: string;
  structureId: string;
  frames: StoryboardFrame[];
  aspectRatio: "16:9" | "9:16" | "1:1" | "4:5";
  generatedAt: string;
}

// ── Style Profiles ────────────────────────────────────────────

export interface StyleProfile {
  id: string;
  name: string;
  description: string;
  colorPalette: string[];
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont?: string;
  };
  motionStyle: "cinematic" | "kinetic" | "minimal" | "organic" | "editorial";
  grainLevel: number;
  contrastRatio: number;
  tags: string[];
}

export interface StyleApplication {
  profileId: string;
  storyboardId: string;
  appliedFrames: StyledFrame[];
  appliedAt: string;
}

export interface StyledFrame extends StoryboardFrame {
  styleOverrides: {
    colorGrade?: string;
    filterName?: string;
    motionIntensity?: number;
    textPlacement?: "top" | "center" | "bottom" | "lower-third";
  };
}

// ── Scene Enrichment ──────────────────────────────────────────

export interface SceneEnrichment {
  frameIndex: number;
  soundDesign: SoundLayer[];
  motionGraphics: MotionElement[];
  environmentalCues: string[];
}

export interface SoundLayer {
  type: "ambient" | "sfx" | "music_bed" | "foley";
  description: string;
  volume: number;
  startMs: number;
  endMs: number;
}

export interface MotionElement {
  type: "particle" | "text_animate" | "shape_morph" | "parallax" | "reveal";
  description: string;
  intensity: number;
  trigger: "on_enter" | "mid_scene" | "on_exit";
}

// ── Transitions ───────────────────────────────────────────────

export type TransitionType =
  | "cut"
  | "dissolve"
  | "wipe"
  | "zoom"
  | "morph"
  | "glitch"
  | "slide"
  | "iris";

export interface TransitionBridge {
  fromFrame: number;
  toFrame: number;
  type: TransitionType;
  durationMs: number;
  easing: string;
  emotionalPurpose: string;
}

// ── Retention Metrics ─────────────────────────────────────────

export interface RetentionDataPoint {
  timestampMs: number;
  retentionPct: number;
  engagementScore: number;
}

export interface RetentionAnalysis {
  contentId: string;
  platform: string;
  totalViews: number;
  avgWatchPct: number;
  dropOffPoints: DropOffPoint[];
  retentionCurve: RetentionDataPoint[];
  recommendations: RetentionRecommendation[];
  analyzedAt: string;
}

export interface DropOffPoint {
  timestampMs: number;
  dropPct: number;
  likelyReason: string;
}

export interface RetentionRecommendation {
  actLabel: ActLabel;
  issue: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
  expectedLift: number;
}

// ── Pipeline ──────────────────────────────────────────────────

export interface KovaPipelineRequest {
  concept: ConceptSubmission;
  styleProfileId?: string;
  aspectRatio?: Storyboard["aspectRatio"];
  includeEnrichment?: boolean;
}

export interface KovaPipelineResult {
  concept: ConceptGateResult;
  structure?: FiveActStructure;
  storyboard?: Storyboard;
  style?: StyleApplication;
  enrichments?: SceneEnrichment[];
  transitions?: TransitionBridge[];
}

// ── Quality Chain ─────────────────────────────────────────────

export interface QualitySubmission {
  contentId: string;
  contentType: "video" | "audio" | "image" | "copy";
  brandSlug: string;
  payload: Record<string, unknown>;
}

export interface QualityVerdict {
  submissionId: string;
  pass: boolean;
  overallScore: number;
  checks: QualityCheck[];
  reviewedAt: string;
}

export interface QualityCheck {
  name: string;
  pass: boolean;
  score: number;
  details: string;
}
