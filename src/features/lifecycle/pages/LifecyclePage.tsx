import { useState } from "react";
import { ArrowRight, Mail, Plus, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Button, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

type JourneyDraft = { id:string; name:string; trigger:string; audience:string; state:"Draft"|"Approval required" };

const journeys = [
  ["New lead nurture","High-intent lead created","24.8% activation","$52K","Active"],
  ["Trial activation","No integration after 12h","42.8% activation","$71K","Active"],
  ["Expansion","Usage + account fit threshold","18.1% expansion","$63K","Active"],
  ["Churn rescue","Usage decline + high LTV","11.2% recovery","$33K","Review"]
] as const;

export default function LifecyclePage() {
  const [name,setName]=useState("");
  const [drafts,setDrafts]=useState<JourneyDraft[]>([]);

  function createDraft(){
    const journeyName=name.trim()||"High-value activation intervention";
    setDrafts(current=>[{id:"JRN-"+String(current.length+1).padStart(3,"0"),name:journeyName,trigger:"Behavioral threshold",audience:"Eligible high-value accounts",state:"Approval required"},...current]);
    setName("");
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">CUSTOMER LIFECYCLE</span><h1>Lifecycle & CRM</h1>
          <p className="mt-3">Use behavior, value, intent and lifecycle evidence to move leads and customers toward activation, expansion, advocacy and recovery. New outbound communication remains governed.</p>
        </div>
        <Button onClick={createDraft}><Plus size={16}/> Create journey</Button>
      </header>

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Lifecycle revenue" value="$219K" detail="+17%" icon={<Mail size={18}/>} />
        <MetricCard label="Activation rate" value="42.8%" detail="+4.1 pts" />
        <MetricCard label="At-risk accounts" value="841" detail="-9%" />
        <MetricCard label="Expansion-ready" value="2,104" detail="High-LTV audience" />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-2"><Workflow size={19} className="text-violet-700"/><span className="section-kicker mb-0">JOURNEYS</span></div>
          <h2>Behavior-driven programs</h2>
          <div className="mt-4 overflow-x-auto"><table><thead><tr><th>Journey</th><th>Trigger</th><th>Outcome</th><th>Revenue</th><th>State</th></tr></thead><tbody>
            {drafts.map(item=><tr key={item.id}><td><strong>{item.name}</strong><div className="text-[11px] text-slate-400">{item.id}</div></td><td>{item.trigger}</td><td>{item.audience}</td><td>—</td><td><StatusBadge tone="warning">{item.state}</StatusBadge></td></tr>)}
            {journeys.map(([journey,trigger,outcome,revenue,state])=><tr key={journey}><td><strong>{journey}</strong></td><td>{trigger}</td><td>{outcome}</td><td>{revenue}</td><td><StatusBadge tone={state==="Active"?"success":"warning"}>{state}</StatusBadge></td></tr>)}
          </tbody></table></div>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="flex items-center gap-2"><Sparkles size={18} className="text-violet-700"/><span className="section-kicker mb-0">JOURNEY BUILDER</span></div>
          <h2 className="mt-3">Stage a governed journey</h2>
          <p>Draft the intent first. Messaging, audience activation and CRM writes require backend authorization and policy checks.</p>
          <Input value={name} onChange={event=>setName(event.target.value)} placeholder="Journey name"/>
          <Button className="mt-3 w-full" onClick={createDraft}>Create journey draft</Button>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-700"/><strong className="text-xs text-amber-900">Customer contact policy</strong></div>
            <p className="mb-0 mt-1 text-xs text-amber-800">New outbound communication is approval-controlled. Suppression, consent and frequency rules are evaluated before activation.</p>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Panel className="p-5"><span className="section-kicker">LEAD SCORING</span><h2>Revenue-aware qualification</h2>
          <div className="mt-4 grid gap-3">{[
            ["Product-fit score","92","Firmographic + usage fit"],
            ["Intent score","88","High-intent page + return visits"],
            ["Revenue propensity","81","Historical close likelihood"],
            ["Expansion propensity","76","Usage + account headroom"]
          ].map(([label,value,detail])=><div key={label} className="grid grid-cols-[1fr_50px] gap-3 rounded-lg border border-growth-line p-3"><div><strong className="text-sm">{label}</strong><span className="mt-1 block text-xs text-growth-muted">{detail}</span></div><strong className="text-lg text-violet-700">{value}</strong></div>)}</div>
        </Panel>

        <Panel className="p-5"><span className="section-kicker">AI LIFECYCLE BRIEF</span><h2>Activation friction is concentrated in the first integration step.</h2>
          <p>Accounts that connect a data source within 24 hours retain materially better. The next safest action is an in-product guidance experiment before adding outbound messaging.</p>
          <Button variant="secondary">Open opportunity <ArrowRight size={15}/></Button>
        </Panel>
      </section>
    </>
  );
}
