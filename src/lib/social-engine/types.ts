// Social Engine — Core Types
// All interfaces for the social content generation and distribution system

export interface SocialBrandProfile {
  slug: string;
  name: string;
  sector: string;
  location: string;
  tone: string;
  targetAudience: string[];
  hashtags: string[];
  imageStyle: string;
  bestPlatforms: string[];
  logoLine: string;
}

export interface PlatformVariant {
  text: string;
  hashtags: string[];
  suggestedImagePrompt?: string;
}

export interface GeneratedCopy {
  platformVariants: {
    instagram?: PlatformVariant;
    x?: PlatformVariant;
    linkedin?: PlatformVariant;
    facebook?: PlatformVariant;
    tiktok?: PlatformVariant;
  };
  momentRelevanceScore: number;
  suggestedPublishTime: string;
  toneAnalysis: string;
}

export interface CopyGenerationRequest {
  brandSlug: string;
  momentId?: string;
  momentContext?: string;
  promotion?: string;
  platforms: string[];
  contentType: "quick" | "video_script";
  customPrompt?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  platform: string;
  brandSlug: string;
  aspectRatio?: "square" | "landscape" | "portrait";
}

export interface GeneratedImage {
  url: string;
  localPath: string;
  prompt: string;
  provider: string;
}

export interface VideoGenerationRequest {
  script: string;
  brandSlug: string;
  voiceId?: string;
  format: "9:16" | "16:9" | "1:1";
  imagePrompt?: string;
}

export interface GeneratedVideo {
  url: string;
  thumbnailUrl?: string;
  duration: number;
}

export interface PublishRequest {
  platform: string;
  text: string;
  imageUrl?: string;
  hashtags?: string[];
}

export interface PublishResult {
  platform: string;
  status: "published" | "failed" | "not_configured";
  postId?: string;
  postUrl?: string;
  error?: string;
}

export interface PublishAllRequest {
  platforms: string[];
  content: {
    [platform: string]: {
      text: string;
      imageUrl?: string;
      hashtags?: string[];
    };
  };
  brandSlug: string;
  momentId?: string;
}

export interface PublishAllResult {
  results: PublishResult[];
  timestamp: string;
}

export interface ServiceStatus {
  contentAI: "live" | "demo";
  imageAI: "live" | "demo";
  qualityChain: "live" | "demo";
  instagram: "live" | "demo";
  linkedin: "live" | "demo";
  x: "live" | "demo";
  facebook: "live" | "demo";
}

export interface SocialContentParams {
  brandName: string;
  brandSector: string;
  brandLocation: string;
  brandTone: string;
  brandTargetAudience: string[];
  momentTitle?: string;
  momentDescription?: string;
  momentTriggerType?: string;
  promotion?: string;
  platforms: string[];
  contentType: "quick" | "video_script";
  customPrompt?: string;
  existingRadioScript?: string;
}

export interface QualityScore {
  hookStrength: number;
  brandAlignment: number;
  momentConnection: number;
  platformFit: number;
  overall: number;
}

export interface SocialQualityResult {
  content: GeneratedCopy;
  qualityScore?: QualityScore;
  chainStage: "writer" | "ep_reviewed" | "cd_approved";
  retries: number;
}

export interface CrossMediaLift {
  radioReach: number;
  socialReach: number;
  combinedReach: number;
  liftPercentage: number;
}

export interface CrossMediaEntry {
  id: string;
  momentId: string;
  momentTitle: string;
  momentTriggerType: string;
  brandSlug: string;
  brandName: string;
  timestamp: string;
  channels: ("radio" | "social")[];
  popScore: number;
  radioStatus?: "ready" | "published" | "failed";
  socialStatus?: "ready" | "published" | "failed";
  crossMediaLift?: CrossMediaLift;
  platformResults?: PublishResult[];
}
