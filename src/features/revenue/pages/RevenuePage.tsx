import { useMemo, useState } from "react";
import { BarChart3, CircleDollarSign, Search, Sparkles, TrendingUp } from "lucide-react";
import { Button, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

const channels = [
  ["Google Ads", "$482K", "4.9×", "$318K", "High"],
  ["Meta", "$318K", "3.6×", "$204K", "High"],
  ["Organic", "$404K", "9.8×", "$271K", "Medium"],
  ["Lifecycle", "$219K", "12.1×", "$188K", "High"],
  ["LinkedIn", "$146K", "3.1×", "$91K", "Medium"]
] as const;

const funnel = [
  ["Qualified visits", "184,220", "100%", "—"],
  ["Qualified leads", "18,421", "10.0%", "+1.2 pts"],
  ["Sales-qualified", "6,842", "37.1%", "+2.8 pts"],
  ["Opportunities", "2,104", "30.8%", "+0.9 pts"],
  ["Won", "482", "22.9%", "+1.7 pts"]
] as const;

export default function RevenuePage() {
  const [tab, setTab] = useState("Overview");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const attributed = useMemo(
    () => channels.reduce((sum, [, value]) => sum + Number(value.replace(/[$K]/g, "")), 0),
    []
  );

  function ask() {
    if (!question.trim()) return;
    setAnswer("Preview analysis: paid social is contributing upstream demand that later converts through search and direct traffic. Validate this with the current holdout and incrementality evidence before reallocating spend.");
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">REVENUE INTELLIGENCE · KLARITY</span>
          <h1>Money & Measurement</h1>
          <p className="mt-3">
            Unify acquisition cost, funnel, pipeline, revenue, margin, LTV, multi-touch attribution and incrementality so AI optimizes for business outcomes rather than platform-reported conversions.
          </p>
        </div>
        <Button variant="secondary"><BarChart3 size={16} /> Measurement plan</Button>
      </header>

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Tracked revenue" value="$2.46M" detail="94% evidence confidence" icon={<CircleDollarSign size={18} />} />
        <MetricCard label="Incremental revenue" value="$1.12M" detail="+14.2% vs prior period" />
        <MetricCard label="Blended CAC" value="$184" detail="-8.4% improvement" />
        <MetricCard label="Contribution profit" value="$418K" detail="+12.4% AI-optimized" icon={<TrendingUp size={18} />} />
      </section>

      <div className="module-tabs" role="tablist" aria-label="Revenue intelligence sections">
        {["Overview", "Full funnel", "Klarity attribution", "Incrementality", "CAC & LTV", "Profit"].map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div><span className="section-kicker">{tab.toUpperCase()}</span><h2>Revenue by source</h2></div>
            <StatusBadge tone="success">{attributed}K modeled revenue</StatusBadge>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Source</th><th>Influenced revenue</th><th>ROAS</th><th>Incremental estimate</th><th>Evidence</th></tr></thead>
              <tbody>{channels.map(([name, revenue, roas, incremental, evidence]) => (
                <tr key={name}><td><strong>{name}</strong></td><td>{revenue}</td><td>{roas}</td><td>{incremental}</td><td><StatusBadge tone={evidence === "High" ? "success" : "warning"}>{evidence}</StatusBadge></td></tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center gap-2"><Sparkles size={18} className="text-violet-700" /><span className="section-kicker mb-0">REVENUE ANALYST</span></div>
          <h2 className="mt-3">Ask the measurement layer</h2>
          <p>Query revenue, attribution and causal evidence in business language.</p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <Input className="pl-9" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Why did qualified pipeline move this week?" />
          </div>
          <Button className="mt-3 w-full" onClick={ask}>Analyze evidence</Button>
          {answer && <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-4 text-xs leading-5 text-violet-900">{answer}</div>}
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Panel className="p-5">
          <span className="section-kicker">FULL FUNNEL</span><h2>Where value is converting</h2>
          <div className="mt-4 overflow-x-auto">
            <table>
              <thead><tr><th>Stage</th><th>Volume</th><th>Stage conversion</th><th>Change</th></tr></thead>
              <tbody>{funnel.map(([stage, volume, conversion, change]) => (
                <tr key={stage}><td><strong>{stage}</strong></td><td>{volume}</td><td>{conversion}</td><td>{change}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-5">
          <span className="section-kicker">INCREMENTALITY</span><h2>What appears causal</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["Meta assisted demand", "$204K", "14-day holdout", "High"],
              ["Brand search protection", "$82K", "Geo holdout", "Medium"],
              ["Lifecycle expansion", "$188K", "Eligible-control cohort", "High"]
            ].map(([name, value, method, confidence]) => (
              <div key={name} className="rounded-xl border border-growth-line p-4">
                <div className="flex items-center justify-between gap-2"><strong className="text-sm">{name}</strong><StatusBadge tone={confidence === "High" ? "success" : "warning"}>{confidence}</StatusBadge></div>
                <div className="mt-2 flex items-center justify-between text-xs text-growth-muted"><span>{method}</span><strong className="text-growth-ink">{value}</strong></div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}
