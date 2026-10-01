// ElevenLabs engine implementation — server-side only
// Handles voice synthesis, SFX generation, and music generation

import type { VoiceProfile, VoiceSettings, GeneratedAudio } from "./types";
import { saveCleanAudio } from "./ffmpeg";

const API_BASE = "https://api.elevenlabs.io/v1";

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key || key.startsWith("sk_your_")) {
    throw new Error("ELEVENLABS_API_KEY not configured");
  }
  return key;
}

function headers(): Record<string, string> {
  return {
    "xi-api-key": getApiKey(),
    "Content-Type": "application/json",
  };
}

async function saveAudioFile(
  buffer: ArrayBuffer,
  prefix: string
): Promise<{ url: string; filename: string; duration: number | null }> {
  // Clean every generated file: re-encode and strip all metadata/vendor tags,
  // then serve from /tmp via /api/audio/serve.
  const { filename, duration } = await saveCleanAudio(buffer, prefix, "mp3");
  return { url: `/api/audio/serve?file=${filename}`, filename, duration };
}

// Irish/UK accent keywords for filtering
const IRISH_ACCENT_KEYWORDS = [
  "irish",
  "ireland",
  "connacht",
  "ulster",
  "munster",
  "leinster",
  "dublin",
  "cork",
  "galway",
];

const UK_ACCENT_KEYWORDS = ["british", "english", "scottish", "welsh", "uk"];

export async function listVoices(): Promise<VoiceProfile[]> {
  const res = await fetch(`${API_BASE}/voices`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Voice listing failed: ${res.status}`);
  }
  const data = await res.json();

  return (data.voices || []).map(
    (v: {
      voice_id: string;
      name: string;
      labels?: Record<string, string>;
      description?: string;
    }) => {
      const labels = v.labels || {};
      const accent = labels.accent || labels.language || "Unknown";
      const gender = (labels.gender || "neutral") as "male" | "female" | "neutral";
      const age = labels.age || "adult";
      const description = v.description || labels.description || "";
      const tags: string[] = Object.values(labels).filter(Boolean);

      // Determine if this is an Irish accent
      const accentLower = accent.toLowerCase();
      const isIrish = IRISH_ACCENT_KEYWORDS.some((kw) => accentLower.includes(kw));
      const isUK = UK_ACCENT_KEYWORDS.some((kw) => accentLower.includes(kw));

      return {
        id: v.voice_id,
        name: v.name,
        description,
        accent: isIrish ? `Irish (${accent})` : accent,
        gender,
        age,
        tags: [...tags, ...(isIrish ? ["irish", "recommended"] : []), ...(isUK ? ["british"] : [])],
        isCloned: labels.use_case === "cloned" || false,
      } satisfies VoiceProfile;
    }
  );
}

export async function generateSpeech(
  text: string,
  voiceId: string,
  settings: Partial<VoiceSettings> = {}
): Promise<GeneratedAudio> {
  // Auto-detect cloned voices so callers do not need to pass isCloned
  let isCloned = settings.isCloned ?? false;
  if (!isCloned) {
    try {
      const vRes = await fetch(API_BASE + "/voices/" + voiceId, { headers: headers() });
      if (vRes.ok) {
        const vData = await vRes.json();
        const cat = vData.category || "";
        isCloned = cat === "cloned" || cat === "professional" || (vData.labels?.use_case === "cloned");
      }
    } catch { /* proceed with defaults */ }
  }
  const modelId = settings.modelId || process.env.VOICE_MODEL_ID || "eleven_v3";
  const isV3 = modelId.startsWith("eleven_v3");
  // v3 only accepts stability presets 0 (creative), 0.5 (natural), 1 (robust)
  const rawStability = settings.stability ?? (isV3 ? 0.5 : 0.75);
  const stability = isV3 ? [0, 0.5, 1].reduce((a, b) => (Math.abs(b - rawStability) < Math.abs(a - rawStability) ? b : a)) : rawStability;
  const body = {
    text,
    model_id: modelId,
    voice_settings: {
      stability,
      similarity_boost: settings.similarityBoost ?? (isCloned ? 0.95 : 0.8),
      style: settings.style ?? (isV3 ? undefined : 0.05),
      use_speaker_boost: settings.useSpeakerBoost ?? true,
      ...(settings.speed ? { speed: settings.speed } : {}),
    },
  };

  const res = await fetch(`${API_BASE}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[voice-engine]", res.status, err);
    throw new Error(`Speech generation failed (${res.status})`);
  }

  const buffer = await res.arrayBuffer();
  const { url, filename, duration } = await saveAudioFile(buffer, "voice");
  // Real duration from the file; fall back to ~2.5 words/sec
  const estimatedDuration = duration ?? text.split(/\s+/).length / 2.5;
  return { url, duration: estimatedDuration, format: "mp3", filename };
}

export async function cloneVoice(
  name: string,
  audioFiles: Buffer[],
  fileNames: string[],
  labels: Record<string, string> = {}
): Promise<VoiceProfile> {
  const formData = new FormData();
  formData.append("name", name);

  audioFiles.forEach((buf, i) => {
    const blob = new Blob([new Uint8Array(buf)], { type: "audio/mpeg" });
    formData.append("files", blob, fileNames[i] || `sample-${i}.mp3`);
  });

  if (labels.accent) {
    formData.append("labels", JSON.stringify(labels));
  }

  const res = await fetch(`${API_BASE}/voices/add`, {
    method: "POST",
    headers: { "xi-api-key": getApiKey() },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[voice-clone]", res.status, err);
    throw new Error(`Voice cloning failed (${res.status})`);
  }

  const data = await res.json();

  return {
    id: data.voice_id,
    name,
    description: `Cloned voice: ${name}`,
    accent: labels.accent || "Custom",
    gender: (labels.gender as "male" | "female" | "neutral") || "neutral",
    age: labels.age || "adult",
    tags: ["cloned", labels.accent || "custom"].filter(Boolean),
    isCloned: true,
  };
}

export async function generateSoundEffect(
  prompt: string,
  durationSeconds: number
): Promise<GeneratedAudio> {
  const body = {
    text: prompt,
    duration_seconds: Math.min(Math.max(durationSeconds, 0.5), 22),
  };

  const res = await fetch(`${API_BASE}/sound-generation`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[sfx-engine]", res.status, err);
    throw new Error(`SFX generation failed (${res.status})`);
  }

  const buffer = await res.arrayBuffer();
  const { url, filename, duration } = await saveAudioFile(buffer, "sfx");
  return { url, duration: duration ?? durationSeconds, format: "mp3", filename };
}

export async function generateMusic(
  prompt: string,
  durationSeconds: number,
  options: { instrumental?: boolean } = {}
): Promise<GeneratedAudio> {
  const lengthMs = Math.round(Math.min(Math.max(durationSeconds, 3), 300) * 1000);
  const buffer = await composeMusic({
    prompt,
    music_length_ms: lengthMs,
    force_instrumental: options.instrumental ?? true,
  });
  const { url, filename, duration } = await saveAudioFile(buffer, "music");
  return { url, duration: duration ?? durationSeconds, format: "mp3", filename };
}

/**
 * Sung jingle: lyrics are embedded in the prompt, vocals allowed.
 */
export async function generateJingle(
  stylePrompt: string,
  lyrics: string,
  durationSeconds: number
): Promise<GeneratedAudio> {
  const lengthMs = Math.round(Math.min(Math.max(durationSeconds, 5), 120) * 1000);
  const prompt = `${stylePrompt}\n\nLyrics:\n${lyrics}`.slice(0, 4000);
  const buffer = await composeMusic({ prompt, music_length_ms: lengthMs });
  const { url, filename, duration } = await saveAudioFile(buffer, "jingle");
  return { url, duration: duration ?? durationSeconds, format: "mp3", filename };
}

const MUSIC_MODELS = (process.env.MUSIC_MODEL_ID || "music_v2_5,music_v1").split(",").map((m) => m.trim()).filter(Boolean);

async function composeMusic(body: Record<string, unknown>): Promise<ArrayBuffer> {
  let lastErr = "";
  // Try newest model first, fall back to older ones the account may have.
  for (const model of [...MUSIC_MODELS, ""]) {
    const payload = model ? { ...body, model_id: model } : body;
    const res = await fetch(`${API_BASE}/music?output_format=mp3_44100_192`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    if (res.ok) return res.arrayBuffer();
    lastErr = `${res.status}`;
    // Only retry on model/validation problems; auth or quota errors won't improve.
    if (res.status !== 400 && res.status !== 422) break;
  }
  throw new Error(`Music generation failed (${lastErr})`);
}
