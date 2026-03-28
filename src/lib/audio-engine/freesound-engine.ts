// Freesound engine implementation — server-side only
// Handles SFX library browsing and search

import type { SoundEffect } from "./types";

const API_BASE = "https://freesound.org/apiv2";

function getApiKey(): string {
  const key = process.env.FREESOUND_API_KEY;
  if (!key || key.startsWith("your_")) {
    throw new Error("FREESOUND_API_KEY not configured");
  }
  return key;
}

function getAccessToken(): string | null {
  const token = process.env.FREESOUND_ACCESS_TOKEN;
  if (!token || token.startsWith("your_")) return null;
  return token;
}

// Category mapping for radio production
export const RADIO_SFX_CATEGORIES: Record<string, string> = {
  motoring: "car engine OR horn OR tyre OR driving OR traffic",
  hospitality: "restaurant OR kitchen OR cooking OR dining",
  retail: "cash register OR shopping OR door bell OR crowd",
  weather: "rain OR thunder OR wind OR sunny OR birds",
  sport: "crowd cheer OR whistle OR stadium OR goal",
  nature: "birds OR ocean OR river OR forest",
  urban: "city OR traffic OR construction OR siren",
  transitions: "jingle OR stinger OR whoosh OR transition",
};

export async function searchSFX(
  query: string,
  limit: number = 20,
  category?: string
): Promise<SoundEffect[]> {
  const apiKey = getApiKey();
  const token = getAccessToken();

  // Build the search query — combine user query with category terms if provided
  let searchQuery = query;
  if (category && RADIO_SFX_CATEGORIES[category]) {
    searchQuery = `${query} ${RADIO_SFX_CATEGORIES[category]}`;
  }

  const params = new URLSearchParams({
    query: searchQuery,
    fields: "id,name,tags,duration,previews,description",
    page_size: String(Math.min(limit, 50)),
    ...(token ? { token } : { token: apiKey }),
  });

  const res = await fetch(`${API_BASE}/search/text/?${params}`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Freesound search failed: ${res.status} - ${err}`);
  }

  const data = await res.json();

  return (data.results || []).map(
    (s: {
      id: number;
      name: string;
      description: string;
      tags: string[];
      duration: number;
      previews?: Record<string, string>;
    }) => ({
      id: String(s.id),
      name: s.name,
      description: s.description || "",
      tags: s.tags || [],
      duration: Math.round(s.duration * 10) / 10,
      previewUrl: s.previews?.["preview-hq-mp3"] || s.previews?.["preview-lq-mp3"] || "",
      downloadUrl: s.previews?.["preview-hq-mp3"] || "",
    })
  );
}
