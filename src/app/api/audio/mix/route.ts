import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface MixSegment {
  audioUrl: string;
  startTime: number;
  duration: number;
  volume: number;
  track: "voice" | "music" | "sfx";
  ducking?: {
    underVoice: boolean;
    duckLevel: number;
    fadeMs: number;
  };
}

interface MixRequestBody {
  segments: MixSegment[];
  totalDuration: number;
  loudnessTarget: number;
  outputFormat: "wav" | "mp3" | "both";
}

async function findFfmpeg(): Promise<string | null> {
  // Try system ffmpeg
  try {
    await execFileAsync("ffmpeg", ["-version"]);
    return "ffmpeg";
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: MixRequestBody = await request.json();
    const { segments, totalDuration, outputFormat = "both" } = body;

    if (!segments || segments.length === 0) {
      return Response.json({ error: "No audio segments provided" }, { status: 400 });
    }

    const ffmpegPath = await findFfmpeg();

    if (!ffmpegPath) {
      // Return a simulated mix result when FFmpeg isn't available
      const primaryVoice = segments.find((s) => s.track === "voice");
      const fallbackUrl = "/api/audio/demo-tone?type=voice&variant=default";
      return Response.json({
        mp3Url: primaryVoice?.audioUrl || segments[0]?.audioUrl || fallbackUrl,
        wavUrl: primaryVoice?.audioUrl || segments[0]?.audioUrl || fallbackUrl,
        loudness: -23,
        duration: totalDuration,
        warning: "FFmpeg not available — using demo audio fallback.",
        note: "FFmpeg not available — returning primary audio track. Install FFmpeg for full mixing.",
      });
    }

    const outDir = join(process.cwd(), "public", "audio", "mixed");
    await mkdir(outDir, { recursive: true });

    const mixId = randomUUID().slice(0, 8);

    // Resolve audio file paths (convert URLs to file paths)
    const resolvedSegments = await Promise.all(
      segments.map(async (seg) => {
        let filePath: string;
        if (seg.audioUrl.startsWith("/")) {
          filePath = join(process.cwd(), "public", seg.audioUrl);
        } else if (seg.audioUrl.startsWith("http")) {
          const res = await fetch(seg.audioUrl);
          const buffer = await res.arrayBuffer();
          const tmpPath = join(outDir, `tmp-${randomUUID().slice(0, 8)}.mp3`);
          await writeFile(tmpPath, Buffer.from(buffer));
          filePath = tmpPath;
        } else {
          filePath = seg.audioUrl;
        }
        return { ...seg, filePath };
      })
    );

    // Build FFmpeg filter graph
    const filters: string[] = [];
    const mixInputLabels: string[] = [];

    resolvedSegments.forEach((seg, i) => {
      const delayMs = Math.round(seg.startTime * 1000);
      const vol = seg.volume / 100;

      let effectiveVol = vol;
      if (seg.ducking?.underVoice) {
        effectiveVol = (seg.ducking.duckLevel / 100) * vol;
      }

      filters.push(
        `[${i}:a]adelay=${delayMs}|${delayMs},volume=${effectiveVol.toFixed(2)},atrim=duration=${seg.duration}[a${i}]`
      );
      mixInputLabels.push(`[a${i}]`);
    });

    const filterGraph =
      filters.join(";") +
      `;${mixInputLabels.join("")}amix=inputs=${resolvedSegments.length}:duration=longest:dropout_transition=2,loudnorm=I=-23:TP=-1.5:LRA=11[out]`;

    // Build ffmpeg args array (no shell injection possible)
    const buildArgs = (outputPath: string, extraArgs: string[]): string[] => {
      const args: string[] = ["-y"];
      for (const seg of resolvedSegments) {
        args.push("-i", seg.filePath);
      }
      args.push("-filter_complex", filterGraph);
      args.push("-map", "[out]");
      args.push(...extraArgs);
      args.push(outputPath);
      return args;
    };

    const results: { mp3Url?: string; wavUrl?: string } = {};

    if (outputFormat === "mp3" || outputFormat === "both") {
      const mp3File = `mix-${mixId}.mp3`;
      const mp3Path = join(outDir, mp3File);
      await execFileAsync(ffmpegPath, buildArgs(mp3Path, ["-ar", "44100", "-b:a", "320k"]), {
        timeout: 60000,
      });
      results.mp3Url = `/audio/mixed/${mp3File}`;
    }

    if (outputFormat === "wav" || outputFormat === "both") {
      const wavFile = `mix-${mixId}.wav`;
      const wavPath = join(outDir, wavFile);
      await execFileAsync(ffmpegPath, buildArgs(wavPath, ["-ar", "48000", "-sample_fmt", "s24"]), {
        timeout: 60000,
      });
      results.wavUrl = `/audio/mixed/${wavFile}`;
    }

    return Response.json({
      ...results,
      loudness: -23,
      duration: totalDuration,
    });
  } catch (error) {
    return Response.json(
      { error: "Audio mixing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
