import { useMemo, useState } from "react";
import { Bot, BrainCircuit, CheckCircle2, ShieldCheck, Wrench } from "lucide-react";
import { Button, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

type Agent = {
  id:string;
  name:string;
  domain:string;
  status:"Running"|"Learning"|"Waiting";
  autonomy:"Observe"|"Draft"|"Approval required";
  success:number;
  actions:number;
  tools:string[];
  permissions:string[];
};

const roster:Agent[]=[
  {id:"AG-01",name:"AI CMO",domain:"Cross-channel strategy",status:"Running",autonomy:"Approval required",success:97,actions:28,tools:["World Model","Digital Twin","Opportunity Engine"],permissions:["Read all marketing evidence","Create strategy drafts","Request approvals"]},
  {id:"AG-02",name:"Paid Growth Agent",domain:"Google · Meta · LinkedIn",status:"Running",autonomy:"Approval required",success:96,actions:47,tools:["Ad platforms","Revenue Intelligence","Creative Genome"],permissions:["Read campaign data","Draft budget changes","Draft audience activation"]},
  {id:"AG-03",name:"Organic Growth Agent",domain:"SEO · GEO · content",status:"Learning",autonomy:"Draft",success:94,actions:19,tools:["Search console","Content graph","Market Intelligence"],permissions:["Read organic evidence","Draft briefs","Draft page changes"]},
  {id:"AG-04",name:"Lifecycle Agent",domain:"Email · CRM · retention",status:"Running",autonomy:"Approval required",success:95,actions:31,tools:["CRM","Customer Graph","Lifecycle"],permissions:["Read customer evidence","Draft journeys","Request outbound approval"]},
  {id:"AG-05",name:"Revenue Analyst",domain:"Attribution · incrementality · profit",status:"Waiting",autonomy:"Observe",success:98,actions:15,tools:["Revenue Intelligence","Experiment Memory"],permissions:["Read revenue data","Verify outcomes","Write learning drafts"]}
];

export default function AgentsPage(){
  const [selected,setSelected]=useState<Agent>(roster[0]!);
  const [policyIntent,setPolicyIntent]=useState<string|null>(null);

  const running=useMemo(()=>roster.filter(item=>item.status==="Running").length,[]);
  return (
    <>
      <header className="mb-6 max-w-4xl"><span className="section-kicker">AI WORKFORCE</span><h1>Agents</h1><p className="mt-3">Specialist agents share goals and verified memory while remaining constrained by domain permissions, tool access, budgets, policy and human approval thresholds.</p></header>

      {policyIntent&&<div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><strong className="text-sm text-amber-900">Policy change staged</strong><p className="mb-0 mt-1 text-xs text-amber-800">{policyIntent} No production permission has changed until backend policy confirms it.</p></div>}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Active agents" value={String(roster.length)} detail={running+" currently running"} icon={<Bot size={18}/>} />
        <MetricCard label="Verified actions" value="184" detail="+42 this week" />
        <MetricCard label="Success rate" value="96.2%" detail="+1.4 pts" />
        <MetricCard label="Approval-bound agents" value="3" detail="Consequential actions gated" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel className="p-5">
          <span className="section-kicker">AGENT ROSTER</span><h2>Specialist workforce</h2>
          <div className="mt-4 grid gap-3">{roster.map(agent=>(
            <button key={agent.id} type="button" onClick={()=>setSelected(agent)} className={["grid gap-3 rounded-xl border p-4 text-left md:grid-cols-[1fr_120px_150px_80px] md:items-center",selected.id===agent.id?"border-violet-300 bg-violet-50":"border-growth-line bg-white hover:border-slate-300"].join(" ")}>
              <span><strong className="block text-sm">{agent.name}</strong><span className="mt-1 block text-xs text-growth-muted">{agent.domain}</span></span>
              <StatusBadge tone={agent.status==="Running"?"success":agent.status==="Learning"?"accent":"neutral"}>{agent.status}</StatusBadge>
              <span className="text-xs text-growth-muted">{agent.autonomy}</span>
              <strong className="text-sm">{agent.success}%</strong>
            </button>
          ))}</div>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="flex items-center gap-2"><BrainCircuit size={19} className="text-violet-700"/><span className="section-kicker mb-0">AGENT CONTRACT</span></div>
          <h2 className="mt-3">{selected.name}</h2><p>{selected.domain}</p>
          <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-growth-muted">Autonomy</span><strong className="mt-1 block text-xs">{selected.autonomy}</strong></div><div className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-growth-muted">Actions / 7d</span><strong className="mt-1 block text-xs">{selected.actions}</strong></div></div>

          <div className="mt-5"><div className="flex items-center gap-2"><Wrench size={16} className="text-slate-500"/><strong className="text-xs">Tools</strong></div><div className="mt-2 flex flex-wrap gap-1.5">{selected.tools.map(tool=><span key={tool} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-700">{tool}</span>)}</div></div>
          <div className="mt-5"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-slate-500"/><strong className="text-xs">Permissions</strong></div><div className="mt-2 grid gap-2">{selected.permissions.map(permission=><div key={permission} className="flex items-center gap-2 text-xs text-growth-muted"><CheckCircle2 size={14} className="text-emerald-600"/>{permission}</div>)}</div></div>

          <Button className="mt-5 w-full" variant="secondary" onClick={()=>setPolicyIntent("Requested autonomy review for "+selected.name+".")}>Review autonomy policy</Button>
        </Panel>
      </section>
    </>
  );
}
