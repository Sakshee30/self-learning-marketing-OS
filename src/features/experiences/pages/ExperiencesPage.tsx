import { useState } from "react";
import { MonitorSmartphone, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { Button, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

type ExperienceDraft={id:string;name:string;surface:string;state:"Draft"|"Approval required"};

const pages=[
  ["Homepage proof","6.8%","+8.4%","Live"],
  ["Pricing hierarchy","8.1%","+12.1%","Experiment"],
  ["Enterprise CTA","4.2%","+6.8%","Live"],
  ["Exit recovery","3.1%","+3.2%","Learning"]
] as const;

export default function ExperiencesPage(){
  const [name,setName]=useState("");
  const [drafts,setDrafts]=useState<ExperienceDraft[]>([]);

  function create(){
    const value=name.trim()||"Pricing proof hierarchy";
    setDrafts(current=>[{id:"EXPX-"+String(current.length+1).padStart(3,"0"),name:value,surface:"Website",state:"Approval required"},...current]);
    setName("");
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl"><span className="section-kicker">EXPERIENCE OPTIMIZATION</span><h1>Website & CRO</h1><p className="mt-3">Detect friction, draft experience hypotheses, personalize eligible journeys and improve conversion while preserving brand, accessibility and deployment safety.</p></div>
        <Button onClick={create}><Plus size={16}/> Create experience</Button>
      </header>

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Qualified CVR" value="6.42%" detail="+0.8 pts" icon={<MonitorSmartphone size={18}/>} />
        <MetricCard label="Experiences live" value="12" detail="+3 this month" />
        <MetricCard label="Measured lift" value="$128K" detail="+19%" />
        <MetricCard label="Accessibility checks" value="100%" detail="Pre-release gate" />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5"><span className="section-kicker">EXPERIENCE OPERATING VIEW</span><h2>Conversion surfaces</h2>
          <div className="mt-4 overflow-x-auto"><table><thead><tr><th>Experience</th><th>Qualified CVR</th><th>Lift</th><th>State</th></tr></thead><tbody>
            {drafts.map(item=><tr key={item.id}><td><strong>{item.name}</strong><div className="text-[11px] text-slate-400">{item.id}</div></td><td>Not started</td><td>Simulation pending</td><td><StatusBadge tone="warning">{item.state}</StatusBadge></td></tr>)}
            {pages.map(([name,cvr,lift,state])=><tr key={name}><td><strong>{name}</strong></td><td>{cvr}</td><td>{lift}</td><td><StatusBadge tone={state==="Live"?"success":"accent"}>{state}</StatusBadge></td></tr>)}
          </tbody></table></div>
        </Panel>

        <Panel className="h-fit p-5"><div className="flex items-center gap-2"><Sparkles size={18} className="text-violet-700"/><span className="section-kicker mb-0">EXPERIENCE BUILDER</span></div><h2 className="mt-3">Stage a hypothesis</h2>
          <p>Draft a change first. Production deployment, personalization activation and form changes remain approval-controlled.</p>
          <Input value={name} onChange={event=>setName(event.target.value)} placeholder="Experience or hypothesis"/>
          <Button className="mt-3 w-full" onClick={create}>Create draft experience</Button>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Panel className="p-5"><span className="section-kicker">FRICTION MAP</span><h2>Where buyers hesitate</h2>
          <div className="mt-4 grid gap-3">{[
            ["Pricing page","Feature detail opens before plan comparison","High","Mobile"],
            ["Enterprise page","Proof is below first CTA","Medium","All"],
            ["Demo form","Company-size field abandonment","Medium","Mobile"],
            ["Comparison pages","Weak direct answer structure","High","Organic"]
          ].map(([surface,issue,priority,segment])=><div key={surface} className="grid gap-2 rounded-lg border border-growth-line p-3 md:grid-cols-[120px_1fr_90px_90px] md:items-center"><strong className="text-sm">{surface}</strong><span className="text-xs text-growth-muted">{issue}</span><StatusBadge tone={priority==="High"?"warning":"neutral"}>{priority}</StatusBadge><span className="text-xs">{segment}</span></div>)}</div>
        </Panel>

        <Panel className="p-5"><div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-700"/><span className="section-kicker mb-0">DEPLOYMENT SAFETY</span></div><h2 className="mt-3">Experience guardrails</h2>
          <div className="mt-4 grid gap-2">{["Accessibility validation","Analytics instrumentation","Rollback plan","Brand policy","Experiment eligibility"].map(rule=><div key={rule} className="flex items-center justify-between rounded-lg border border-growth-line p-3"><span className="text-xs font-semibold">{rule}</span><StatusBadge tone="success">Required</StatusBadge></div>)}</div>
        </Panel>
      </section>
    </>
  );
}
