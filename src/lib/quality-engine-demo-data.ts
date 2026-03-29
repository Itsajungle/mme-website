// Quality Engine demo data — realistic pipeline items for dashboard display

export type ContentType = "radio-ad" | "social-post";
export type PipelineStage = "concept-gate" | "writer" | "executive-producer" | "creative-director";
export type PipelineStatus = "processing" | "approved" | "revision-required" | "rejected";
export type AgentStatus = "idle" | "processing" | "complete";

export interface PipelineItemData {
  id: string;
  contentType: ContentType;
  brandName: string;
  title: string;
  duration?: string;
  currentStage: PipelineStage;
  status: PipelineStatus;
  score?: number;
  timeInPipeline: string;
  startedAt: string;
}

export interface AgentStats {
  tasksToday: number;
  avgTime: string;
  approvalRate: number;
}

export interface AgentData {
  name: string;
  role: string;
  stage: PipelineStage;
  status: AgentStatus;
  stats: AgentStats;
  accentColor: string;
}

export interface PerformanceMetrics {
  totalToday: number;
  totalWeek: number;
  totalAllTime: number;
  avgQualityScore: number;
  firstPassApproval: number;
  afterRevisionApproval: number;
  avgPipelineTime: string;
  radioCount: number;
  socialCount: number;
  rejectionReasons: { reason: string; count: number }[];
}

export const AGENT_DATA: AgentData[] = [
  {
    name: "Kova",
    role: "Concept Gate",
    stage: "concept-gate",
    status: "complete",
    stats: { tasksToday: 14, avgTime: "1.2s", approvalRate: 96 },
    accentColor: "#3B82F6",
  },
  {
    name: "Writer",
    role: "Content Generation",
    stage: "writer",
    status: "processing",
    stats: { tasksToday: 12, avgTime: "8.4s", approvalRate: 91 },
    accentColor: "#8B5CF6",
  },
  {
    name: "Executive Producer",
    role: "Quality Review",
    stage: "executive-producer",
    status: "processing",
    stats: { tasksToday: 10, avgTime: "3.1s", approvalRate: 82 },
    accentColor: "#F59E0B",
  },
  {
    name: "Creative Director",
    role: "Final Approval",
    stage: "creative-director",
    status: "idle",
    stats: { tasksToday: 8, avgTime: "2.7s", approvalRate: 94 },
    accentColor: "#00FF96",
  },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  "concept-gate",
  "writer",
  "executive-producer",
  "creative-director",
];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  "concept-gate": "Concept Gate",
  writer: "Writer",
  "executive-producer": "Executive Producer",
  "creative-director": "Creative Director",
};

export const PIPELINE_ITEMS: PipelineItemData[] = [
  {
    id: "QE-1041",
    contentType: "radio-ad",
    brandName: "Tadg Riordan Motors",
    title: "Weather Ad (30s)",
    duration: "30s",
    currentStage: "creative-director",
    status: "approved",
    score: 94,
    timeInPipeline: "14.2s",
    startedAt: "12:04:18",
  },
  {
    id: "QE-1042",
    contentType: "radio-ad",
    brandName: "Tadg Riordan Motors",
    title: "Sport Ad (15s)",
    duration: "15s",
    currentStage: "executive-producer",
    status: "processing",
    score: undefined,
    timeInPipeline: "6.8s",
    startedAt: "12:11:33",
  },
  {
    id: "QE-1043",
    contentType: "radio-ad",
    brandName: "Napoli's Kitchen",
    title: "Seasonal Ad (30s)",
    duration: "30s",
    currentStage: "writer",
    status: "processing",
    score: undefined,
    timeInPipeline: "3.1s",
    startedAt: "12:15:02",
  },
  {
    id: "QE-1044",
    contentType: "social-post",
    brandName: "Wye Valley Tours",
    title: "Weekend Adventure Reel",
    currentStage: "creative-director",
    status: "approved",
    score: 91,
    timeInPipeline: "12.6s",
    startedAt: "11:58:44",
  },
  {
    id: "QE-1045",
    contentType: "radio-ad",
    brandName: "Hereford Financial Advisers",
    title: "Tax Year End (30s)",
    duration: "30s",
    currentStage: "executive-producer",
    status: "revision-required",
    score: 68,
    timeInPipeline: "18.3s",
    startedAt: "11:49:51",
  },
  {
    id: "QE-1046",
    contentType: "social-post",
    brandName: "Napoli's Kitchen",
    title: "Friday Night Special Post",
    currentStage: "creative-director",
    status: "approved",
    score: 88,
    timeInPipeline: "11.9s",
    startedAt: "12:01:27",
  },
  {
    id: "QE-1047",
    contentType: "radio-ad",
    brandName: "Green Valley Motors",
    title: "Spring Sale (30s)",
    duration: "30s",
    currentStage: "concept-gate",
    status: "processing",
    score: undefined,
    timeInPipeline: "0.8s",
    startedAt: "12:17:44",
  },
  {
    id: "QE-1048",
    contentType: "social-post",
    brandName: "Tadg Riordan Motors",
    title: "Bank Holiday Carousel",
    currentStage: "executive-producer",
    status: "processing",
    score: undefined,
    timeInPipeline: "5.4s",
    startedAt: "12:12:58",
  },
];

export const PERFORMANCE_METRICS: PerformanceMetrics = {
  totalToday: 47,
  totalWeek: 312,
  totalAllTime: 2841,
  avgQualityScore: 87.3,
  firstPassApproval: 78,
  afterRevisionApproval: 96,
  avgPipelineTime: "15.4s",
  radioCount: 186,
  socialCount: 126,
  rejectionReasons: [
    { reason: "Brand voice mismatch", count: 12 },
    { reason: "Compliance issue", count: 8 },
    { reason: "Duration exceeded", count: 5 },
    { reason: "Low relevance score", count: 4 },
    { reason: "Missing call-to-action", count: 3 },
  ],
};
