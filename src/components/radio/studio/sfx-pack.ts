// Starter sound-effects pack. Files live in /public/sfx (neutral names, no metadata).
// Anything without a file yet can be created on demand from its description.

export interface SfxItem {
  id: string;
  name: string;
  category: "Transitions" | "Motoring" | "Retail" | "Food & drink" | "People & pub" | "Home & office" | "Outdoors";
  prompt: string;    // description used to create it
  seconds: number;
}

export const SFX_PACK: SfxItem[] = [
  { id: "whoosh", name: "Whoosh", category: "Transitions", prompt: "fast clean whoosh transition for a radio advert", seconds: 1.2 },
  { id: "sparkle-sting", name: "Sparkle sting", category: "Transitions", prompt: "short bright magical sparkle sting", seconds: 1.5 },
  { id: "record-scratch", name: "Record scratch", category: "Transitions", prompt: "vinyl record scratch stop, comedic", seconds: 1 },
  { id: "car-start", name: "Engine start", category: "Motoring", prompt: "modern car engine starting and idling smoothly", seconds: 3 },
  { id: "car-door", name: "Car door close", category: "Motoring", prompt: "solid car door closing, satisfying thud", seconds: 1 },
  { id: "car-pass", name: "Car drive-by", category: "Motoring", prompt: "car passing by on a road, left to right", seconds: 3 },
  { id: "keys", name: "Keys jingle", category: "Motoring", prompt: "set of car keys jingling in a hand", seconds: 1.5 },
  { id: "till", name: "Cash register", category: "Retail", prompt: "old-fashioned cash register ka-ching", seconds: 1.5 },
  { id: "shop-bell", name: "Shop door bell", category: "Retail", prompt: "small shop door opening with a bell ringing", seconds: 2 },
  { id: "scanner-beep", name: "Scanner beep", category: "Retail", prompt: "supermarket barcode scanner beep twice", seconds: 1 },
  { id: "sizzle", name: "Steak sizzle", category: "Food & drink", prompt: "steak sizzling on a hot pan", seconds: 3 },
  { id: "cleaver", name: "Butcher's cleaver", category: "Food & drink", prompt: "butcher's cleaver chopping on a wooden block, three chops", seconds: 2 },
  { id: "pint-pour", name: "Pint pour", category: "Food & drink", prompt: "pint of stout being poured from a tap in a pub", seconds: 3 },
  { id: "glasses-clink", name: "Glasses clink", category: "Food & drink", prompt: "two pint glasses clinking, cheers", seconds: 1.2 },
  { id: "kettle", name: "Kettle boil & click", category: "Home & office", prompt: "electric kettle coming to the boil and clicking off", seconds: 3 },
  { id: "phone-ring", name: "Phone ring", category: "Home & office", prompt: "modern mobile phone ringing twice", seconds: 2.5 },
  { id: "doorbell", name: "Doorbell", category: "Home & office", prompt: "house doorbell ding dong", seconds: 1.5 },
  { id: "pub-crowd", name: "Busy pub ambience", category: "People & pub", prompt: "busy Irish pub ambience, chatter and laughter, no music", seconds: 6 },
  { id: "crowd-cheer", name: "Crowd cheer", category: "People & pub", prompt: "small enthusiastic crowd cheering and clapping", seconds: 3 },
  { id: "applause", name: "Applause", category: "People & pub", prompt: "warm audience applause", seconds: 3 },
  { id: "birdsong", name: "Morning birdsong", category: "Outdoors", prompt: "gentle morning birdsong in a garden", seconds: 5 },
  { id: "rain", name: "Rain on window", category: "Outdoors", prompt: "steady rain on a window", seconds: 5 },
  { id: "seagulls", name: "Seaside gulls", category: "Outdoors", prompt: "seagulls and gentle waves at an Irish seaside", seconds: 5 },
  { id: "thunder", name: "Thunder roll", category: "Outdoors", prompt: "distant rolling thunder", seconds: 4 },
];

export const sfxUrl = (id: string) => `/sfx/${id}.mp3`;
