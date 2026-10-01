import { saveCleanAudio } from "@/lib/audio-engine/ffmpeg";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 60 * 1024 * 1024;

/** Import an audio file (studio take, SFX, voice). Re-encoded and stripped of all metadata. */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") || "clip").replace(/[^a-z]/g, "").slice(0, 12) || "clip";
    if (!(file instanceof File)) {
      return Response.json({ error: "No file received" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "File is too large (60 MB max)" }, { status: 413 });
    }
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
    const { filename, duration } = await saveCleanAudio(Buffer.from(await file.arrayBuffer()), kind, ext);
    // Display name: the user's own file name without extension (never stored in the audio)
    const displayName = file.name.replace(/\.[^.]+$/, "").slice(0, 60);
    return Response.json({ url: `/api/audio/serve?file=${filename}`, duration, name: displayName });
  } catch (error) {
    console.error("[audio-upload]", error);
    return Response.json({ error: "Could not read that audio file" }, { status: 500 });
  }
}
