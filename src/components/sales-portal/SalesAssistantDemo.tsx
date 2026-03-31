"use client";
import { useState, useEffect } from "react";
import {
  ChevronRight, Search, TrendingUp, BarChart3, FileText, CheckCircle2,
  Users, Target, Brain, Presentation, Shield, ArrowRight, Clock,
  DollarSign, Radio, Zap, Eye, Star, AlertCircle, ChevronDown,
  Play, Pause, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Mock data for Sunshine 106.8 ────────────────────── */
const mockProspectorData = {
  newProspects: [
    { name: "Fitzgerald's Garage", sector: "Motoring", reason: "3 competitors on-air, they're not. High footfall location in broadcast zone.", score: 92 },
    { name: "Lakeside Hotel & Spa", sector: "Hospitality", reason: "Peak wedding season approaching. Social presence strong but no radio.", score: 87 },
    { name: "Murphy's Home & Garden", sector: "Retail", reason: "New store opening Q2. Heavy print spend detected.", score: 84 },
  ],
  upsellOpps: [
    { name: "Riordan Motors", sector: "Motoring", current: "€800/mo", potential: "€2,400/mo", reason: "Only running weekday spots. Weekend drive-time untapped." },
    { name: "Casey's Bar & Restaurant", sector: "Hospitality", current: "€400/mo", potential: "€1,200/mo", reason: "Summer season + social combo could 3x ROI." },
  ],
  lapsedClients: [
    { name: "Kilkenny Credit Union", sector: "Financial", lastOnAir: "Sep 2025", spend: "€12,000/yr", reason: "Marketing manager changed. New contact identified on LinkedIn." },
    { name: "Walsh Furniture", sector: "Retail", lastOnAir: "Nov 2025", spend: "€8,400/yr", reason: "Moved budget to social. MME cross-media pitch could win them back." },
    { name: "Dome Engineering", sector: "Industrial", lastOnAir: "Jul 2025", spend: "€6,000/yr", reason: "Said 'radio doesn't work for B2B'. Sector research shows otherwise." },
  ],
};

const mockAnalystData = {
  prospect: "Fitzgerald's Garage",
  sector: "Motoring",
  adSpend: [
    { channel: "Social", value: "€1,200/mo", detail: "Facebook, Instagram" },
    { channel: "Print", value: "€800/mo", detail: "Kilkenny People" },
    { channel: "Radio", value: "None", detail: "Not detected" },
    { channel: "Digital", value: "€400/mo", detail: "Google Ads" },
  ],
  totalSpend: "€2,400/mo estimated",
  competitors: [
    { name: "Riordan Motors", onAir: true, station: "Sunshine 106.8", spend: "€800/mo", notes: "Active campaign, weekday drive-time" },
    { name: "Michael Lyng Motors", onAir: true, station: "KCLR + Sunshine", spend: "€1,500/mo", notes: "Multi-station, sports sponsorship" },
    { name: "Dooley Motors", onAir: false, station: "—", spend: "—", notes: "Heavy social spend, no radio presence" },
    { name: "Connolly's Motor Group", onAir: true, station: "Sunshine 106.8", spend: "€600/mo", notes: "Seasonal campaigns only" },
  ],
  insight: "3 of 4 direct competitors are on-air. Fitzgerald's is the largest dealer in the zone WITHOUT radio. Estimated €28,800/yr total ad budget — a 15% radio allocation would be €4,320/yr, well within their range.",
  recommendation: "Lead with competitive gap analysis. Show them what Riordan Motors sounds like on-air (live demo). Position as 'your competitors are already here — you're the one they're not hearing.'",
};

const mockPresentationSlides = [
  { title: "Station Identity", desc: "Sunshine 106.8 idents, logo animation, and brand intro", color: "text-accent" },
  { title: "Market & Reach", desc: "136,000 listeners, Kilkenny/Carlow, demographic breakdown", color: "text-blue-400" },
  { title: "The Sound of Sunshine", desc: "Audio montage — what it feels like to be on Sunshine 106.8", color: "text-amber-400" },
  { title: "Your Competitors On-Air", desc: "Riordan Motors & Connolly's are already reaching your customers", color: "text-red-400" },
  { title: "What YOU Could Sound Like", desc: "Live AI-generated demo ad for Fitzgerald's Garage", color: "text-purple-400" },
  { title: "Social + MME", desc: "Cross-media moment marketing — radio + social from one platform", color: "text-pink-400" },
  { title: "The Package", desc: "Pricing, launch timeline, and ROI projections", color: "text-accent" },
];

const mockDirectorFeedback = [
  { type: "approve" as const, text: "Strong competitive positioning — the 'your competitors are here' angle is powerful for this prospect." },
  { type: "suggest" as const, text: "Add a testimonial or case study from Riordan Motors showing ROI. Social proof from their own sector." },
  { type: "suggest" as const, text: "The pricing slide should lead with the cross-media bundle — that's the differentiator vs. a standard rate card." },
  { type: "approve" as const, text: "Demo ad quality is excellent. The voice and music choices match the Sunshine brand." },
];

/* ── Agent definitions ───────────────────────────────── */
const agents = [
  { id: "prospector", name: "The Prospector", icon: Target, tagline: "Find, upsell, and recover", desc: "Scans station billing history to identify new prospects, upsell opportunities, and lapsed advertisers ready to win back." },
  { id: "analyst", name: "The Business Analyst", icon: Brain, tagline: "Intelligence that closes deals", desc: "Researches prospect ad spend, maps sector competition, and delivers the intelligence a rep needs to walk in armed." },
  { id: "presenter", name: "The Presentation Builder", icon: Presentation, tagline: "One button. Complete pitch.", desc: "Auto-builds a station-branded pitch deck with live demo ads, market data, and the MME cross-media proposition." },
  { id: "director", name: "Sales Director Review", icon: Shield, tagline: "Quality gate before it goes out", desc: "Reviews every presentation for strategic alignment, brand consistency, and competitive positioning." },
];

const agentColors = ["accent", "blue-400", "purple-400", "amber-400"];

/* ── Sub-panels ──────────────────────────────────────── */

function ProspectorPanel() {
  const [tab, setTab] = useState<"new" | "upsell" | "lapsed">("new");
  const tabs = [
    { id: "new" as const, label: "New Prospects", count: 3, Icon: Search },
    { id: "upsell" as const, label: "Upsell", count: 2, Icon: TrendingUp },
    { id: "lapsed" as const, label: "Win Back", count: 3, Icon: RotateCcw },
  ];
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
              tab === t.id
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border text-text-muted hover:text-text hover:bg-white/5"
            )}
          >
            <t.Icon size={13} />
            {t.label}
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", tab === t.id ? "bg-accent text-bg" : "bg-white/10 text-text-muted")}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "new" && mockProspectorData.newProspects.map((p, i) => (
        <div key={i} className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-text">{p.name}</span>
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">Score: {p.score}</span>
          </div>
          <span className="text-[11px] text-amber-400">{p.sector}</span>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">{p.reason}</p>
        </div>
      ))}

      {tab === "upsell" && mockProspectorData.upsellOpps.map((p, i) => (
        <div key={i} className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-text">{p.name}</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted">{p.current}</span>
              <ArrowRight size={12} className="text-accent" />
              <span className="font-bold text-accent">{p.potential}</span>
            </div>
          </div>
          <span className="text-[11px] text-amber-400">{p.sector}</span>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">{p.reason}</p>
        </div>
      ))}

      {tab === "lapsed" && mockProspectorData.lapsedClients.map((p, i) => (
        <div key={i} className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-text">{p.name}</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-red-400">Off-air: {p.lastOnAir}</span>
              <span className="text-text-muted">Was: {p.spend}</span>
            </div>
          </div>
          <span className="text-[11px] text-amber-400">{p.sector}</span>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">{p.reason}</p>
        </div>
      ))}
    </div>
  );
}

function AnalystPanel() {
  const d = mockAnalystData;
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <h4 className="text-base font-bold text-text">Prospect: {d.prospect}</h4>
        <span className="text-xs text-blue-400">Sector: {d.sector}</span>
      </div>

      <div>
        <h5 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Estimated Ad Spend</h5>
        <div className="grid grid-cols-2 gap-2">
          {d.adSpend.map((s, i) => (
            <div key={i} className="rounded-lg border border-border bg-bg-card p-3">
              <div className="text-[10px] text-text-muted mb-0.5">{s.channel}</div>
              <div className={cn("text-sm font-semibold", s.channel === "Radio" ? "text-red-400" : "text-text")}>{s.value}</div>
              <div className="text-[10px] text-text-muted">{s.detail}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-lg border border-accent/20 bg-accent/5 p-3 text-center">
          <span className="text-xs text-text-muted">Total estimated: </span>
          <span className="text-sm font-bold text-accent">{d.totalSpend}</span>
        </div>
      </div>

      <div>
        <h5 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Sector Competition</h5>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-4 gap-0 px-3 py-2 bg-bg-card border-b border-border">
            {["Dealer", "On-Air", "Spend", "Notes"].map((h) => (
              <span key={h} className="text-[10px] font-semibold uppercase text-text-muted">{h}</span>
            ))}
          </div>
          {d.competitors.map((c, i) => (
            <div key={i} className={cn("grid grid-cols-4 gap-0 px-3 py-2.5", i < d.competitors.length - 1 && "border-b border-border")}>
              <span className="text-xs text-text">{c.name}</span>
              <div className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", c.onAir ? "bg-green-400" : "bg-red-400")} />
                <span className={cn("text-xs", c.onAir ? "text-green-400" : "text-red-400")}>{c.onAir ? "Yes" : "No"}</span>
              </div>
              <span className="text-xs text-text-muted">{c.spend}</span>
              <span className="text-[11px] text-text-muted">{c.notes}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={14} className="text-blue-400" />
          <span className="text-xs font-bold uppercase text-blue-400">AI Insight</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-2">{d.insight}</p>
        <p className="text-xs text-text italic leading-relaxed">{d.recommendation}</p>
      </div>
    </div>
  );
}

function PresentationPanel() {
  const [building, setBuilding] = useState(false);
  const [builtSlides, setBuiltSlides] = useState(0);
  const [complete, setComplete] = useState(false);

  const startBuild = () => {
    setBuilding(true);
    setBuiltSlides(0);
    setComplete(false);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBuiltSlides(count);
      if (count >= mockPresentationSlides.length) {
        clearInterval(interval);
        setTimeout(() => setComplete(true), 500);
      }
    }, 800);
  };

  const slideIcons = [Radio, BarChart3, Play, Target, Zap, TrendingUp, DollarSign];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-text">Pitch Deck: Fitzgerald's Garage</h4>
          <p className="text-xs text-text-muted">7 slides, auto-generated from agent intelligence</p>
        </div>
        {!building && (
          <button onClick={startBuild} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Zap size={14} /> Build Presentation
          </button>
        )}
        {complete && (
          <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2">
            <CheckCircle2 size={14} className="text-accent" />
            <span className="text-xs font-semibold text-accent">Ready for review</span>
          </div>
        )}
      </div>

      {mockPresentationSlides.map((slide, i) => {
        const Icon = slideIcons[i];
        const built = i < builtSlides;
        const current = building && i === builtSlides && !complete;
        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-all duration-300",
              built ? "border-white/10 bg-white/[0.02]" : current ? "border-white/20 bg-white/[0.03]" : "border-border bg-bg-card",
              !building ? "opacity-50" : built || current ? "opacity-100" : "opacity-30"
            )}
          >
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", built ? "bg-white/10" : "bg-white/5")}>
              {built ? <CheckCircle2 size={16} className={slide.color} /> : current ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              ) : <Icon size={16} className="text-text-muted" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn("text-xs font-semibold", built ? "text-text" : "text-text-muted")}>Slide {i + 1}: {slide.title}</div>
              <div className={cn("text-[11px] truncate", built ? "text-text-muted" : "text-text-muted/50")}>{slide.desc}</div>
            </div>
            <span className="text-[10px] text-text-muted shrink-0">{built ? "Built" : current ? "Building..." : "Pending"}</span>
          </div>
        );
      })}
    </div>
  );
}

function DirectorPanel() {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div>
          <h4 className="text-base font-bold text-text">Sales Director Review</h4>
          <span className="text-xs text-amber-400">Fitzgerald's Garage — Pitch Deck</span>
        </div>
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-400/10">
            <span className="text-2xl font-extrabold text-amber-400">87</span>
          </div>
          <div className="text-[10px] text-text-muted mt-1">Quality Score</div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5">
        <CheckCircle2 size={16} className="text-accent" />
        <span className="text-sm font-semibold text-accent">Approved with notes</span>
      </div>

      {mockDirectorFeedback.map((f, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-border bg-bg-card p-3">
          <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5", f.type === "approve" ? "bg-green-500/10" : "bg-amber-500/10")}>
            {f.type === "approve" ? <CheckCircle2 size={13} className="text-green-400" /> : <AlertCircle size={13} className="text-amber-400" />}
          </div>
          <div>
            <div className={cn("text-[10px] font-bold uppercase", f.type === "approve" ? "text-green-400" : "text-amber-400")}>{f.type === "approve" ? "Approved" : "Suggestion"}</div>
            <p className="text-xs text-text-muted leading-relaxed mt-0.5">{f.text}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-bg hover:bg-accent-hover transition-colors">
          <CheckCircle2 size={15} /> Approve & Send to Rep
        </button>
        <button className="rounded-lg border border-amber-400 px-4 py-3 text-sm font-medium text-amber-400 hover:bg-amber-400/10 transition-colors">
          Request Changes
        </button>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */

interface SalesAssistantDemoProps {
  stationName: string;
}

export function SalesAssistantDemo({ stationName }: SalesAssistantDemoProps) {
  const [activeAgent, setActiveAgent] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<Set<number>>(new Set());

  const handleAgentClick = (i: number) => {
    setActiveAgent(i);
    const newCompleted = new Set(completedAgents);
    for (let j = 0; j < i; j++) newCompleted.add(j);
    setCompletedAgents(newCompleted);
  };

  const panels = [<ProspectorPanel key="p" />, <AnalystPanel key="a" />, <PresentationPanel key="pr" />, <DirectorPanel key="d" />];
  const colorClasses = ["text-accent border-accent/40 bg-accent/5", "text-blue-400 border-blue-400/40 bg-blue-400/5", "text-purple-400 border-purple-400/40 bg-purple-400/5", "text-amber-400 border-amber-400/40 bg-amber-400/5"];
  const dotColors = ["bg-accent", "bg-blue-400", "bg-purple-400", "bg-amber-400"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-text flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-blue-500">
              <Users size={18} className="text-white" />
            </div>
            Sales Assistant
            <span className="rounded-md bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">Preview</span>
          </h2>
          <p className="text-sm text-text-muted mt-1">AI-powered sales operations for every rep at {stationName}</p>
        </div>
      </div>

      {/* Agent pipeline + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agent cards */}
        <div className="space-y-2">
          <h5 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-3">Agent Pipeline</h5>
          {agents.map((a, i) => {
            const Icon = a.icon;
            const active = activeAgent === i;
            const completed = completedAgents.has(i);
            return (
              <div key={a.id}>
                <button
                  onClick={() => handleAgentClick(i)}
                  className={cn(
                    "w-full text-left rounded-xl border p-4 transition-all",
                    active ? cn(colorClasses[i], "scale-[1.02] shadow-lg") : completed ? "border-white/10 bg-bg-card opacity-80" : "border-border bg-bg-card opacity-70",
                    "hover:opacity-100"
                  )}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-white/10" : "bg-white/5")}>
                      {completed && !active ? <CheckCircle2 size={17} className={cn(dotColors[i].replace("bg-", "text-"))} /> : <Icon size={17} className={active ? cn(dotColors[i].replace("bg-", "text-")) : "text-text-muted"} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-text">{a.name}</div>
                      <div className={cn("text-[11px]", active ? cn(dotColors[i].replace("bg-", "text-")) : "text-text-muted")}>{a.tagline}</div>
                    </div>
                    {active && <span className={cn("h-2 w-2 rounded-full animate-pulse", dotColors[i])} />}
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">{a.desc}</p>
                </button>
                {i < agents.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ChevronDown size={14} className={completed ? cn(dotColors[i].replace("bg-", "text-")) : "text-white/10"} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Stats card */}
          <div className="rounded-xl border border-border bg-bg-card p-4 mt-4">
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-3">Rep Dashboard</h5>
            {[
              { label: "Prospects Found", value: "3", color: "text-accent" },
              { label: "Upsell Pipeline", value: "€4,800/mo", color: "text-blue-400" },
              { label: "Win-Back Revenue", value: "€26,400/yr", color: "text-amber-400" },
              { label: "Presentations Built", value: "1", color: "text-purple-400" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-text-muted">{s.label}</span>
                <span className={cn("text-sm font-bold", s.color)}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active panel */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-bg-card p-5 min-h-[500px]">
          <div className="flex items-center gap-2 mb-5">
            <span className={cn("h-2.5 w-2.5 rounded-full animate-pulse", dotColors[activeAgent])} />
            <span className={cn("text-base font-bold", dotColors[activeAgent].replace("bg-", "text-"))}>{agents[activeAgent].name}</span>
            <span className="text-xs text-text-muted">— {agents[activeAgent].tagline}</span>
          </div>
          {panels[activeAgent]}
        </div>
      </div>
    </div>
  );
}
