import { cloneVoice } from "@/lib/audio-engine/elevenlabs-engine";

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.startsWith("sk_your_")) {
    return Response.json({ error: "Audio engine not configured" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const files = formData.getAll("files") as File[];
    const labelsRaw = formData.get("labels") as string | null;
    const labels = labelsRaw ? JSON.parse(labelsRaw) : {};

    if (!name || files.length === 0) {
      return Response.json({ error: "Missing required fields: name, files" }, { status: 400 });
    }

    // Convert Files to Buffers
    const buffers: Buffer[] = [];
    const fileNames: string[] = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      buffers.push(Buffer.from(arrayBuffer));
      fileNames.push(file.name);
    }

    const result = await cloneVoice(name, buffers, fileNames, labels);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: "Voice cloning failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
