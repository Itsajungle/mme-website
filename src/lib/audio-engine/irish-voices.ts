// Curated Irish voice roster for Sunshine / MME Radio.
// `style` drives the tags shown in the picker; nothing here names the underlying engine.

export interface RosterVoice {
  id: string;
  name: string;
  gender: "male" | "female";
  style: string;          // short description shown to users
  tags: string[];         // e.g. "broadcaster", "warm", "young"
  featured?: boolean;     // shown first
  clone?: boolean;        // a cloned voice owned by us
}

export const IRISH_VOICES: RosterVoice[] = [
  // Broadcast-ready / punchy — best for ads
  { id: "7nDsTGv9cjBVU2m1OA8F", name: "Paul", gender: "male", style: "Irish broadcaster, confident DJ delivery", tags: ["broadcaster", "upbeat"], featured: true },
  { id: "Qrq52PIvoZXeAbdtAugP", name: "Susan", gender: "female", style: "Sunshine 106.8 house voice", tags: ["station", "warm"], featured: true, clone: true },
  { id: "GFyWqnwcF2mv6dWlo3u1", name: "John", gender: "male", style: "Clear, confident Leinster accent", tags: ["clear", "trustworthy"], featured: true },
  { id: "UwtFVYnvYG6hxAbc4I6T", name: "Louise", gender: "female", style: "Neutral Irish, sincere, premium ads", tags: ["premium", "trustworthy"], featured: true },
  { id: "1yDXKNtyiAtDljYHKmZy", name: "Paddy", gender: "male", style: "Older Irish character, nostalgic", tags: ["character", "nostalgic"], featured: true },
  { id: "tEo3d4j7gzVojBL5Z4Pt", name: "Cormac", gender: "male", style: "Rugged, wide emotional range — great for characters", tags: ["character", "expressive"] },
  { id: "0VXT7iQ2kXG7EERbbG9T", name: "Cleo", gender: "female", style: "Youthful, conversational", tags: ["young", "conversational"] },
  { id: "sgk995upfe3tYLvoGcBN", name: "Labhaoise", gender: "female", style: "Casual, warm, lilting", tags: ["warm", "conversational"] },
  { id: "1e9Gn3OQenGu4rjQ3Du1", name: "Niamh", gender: "female", style: "Young, soft and friendly", tags: ["young", "friendly"] },
  { id: "3b8fXc91YHS1i2DYAlBQ", name: "Laura", gender: "female", style: "Warm, articulate, modern", tags: ["warm", "clear"] },
  { id: "1OYA2kgM85gF2eGN8HEp", name: "Colleen", gender: "female", style: "Warm southern Irish", tags: ["warm", "southern"] },
  { id: "kOvUpYLYS0rKGldsKcD1", name: "Maeve", gender: "female", style: "Soft storyteller", tags: ["soft", "story"] },
  { id: "EfdW5L7xDpYTHDlIRmg9", name: "Aisling", gender: "female", style: "Young, calm, informative", tags: ["young", "calm"] },
  { id: "mFgXOmlOfXfr6suoQkRH", name: "Frances", gender: "female", style: "Soft, husky, calm", tags: ["calm", "husky"] },
  { id: "2WvAXMgrakBkapSmnlv7", name: "Flynn", gender: "male", style: "Natural, crisp, neutral Irish", tags: ["clear", "natural"] },
  { id: "5OgOMFAcpSKqVQHHQHrU", name: "Thomas", gender: "male", style: "West of Ireland, enthusiastic", tags: ["west", "enthusiastic"] },
  { id: "zpnRoleXRhWcv8KmQc0N", name: "James", gender: "male", style: "Rich baritone", tags: ["deep", "warm"] },
  { id: "RlSVB64yXMZJjq67jbB1", name: "Bren", gender: "male", style: "Calm, conversational", tags: ["calm", "conversational"] },
  { id: "8SNzJpKT62Cqqqe8Injx", name: "Michael", gender: "male", style: "Soft, melodic", tags: ["soft", "warm"] },
  { id: "9TYDukkUVpJPDSIuv3ir", name: "Darren", gender: "male", style: "Calm, deep, cinematic", tags: ["deep", "cinematic"] },
  { id: "B5jEZPqk2OJ2vkPw3wBM", name: "Cillian", gender: "male", style: "Low, calm, authentic", tags: ["calm", "deep"] },
];
