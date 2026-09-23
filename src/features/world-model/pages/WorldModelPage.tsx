import { useMemo, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { Button, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

type Assumption = {
  id: string;
  statement: string;
  confidence: number;
  evidence: number;
  state: "verified" | "learning" | "challenged";
};

const seedAssumptions: Assumption[] = [
  { id: "A-01", statement: "Mid-market teams are the highest-LTV segment.", confidence: 92, evidence: 18, state: "verified" },
  { id: "A-02", statement: "Activation friction is a bigger constraint than demand.", confidence: 87, evidence: 14, state: "verified" },
  { id: "A-03", statement: "Proof-first messaging outperforms feature-led creative.", confidence: 84, evidence: 9, state: "learning" },
  { id: "A-04", statement: "A 20% paid budget increase remains CAC-efficient.", confidence: 61, evidence: 6, state: "challenged" }
];

const causalEdges = [
  ["First integration connected", "Activation", "+34%", "High"],
  ["Proof-first creative", "Qualified CTR", "+31%", "High"],
  ["High-intent search coverage", "Pipeline", "+18%", "Medium"],
  ["Lifecycle intervention", "Expansion ARR", "+12%", "Medium"]
] as const;

export default function WorldModelPage() {
  const [assumptions, setAssumptions] = useState(seedAssumptions);
  const [researching, setResearching] = useState(false);
  const [draftMode, setDraftMode] = useState(false);

  const confidence = useMemo(
    () => Math.round(assumptions.reduce((sum, item) => sum + item.confidence, 0) / assumptions.length),
    [assumptions]
  );

  function challengeAssumption(id: string) {
    setAssumptions((items) =>
      items.map((item) => item.id === id ? { ...item, state: "challenged", confidence: Math.max(40, item.confidence - 12) } : item)
    );
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">BUSINESS WORLD MODEL</span>
          <h1>A living model of how your business actually grows.</h1>
          <p className="mt-3">
            GrowthOS continuously reconciles business facts, customer behavior, market evidence,
            channel economics, experiments and constraints. Assumptions remain explicit and challengeable.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setDraftMode((value) => !value)}>
            <Pencil size={16} /> {draftMode ? "Exit draft edit" : "Edit model draft"}
          </Button>
          <Button
            onClick={() => {
              setResearching(true);
              window.setTimeout(() => setResearching(false), 1200);
            }}
          >
            <RefreshCw className={researching ? "animate-spin" : ""} size={16} />
            {researching ? "Researching…" : "Refresh evidence"}
          </Button>
        </div>
      </header>

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Model confidence" value={confidence + "%"} detail="Evidence-weighted preview" icon={<BrainCircuit size={18} />} />
        <MetricCard label="Connected signals" value="148" detail="+12 this week" />
        <MetricCard label="Active assumptions" value={String(assumptions.length)} detail="1 currently challenged" />
        <MetricCard label="Verified causal links" value="27" detail="Experiment-backed" />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className="section-kicker">CURRENT BUSINESS TRUTH</span>
              <h2>Economic and strategic facts</h2>
            </div>
            <StatusBadge tone="success">Evidence linked</StatusBadge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Gross margin", "72%", "Finance + CRM"],
              ["Primary market", "US & India B2B SaaS", "Workspace profile"],
              ["Sales cycle", "34 days", "CRM opportunity history"],
              ["Priority segment", "Mid-market teams", "LTV + win rate"],
              ["Positioning", "Premium", "Pricing + market research"],
              ["Binding constraint", "Activation", "Funnel + experiment evidence"]
            ].map(([label, value, source]) => (
              <div key={label} className="rounded-xl border border-growth-line bg-slate-50/60 p-4">
                <span className="text-xs font-semibold text-growth-muted">{label}</span>
                <strong className="mt-1 block text-sm text-growth-ink">{value}</strong>
                <span className="mt-2 block text-xs text-slate-400">{source}</span>
              </div>
            ))}
          </div>

          {draftMode && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <strong className="text-sm text-amber-900">Draft editing mode</strong>
              <p className="mb-0 mt-1 text-xs text-amber-800">
                Frontend edits are staged only. They must be versioned and confirmed by the backend before becoming authoritative model facts.
              </p>
            </div>
          )}
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <Target className="text-violet-600" size={20} />
            <div>
              <span className="section-kicker">BINDING CONSTRAINT</span>
              <h2>Activation beats more traffic</h2>
            </div>
          </div>
          <p>
            The model estimates that improving visitor-to-qualified-lead conversion has 2.4× the
            contribution-profit impact of adding equivalent paid traffic at current acquisition costs.
          </p>

          <div className="mt-5 grid gap-3">
            {[
              ["Improve qualified CVR by 0.6pt", "+$69K", "Low risk", "success"],
              ["Scale paid media by 20%", "+$71K", "Medium risk", "warning"],
              ["Expand lifecycle coverage", "+$48K", "Low risk", "success"]
            ].map(([action, value, risk, tone]) => (
              <div key={action} className="flex items-center justify-between gap-3 rounded-lg border border-growth-line p-3">
                <div>
                  <strong className="block text-sm">{action}</strong>
                  <span className="text-xs text-growth-muted">{value} modeled pipeline</span>
                </div>
                <StatusBadge tone={tone as "success" | "warning"}>{risk}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className="section-kicker">ASSUMPTION LEDGER</span>
              <h2>What the AI believes—and how strongly</h2>
            </div>
            <StatusBadge tone="accent">Explicit uncertainty</StatusBadge>
          </div>

          <div className="grid gap-3">
            {assumptions.map((item) => (
              <div key={item.id} className="rounded-xl border border-growth-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{item.id}</span>
                      <StatusBadge tone={item.state === "verified" ? "success" : item.state === "challenged" ? "danger" : "accent"}>
                        {item.state}
                      </StatusBadge>
                    </div>
                    <strong className="mt-2 block text-sm text-growth-ink">{item.statement}</strong>
                    <span className="mt-1 block text-xs text-growth-muted">{item.evidence} evidence references</span>
                  </div>
                  <div className="text-right">
                    <strong className="block text-lg">{item.confidence}%</strong>
                    <span className="text-xs text-growth-muted">confidence</span>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-violet-500" style={{ width: item.confidence + "%" }} />
                </div>

                {item.state !== "challenged" && (
                  <button type="button" className="mt-3 text-xs font-semibold text-violet-700" onClick={() => challengeAssumption(item.id)}>
                    Challenge assumption
                  </button>
                )}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <GitBranch className="text-violet-600" size={20} />
            <div>
              <span className="section-kicker">MARKETING CAUSAL GRAPH</span>
              <h2>Verified relationships</h2>
            </div>
          </div>

          <div className="grid gap-3">
            {causalEdges.map(([cause, outcome, lift, confidence]) => (
              <div key={cause} className="rounded-xl border border-growth-line p-3">
                <div className="flex items-center gap-2 text-xs text-growth-muted">
                  <span>{cause}</span>
                  <span aria-hidden="true">→</span>
                  <span>{outcome}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <strong className="text-sm text-emerald-700">{lift}</strong>
                  <StatusBadge tone={confidence === "High" ? "success" : "warning"}>{confidence} evidence</StatusBadge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-violet-700" size={17} />
              <strong className="text-sm text-violet-900">Next learning priority</strong>
            </div>
            <p className="mb-0 mt-1 text-xs text-violet-800">
              Verify whether paid-social assisted demand remains incremental after controlling for branded search lift.
            </p>
          </div>
        </Panel>
      </section>

      <Panel className="p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 text-emerald-700" size={20} />
          <div>
            <strong className="text-sm">Model governance</strong>
            <p className="mb-0 mt-1 text-xs text-growth-muted">
              World Model updates are evidence-linked, versioned and reviewable. Unknown or low-confidence assumptions remain visible rather than being silently promoted to fact.
            </p>
          </div>
        </div>
      </Panel>
    </>
  );
}
