// Kova → Quality Chain connector
// Takes Kova pipeline output and formats it for quality chain submission

import { qualityChainClient, type SubmitContentRequest, type SubmitContentResponse } from "./paperclip-client";

export interface KovaConceptOutput {
  contentId: string;
  contentType: "radio-ad" | "social-post";
  brandSlug: string;
  stationSlug: string;
  title: string;
  description: string;
  duration?: string;
  triggerType?: string;
  relevanceScore: number;
  momentId?: string;
  suggestedAngle: string;
  readyForChain: boolean;
}

export async function submitToChain(kovaOutput: KovaConceptOutput): Promise<SubmitContentResponse> {
  if (!kovaOutput.readyForChain) {
    return {
      pipelineId: "",
      status: "rejected",
      message: "Content not cleared by concept gate — readyForChain is false",
    };
  }

  const request: SubmitContentRequest = {
    contentId: kovaOutput.contentId,
    contentType: kovaOutput.contentType,
    brandSlug: kovaOutput.brandSlug,
    stationSlug: kovaOutput.stationSlug,
    concept: {
      title: kovaOutput.title,
      description: kovaOutput.description,
      duration: kovaOutput.duration,
      triggerType: kovaOutput.triggerType,
    },
    kovaOutput: {
      relevanceScore: kovaOutput.relevanceScore,
      momentId: kovaOutput.momentId,
      suggestedAngle: kovaOutput.suggestedAngle,
      readyForChain: kovaOutput.readyForChain,
    },
  };

  return qualityChainClient.submitContent(request);
}
