import { useMemo, useState } from "react";
import { FileText, SearchCheck, Sparkles, Wrench } from "lucide-react";
import { Button, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

const opportunities = [
  ["AI marketing automation comparison", "Commercial", "High", "14 pages", "GEO + SEO"],
  ["Marketing attribution software", "Commercial", "High", "6 pages", "SEO"],
  ["Autonomous marketing operations", "Category", "Medium", "9 pages", "GEO"],
  ["AI CMO use cases", "Educational", "Medium", "12 pages", "SEO + GEO"]
] as const;

const technicalIssues = [
  ["Missing structured evidence blocks", "14", "High"],
  ["Internal-link depth > 3", "31", "Medium"],
  ["Slow LCP pages", "8", "Medium"],
  ["Canonical conflicts", "2", "High"]
] as const;

export default function OrganicPage() {
  const [tab, setTab] = useState("SEO");
  const [topic, setTopic] = useState("");
  const [brief, setBrief] = useState<string | null>(null);

  const issueCount = useMemo(
    () => technicalIssues.reduce((sum, [, count]) => sum + Number(count), 0),
    []
  );

  function createBrief() {
    const value = topic.trim() || "AI marketing automation comparison";
    setBrief(
      "Draft brief for “" + value + "”: answer buyer intent directly, cite verifiable evidence, cover entity relationships, include comparison criteria, add internal links to revenue and governance proof, and avoid unsupported claims."
    );
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">SEARCH + ANSWER ENGINE OPTIMIZATION</span>
          <h1>SEO & GEO</h1>
          <p className="mt-3">
            Improve technical search health, commercial content coverage, entity authority and answer-engine visibility.
            GrowthOS drafts recommendations automatically; publishing remains governed.
          </p>
        </div>
        <Button onClick={createBrief}><Sparkles size={16} /> Create content brief</Button>
      </header>

      {brief && (
        <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <strong className="text-sm text-violet-900">Content brief staged</strong>
          <p className="mb-0 mt-1 text-xs leading-5 text-violet-800">{brief}</p>
        </div>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Organic pipeline" value="$404K" detail="+13.1%" icon={<SearchCheck size={18} />} />
        <MetricCard label="Answer visibility" value="38%" detail="+6.4 pts" />
        <MetricCard label="Technical health" value="94" detail="+3 points" />
        <MetricCard label="Priority issues" value={String(issueCount)} detail="Grouped by root cause" />
      </section>

      <div className="module-tabs" role="tablist" aria-label="Organic growth sections">
        {["SEO", "GEO", "Technical", "Content", "Entities", "Internal links"].map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div><span className="section-kicker">{tab.toUpperCase()} OPPORTUNITIES</span><h2>Highest-value content gaps</h2></div>
            <StatusBadge tone="accent">Intent ranked</StatusBadge>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Topic</th><th>Intent</th><th>Priority</th><th>Coverage</th><th>Surface</th></tr></thead>
              <tbody>{opportunities.map(([name,intent,priority,coverage,surface]) => (
                <tr key={name}><td><strong>{name}</strong></td><td>{intent}</td><td><StatusBadge tone={priority === "High" ? "warning" : "neutral"}>{priority}</StatusBadge></td><td>{coverage}</td><td>{surface}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="flex items-center gap-2"><FileText size={18} className="text-violet-700" /><span className="section-kicker mb-0">BRIEF GENERATOR</span></div>
          <h2 className="mt-3">Draft from market evidence</h2>
          <p>Create an evidence-led content brief without publishing anything.</p>
          <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Topic or buyer question" />
          <Button className="mt-3 w-full" onClick={createBrief}>Generate draft brief</Button>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-2"><Wrench size={18} className="text-violet-700" /><span className="section-kicker mb-0">TECHNICAL HEALTH</span></div>
          <h2>Root-cause backlog</h2>
          <div className="mt-4 grid gap-3">{technicalIssues.map(([issue,count,severity]) => (
            <div key={issue} className="grid gap-2 rounded-lg border border-growth-line p-3 sm:grid-cols-[1fr_80px_100px] sm:items-center">
              <strong className="text-sm">{issue}</strong><span className="text-xs text-growth-muted">{count} affected</span><StatusBadge tone={severity === "High" ? "danger" : "warning"}>{severity}</StatusBadge>
            </div>
          ))}</div>
        </Panel>

        <Panel className="p-5">
          <span className="section-kicker">AI ORGANIC BRIEF</span><h2>Commercial comparison pages are the fastest path to answer visibility.</h2>
          <p>Authority is sufficient for 14 high-intent questions, but page structure lacks direct evidence, explicit comparison criteria and source-linked answers.</p>
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs leading-5 text-emerald-900">
            Drafting can run autonomously. Publishing pages, schema changes or production redirects remain approval-controlled.
          </div>
        </Panel>
      </section>
    </>
  );
}
