// Quality Chain monitor — polling helper to track content through the pipeline

import { qualityChainClient, type PipelineStatusResponse } from "./paperclip-client";

export interface MonitorUpdate {
  pipelineId: string;
  currentStage: string;
  elapsedTime: string;
  scores: Record<string, number | undefined>;
  overallStatus: "in-progress" | "approved" | "rejected";
}

export type MonitorCallback = (update: MonitorUpdate) => void;

function extractUpdate(response: PipelineStatusResponse): MonitorUpdate {
  const scores: Record<string, number | undefined> = {};
  for (const stage of response.stages) {
    scores[stage.name] = stage.score;
  }
  return {
    pipelineId: response.pipelineId,
    currentStage: response.currentStage,
    elapsedTime: response.elapsedTime,
    scores,
    overallStatus: response.overallStatus,
  };
}

export async function pollPipelineStatus(pipelineId: string): Promise<MonitorUpdate> {
  const response = await qualityChainClient.getPipelineStatus(pipelineId);
  return extractUpdate(response);
}

export function startPipelineMonitor(
  pipelineId: string,
  callback: MonitorCallback,
  intervalMs: number = 2000
): () => void {
  let active = true;

  const poll = async () => {
    if (!active) return;
    try {
      const update = await pollPipelineStatus(pipelineId);
      callback(update);
      if (update.overallStatus !== "in-progress") {
        active = false;
        return;
      }
    } catch {
      // Silently retry on next interval
    }
    if (active) setTimeout(poll, intervalMs);
  };

  poll();

  return () => {
    active = false;
  };
}
