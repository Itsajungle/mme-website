// Jamendo engine implementation — server-side only
// Handles royalty-free music library browsing

import type { MusicTrack } from "./types";

const API_BASE = "https://api.jamendo.com/v3.0";

function getClientId(): string {
  const id = process.env.JAMENDO_CLIENT_ID;
  if (!id || id.startsWith("your_")) {
    throw new Error("JAMENDO_CLIENT_ID not configured");
  }
  return id;
}

// Mood-to-tag mapping for radio production
export const MOOD_TAGS: Record<string, string> = {
  upbeat: "upbeat+happy+energetic",
  urgent: "intense+driving+fast",
  relaxed: "calm+peaceful+mellow",
  premium: "elegant+sophisticated+corporate",
  dramatic: "epic+cinematic+powerful",
  warm: "warm+friendly+acoustic",
  festive: "celebration+party+fun",
};

// Sector-to-tag mapping
export const SECTOR_TAGS: Record<string, string> = {
  motoring: "driving+road+adventure",
  hospitality: "lounge+dining+smooth",
  financial: "corporate+professional+trust",
  retail: "shopping+pop+bright",
  sport: "energetic+action+victory",
  tourism: "adventure+nature+uplifting",
};

export async function searchMusic(
  query: string,
  mood?: string,
  sector?: string,
  limit: number = 20
): Promise<MusicTrack[]> {
  const clientId = getClientId();

  const params: Record<string, string> = {
    client_id: clientId,
    format: "json",
    limit: String(Math.min(limit, 50)),
    type: "backgroundmusic",
    audioformat: "mp32",
    include: "musicinfo+lyrics",
  };

  // Add mood tags
  if (mood && MOOD_TAGS[mood]) {
    params.fuzzytags = MOOD_TAGS[mood];
  } else if (sector && SECTOR_TAGS[sector]) {
    params.fuzzytags = SECTOR_TAGS[sector];
  }

  // Add search query
  if (query) {
    params.search = query;
  }

  const searchParams = new URLSearchParams(params);
  const res = await fetch(`${API_BASE}/tracks/?${searchParams}`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Jamendo search failed: ${res.status} - ${err}`);
  }

  const data = await res.json();

  return (data.results || []).map(
    (t: {
      id: string;
      name: string;
      artist_name: string;
      duration: number;
      audio: string;
      audiodownload: string;
      musicinfo?: { tags?: { genres?: string[]; instruments?: string[] } };
    }) => {
      const tags: string[] = [];
      if (t.musicinfo?.tags?.genres) tags.push(...t.musicinfo.tags.genres);
      if (t.musicinfo?.tags?.instruments) tags.push(...t.musicinfo.tags.instruments);

      return {
        id: String(t.id),
        name: t.name,
        artist: t.artist_name,
        duration: t.duration,
        tags,
        mood: mood || "general",
        streamUrl: t.audio,
        downloadUrl: t.audiodownload,
        license: "CC BY-NC-SA",
      } satisfies MusicTrack;
    }
  );
}

export async function streamTrack(trackId: string): Promise<string> {
  const clientId = getClientId();
  const params = new URLSearchParams({
    client_id: clientId,
    format: "json",
    id: trackId,
    audioformat: "mp32",
  });

  const res = await fetch(`${API_BASE}/tracks/?${params}`);
  if (!res.ok) {
    throw new Error(`Jamendo stream failed: ${res.status}`);
  }

  const data = await res.json();
  const track = data.results?.[0];
  if (!track?.audio) {
    throw new Error("Track not found");
  }

  return track.audio;
}
