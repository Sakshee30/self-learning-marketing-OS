import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Gauge,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import { Button, FormField, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";
import { formatCurrency } from "../../../shared/i18n/format";
import { useAccessScope } from "../../workspace/hooks/useAccessScope";
import { DecisionJourney, GovernedExecutionLegend } from "../../../compositions/governed-execution/DecisionJourney";
import { decisionBelongsToScope, useGovernedExecutionStore } from "../../../compositions/governed-execution/store";

type Scenario = {
  name: string;
  pipeline: number;
  incrementalSpend: number;
  risk: "Low" | "Medium" | "High";
  confidence: number;
  approvalRequired: boolean;
};

function money(value: number) {
  return formatCurrency(Math.round(value), "USD");
}

export default function DigitalTwinPage() {
  const navigate = useNavigate();
  const accessScope = useAccessScope();
  const governedDecision = useGovernedExecutionStore((state) => state.current);
  const attachSimulation = useGovernedExecutionStore((state) => state.attachSimulation);
  const requireApproval = useGovernedExecutionStore((state) => state.requireApproval);
  const [budgetChange, setBudgetChange] = useState(20);
  const [conversionLift, setConversionLift] = useState(0.6);
  const [lifecycleLift, setLifecycleLift] = useState(18);
  const [submitted, setSubmitted] = useState(false);

  const scenarios = useMemo<Scenario[]>(() => {
    const paidPipeline = 52000 + budgetChange * 950;
    const cvrPipeline = 41000 + conversionLift * 47000;
    const lifecyclePipeline = 30000 + lifecycleLift * 1000;

    return [
      {
        name: "Scale paid media",
        pipeline: paidPipeline,
        incrementalSpend: Math.max(0, budgetChange) * 2100,
        risk: budgetChange > 25 ? "High" : budgetChange > 12 ? "Medium" : "Low",
        confidence: 82,
        approvalRequired: budgetChange !== 0
      },
      {
        name: "Improve qualified conversion",
        pipeline: cvrPipeline,
        incrementalSpend: 25000,
        risk: "Low",
        confidence: 88,
        approvalRequired: true
      },
      {
        name: "Expand lifecycle coverage",
        pipeline: lifecyclePipeline,
        incrementalSpend: 11000,
        risk: "Low",
        confidence: 86,
        approvalRequired: true
      }
    ];
  }, [budgetChange, conversionLift, lifecycleLift]);

  const best = useMemo(
    () => [...scenarios].sort((a, b) => (b.pipeline - b.incrementalSpend) - (a.pipeline - a.incrementalSpend))[0],
    [scenarios]
  );

  const activeDecision =
    decisionBelongsToScope(governedDecision, accessScope) ? governedDecision : null;

  function sendBestScenarioToApproval() {
    if (!accessScope || !activeDecision || !best || !submitted) return;

    attachSimulation(activeDecision.id, accessScope, {
      scenarioName: best.name,
      modeledPipeline: best.pipeline,
      incrementalSpend: best.incrementalSpend,
      confidence: best.confidence,
      risk: best.risk,
      approvalRequired: best.approvalRequired,
      simulatedAt: new Date().toISOString()
    });

    requireApproval(activeDecision.id, accessScope);
    navigate("/approvals");
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">GROWTH DIGITAL TWIN</span>
          <h1>Simulate business decisions before spending real money.</h1>
          <p className="mt-3">
            Compare strategies against a modeled version of the business using current economics,
            customer behavior, capacity and causal evidence. A simulation is a forecast—not an execution.
          </p>
        </div>
        <Button onClick={() => setSubmitted(true)}><Play size={16} /> Run scenario set</Button>
      </header>

      {activeDecision ? (
        <Panel className="mb-4 p-4">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="type-overline text-slate-400">STRATEGY FROM AI CMO</span>
              <h2 className="mt-1">{activeDecision.title}</h2>
              <p className="mb-0 mt-1 max-w-3xl type-body text-growth-muted">
                Goal: {activeDecision.goal}. Forecast: {activeDecision.forecast}. Approval trigger: {activeDecision.approvalReason}.
              </p>
            </div>
            <StatusBadge tone="warning">{activeDecision.risk} risk</StatusBadge>
          </div>
          <DecisionJourney stage={activeDecision.stage} />
          <div className="mt-3"><GovernedExecutionLegend /></div>
        </Panel>
      ) : (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <strong className="text-sm text-growth-ink">Standalone simulation mode</strong>
          <p className="mb-0 mt-1 type-caption text-growth-muted">
            Open a recommendation from AI CMO to bind this simulation to a governed decision journey.
          </p>
        </div>
      )}

      {submitted && (
        <div className="mb-4 flex items-start justify-between gap-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div>
            <strong className="text-sm text-violet-900">Simulation refreshed</strong>
            <p className="mb-0 mt-1 text-xs text-violet-800">
              The current inputs were evaluated locally for this frontend preview. No budget, campaign,
              website or customer action was changed.
            </p>
          </div>
          <StatusBadge tone="accent">Simulation only</StatusBadge>
        </div>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Forecast accuracy" value="87%" detail="+2.1 pts vs prior quarter" icon={<Gauge size={18} />} />
        <MetricCard label="Scenarios modeled" value="28" detail="+6 this week" />
        <MetricCard label="Risk avoided" value="$118K" detail="Rejected or revised plans" />
        <MetricCard label="Model freshness" value="8m" detail="Revenue + channel evidence" />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="h-fit p-5">
          <div className="mb-5 flex items-center gap-3">
            <SlidersHorizontal className="text-violet-700" size={20} />
            <div>
              <span className="section-kicker">SCENARIO INPUTS</span>
              <h2>Adjust the levers</h2>
            </div>
          </div>

          <div className="grid gap-5">
            <FormField
              label="Paid-media budget change (%)"
              description="Positive values increase spend; negative values reduce it."
            >
              {({ inputId, descriptionId }) => (
                <Input
                  id={inputId}
                  type="number"
                  min={-50}
                  max={100}
                  value={budgetChange}
                  aria-describedby={descriptionId}
                  onChange={(event) => setBudgetChange(Number(event.target.value))}
                />
              )}
            </FormField>

            <FormField label="Qualified conversion lift (points)">
              {({ inputId }) => (
                <Input
                  id={inputId}
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={conversionLift}
                  onChange={(event) => setConversionLift(Number(event.target.value))}
                />
              )}
            </FormField>

            <FormField label="Lifecycle coverage increase (%)">
              {({ inputId }) => (
                <Input
                  id={inputId}
                  type="number"
                  min={0}
                  max={100}
                  value={lifecycleLift}
                  onChange={(event) => setLifecycleLift(Number(event.target.value))}
                />
              )}
            </FormField>
          </div>

          <div className="mt-5 rounded-xl border border-growth-line bg-slate-50 p-4">
            <strong className="text-sm">Current evidence basis</strong>
            <ul className="mb-0 mt-2 grid gap-1.5 pl-4 text-xs leading-5 text-growth-muted">
              <li>Revenue and margin history</li>
              <li>Attribution + incrementality evidence</li>
              <li>Customer conversion and lifecycle behavior</li>
              <li>Campaign saturation and channel capacity</li>
            </ul>
          </div>
        </Panel>

        <div className="grid gap-4">
          <Panel className="p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="section-kicker">STRATEGY COMPARISON</span>
                <h2>Modeled impact</h2>
              </div>
              <StatusBadge tone="success">Evidence-weighted</StatusBadge>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {scenarios.map((scenario) => {
                const isBest = scenario.name === best?.name;
                return (
                  <article
                    key={scenario.name}
                    className={[
                      "rounded-xl border p-4",
                      isBest ? "border-violet-300 bg-violet-50" : "border-growth-line bg-white"
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-sm">{scenario.name}</strong>
                      {isBest ? <StatusBadge tone="accent">Best net impact</StatusBadge> : null}
                    </div>
                    <div className="mt-4 grid gap-3">
                      <div>
                        <span className="text-xs text-growth-muted">Modeled pipeline</span>
                        <strong className="mt-1 block text-xl">{money(scenario.pipeline)}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-white/70 p-2.5">
                          <span className="text-xs text-growth-muted">Spend</span>
                          <strong className="mt-1 block text-xs">{money(scenario.incrementalSpend)}</strong>
                        </div>
                        <div className="rounded-lg bg-white/70 p-2.5">
                          <span className="text-xs text-growth-muted">Confidence</span>
                          <strong className="mt-1 block text-xs">{scenario.confidence}%</strong>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <StatusBadge tone={scenario.risk === "Low" ? "success" : scenario.risk === "Medium" ? "warning" : "danger"}>
                        {scenario.risk} risk
                      </StatusBadge>
                      <span className="text-xs text-growth-muted">
                        {scenario.approvalRequired ? "Approval required" : "Within envelope"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="text-violet-700" size={19} />
                  <span className="section-kicker mb-0">AI CMO INTERPRETATION</span>
                </div>
                <h2 className="mt-2">Improve conversion before scaling spend.</h2>
                <p>
                  At the current assumptions, conversion improvement produces comparable pipeline with
                  materially lower incremental spend and less channel-saturation risk. Paid scaling remains
                  viable after the conversion intervention is verified.
                </p>

                <div className="mt-4 grid gap-2">
                  {[
                    ["Evidence", "14 connected signals + 3 causal experiments"],
                    ["Primary uncertainty", "Mobile pricing-page response"],
                    ["Reversibility", "High for CRO experiment; medium for budget shift"],
                    ["Next validation", "Run pricing hierarchy experiment with holdout"]
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-1 rounded-lg border border-growth-line p-3 sm:grid-cols-[150px_1fr]">
                      <span className="text-xs font-semibold text-growth-muted">{label}</span>
                      <strong className="text-xs text-growth-ink">{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-amber-700" size={18} />
                  <strong className="text-sm text-amber-900">Governance</strong>
                </div>
                <p className="mb-0 mt-2 text-xs leading-5 text-amber-800">
                  Sending a scenario to execution creates an approval intent. The simulation itself never
                  authorizes spend, publishing, customer contact or production changes.
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="secondary"
                  disabled={!activeDecision || !submitted}
                  onClick={sendBestScenarioToApproval}
                >
                  Send best scenario to Approval Center <ArrowRight size={15} />
                </Button>
              </aside>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-start gap-3">
              <BrainCircuit className="mt-0.5 text-violet-700" size={20} />
              <div>
                <strong className="text-sm">Simulation memory</strong>
                <p className="mb-0 mt-1 text-xs text-growth-muted">
                  When the backend is connected, forecasts, assumptions, approval intent and actual outcomes
                  will be linked through decision receipts so forecast accuracy can be measured instead of assumed.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
}
