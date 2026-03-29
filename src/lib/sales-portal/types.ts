// Sales Rep Portal — Type Definitions

// ── Voice Roster ─────────────────────────────────────────────

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: "male" | "female";
}

export const VOICE_ROSTER: VoiceOption[] = [
  { id: "mFgXOmlOfXfr6suoQkRH", name: "Frances", description: "Soft, warm, calm Irish accent", gender: "female" },
  { id: "3b8fXc91YHS1i2DYAlBQ", name: "Laura", description: "Warm, articulate Irish female", gender: "female" },
  { id: "SpA6eNczAK7oucJPiPpw", name: "Beckie", description: "Mature, gentle Irish female", gender: "female" },
  { id: "1OYA2kgM85gF2eGN8HEp", name: "Colleen", description: "Warm southern Irish woman", gender: "female" },
  { id: "EfdW5L7xDpYTHDlIRmg9", name: "Aisling", description: "Young Irish female, calm & informative", gender: "female" },
  { id: "1e9Gn3OQenGu4rjQ3Du1", name: "Niamh", description: "Young Irish female, soft & friendly", gender: "female" },
  { id: "sgk995upfe3tYLvoGcBN", name: "Labhaoise", description: "Casual Irish woman, warm & grounded", gender: "female" },
  { id: "rdEILoSxdT6xKDZ56abJ", name: "Isla Wilde", description: "Gentle, soft neutral Irish accent", gender: "female" },
  { id: "Qrq52PIvoZXeAbdtAugP", name: "Susan", description: "Cloned voice — Sunshine 106.8", gender: "female" },
  { id: "2WvAXMgrakBkapSmnlv7", name: "Flynn", description: "Natural, crisp neutral Irish", gender: "male" },
  { id: "8SNzJpKT62Cqqqe8Injx", name: "Michael", description: "Soft Irish male, melodic & soothing", gender: "male" },
  { id: "zpnRoleXRhWcv8KmQc0N", name: "James Fitzgerald", description: "Middle-aged Irish, clear baritone", gender: "male" },
  { id: "RlSVB64yXMZJjq67jbB1", name: "Bren", description: "Calm conversational Irish male", gender: "male" },
  { id: "5OgOMFAcpSKqVQHHQHrU", name: "Thomas", description: "West of Ireland, enthusiastic narration", gender: "male" },
  { id: "huSf6WJX1X9lGY6I9CfQ", name: "Stephen", description: "Calm, versatile Irish narrator", gender: "male" },
  { id: "9TYDukkUVpJPDSIuv3ir", name: "Darren", description: "Calm masculine Irish, cinematic", gender: "male" },
  { id: "7nDsTGv9cjBVU2m1OA8F", name: "Paul", description: "Irish broadcaster, DJ-style delivery", gender: "male" },
  { id: "1yDXKNtyiAtDljYHKmZy", name: "Paddy Irishman", description: "Middle-aged Irish, nostalgic character", gender: "male" },
  { id: "B5jEZPqk2OJ2vkPw3wBM", name: "Cillian", description: "Cloned voice — Irish male", gender: "male" },
];

// ── Tone → Voice mapping ────────────────────────────────────

export const TONE_VOICE_MAP: Record<string, string[]> = {
  friendly: ["Frances", "Bren", "Laura", "Colleen", "Flynn"],
  urgent: ["Cillian", "Paul", "Darren", "Thomas"],
  professional: ["James Fitzgerald", "Stephen", "Beckie", "Isla Wilde"],
  humorous: ["Susan", "Paddy Irishman", "Flynn", "Paul"],
  emotional: ["Frances", "Niamh", "Michael", "Aisling"],
};

// ── Business Types ──────────────────────────────────────────

export const BUSINESS_TYPES = [
  "Automotive",
  "Hospitality",
  "Retail",
  "Financial Services",
  "Tourism",
  "Health & Wellness",
  "Property",
  "Education",
  "Professional Services",
  "Entertainment",
  "Food & Drink",
  "Technology",
  "Agriculture",
  "Other",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

// ── Tones ───────────────────────────────────────────────────

export const TONES = [
  { key: "friendly", label: "Friendly", description: "Warm, approachable" },
  { key: "urgent", label: "Urgent", description: "Sharp, energetic" },
  { key: "professional", label: "Professional", description: "Clear, authoritative" },
  { key: "humorous", label: "Humorous", description: "Playful, fun" },
  { key: "emotional", label: "Emotional", description: "Heartfelt, moving" },
] as const;

export type Tone = (typeof TONES)[number]["key"];

// ── Durations ───────────────────────────────────────────────

export const DURATIONS = [
  { value: 15, label: "15s", description: "Quick spot" },
  { value: 30, label: "30s", description: "Standard" },
  { value: 45, label: "45s", description: "Extended" },
  { value: 60, label: "60s", description: "Full production" },
] as const;

// ── Generation Modes ────────────────────────────────────────

export type GenerationMode = "automated" | "hybrid";

// ── Brief / Request ─────────────────────────────────────────

export interface DemoAdBrief {
  advertiserName: string;
  businessType: BusinessType;
  keyMessage: string;
  duration: number;
  tone: Tone;
  mode: GenerationMode;
  stationId: string;
  repId: string;
}

// ── Generate Request/Response ───────────────────────────────

export interface GenerateRequest extends DemoAdBrief {
  advertiserId?: string;
}

export interface GenerateResponse {
  success: true;
  adId: string;
  advertiserId: string;
  advertiserName: string;
  businessType: string;
  keyMessage: string;
  duration: number;
  tone: string;
  mode: GenerationMode;
  script: string;
  voiceId: string;
  musicStyle: string;
  sfxSpots: string[];
  audioUrl: string | null;
  comptrodScore: number;
  scoreReason: string;
  status: "complete" | "script-ready";
}

export interface GenerateAudioRequest {
  adId: string;
  editedScript: string;
  voiceId: string;
  duration: number;
  tone: string;
  businessType: string;
  stationId: string;
  repId: string;
}

export interface GenerateAudioResponse {
  success: true;
  adId: string;
  audioUrl: string;
  comptrodScore: number;
  scoreReason: string;
}

// ── Activity Feed ───────────────────────────────────────────

export interface DemoAdActivity {
  id: string;
  adId: string;
  repId: string;
  advertiserName: string;
  businessType: string;
  tone: string;
  duration: number;
  mode: GenerationMode;
  comptrodScore: number;
  status: "complete" | "script-ready" | "generating" | "failed";
  createdAt: string;
  audioUrl?: string;
}

// ── Pipeline Step ───────────────────────────────────────────

export type PipelineStep =
  | "idle"
  | "concept-gate"
  | "script"
  | "voice"
  | "music"
  | "sfx"
  | "mixing"
  | "metrics"
  | "complete"
  | "error";

export const PIPELINE_LABELS: Record<PipelineStep, string> = {
  idle: "Ready",
  "concept-gate": "Evaluating Concept...",
  script: "Generating Script...",
  voice: "Synthesising Voice...",
  music: "Placing Music...",
  sfx: "Adding Sound Effects...",
  mixing: "Mixing Final Production...",
  metrics: "Calculating ComProd Score...",
  complete: "Complete",
  error: "Error",
};
