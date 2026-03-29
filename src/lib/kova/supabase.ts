import type {
  ConceptGateResult,
  FiveActStructure,
  Storyboard,
  StyleApplication,
  RetentionAnalysis,
  QualityVerdict,
} from "./types";

// Supabase integration for Kova Creative Intelligence.
// When @supabase/supabase-js is installed and env vars are configured,
// replace the in-memory store with real Supabase calls.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_KEY && !SUPABASE_KEY.startsWith("your_"));
}

// ── In-memory fallback store ──────────────────────────────────

const store = {
  concepts: new Map<string, ConceptGateResult>(),
  structures: new Map<string, FiveActStructure>(),
  storyboards: new Map<string, Storyboard>(),
  styles: new Map<string, StyleApplication>(),
  retention: new Map<string, RetentionAnalysis>(),
  quality: new Map<string, QualityVerdict>(),
};

// ── Concept Gate ──────────────────────────────────────────────

export async function saveConcept(result: ConceptGateResult): Promise<void> {
  store.concepts.set(result.id, result);
}

export async function getConcept(id: string): Promise<ConceptGateResult | null> {
  return store.concepts.get(id) ?? null;
}

// ── Five-Act Structure ────────────────────────────────────────

export async function saveStructure(structure: FiveActStructure): Promise<void> {
  store.structures.set(structure.id, structure);
}

export async function getStructure(id: string): Promise<FiveActStructure | null> {
  return store.structures.get(id) ?? null;
}

// ── Storyboard ────────────────────────────────────────────────

export async function saveStoryboard(storyboard: Storyboard): Promise<void> {
  store.storyboards.set(storyboard.id, storyboard);
}

export async function getStoryboard(id: string): Promise<Storyboard | null> {
  return store.storyboards.get(id) ?? null;
}

// ── Style Application ─────────────────────────────────────────

export async function saveStyleApplication(app: StyleApplication): Promise<void> {
  store.styles.set(app.storyboardId, app);
}

// ── Retention Analysis ────────────────────────────────────────

export async function saveRetention(analysis: RetentionAnalysis): Promise<void> {
  store.retention.set(analysis.contentId, analysis);
}

export async function getRetention(contentId: string): Promise<RetentionAnalysis | null> {
  return store.retention.get(contentId) ?? null;
}

// ── Quality Verdicts ──────────────────────────────────────────

export async function saveQualityVerdict(verdict: QualityVerdict): Promise<void> {
  store.quality.set(verdict.submissionId, verdict);
}

export async function getQualityVerdict(id: string): Promise<QualityVerdict | null> {
  return store.quality.get(id) ?? null;
}
