import { useState } from "react";
import { Bot, CheckCircle2, GitBranch, Pause, Play, Plus, ShieldCheck, Zap } from "lucide-react";
import { Button, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

const flows=[
  ["Paid media waste guard","Every 30 min","8","Budget changes","$18.4K protected","Active"],
  ["High-intent lead acceleration","New qualified lead","12","External message","+21% SQL rate","Active"],
  ["Creative fatigue response","Frequency > 3.5","7","Campaign pause","+14% CTR","Active"],
  ["Churn rescue orchestration","Risk score > 0.72","10","Offer > 10%","$43K ARR","Draft"]
] as const;

export default function AutomationsPage(){
  const [controlIntent,setControlIntent]=useState<"pause"|"resume"|null>(null);
  const [draftCount,setDraftCount]=useState(0);

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><span className="section-kicker">AUTONOMOUS OPERATIONS</span><h1>Automations</h1><p className="mt-3">Turn strategy into observable workflows that can branch, call agents, wait for evidence, request human approval and verify outcomes.</p></div><Button onClick={()=>setDraftCount(value=>value+1)}><Plus size={16}/> New automation draft</Button></header>

      {controlIntent&&<div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><strong className="text-sm text-amber-900">{controlIntent==="pause"?"Pause":"Resume"} intent staged</strong><p className="mb-0 mt-1 text-xs text-amber-800">The browser has not changed production execution. The backend control policy must acknowledge this change before status becomes authoritative.</p></div>}

      <section className="mb-4 grid gap-3 md:grid-cols-4"><MetricCard label="Active workflows" value="18" detail="6 agent-orchestrated" icon={<Zap size={18}/>} /><MetricCard label="Runs / day" value="8,420" detail="99.4% policy-valid"/><MetricCard label="Human gates" value="31" detail="Material actions"/><MetricCard label="Drafts" value={String(4+draftCount)} detail="Not executable"/></section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <Panel className="p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><span className="section-kicker">LIVE WORKFLOW</span><h2>Revenue opportunity recovery</h2></div><StatusBadge tone="success"><Play size={12}/> Running</StatusBadge></div>
          <div className="grid gap-2 md:grid-cols-5">{[
            [Zap,"Signal","Pipeline drops 8%"],[Bot,"AI diagnosis","Find root cause"],[GitBranch,"Decision","Select response"],[ShieldCheck,"Approval","If material"],[CheckCircle2,"Verify","Measure outcome"]
          ].map(([Icon,title,detail])=>{const NodeIcon=Icon as typeof Zap;return <div key={String(title)} className="rounded-xl border border-growth-line bg-slate-50 p-3"><NodeIcon size={17} className="text-violet-700"/><strong className="mt-3 block text-xs">{title as string}</strong><span className="mt-1 block text-[11px] text-growth-muted">{detail as string}</span></div>})}</div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3"><strong className="text-xs text-amber-900">Latest run is waiting for approval</strong><p className="mb-0 mt-1 text-xs text-amber-800">Paid Growth Agent proposes a $6,500 weekly budget reallocation.</p></div>
        </Panel>

        <Panel className="p-5"><span className="section-kicker">AUTONOMY CONTROL</span><h2>Production intent</h2><p>Pause/resume is a sensitive operational change. The frontend only submits intent.</p>
          <div className="grid gap-2"><Button variant="secondary" onClick={()=>setControlIntent("pause")}><Pause size={15}/> Stage pause request</Button><Button variant="secondary" onClick={()=>setControlIntent("resume")}><Play size={15}/> Stage resume request</Button></div>
          <div className="mt-4 rounded-xl border border-growth-line p-4"><strong className="text-xs">Guardrails</strong><ul className="mb-0 mt-2 grid gap-1.5 pl-4 text-xs text-growth-muted"><li>Spend changes require policy evaluation</li><li>External messaging requires consent + approval</li><li>Production changes require rollback support</li><li>High-risk actions always require a human</li></ul></div>
        </Panel>
      </section>

      <Panel className="p-5"><span className="section-kicker">WORKFLOW LIBRARY</span><h2>Operating automations</h2><div className="mt-4 overflow-x-auto"><table><thead><tr><th>Automation</th><th>Trigger</th><th>Steps</th><th>Human gate</th><th>Outcome</th><th>Status</th></tr></thead><tbody>{flows.map(([name,trigger,steps,gate,outcome,status])=><tr key={name}><td><strong>{name}</strong></td><td>{trigger}</td><td>{steps}</td><td>{gate}</td><td>{outcome}</td><td><StatusBadge tone={status==="Active"?"success":"neutral"}>{status}</StatusBadge></td></tr>)}</tbody></table></div></Panel>
    </>
  );
}
