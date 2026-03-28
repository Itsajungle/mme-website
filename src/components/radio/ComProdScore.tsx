"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Award, BarChart3, Target, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComProdScoreProps {
  script: string;
  duration: number; // seconds
  triggerType: string;
  logoLine: string;
  brandName: string;
  hasMusic?: boolean;
  hasSFX?: boolean;
}

interface ScoreResult {
  readability: number; // 1-10
  ctaStrength: "Weak" | "Moderate" | "Strong";
  creativeScore: number; // 0-100
  timingAssessment: "Under" | "On Target" | "Over";
  suggestions: string[];
  // Sub-elements
  relevance: number; // 0-25
  emotionalHook: number; // 0-25
  memorability: number; // 0-25
  ctaScore: number; // 0-25
}

function scoreScript(props: ComProdScoreProps): ScoreResult {
  const { script, duration, triggerType, logoLine, brandName, hasMusic, hasSFX } = props;

  // Extract voice text (remove directions)
  const voiceText = script
    .replace(/\[.*?\]/g, "")
    .replace(/VOICE.*?:/g, "")
    .replace(/"/g, "")
    .trim();

  const words = voiceText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = voiceText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;

  // 1. Readability (1-10) — Flesch-Kincaid adapted for spoken word
  let readability = 8.5;
  if (avgWordsPerSentence > 20) readability -= (avgWordsPerSentence - 20) * 0.15;
  if (avgWordsPerSentence < 8) readability -= 0.5; // Too choppy
  // Reward conversational phrasing
  const conversationalWords = ["you", "your", "we", "our", "today", "now", "here"];
  const conversationalCount = words.filter((w) =>
    conversationalWords.includes(w.toLowerCase())
  ).length;
  readability += Math.min(conversationalCount * 0.1, 0.8);
  readability = Math.max(1, Math.min(10, Math.round(readability * 10) / 10));

  // 2. CTA Strength
  const hasActionVerb = /\b(call|visit|pop|come|drop|see|book|order|contact|find|get)\b/i.test(voiceText);
  const hasLocation = /\b(street|road|avenue|lane|square|center|centre)\b/i.test(voiceText) || brandName.length > 0;
  const hasUrgency = /\b(today|now|this weekend|don't miss|limited|hurry|last chance|only)\b/i.test(voiceText);
  const hasLogoLine = voiceText.toLowerCase().includes(logoLine.toLowerCase());

  const ctaElements = [hasActionVerb, hasLocation, hasUrgency, hasLogoLine].filter(Boolean).length;
  const ctaStrength: "Weak" | "Moderate" | "Strong" = ctaElements >= 4 ? "Strong" : ctaElements >= 2 ? "Moderate" : "Weak";

  // 3. Creative Quality — Peter Stone's 4 Elements
  // Element 1: Relevance (connection to trigger/moment)
  let relevance = 10; // Base
  const triggerWords: Record<string, string[]> = {
    Weather: ["sun", "rain", "weather", "forecast", "shine", "warm", "cold"],
    Sport: ["match", "game", "win", "goal", "team", "result", "score"],
    Seasonal: ["season", "spring", "summer", "autumn", "winter", "christmas", "easter", "holiday"],
    Traffic: ["traffic", "road", "drive", "commute", "journey"],
    News: ["news", "announce", "report", "breaking"],
    Industry: ["industry", "market", "sector", "new"],
  };
  const relevantWords = triggerWords[triggerType] || [];
  const triggerMentions = words.filter((w) => relevantWords.includes(w.toLowerCase())).length;
  relevance += Math.min(triggerMentions * 3, 15);

  // Element 2: Emotional Hook
  let emotionalHook = 10;
  const emotionalMarkers = /\b(feel|love|heart|dream|imagine|picture|trust|family|community|home|care|joy|happy|exciting|brilliant|amazing)\b/i;
  const emotionalMatches = voiceText.match(new RegExp(emotionalMarkers, "gi"));
  emotionalHook += Math.min((emotionalMatches?.length || 0) * 3, 15);

  // Element 3: Memorability
  let memorability = 8;
  if (hasLogoLine) memorability += 8;
  if (hasMusic) memorability += 5;
  if (hasSFX) memorability += 4;
  memorability = Math.min(25, memorability);

  // Element 4: Call to Action
  let ctaScore = ctaElements * 6;
  ctaScore = Math.min(25, Math.max(0, ctaScore));

  const creativeScore = Math.min(100, relevance + emotionalHook + memorability + ctaScore);

  // 4. Timing Assessment
  const targetWords = Math.round(duration * 2.5);
  const ratio = wordCount / targetWords;
  const timingAssessment: "Under" | "On Target" | "Over" =
    ratio < 0.8 ? "Under" : ratio > 1.15 ? "Over" : "On Target";

  // 5. Suggestions
  const suggestions: string[] = [];
  if (!hasLogoLine) suggestions.push(`Add logo line "${logoLine}" for brand reinforcement`);
  if (!hasLocation) suggestions.push("Add a location mention for stronger local connection");
  if (!hasUrgency) suggestions.push("Consider adding urgency for stronger response");
  if (!hasActionVerb) suggestions.push("Include a clear action verb (visit, call, pop in)");
  if (triggerMentions === 0) suggestions.push(`Reference the ${triggerType.toLowerCase()} trigger for moment relevance`);
  if (avgWordsPerSentence > 18) suggestions.push("Shorten some sentences — aim for under 15 words for radio");
  if (timingAssessment === "Over") suggestions.push("Script is too long — trim to avoid rushed delivery");
  if (timingAssessment === "Under") suggestions.push("Script is short — add more detail or slow the pace");
  if (!hasMusic) suggestions.push("Add a music bed for production quality");

  return {
    readability,
    ctaStrength,
    creativeScore,
    timingAssessment,
    suggestions,
    relevance,
    emotionalHook,
    memorability,
    ctaScore,
  };
}

export function ComProdScore(props: ComProdScoreProps) {
  const score = useMemo(() => scoreScript(props), [props.script, props.duration, props.triggerType, props.logoLine, props.brandName, props.hasMusic, props.hasSFX]);

  const isApproved = score.creativeScore >= 75;

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className={cn(
        "rounded-xl border p-5",
        isApproved ? "border-accent/30 bg-accent/5" : "border-amber-500/30 bg-amber-500/5"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award size={20} className={isApproved ? "text-accent" : "text-amber-400"} />
            <h3 className="font-heading text-lg font-bold text-text">ComProd Director</h3>
          </div>
          <span className={cn(
            "rounded-full px-3 py-1 text-xs font-bold",
            isApproved ? "bg-accent/10 text-accent" : "bg-amber-500/10 text-amber-400"
          )}>
            {isApproved ? "Approved — Ready to Schedule" : "Below Threshold — Review Recommended"}
          </span>
        </div>

        {/* Creative Score */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-heading text-4xl font-bold text-text">{score.creativeScore}</span>
          <span className="text-lg text-text-muted">/100</span>
        </div>
        <div className="h-2 rounded-full bg-bg-deep overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score.creativeScore}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn("h-full rounded-full", isApproved ? "bg-accent" : "bg-amber-500")}
          />
        </div>

        {/* 4 Elements Breakdown */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { label: "Relevance", score: score.relevance, max: 25 },
            { label: "Emotion", score: score.emotionalHook, max: 25 },
            { label: "Memory", score: score.memorability, max: 25 },
            { label: "CTA", score: score.ctaScore, max: 25 },
          ].map((el) => (
            <div key={el.label} className="text-center">
              <div className="text-xs text-text-muted mb-1">{el.label}</div>
              <div className="font-mono text-sm font-bold text-text">{el.score}/{el.max}</div>
              <div className="mt-1 h-1 rounded-full bg-bg-deep overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(el.score / el.max) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className={cn("h-full rounded-full", el.score >= el.max * 0.7 ? "bg-accent" : "bg-amber-500")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-accent" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Readability</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold text-text">{score.readability}</span>
            <span className="text-sm text-text-muted">/10</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-bg-deep overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.readability * 10}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full rounded-full bg-accent"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-accent" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">CTA Strength</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-text">{score.ctaStrength}</span>
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold",
              score.ctaStrength === "Strong" ? "bg-accent/10 text-accent" :
              score.ctaStrength === "Moderate" ? "bg-amber-500/10 text-amber-400" :
              "bg-red-500/10 text-red-400"
            )}>
              {score.ctaStrength === "Strong" ? "Good" : score.ctaStrength === "Moderate" ? "OK" : "Needs Work"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-accent" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Timing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-text">{score.timingAssessment}</span>
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold",
              score.timingAssessment === "On Target" ? "bg-accent/10 text-accent" : "bg-amber-500/10 text-amber-400"
            )}>
              {score.timingAssessment === "On Target" ? "Perfect" : "Adjust"}
            </span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {score.suggestions.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Improvement Suggestions</span>
          </div>
          <ul className="space-y-2">
            {score.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Export scoring function for use in automated mode
export { scoreScript };
export type { ScoreResult };
