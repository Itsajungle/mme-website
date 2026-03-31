// ElevenLabs engine implementation — server-side only
// Handles voice synthesis, SFX generation, and music generation

import type { VoiceProfile, VoiceSettings, GeneratedAudio } from "./types";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

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
  prefix: string,
  ext: string = "mp3"
): Promise<{ url: string; filename: string }> {
  // Save to /tmp which is always writable in Docker containers
  // Serve via /api/audio/serve?file= route instead of public/ static files
  const dir = "/tmp/mme-audio";
  await mkdir(dir, { recursive: true });
  const filename = `${prefix}-${randomUUID().slice(0, 8)}.${ext}`;
  const filepath = join(dir, filename);
  await writeFile(filepath, Buffer.from(buffer));
  return { url: `/api/audio/serve?file=${filename}`, filename };
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
  const body = {
    text,
    model_id: "eleven_v3",
    voice_settings: {
      stability: settings.stability ?? (isCloned ? 0.75 : 0.5),
      similarity_boost: settings.similarityBoost ?? (isCloned ? 0.95 : 0.8),
      style: settings.style ?? (isCloned ? 0.05 : 0.3),
      use_speaker_boost: settings.useSpeakerBoost ?? true,
    },
    output_format: "mp3_44100_128",
  };

  const res = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Speech generation failed: ${res.status} - ${err}`);
  }

  const buffer = await res.arrayBuffer();
  const { url, filename } = await saveAudioFile(buffer, "voice");

  // Estimate duration from text (2.5 words/sec average)
  const wordCount = text.split(/\s+/).length;
  const estimatedDuration = wordCount / 2.5;

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
    throw new Error(`Voice cloning failed: ${res.status} - ${err}`);
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
    throw new Error(`SFX generation failed: ${res.status} - ${err}`);
  }

  const buffer = await res.arrayBuffer();
  const { url, filename } = await saveAudioFile(buffer, "sfx");

  return { url, duration: durationSeconds, format: "mp3", filename };
}

export async function generateMusic(
  prompt: string,
  durationSeconds: number
): Promise<GeneratedAudio> {
  const body = {
    prompt,
    duration_seconds: Math.min(Math.max(durationSeconds, 3), 300),
  };

  const res = await fetch(`${API_BASE}/music/generate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Music generation failed: ${res.status} - ${err}`);
  }

  const buffer = await res.arrayBuffer();
  const { url, filename } = await saveAudioFile(buffer, "music");

  return { url, duration: durationSeconds, format: "mp3", filename };
}
