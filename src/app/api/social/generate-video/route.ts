import { getBrandBySlug, DEMO_BRANDS } from "@/lib/demo-data";
import type { VideoGenerationRequest } from "@/lib/social-engine/types";
import { execFile } from "child_process";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";

// Check if FFmpeg is available on the system
async function ffmpegAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    execFile("ffmpeg", ["-version"], (error) => resolve(!error));
  });
}

// Download an image URL to a local file for FFmpeg input
async function downloadToFile(url: string, baseUrl: string): Promise<string> {
  const dir = "/tmp/mme-video-tmp";
  await mkdir(dir, { recursive: true });
  const filename = `input-${randomUUID().slice(0, 8)}.png`;
  const filepath = path.join(dir, filename);

  // If it's a local serve URL, read from /tmp directly
  if (url.startsWith("/api/images/serve")) {
    const params = new URLSearchParams(url.split("?")[1]);
    const file = params.get("file");
    if (file && !file.includes("..") && !file.includes("/")) {
      const sourcePath = path.join("/tmp/mme-images", file);
      if (existsSync(sourcePath)) {
        const data = await readFile(sourcePath);
        await writeFile(filepath, data);
        return filepath;
      }
    }
  }

  // Otherwise fetch it
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(filepath, buffer);
  return filepath;
}

// Compose video from slides + audio using FFmpeg
async function composeVideo(
  slides: Array<{ imageUrl?: string; duration: number }>,
  audioUrl: string | null,
  baseUrl: string,
): Promise<string | null> {
  if (!(await ffmpegAvailable())) return null;

  const videoDir = "/tmp/mme-videos";
  const tmpDir = "/tmp/mme-video-tmp";
  await mkdir(videoDir, { recursive: true });
  await mkdir(tmpDir, { recursive: true });

  // Download all slide images
  const imageFiles: Array<{ path: string; duration: number }> = [];
  for (const slide of slides) {
    if (!slide.imageUrl) continue;
    try {
      const localPath = await downloadToFile(slide.imageUrl, baseUrl);
      imageFiles.push({ path: localPath, duration: slide.duration });
    } catch (err) {
      console.error("[generate-video] Failed to download slide image:", err);
    }
  }

  if (imageFiles.length === 0) return null;

  // Download audio if available
  let audioPath: string | null = null;
  if (audioUrl) {
    try {
      const audioFilename = `audio-${randomUUID().slice(0, 8)}.mp3`;
      const audioFilepath = path.join(tmpDir, audioFilename);

      if (audioUrl.startsWith("/api/audio/serve")) {
        const params = new URLSearchParams(audioUrl.split("?")[1]);
        const file = params.get("file");
        if (file && !file.includes("..") && !file.includes("/")) {
          const sourcePath = path.join("/tmp/mme-audio", file);
          if (existsSync(sourcePath)) {
            const data = await readFile(sourcePath);
            await writeFile(audioFilepath, data);
            audioPath = audioFilepath;
          }
        }
      }

      if (!audioPath) {
        const fullUrl = audioUrl.startsWith("http") ? audioUrl : `${baseUrl}${audioUrl}`;
        const res = await fetch(fullUrl);
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          await writeFile(audioFilepath, buffer);
          audioPath = audioFilepath;
        }
      }
    } catch (err) {
      console.error("[generate-video] Failed to download audio:", err);
    }
  }

  // Build FFmpeg concat file
  const concatFile = path.join(tmpDir, `concat-${randomUUID().slice(0, 8)}.txt`);
  const concatContent = imageFiles
    .map((f) => `file '${f.path}'\nduration ${f.duration}`)
    .join("\n");
  // FFmpeg concat requires last file repeated without duration
  const lastFile = imageFiles[imageFiles.length - 1];
  await writeFile(concatFile, `${concatContent}\nfile '${lastFile.path}'\n`, "utf-8");

  const outputFilename = `slideshow-${randomUUID().slice(0, 8)}.mp4`;
  const outputPath = path.join(videoDir, outputFilename);

  // Build FFmpeg args array (execFile for safety — no shell injection)
  const ffmpegArgs = [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatFile,
    ...(audioPath ? ["-i", audioPath] : []),
    "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "23",
    "-r", "30",
    ...(audioPath ? ["-map", "0:v", "-map", "1:a", "-shortest"] : []),
    "-movflags", "+faststart",
    outputPath,
  ];

  return new Promise((resolve) => {
    execFile("ffmpeg", ffmpegArgs, { timeout: 120000 }, (error) => {
      if (error) {
        console.error("[generate-video] FFmpeg error:", error.message);
        resolve(null);
      } else {
        resolve(`/api/video/serve?file=${outputFilename}`);
      }
    });
  });
}

// V2 approach: static image + voiceover as a "talking head" video placeholder
// V3: when slides[] provided with audioUrl, attempts FFmpeg composition into single MP4
// Falls back to slides + audio player if FFmpeg unavailable
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { script, brandSlug, voiceId, format, imagePrompt, slides, audioUrl: providedAudioUrl } = body as VideoGenerationRequest & { audioUrl?: string };

    if (!brandSlug) {
      return Response.json(
        { error: "Missing required field: brandSlug" },
        { status: 400 }
      );
    }

    let brand = getBrandBySlug("sunshine-radio", brandSlug);
    if (!brand) {
      brand = DEMO_BRANDS.find((b) => b.slug === brandSlug);
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // ── Narrated slideshow mode (from generate-slideshow) ──────────────
    if (slides && slides.length > 0 && providedAudioUrl) {
      // Try FFmpeg composition
      const videoUrl = await composeVideo(slides, providedAudioUrl, baseUrl);

      const duration = slides.reduce((sum: number, s: { duration?: number }) => sum + (s.duration ?? 5), 0);

      if (videoUrl) {
        return Response.json({
          videoUrl,
          audioUrl: providedAudioUrl,
          thumbnailUrl: slides[0]?.imageUrl ?? null,
          duration,
          status: "ready",
          composed: true,
          slideCount: slides.length,
        });
      }

      // Fallback: return slides + audio for client-side playback
      return Response.json({
        videoUrl: slides[0]?.imageUrl ?? null,
        audioUrl: providedAudioUrl,
        thumbnailUrl: slides[0]?.imageUrl ?? null,
        duration,
        status: "ready",
        composed: false,
        slides,
        slideCount: slides.length,
        message: "Video composed as slideshow with audio player (FFmpeg not available for single-file composition)",
      });
    }

    // ── Legacy single-take mode ──────────────────────────────────────────
    if (!script || !format) {
      return Response.json(
        { error: "Missing required fields: script, format" },
        { status: 400 }
      );
    }

    const resolvedVoiceId = voiceId ?? brand?.audioBrandKit.voiceId;

    // Use the first slide image if available, otherwise generate one
    let imageUrl: string | null = slides?.[0]?.imageUrl ?? null;
    if (!imageUrl) {
      try {
        const imageRes = await fetch(`${baseUrl}/api/social/generate-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: imagePrompt ?? `Promotional visual for ${brand?.name ?? brandSlug}`,
            platform: "video",
            brandSlug,
            aspectRatio: format === "9:16" ? "portrait" : format === "16:9" ? "landscape" : "square",
          }),
        });
        if (imageRes.ok) {
          const imageData = await imageRes.json();
          imageUrl = imageData.url ?? null;
        }
      } catch {
        // Image generation not critical — continue
      }
    }

    // Generate voiceover for the FULL script (single take)
    let audioUrl: string | null = null;
    if (resolvedVoiceId) {
      try {
        const voiceRes = await fetch(`${baseUrl}/api/audio/voice-generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: script, voiceId: resolvedVoiceId }),
        });
        if (voiceRes.ok) {
          const voiceData = await voiceRes.json();
          audioUrl = voiceData.audioUrl ?? voiceData.url ?? null;
        }
      } catch {
        // Voice generation not critical — continue
      }
    }

    // Use slide durations if available, otherwise estimate from word count
    const duration = slides
      ? slides.reduce((sum: number, s: { duration?: number }) => sum + (s.duration ?? 20), 0)
      : Math.max(5, Math.round((script.split(/\s+/).length / 130) * 60));

    if (!imageUrl && !audioUrl) {
      return Response.json({
        videoUrl: "/api/audio/demo-tone?type=music&variant=upbeat",
        audioUrl: "/api/audio/demo-tone?type=voice&variant=default",
        thumbnailUrl: null,
        duration,
        status: "demo",
        message: "Video generation not configured. Showing demo preview.",
        slideCount: slides?.length ?? 0,
      });
    }

    return Response.json({
      videoUrl: imageUrl,
      audioUrl,
      thumbnailUrl: imageUrl,
      duration,
      status: "ready",
      slideCount: slides?.length ?? 0,
    });
  } catch (err) {
    console.error("[generate-video] Error:", err);
    return Response.json(
      { error: "Video generation failed. Please try again." },
      { status: 500 }
    );
  }
}
