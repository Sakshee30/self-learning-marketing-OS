import { useMemo, useState } from "react";
import { Plus, Radar, Search, Sparkles } from "lucide-react";
import { Button, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

const competitors = [
  ["EasyInsights", "Unified marketing analytics", "Automation + attribution", "Medium", "Today"],
  ["HubSpot", "CRM-led growth platform", "AI campaign workflows", "High", "Today"],
  ["Adobe", "Enterprise experience cloud", "GenAI + orchestration", "Medium", "2d ago"],
  ["Salesforce", "CRM + Data Cloud", "Agentic marketing", "High", "Today"],
  ["Hightouch", "Composable CDP", "AI decisioning", "Medium", "1d ago"]
] as const;

const signals = [
  ["Category messaging", "AI automation claims are converging across vendors.", "High"],
  ["Pricing", "Annual-plan discounting increased across mid-market competitors.", "Medium"],
  ["Creative", "Proof-led customer outcome stories are rising in paid social.", "High"],
  ["Search", "Demand is shifting from 'marketing analytics' toward 'AI marketing automation'.", "High"]
] as const;

export default function MarketPage() {
  const [query, setQuery] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [previewCompetitors, setPreviewCompetitors] = useState<string[]>([]);

  const visible = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return competitors;
    return competitors.filter((row) => row.some((cell) => cell.toLowerCase().includes(value)));
  }, [query]);

  function addCompetitor() {
    const value = newCompetitor.trim();
    if (!value || previewCompetitors.includes(value)) return;
    setPreviewCompetitors((current) => [value, ...current]);
    setNewCompetitor("");
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">MARKET INTELLIGENCE</span>
          <h1>Market & Competitors</h1>
          <p className="mt-3">
            Track category demand, competitor positioning, pricing, offers, creative patterns, search visibility and emerging customer language so strategy reacts to evidence rather than periodic research decks.
          </p>
        </div>
      </header>

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Competitors tracked" value={String(24 + previewCompetitors.length)} detail="+2 verified this month" icon={<Radar size={18} />} />
        <MetricCard label="Market signals / week" value="1,482" detail="+18% source coverage" />
        <MetricCard label="Strategic changes" value="7" detail="3 high priority" />
        <MetricCard label="Search share change" value="+4.2 pts" detail="Commercial intent set" />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div><span className="section-kicker">COMPETITIVE MAP</span><h2>Tracked companies</h2></div>
            <div className="relative w-full md:w-72"><Search className="absolute left-3 top-3 text-slate-400" size={16} /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search competitors…" /></div>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Company</th><th>Positioning</th><th>Observed focus</th><th>Priority</th><th>Freshness</th></tr></thead>
              <tbody>
                {previewCompetitors.map((name) => <tr key={name}><td><strong>{name}</strong></td><td>Research pending</td><td>Queued</td><td><StatusBadge tone="neutral">Unverified</StatusBadge></td><td>Preview</td></tr>)}
                {visible.map(([name, positioning, focus, priority, freshness]) => (
                  <tr key={name}><td><strong>{name}</strong></td><td>{positioning}</td><td>{focus}</td><td><StatusBadge tone={priority === "High" ? "warning" : "neutral"}>{priority}</StatusBadge></td><td>{freshness}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="h-fit p-5">
          <span className="section-kicker">ADD RESEARCH TARGET</span><h2>Track a competitor</h2>
          <p>Adding a name creates a research target only. It does not invent verified facts until evidence is collected.</p>
          <Input value={newCompetitor} onChange={(event) => setNewCompetitor(event.target.value)} placeholder="Competitor name" />
          <Button className="mt-3 w-full" onClick={addCompetitor}><Plus size={15} /> Add research target</Button>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_.85fr]">
        <Panel className="p-5">
          <span className="section-kicker">LIVE MARKET SIGNALS</span><h2>What changed</h2>
          <div className="mt-4 grid gap-3">{signals.map(([area, insight, priority]) => (
            <div key={area} className="rounded-xl border border-growth-line p-4">
              <div className="flex items-start justify-between gap-3"><strong className="text-sm">{area}</strong><StatusBadge tone={priority === "High" ? "warning" : "neutral"}>{priority}</StatusBadge></div>
              <p className="mb-0 mt-2 text-xs">{insight}</p>
            </div>
          ))}</div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center gap-2"><Sparkles size={18} className="text-violet-700" /><span className="section-kicker mb-0">AI CMO SYNTHESIS</span></div>
          <h2 className="mt-3">Automation is becoming table stakes; proof and governance remain whitespace.</h2>
          <p>
            Competitors increasingly claim AI automation. Fewer demonstrate verified revenue impact, explicit human approval boundaries, decision receipts and reversible execution. GrowthOS can differentiate on measurable autonomous outcomes with control.
          </p>
          <div className="mt-4 grid gap-2">
            {[
              ["Positioning opportunity", "Autonomous outcomes with governed execution"],
              ["Proof requirement", "Incremental revenue + decision receipts"],
              ["Message risk", "Avoid unsupported 'replace all marketers' guarantees"],
              ["Content priority", "Comparison + evidence pages"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-growth-line p-3"><span className="text-xs text-growth-muted">{label}</span><strong className="mt-1 block text-xs">{value}</strong></div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}
