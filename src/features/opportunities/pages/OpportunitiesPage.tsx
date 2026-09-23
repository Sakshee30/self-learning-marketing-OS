import { useMemo, useState } from "react";
import { ArrowRight, Filter, Lightbulb, Play, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Button, MetricCard, Panel, Select, StatusBadge } from "../../../shared/ui";

type Opportunity = {
  id: string;
  name: string;
  domain: string;
  value: number;
  confidence: number;
  effort: "Low" | "Medium" | "High";
  risk: "Low" | "Medium" | "High";
  reversibility: "High" | "Medium" | "Low";
  timeToImpact: string;
  state: "Ready to simulate" | "Drafting" | "Running" | "Needs approval";
};

const seed: Opportunity[] = [
  { id: "OP-018", name: "Expand high-intent non-brand search", domain: "Paid growth", value: 62000, confidence: 88, effort: "Low", risk: "Medium", reversibility: "High", timeToImpact: "7–14 days", state: "Needs approval" },
  { id: "OP-017", name: "Build GEO comparison landing-page cluster", domain: "SEO & GEO", value: 47000, confidence: 84, effort: "Medium", risk: "Low", reversibility: "High", timeToImpact: "30–60 days", state: "Drafting" },
  { id: "OP-016", name: "Expand lifecycle program for high-LTV accounts", domain: "Lifecycle", value: 39000, confidence: 91, effort: "Low", risk: "Low", reversibility: "High", timeToImpact: "14–30 days", state: "Running" },
  { id: "OP-015", name: "Test pricing-page proof hierarchy", domain: "CRO", value: 31000, confidence: 79, effort: "Medium", risk: "Low", reversibility: "High", timeToImpact: "14 days", state: "Ready to simulate" },
  { id: "OP-014", name: "Refresh fatigued proof-led Meta creative", domain: "Creative", value: 24000, confidence: 86, effort: "Low", risk: "Low", reversibility: "High", timeToImpact: "7 days", state: "Ready to simulate" }
];

function money(value: number) {
  return "$" + value.toLocaleString();
}

export default function OpportunitiesPage() {
  const [riskFilter, setRiskFilter] = useState("All");
  const [selected, setSelected] = useState<Opportunity>(seed[0]!);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  const ranked = useMemo(
    () => seed
      .filter((item) => riskFilter === "All" || item.risk === riskFilter)
      .sort((a, b) => (b.value * b.confidence) - (a.value * a.confidence)),
    [riskFilter]
  );

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">AI OPPORTUNITY ENGINE</span>
          <h1>Growth Opportunities</h1>
          <p className="mt-3">
            Rank growth moves by expected incremental value, confidence, effort, risk, reversibility and time-to-impact.
            The system recommends what to investigate next without confusing a forecast with confirmed revenue.
          </p>
        </div>
        <Button><Sparkles size={16} /> Find new opportunities</Button>
      </header>

      {simulationNotice && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <p className="mb-0 text-xs text-violet-900">{simulationNotice}</p>
          <button className="text-xs font-semibold text-violet-700" onClick={() => setSimulationNotice(null)}>Dismiss</button>
        </div>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Open opportunity value" value="$486K" detail="+$74K newly detected" icon={<Target size={18} />} />
        <MetricCard label="High-confidence" value="12" detail="Confidence ≥ 85%" />
        <MetricCard label="In execution" value="7" detail="4 within approved envelope" />
        <MetricCard label="Awaiting approval" value="4" detail="Material actions governed" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_400px]">
        <Panel className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="section-kicker">RANKED BACKLOG</span>
              <h2>Highest-value next moves</h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <Select aria-label="Filter opportunity risk" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
                <option>All</option><option>Low</option><option>Medium</option><option>High</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            {ranked.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelected(item)}
                className={[
                  "grid gap-3 rounded-xl border p-4 text-left transition lg:grid-cols-[42px_minmax(0,1fr)_90px_100px_120px]",
                  selected.id === item.id ? "border-violet-300 bg-violet-50" : "border-growth-line bg-white hover:border-slate-300"
                ].join(" ")}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{index + 1}</span>
                <span>
                  <strong className="block text-sm text-growth-ink">{item.name}</strong>
                  <span className="mt-1 block text-xs text-growth-muted">{item.domain} · {item.timeToImpact}</span>
                </span>
                <span><small className="block text-xs text-growth-muted">Value</small><strong className="text-sm">{money(item.value)}</strong></span>
                <span><small className="block text-xs text-growth-muted">Confidence</small><strong className="text-sm">{item.confidence}%</strong></span>
                <StatusBadge tone={item.state === "Running" ? "success" : item.state === "Needs approval" ? "warning" : "accent"}>{item.state}</StatusBadge>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-violet-700" size={19} />
            <span className="section-kicker mb-0">OPPORTUNITY DETAIL</span>
          </div>
          <h2 className="mt-3">{selected.name}</h2>
          <p>
            GrowthOS found this by reconciling channel saturation, conversion quality, revenue evidence and the current CAC boundary.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["Expected value", money(selected.value)],
              ["Confidence", selected.confidence + "%"],
              ["Effort", selected.effort],
              ["Risk", selected.risk],
              ["Reversibility", selected.reversibility],
              ["Time to impact", selected.timeToImpact]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <span className="text-xs text-growth-muted">{label}</span>
                <strong className="mt-1 block text-xs">{value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-700" /><strong className="text-xs text-emerald-900">Policy path</strong></div>
            <p className="mb-0 mt-1 text-xs text-emerald-800">
              Research and simulation are autonomous. Spend, publishing or customer-impact execution will create an approval request when required.
            </p>
          </div>

          <Button
            className="mt-4 w-full"
            onClick={() => setSimulationNotice(selected.name + " was sent to the Digital Twin preview. No execution has occurred.")}
          >
            <Play size={15} /> Simulate opportunity <ArrowRight size={15} />
          </Button>
        </Panel>
      </section>
    </>
  );
}
