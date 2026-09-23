import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Eye,
  GitBranch,
  Play,
  Radar,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import { GoalBuilder } from "../components/GoalBuilder";
import type { CmoGoalInput } from "../schemas/goal.schema";
import { Button, EvidenceViewer, MetricCard, Panel, Recommendation, StatusBadge } from "../../../shared/ui";
import { useAccessScope } from "../../workspace/hooks/useAccessScope";
import { DecisionJourney, GovernedExecutionLegend } from "../../../compositions/governed-execution/DecisionJourney";
import { decisionBelongsToScope, useGovernedExecutionStore } from "../../../compositions/governed-execution/store";

const initialGoal: CmoGoalInput = {
  objective: "Grow qualified pipeline without increasing blended CAC",
  metric: "qualified_pipeline",
  targetValue: "$4.4M qualified pipeline",
  horizonDays: 90,
  maxCac: 420,
  spendCeiling: 180000,
  riskTolerance: "balanced",
  approvalPolicy: "governed"
};

const planSteps = [
  {
    id: "OBSERVE",
    title: "Observe",
    detail: "Refresh revenue, customer, market, campaign and product evidence.",
    state: "completed",
    icon: Eye
  },
  {
    id: "UNDERSTAND",
    title: "Understand",
    detail: "Reconcile the World Model and identify the current binding constraint.",
    state: "completed",
    icon: BrainCircuit
  },
  {
    id: "PREDICT",
    title: "Predict",
    detail: "Estimate expected impact, downside, confidence and time-to-result.",
    state: "completed",
    icon: TrendingUp
  },
  {
    id: "DECIDE",
    title: "Decide",
    detail: "Rank strategies by incremental profit, confidence, effort and risk.",
    state: "active",
    icon: GitBranch
  },
  {
    id: "SIMULATE",
    title: "Simulate",
    detail: "Test candidate strategies against the Growth Digital Twin.",
    state: "queued",
    icon: Radar
  },
  {
    id: "APPROVE",
    title: "Approve",
    detail: "Route money, publishing, customer contact and irreversible actions to humans.",
    state: "queued",
    icon: BadgeCheck
  },
  {
    id: "EXECUTE",
    title: "Execute",
    detail: "Dispatch approved work to specialist agents and connected systems.",
    state: "queued",
    icon: Play
  },
  {
    id: "MEASURE",
    title: "Measure",
    detail: "Compare forecast with verified revenue, profit and customer outcomes.",
    state: "queued",
    icon: CircleDollarSign
  },
  {
    id: "LEARN",
    title: "Learn & correct",
    detail: "Write evidence-backed learning to memory and update the next decision cycle.",
    state: "queued",
    icon: RefreshCw
  }
] as const;

const strategies = [
  {
    name: "Intent capture reallocation",
    reason: "High-intent search continues to produce the strongest qualified-pipeline efficiency.",
    forecast: "+$182K",
    confidence: "91%",
    investment: "$24K shifted",
    risk: "Medium",
    approval: "Budget change"
  },
  {
    name: "Activation proof sequence",
    reason: "The World Model currently identifies activation friction as the strongest constraint after acquisition.",
    forecast: "+$96K",
    confidence: "86%",
    investment: "$8K",
    risk: "Low",
    approval: "External publish"
  },
  {
    name: "Expansion-risk intervention",
    reason: "27 high-value accounts show declining engagement while remaining above product-fit threshold.",
    forecast: "+$41K ARR",
    confidence: "79%",
    investment: "$3K",
    risk: "Medium",
    approval: "Customer contact"
  }
] as const;

export default function AiCmoPage() {
  const navigate = useNavigate();
  const accessScope = useAccessScope();
  const governedDecision = useGovernedExecutionStore((state) => state.current);
  const stageProposal = useGovernedExecutionStore((state) => state.stageProposal);
  const [goal, setGoal] = useState(initialGoal);
  const [goalBuilderOpen, setGoalBuilderOpen] = useState(false);
  const [researching, setResearching] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(0);

  const governedActionCount = useMemo(() => strategies.length, []);
  const selected = strategies[selectedStrategy] ?? strategies[0];
  const activeDecision =
    decisionBelongsToScope(governedDecision, accessScope) ? governedDecision : null;

  function simulateSelectedStrategy() {
    if (!accessScope || !selected) return;

    stageProposal(accessScope, {
      title: selected.name,
      goal: goal.objective,
      rationale: selected.reason,
      forecast: selected.forecast,
      confidence: Number(selected.confidence.replace("%", "")),
      risk: selected.risk,
      approvalReason: selected.approval,
      evidenceRefs: ["crm-quality", "channel-economics", "world-model"]
    });

    navigate("/digital-twin");
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">AUTONOMOUS MARKETING EXECUTIVE</span>
          <h1>AI CMO</h1>
          <p className="mt-3 max-w-3xl">
            Give GrowthOS a business outcome. The AI CMO observes the business, updates its World Model,
            predicts opportunities, selects strategies, simulates consequences and prepares governed execution.
            Humans retain authority over spend, brand, customer contact, policy and irreversible actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setResearching(true);
              window.setTimeout(() => setResearching(false), 1200);
            }}
          >
            <RefreshCw className={researching ? "animate-spin" : ""} size={16} />
            {researching ? "Refreshing evidence…" : "Refresh evidence"}
          </Button>
          <Button onClick={() => setGoalBuilderOpen(true)}>
            <Target size={16} />
            Set business goal
          </Button>
        </div>
      </header>

      {goalBuilderOpen ? (
        <GoalBuilder
          onClose={() => setGoalBuilderOpen(false)}
          onSave={(nextGoal) => {
            setGoal(nextGoal);
            setGoalBuilderOpen(false);
          }}
        />
      ) : null}

      <section className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Goal horizon" value={goal.horizonDays + " days"} detail={goal.targetValue} icon={<Clock3 size={18} />} />
        <MetricCard label="Maximum CAC" value={"$" + goal.maxCac.toLocaleString()} detail="Hard operating constraint" icon={<ShieldCheck size={18} />} />
        <MetricCard label="Spend ceiling" value={"$" + goal.spendCeiling.toLocaleString()} detail="Monthly maximum" icon={<CircleDollarSign size={18} />} />
        <MetricCard label="Governed actions" value={String(governedActionCount)} detail="Require human authority" icon={<BadgeCheck size={18} />} />
      </section>

      {activeDecision ? (
        <Panel className="mb-4 p-4">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="type-overline text-slate-400">GOVERNED DECISION JOURNEY</span>
              <h2 className="mt-1">{activeDecision.title}</h2>
              <p className="mb-0 mt-1 max-w-3xl type-body text-growth-muted">
                This is a frontend workflow artifact for the current workspace. It does not represent external execution.
              </p>
            </div>
            <StatusBadge tone="accent">{activeDecision.stage.replaceAll("_", " ")}</StatusBadge>
          </div>
          <DecisionJourney stage={activeDecision.stage} />
          <div className="mt-3"><GovernedExecutionLegend /></div>
        </Panel>
      ) : null}

      <Panel className="mb-4 overflow-hidden">
        <div className="grid gap-4 border-b border-growth-line bg-slate-50/70 p-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <span className="section-kicker">ACTIVE BUSINESS OBJECTIVE</span>
            <h2 className="type-title max-w-4xl">{goal.objective}</h2>
            <p className="mb-0 mt-2 max-w-3xl">
              Primary metric: <strong>{goal.metric.replaceAll("_", " ")}</strong> · target{" "}
              <strong>{goal.targetValue}</strong> · risk tolerance{" "}
              <strong className="capitalize">{goal.riskTolerance}</strong>.
            </p>
          </div>
          <StatusBadge tone="success"><CheckCircle2 size={13} /> Governed execution</StatusBadge>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-3 xl:grid-cols-9">
          {planSteps.map((step) => {
            const Icon = step.icon;
            const tone =
              step.state === "completed"
                ? "border-emerald-200 bg-emerald-50"
                : step.state === "active"
                  ? "border-violet-300 bg-violet-50 shadow-sm"
                  : "border-growth-line bg-white";
            return (
              <article key={step.id} className={"rounded-xl border p-3 " + tone}>
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-violet-700 shadow-sm">
                    <Icon size={16} />
                  </span>
                  <span className="type-overline text-slate-400">{step.id}</span>
                </div>
                <strong className="mt-3 block text-sm text-growth-ink">{step.title}</strong>
                <p className="mb-0 mt-1 text-xs leading-5">{step.detail}</p>
              </article>
            );
          })}
        </div>
      </Panel>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <Panel className="p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="section-kicker">STRATEGY RANKING</span>
              <h2>What the AI CMO recommends next</h2>
              <p className="mb-0 mt-1 max-w-2xl text-sm">
                Recommendations remain proposals until simulation, policy evaluation and the required approval path complete.
              </p>
            </div>
            <StatusBadge tone="accent"><Sparkles size={13} /> Evidence weighted</StatusBadge>
          </div>

          <div className="grid gap-2">
            {strategies.map((strategy, index) => (
              <button
                key={strategy.name}
                type="button"
                onClick={() => setSelectedStrategy(index)}
                aria-pressed={selectedStrategy === index}
                className={[
                  "w-full rounded-xl border p-4 text-left transition",
                  selectedStrategy === index
                    ? "border-violet-300 bg-violet-50"
                    : "border-growth-line bg-white hover:border-slate-300"
                ].join(" ")}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="type-overline text-slate-400">STRATEGY {String(index + 1).padStart(2, "0")}</span>
                    <strong className="mt-1 block text-sm text-growth-ink">{strategy.name}</strong>
                  </div>
                  <strong className="metric-number text-lg text-emerald-700">{strategy.forecast}</strong>
                </div>
                <p className="mb-0 mt-2 text-xs leading-5">{strategy.reason}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge tone="success">Confidence {strategy.confidence}</StatusBadge>
                  <StatusBadge tone="neutral">{strategy.investment}</StatusBadge>
                  <StatusBadge tone={strategy.risk === "Low" ? "success" : "warning"}>{strategy.risk} risk</StatusBadge>
                  <StatusBadge tone="warning">Approval: {strategy.approval}</StatusBadge>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <span className="section-kicker">DECISION BRIEF</span>
          <h2>{selected.name}</h2>
          <p className="mt-2">
            The AI CMO is not claiming execution. This surface explains the proposal that will be simulated
            and, where required, placed into the Human Approval Center.
          </p>

          <div className="mt-4 grid gap-4">
            <Recommendation
              title={selected.name}
              rationale={selected.reason}
              confidence={Number(selected.confidence.replace("%", ""))}
              impact={selected.forecast}
            >
              <StatusBadge tone="warning">
                Approval: {selected.approval}
              </StatusBadge>
            </Recommendation>

            <EvidenceViewer
              title="Evidence used for this recommendation"
              items={[
                {
                  id: "crm-quality",
                  label: "Opportunity quality",
                  source: "CRM + Revenue Intelligence",
                  detail: "Pipeline quality, close rates and realized revenue are reconciled before strategy ranking.",
                  confidence: 94
                },
                {
                  id: "channel-economics",
                  label: "Channel economics",
                  source: "Campaigns + Attribution",
                  detail: "Paid-search efficiency and saturation signals are compared against the active CAC boundary.",
                  confidence: 91
                },
                {
                  id: "world-model",
                  label: "Business constraints",
                  source: "Business World Model",
                  detail: "Margin, positioning, sales-cycle and activation assumptions constrain the proposed action."
                }
              ]}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
              <div>
                <span className="type-overline text-violet-500">NEXT GOVERNED STEP</span>
                <strong className="mt-1 block text-sm text-violet-950">Simulate this recommendation before any approval or execution.</strong>
                <p className="mb-0 mt-1 type-caption text-violet-800">
                  GrowthOS will carry the goal, evidence, forecast, confidence and approval reason into the Digital Twin.
                </p>
              </div>
              <Button onClick={simulateSelectedStrategy} disabled={!accessScope}>
                <Radar size={16} /> Simulate selected strategy
              </Button>
            </div>

            <div className="rounded-xl border border-growth-line bg-slate-50/70 p-3">
              <span className="type-overline text-slate-400">RECEIPT CONTRACT</span>
              <p className="mb-0 mt-1 text-xs leading-5 text-growth-ink">
                A future decision receipt binds evidence, forecast, policy verdict, actor identity,
                approval state, execution confirmation, verified outcome and the learning written back to memory.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-amber-700" size={17} />
              <strong className="text-sm text-amber-950">Human authority remains explicit</strong>
            </div>
            <p className="mb-0 mt-2 text-xs leading-5 text-amber-900">
              Research, analysis, forecasting and drafting may proceed automatically. Budget, bid/spend,
              publishing, new customer communication, production changes and destructive actions stay governed.
            </p>
          </div>
        </Panel>
      </section>
    </>
  );
}
