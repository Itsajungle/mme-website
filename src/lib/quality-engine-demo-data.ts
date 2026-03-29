// Quality Engine demo data — realistic pipeline items for dashboard display

export type ContentType = "radio-ad" | "social-post";
export type PipelineStage =
  | "concept-gate"
  | "writer"
  | "executive-producer"
  | "creative-director"
  | "distribution";
export type PipelineStatus =
  | "processing"
  | "approved"
  | "revision-required"
  | "rejected";
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

export interface TimelineEntry {
  id: string;
  timestamp: string;
  agent: string;
  agentColor: string;
  action: string;
  detail: string;
  contentId?: string;
}

export interface QualityTrendPoint {
  date: string;
  score: number;
  volume: number;
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
  approvalBreakdown: { label: string; value: number; color: string }[];
  qualityTrend: QualityTrendPoint[];
}

export const AGENT_DATA: AgentData[] = [
  {
    name: "Trigger",
    role: "Content Detection",
    stage: "concept-gate",
    status: "complete",
    stats: { tasksToday: 14, avgTime: "1.2s", approvalRate: 96 },
    accentColor: "#3B82F6",
  },
  {
    name: "Writer",
    role: "Script Generation",
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
  {
    name: "Distribution",
    role: "Scheduling & Delivery",
    stage: "distribution",
    status: "idle",
    stats: { tasksToday: 6, avgTime: "0.8s", approvalRate: 100 },
    accentColor: "#10B981",
  },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  "concept-gate",
  "writer",
  "executive-producer",
  "creative-director",
  "distribution",
];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  "concept-gate": "Trigger",
  writer: "Writer",
  "executive-producer": "Exec. Producer",
  "creative-director": "Creative Dir.",
  distribution: "Distribution",
};

export const PIPELINE_ITEMS: PipelineItemData[] = [
  {
    id: "QE-1041",
    contentType: "radio-ad",
    brandName: "Tadg Riordan Motors",
    title: "Weather Ad (30s)",
    duration: "30s",
    currentStage: "distribution",
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
    currentStage: "distribution",
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

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: "tl-001",
    timestamp: "12:17:44",
    agent: "Trigger",
    agentColor: "#3B82F6",
    action: "Content detected",
    detail: "Weather trigger activated — Green Valley Motors",
    contentId: "QE-1047",
  },
  {
    id: "tl-002",
    timestamp: "12:16:31",
    agent: "Writer",
    agentColor: "#8B5CF6",
    action: "Script generated",
    detail: "30s seasonal ad for Napoli's Kitchen — 78 words",
    contentId: "QE-1043",
  },
  {
    id: "tl-003",
    timestamp: "12:15:02",
    agent: "Trigger",
    agentColor: "#3B82F6",
    action: "Content detected",
    detail: "Seasonal trigger activated — Napoli's Kitchen",
    contentId: "QE-1043",
  },
  {
    id: "tl-004",
    timestamp: "12:14:18",
    agent: "Executive Producer",
    agentColor: "#F59E0B",
    action: "Review complete",
    detail: "Sport ad approved — score 87/100",
    contentId: "QE-1042",
  },
  {
    id: "tl-005",
    timestamp: "12:12:58",
    agent: "Trigger",
    agentColor: "#3B82F6",
    action: "Content detected",
    detail: "Social trigger — Tadg Riordan Motors carousel",
    contentId: "QE-1048",
  },
  {
    id: "tl-006",
    timestamp: "12:11:33",
    agent: "Writer",
    agentColor: "#8B5CF6",
    action: "Script generated",
    detail: "15s sport ad for Tadg Riordan Motors — 38 words",
    contentId: "QE-1042",
  },
  {
    id: "tl-007",
    timestamp: "12:08:22",
    agent: "Creative Director",
    agentColor: "#00FF96",
    action: "Approved",
    detail: "Weather ad scored 94/100 — ready for distribution",
    contentId: "QE-1041",
  },
  {
    id: "tl-008",
    timestamp: "12:06:55",
    agent: "Distribution",
    agentColor: "#10B981",
    action: "Scheduled",
    detail: "Tadg Riordan weather ad queued for next weather break",
    contentId: "QE-1041",
  },
  {
    id: "tl-009",
    timestamp: "12:04:18",
    agent: "Trigger",
    agentColor: "#3B82F6",
    action: "Content detected",
    detail: "Weather trigger — Tadg Riordan Motors 30s",
    contentId: "QE-1041",
  },
  {
    id: "tl-010",
    timestamp: "12:01:27",
    agent: "Creative Director",
    agentColor: "#00FF96",
    action: "Approved",
    detail: "Napoli's Kitchen social post — score 88/100",
    contentId: "QE-1046",
  },
  {
    id: "tl-011",
    timestamp: "11:58:44",
    agent: "Executive Producer",
    agentColor: "#F59E0B",
    action: "Revision requested",
    detail: "Tax Year End ad — brand voice mismatch, score 68/100",
    contentId: "QE-1045",
  },
  {
    id: "tl-012",
    timestamp: "11:55:10",
    agent: "Distribution",
    agentColor: "#10B981",
    action: "Delivered",
    detail: "Wye Valley Tours reel published to social channels",
    contentId: "QE-1044",
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
  approvalBreakdown: [
    { label: "First Pass", value: 78, color: "#00FF96" },
    { label: "After Revision", value: 18, color: "#F59E0B" },
    { label: "Rejected", value: 4, color: "#EF4444" },
  ],
  qualityTrend: [
    { date: "Mon", score: 84.1, volume: 58 },
    { date: "Tue", score: 85.7, volume: 62 },
    { date: "Wed", score: 86.3, volume: 55 },
    { date: "Thu", score: 87.9, volume: 71 },
    { date: "Fri", score: 88.2, volume: 66 },
    { date: "Sat", score: 86.8, volume: 42 },
    { date: "Today", score: 87.3, volume: 47 },
  ],
};
