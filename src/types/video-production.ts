// Types for the 7-clip video ad production pipeline

export type AspectRatio = "9:16" | "16:9" | "1:1";

export type ClipType =
  | "remotion_intro"
  | "presenter"
  | "image_overlay"
  | "remotion_offer"
  | "remotion_outro";

export type ClipStatus =
  | "pending"
  | "generating"
  | "complete"
  | "error";

export type PipelineStage =
  | "idle"
  | "script"
  | "presenter_videos"
  | "images"
  | "composition"
  | "complete"
  | "error";

export type ImageSource = "ai_generated" | "brand_kit";

// ─── Script types ───────────────────────────────────────────────────────────

export interface OfferData {
  headline: string;
  price: string;
  finance: string;
  terms: string;
}

export interface ScriptClip {
  clipNumber: number;
  type: ClipType;
  duration: number;
  script?: string;
  direction?: string;
  imagePrompt?: string;
  offerData?: OfferData;
  notes?: string;
}

export interface GeneratedScript {
  clips: ScriptClip[];
  totalDuration: number;
  voiceTone: string;
  targetAudience: string;
}

// ─── Presenter / Avatar types ───────────────────────────────────────────────

export interface Avatar {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string;
  gender?: string;
}

export interface PresenterGenerateRequest {
  scriptText: string;
  avatarId: string;
  voiceId: string;
  aspectRatio: AspectRatio;
}

export interface PresenterStatusResponse {
  status: "processing" | "completed" | "failed";
  video_url?: string;
  error?: string;
}

// ─── Timeline clip (UI state) ───────────────────────────────────────────────

export interface TimelineClip {
  clipNumber: number;
  type: ClipType;
  label: string;
  duration: number;
  status: ClipStatus;
  script?: string;
  direction?: string;
  imagePrompt?: string;
  offerData?: OfferData;
  notes?: string;
  // Generated asset URLs
  videoUrl?: string;
  imageUrl?: string;
  error?: string;
}

// ─── Composition types ──────────────────────────────────────────────────────

export interface RenderSegment {
  type: "remotion" | "heygen";
  template?: string;
  videoUrl?: string;
  duration: number;
  props?: Record<string, unknown>;
}

export interface RenderOverlay {
  template: string;
  startTime: number;
  duration: number;
  mode: "fullscreen" | "overlay" | "pip";
  props: Record<string, unknown>;
}

export interface ComposeRequest {
  segments: RenderSegment[];
  overlays: RenderOverlay[];
  platform: string;
  aspectRatio: AspectRatio;
}

export interface ComposeStatusResponse {
  status: "rendering" | "completed" | "failed";
  progress?: number;
  outputUrl?: string;
  error?: string;
}

// ─── Campaign brief ─────────────────────────────────────────────────────────

export interface CampaignBrief {
  concept: string;
  carMake?: string;
  carModel?: string;
  carYear?: string;
  dealDetails?: string;
  location?: string;
}

// ─── Lower third ────────────────────────────────────────────────────────────

export interface LowerThirdData {
  name: string;
  title: string;
}

// ─── Pipeline state ─────────────────────────────────────────────────────────

export interface PipelineState {
  stage: PipelineStage;
  progress: number;
  scriptReady: boolean;
  presenterVideosReady: boolean;
  imageReady: boolean;
  compositionReady: boolean;
  error?: string;
  composedVideoUrl?: string;
  renderId?: string;
}
