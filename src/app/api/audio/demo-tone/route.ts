import { NextRequest } from "next/server";

// Generate a simple WAV tone for demo previews
// This ensures demo mode always has audible audio
function generateToneWav(
  frequency: number = 440,
  durationMs: number = 2000,
  sampleRate: number = 44100
): Buffer {
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate tone with fade in/out
  const fadeLength = Math.floor(numSamples * 0.1);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let amplitude = Math.sin(2 * Math.PI * frequency * t);

    // Add harmonics for richer sound
    amplitude += 0.3 * Math.sin(2 * Math.PI * frequency * 2 * t);
    amplitude += 0.15 * Math.sin(2 * Math.PI * frequency * 3 * t);

    // Fade in
    if (i < fadeLength) {
      amplitude *= i / fadeLength;
    }
    // Fade out
    if (i > numSamples - fadeLength) {
      amplitude *= (numSamples - i) / fadeLength;
    }

    // Normalize
    amplitude *= 0.4;

    const sample = Math.max(-1, Math.min(1, amplitude));
    const intSample = Math.round(sample * 32767);
    buffer.writeInt16LE(intSample, headerSize + i * 2);
  }

  return buffer;
}

// Voice-like frequencies for different demo voice types
const VOICE_TONES: Record<string, { freq: number; duration: number }> = {
  "male-low": { freq: 130, duration: 2500 },
  "male-mid": { freq: 165, duration: 2200 },
  "female-mid": { freq: 260, duration: 2200 },
  "female-high": { freq: 330, duration: 2000 },
  default: { freq: 220, duration: 2000 },
};

const MUSIC_TONES: Record<string, { freq: number; duration: number }> = {
  upbeat: { freq: 523, duration: 3000 },
  relaxed: { freq: 330, duration: 4000 },
  dramatic: { freq: 196, duration: 3500 },
  premium: { freq: 440, duration: 3000 },
  default: { freq: 392, duration: 3000 },
};

const SFX_TONES: Record<string, { freq: number; duration: number }> = {
  ding: { freq: 880, duration: 500 },
  beep: { freq: 660, duration: 300 },
  whoosh: { freq: 200, duration: 800 },
  default: { freq: 440, duration: 1000 },
};

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "voice";
  const variant = request.nextUrl.searchParams.get("variant") || "default";

  let toneConfig: { freq: number; duration: number };

  switch (type) {
    case "music":
      toneConfig = MUSIC_TONES[variant] || MUSIC_TONES.default;
      break;
    case "sfx":
      toneConfig = SFX_TONES[variant] || SFX_TONES.default;
      break;
    case "voice":
    default:
      toneConfig = VOICE_TONES[variant] || VOICE_TONES.default;
      break;
  }

  const wav = generateToneWav(toneConfig.freq, toneConfig.duration);
  const body = wav.buffer.slice(wav.byteOffset, wav.byteOffset + wav.byteLength) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": "audio/wav",
      "Content-Length": String(wav.length),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
