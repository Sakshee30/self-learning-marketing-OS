import { useMemo, useState } from "react";
import { BrainCircuit, Plus, Search, Sparkles } from "lucide-react";
import { Button, Input, MetricCard, Panel, Select, StatusBadge } from "../../../shared/ui";

type MemoryItem={id:string;type:"Decision"|"Learning"|"Assumption"|"Policy"|"Evidence";title:string;domain:string;state:"Verified"|"Challenged"|"Active"|"Draft";summary:string};

const seed:MemoryItem[]=[
  {id:"MEM-382",type:"Learning",title:"Proof-first creative improves qualified response",domain:"Creative",state:"Verified",summary:"Holdout-backed variants produced +18.4% pipeline contribution."},
  {id:"MEM-381",type:"Decision",title:"Protect high-intent search during budget shift",domain:"Paid growth",state:"Verified",summary:"Preserve branded and commercial intent while reducing saturated prospecting."},
  {id:"MEM-379",type:"Assumption",title:"Activation remains the binding growth constraint",domain:"World Model",state:"Active",summary:"Current evidence suggests conversion improvement outperforms traffic expansion."},
  {id:"MEM-374",type:"Learning",title:"Annual discount urgency produced no material lift",domain:"Pricing",state:"Verified",summary:"95% confidence interval included no commercially meaningful improvement."},
  {id:"MEM-369",type:"Policy",title:"New outbound customer communication requires approval",domain:"Governance",state:"Active",summary:"Consent eligibility alone does not authorize a new outbound sequence."}
];

export default function MemoryPage(){
  const [query,setQuery]=useState("");
  const [type,setType]=useState("All");
  const [drafts,setDrafts]=useState<MemoryItem[]>([]);
  const items=[...drafts,...seed];
  const visible=useMemo(()=>items.filter(item=>(type==="All"||item.type===type)&&(!query.trim()||[item.title,item.summary,item.domain].some(v=>v.toLowerCase().includes(query.toLowerCase())))),[items,query,type]);

  function addDraft(){
    setDrafts(current=>[{id:"MEM-DRAFT-"+String(current.length+1).padStart(3,"0"),type:"Assumption",title:"New operator-authored assumption",domain:"Workspace",state:"Draft",summary:"Draft memory is not verified learning and will not be used as authoritative evidence until reviewed."},...current]);
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><span className="section-kicker">ORGANIZATIONAL MEMORY</span><h1>Memory & Decisions</h1><p className="mt-3">Keep goals, evidence, decisions, assumptions, experiments and outcomes traceable so AI agents learn from verified results instead of repeating mistakes or treating every note as fact.</p></div><Button onClick={addDraft}><Plus size={16}/> Add memory draft</Button></header>
      <section className="mb-4 grid gap-3 md:grid-cols-4"><MetricCard label="Verified learnings" value="382" detail="+24 this month" icon={<BrainCircuit size={18}/>} /><MetricCard label="Decision receipts" value="1,248" detail="+61 this week"/><MetricCard label="Active assumptions" value="31" detail="6 challenged"/><MetricCard label="Reusable patterns" value="74" detail="+8 verified"/></section>

      <Panel className="p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><span className="section-kicker">MEMORY INDEX</span><h2>Search verified context</h2></div><div className="flex w-full gap-2 md:w-auto"><div className="relative flex-1 md:w-72"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><Input className="pl-9" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search decisions and learning…"/></div><Select value={type} onChange={event=>setType(event.target.value)}><option>All</option><option>Decision</option><option>Learning</option><option>Assumption</option><option>Policy</option><option>Evidence</option></Select></div></div>
        <div className="mt-5 grid gap-3">{visible.map(item=><article key={item.id} className="rounded-xl border border-growth-line p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><StatusBadge tone="accent">{item.type}</StatusBadge><span className="text-[11px] text-slate-400">{item.id}</span></div><strong className="mt-2 block text-sm">{item.title}</strong><span className="mt-1 block text-xs text-growth-muted">{item.domain}</span></div><StatusBadge tone={item.state==="Verified"?"success":item.state==="Challenged"?"danger":item.state==="Draft"?"warning":"neutral"}>{item.state}</StatusBadge></div><p className="mb-0 mt-3 text-xs">{item.summary}</p></article>)}</div>
      </Panel>

      <Panel className="mt-4 p-5"><div className="flex items-start gap-3"><Sparkles size={19} className="mt-0.5 text-violet-700"/><div><strong className="text-sm">Memory integrity rule</strong><p className="mb-0 mt-1 text-xs text-growth-muted">Drafts, observations, challenged assumptions and verified learnings remain separate states. Agents should consume authoritative memory through typed evidence and decision-receipt references once the backend is connected.</p></div></div></Panel>
    </>
  );
}
