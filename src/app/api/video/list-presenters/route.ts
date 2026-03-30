import { NextResponse } from "next/server";

interface AvatarEntry {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string;
  gender: string;
  group: "stock" | "custom";
}

// ─── CTE Stock Avatars ──────────────────────────────────────────────────────

const CTE_AVATARS: Omit<AvatarEntry, "preview_image_url">[] = [
  { avatar_id: "Marcus_Suit_Front_public", avatar_name: "Marcus — Mature Male", gender: "male", group: "stock" },
  { avatar_id: "fe4364faaff54befa7e0575557dcb7b4", avatar_name: "Garage Owner", gender: "male", group: "stock" },
  { avatar_id: "26dfb00ad9244da9bcf6cda5d5c2db88", avatar_name: "Young Guy", gender: "male", group: "stock" },
  { avatar_id: "0de4f6e9ab0a430bb67ffde4feed7689", avatar_name: "Mum", gender: "female", group: "stock" },
  { avatar_id: "924dbfd6d7874cc49b74e47b18c18fe4", avatar_name: "Young Pretty Female", gender: "female", group: "stock" },
  { avatar_id: "8be1f78438f446c29b4fea430a0092b3", avatar_name: "Prof Asian", gender: "male", group: "stock" },
  { avatar_id: "5fe14e11b47e4f6aaf0ee05072c5c9dd", avatar_name: "Sporty Woman", gender: "female", group: "stock" },
  { avatar_id: "3c173043b72e4c60a5d4d3466eb55bdd", avatar_name: "Sporty Dude", gender: "male", group: "stock" },
  { avatar_id: "Daisy-inskirt-20220818", avatar_name: "Daisy — Young English Woman", gender: "female", group: "stock" },
  { avatar_id: "Angela-inblackskirt-20220820", avatar_name: "Angela — Professional Woman", gender: "female", group: "stock" },
  { avatar_id: "josh_lite3_20230714", avatar_name: "Josh — Young English Man", gender: "male", group: "stock" },
  { avatar_id: "Wayne_20240711", avatar_name: "Wayne — Mature Professional", gender: "male", group: "stock" },
  { avatar_id: "ef08894254b44b3dbbf4e7d3e4adb6d6", avatar_name: "Kayla — Energetic Presenter", gender: "female", group: "stock" },
  { avatar_id: "37f4d912aa564663a1cf8d63acd0e1ab", avatar_name: "Tyler — Casual Male", gender: "male", group: "stock" },
  { avatar_id: "V00dBuilder_Kira", avatar_name: "Kira — Modern Female", gender: "female", group: "stock" },
];

// ─── Susan Custom Avatars ───────────────────────────────────────────────────

const SUSAN_AVATARS: Omit<AvatarEntry, "preview_image_url">[] = [
  { avatar_id: "926d00b461584b4fbf90dbd0425e4ba8", avatar_name: "Susan — Classic Presenter", gender: "female", group: "custom" },
  { avatar_id: "f0acdb095c764fb98c25a0e2fe4d2817", avatar_name: "Susan — Look 5", gender: "female", group: "custom" },
  { avatar_id: "5fd80a9cca8a4754a79142eaec9680c4", avatar_name: "Susan — Look 6", gender: "female", group: "custom" },
  { avatar_id: "dfc8d37e36c4457c906ba7880504e14e", avatar_name: "Susan — Look 7", gender: "female", group: "custom" },
  { avatar_id: "2bf74bb944b74adc80ae9c4f9de1e042", avatar_name: "Susan — Look 8", gender: "female", group: "custom" },
  { avatar_id: "fbb173654ce040788232bf153d040021", avatar_name: "Susan — Look 9", gender: "female", group: "custom" },
  { avatar_id: "25ba666e5cc34c04a571d2e38f6feaa9", avatar_name: "Susan — Look 10", gender: "female", group: "custom" },
  { avatar_id: "f38f11dd104043b7aacda4d9385d89a6", avatar_name: "Susan — Look 11", gender: "female", group: "custom" },
  { avatar_id: "9a545d9990ae4ef981d4bea5ce1b3360", avatar_name: "Susan — Look 12", gender: "female", group: "custom" },
  { avatar_id: "23021c73a5924f4298237ce6d1f9cefb", avatar_name: "Susan — Look 13", gender: "female", group: "custom" },
  { avatar_id: "7a95e6d8afcf4748a0a47cb9bdbe3bd3", avatar_name: "Susan — Look 14", gender: "female", group: "custom" },
  { avatar_id: "66200f5e6c37450fbbbc6ad335282760", avatar_name: "Susan — Look 15", gender: "female", group: "custom" },
];

// ─── Avatar → ElevenLabs Voice Mapping ──────────────────────────────────────

const AVATAR_VOICE_MAP: Record<string, string> = {
  "Marcus_Suit_Front_public": "9191c82c103a47419df976aaca391adb",
  "fe4364faaff54befa7e0575557dcb7b4": "dd669769e46d4ab29eac28afcbadbbaf",
  "26dfb00ad9244da9bcf6cda5d5c2db88": "cfdd71ff3755430aa80fa7e17779833b",
  "0de4f6e9ab0a430bb67ffde4feed7689": "a11d6e4b0cdd4b0aafdc1195e0b8226c",
  "924dbfd6d7874cc49b74e47b18c18fe4": "152025178ffd474ebad0d7dacacffcdd",
  "8be1f78438f446c29b4fea430a0092b3": "573f6303433b4afcafc5e2ff354256c7",
  "5fe14e11b47e4f6aaf0ee05072c5c9dd": "d103c8b082014fd88de855d9bbda36c9",
  "3c173043b72e4c60a5d4d3466eb55bdd": "6f5aaba473a5435a9c6fba2f3c307ca1",
};

// ─── Route Handler ──────────────────────────────────────────────────────────

export async function GET() {
  // Build hardcoded list with empty thumbnails
  const allAvatars: AvatarEntry[] = [
    ...CTE_AVATARS.map((a) => ({ ...a, preview_image_url: "" })),
    ...SUSAN_AVATARS.map((a) => ({ ...a, preview_image_url: "" })),
  ];

  // Optionally enrich with live thumbnails from the presenter engine
  const apiKey = process.env.HEYGEN_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch("https://api.heygen.com/v2/avatars", {
        headers: { "X-Api-Key": apiKey },
      });

      if (response.ok) {
        const data = await response.json();
        const liveAvatars: Record<string, string> = {};
        for (const a of data?.data?.avatars ?? []) {
          if (a.avatar_id && a.preview_image_url) {
            liveAvatars[a.avatar_id] = a.preview_image_url;
          }
        }

        // Merge thumbnails into hardcoded list
        for (const avatar of allAvatars) {
          if (liveAvatars[avatar.avatar_id]) {
            avatar.preview_image_url = liveAvatars[avatar.avatar_id];
          }
        }
      }
    } catch (err) {
      console.error("[list-presenters] Could not enrich thumbnails:", err);
    }
  }

  return NextResponse.json({
    avatars: allAvatars,
    voiceMap: AVATAR_VOICE_MAP,
    defaultAvatarId: "Marcus_Suit_Front_public",
    source: apiKey ? "live" : "curated",
  });
}
