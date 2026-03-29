// Quality Chain API client — wraps fetch calls to the quality-chain service

export interface SubmitContentRequest {
  contentId: string;
  contentType: "radio-ad" | "social-post";
  brandSlug: string;
  stationSlug: string;
  concept: {
    title: string;
    description: string;
    duration?: string;
    triggerType?: string;
  };
  kovaOutput: {
    relevanceScore: number;
    momentId?: string;
    suggestedAngle: string;
    readyForChain: boolean;
  };
}

export interface SubmitContentResponse {
  pipelineId: string;
  status: "accepted" | "rejected";
  message: string;
}

export interface VerdictResponse {
  pipelineId: string;
  stage: "concept-gate" | "writer" | "executive-producer" | "creative-director";
  status: "processing" | "approved" | "revision-required" | "rejected";
  score?: number;
  feedback?: string;
  completedAt?: string;
}

export interface PipelineStatusResponse {
  pipelineId: string;
  currentStage: string;
  stages: {
    name: string;
    status: "pending" | "processing" | "complete" | "skipped";
    startedAt?: string;
    completedAt?: string;
    score?: number;
  }[];
  overallStatus: "in-progress" | "approved" | "rejected";
  elapsedTime: string;
}

const DEFAULT_BASE_URL = "/api/quality-chain";

export class QualityChainClient {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async submitContent(request: SubmitContentRequest): Promise<SubmitContentResponse> {
    const res = await fetch(`${this.baseUrl}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`Quality chain submit failed: ${res.status}`);
    return res.json();
  }

  async getVerdict(pipelineId: string): Promise<VerdictResponse> {
    const res = await fetch(`${this.baseUrl}/verdict/${pipelineId}`);
    if (!res.ok) throw new Error(`Quality chain verdict failed: ${res.status}`);
    return res.json();
  }

  async getPipelineStatus(pipelineId: string): Promise<PipelineStatusResponse> {
    const res = await fetch(`${this.baseUrl}/status/${pipelineId}`);
    if (!res.ok) throw new Error(`Quality chain status failed: ${res.status}`);
    return res.json();
  }
}

export const qualityChainClient = new QualityChainClient();
