import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  CloudCog,
  LockKeyhole,
  Search,
  ServerCog,
  ShieldCheck,
  Users,
  Waypoints
} from "lucide-react";

type ChangeState = "Proposed" | "Approved" | "Rolling out" | "Verifying";

const tenants = [
  ["Northstar Labs", "Enterprise", "48", "$8,400", "Healthy", "cell-a"],
  ["Acme Commerce", "Growth", "17", "$3,200", "Healthy", "cell-a"],
  ["Vertex Learning", "Growth", "25", "$4,650", "Review", "cell-b"],
  ["Atlas Mobility", "Enterprise", "72", "$12,900", "Healthy", "cell-b"]
] as const;

const services = [
  ["Identity & routing", "99.99%", "Healthy"],
  ["Customer API", "99.97%", "Healthy"],
  ["Realtime gateway", "99.95%", "Healthy"],
  ["Approval service", "100%", "Healthy"],
  ["Worker admission", "99.96%", "Healthy"],
  ["Model gateway", "99.89%", "Healthy"]
] as const;

const initialChanges:{id:string;title:string;owner:string;state:ChangeState;risk:string}[] = [
  { id:"CHG-204", title:"Raise cell-a worker admission ceiling", owner:"Platform", state:"Proposed", risk:"Medium" },
  { id:"CHG-203", title:"Rotate attribution provider credential", owner:"Security", state:"Approved", risk:"High" },
  { id:"CHG-201", title:"Roll out customer-app release 0.4.0", owner:"Release", state:"Rolling out", risk:"Medium" },
  { id:"CHG-198", title:"Verify restored backup snapshot", owner:"SRE", state:"Verifying", risk:"Low" }
];

function badgeTone(value:string){
  if(["Healthy","Approved","Verified","Low"].includes(value)) return "good";
  if(["High","Review"].includes(value)) return "danger";
  return "warn";
}

export default function App(){
  const [query,setQuery]=useState("");
  const [changes,setChanges]=useState(initialChanges);
  const [notice,setNotice]=useState<string|null>(null);

  function requestAdvance(id:string){
    setChanges(current=>current.map(item=>{
      if(item.id!==id) return item;
      const next:Record<ChangeState,ChangeState>={
        Proposed:"Approved",
        Approved:"Rolling out",
        "Rolling out":"Verifying",
        Verifying:"Verifying"
      };
      setNotice(item.id+" change transition staged for reviewed control-api submission. No infrastructure mutation is performed by this browser.");
      return {...item,state:next[item.state]};
    }));
  }

  return (
    <div className="control-shell">
      <aside className="control-sidebar">
        <div className="control-brand"><span className="brand-icon"><ShieldCheck size={20}/></span><div><strong>GrowthOS</strong><small>Platform Control</small></div></div>
        <nav aria-label="Platform control navigation">
          {[
            [Activity,"Overview"],[Building2,"Tenants"],[ServerCog,"Cells & services"],[Waypoints,"Changes"],[ShieldCheck,"Security"],[CircleDollarSign,"FinOps"],[CloudCog,"Releases"]
          ].map(([Icon,label])=>{const NavIcon=Icon as typeof Activity;return <button key={String(label)} className={label==="Overview"?"active":""}><NavIcon size={17}/><span>{label as string}</span></button>})}
        </nav>
        <div className="trust-note"><LockKeyhole size={16}/><div><strong>Separate trust boundary</strong><span>No customer-app session or secret display.</span></div></div>
      </aside>

      <main>
        <header className="control-topbar">
          <div><span className="eyebrow">PRIVILEGED CONTROL APPLICATION</span><h1>Platform Control Center</h1><p>Desired state, tenant placement, operational evidence and reviewed platform changes.</p></div>
          <div className="search"><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search tenants, changes, services…"/></div>
        </header>

        {notice&&<div className="notice"><AlertTriangle size={18}/><span>{notice}</span><button onClick={()=>setNotice(null)}>Dismiss</button></div>}

        <section className="metrics">
          {[
            ["Active workspaces","184","+12 this month",Building2],
            ["MRR","$412K","+9.6%",CircleDollarSign],
            ["Active users","3,842","+18.2%",Users],
            ["Agent actions/day","1.48M","99.94% verified",Waypoints]
          ].map(([label,value,meta,Icon])=>{const MetricIcon=Icon as typeof Building2;return <article key={String(label)}><MetricIcon size={18}/><span>{label as string}</span><strong>{value as string}</strong><small>{meta as string}</small></article>})}
        </section>

        <section className="two-column">
          <article className="card">
            <div className="card-head"><div><span className="eyebrow">PLATFORM HEALTH</span><h2>Production services</h2></div><span className="badge good">All healthy</span></div>
            <div className="rows">{services.map(([name,uptime,state])=><div className="row" key={name}><div><span className="dot"/><strong>{name}</strong></div><span>{uptime}</span><span className={"badge "+badgeTone(state)}>{state}</span></div>)}</div>
          </article>

          <article className="card">
            <div className="card-head"><div><span className="eyebrow">SECURITY POSTURE</span><h2>Locked controls</h2></div><ShieldCheck size={20}/></div>
            <div className="score"><strong>96</strong><span>/100</span></div>
            <div className="rows compact">
              {[
                ["Privileged MFA","100%"],["SSO operators","100%"],["High-risk alerts","0 open"],["Secrets displayed","Never"],["Break-glass accounts","2 monitored"]
              ].map(([label,value])=><div className="row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>
          </article>
        </section>

        <section className="card change-card">
          <div className="card-head"><div><span className="eyebrow">CHANGE GOVERNANCE</span><h2>Operational Kanban</h2></div><span className="badge warn">Reviewed transitions only</span></div>
          <div className="kanban">
            {(["Proposed","Approved","Rolling out","Verifying"] as ChangeState[]).map(state=>(
              <div className="column" key={state}><div className="column-head"><strong>{state}</strong><span>{changes.filter(item=>item.state===state).length}</span></div>
                {changes.filter(item=>item.state===state).map(item=><article className="change" key={item.id}><small>{item.id} · {item.owner}</small><strong>{item.title}</strong><span className={"badge "+badgeTone(item.risk)}>{item.risk} risk</span>{state!=="Verifying"&&<button onClick={()=>requestAdvance(item.id)}>Stage next transition</button>}{state==="Verifying"&&<div className="verify"><CheckCircle2 size={14}/> Await evidence</div>}</article>)}
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head"><div><span className="eyebrow">TENANT OPERATIONS</span><h2>Workspace placement</h2></div><span className="badge good">Placement directory healthy</span></div>
          <div className="table-wrap"><table><thead><tr><th>Workspace</th><th>Plan</th><th>Seats</th><th>MRR</th><th>Health</th><th>Home cell</th></tr></thead><tbody>{tenants.filter(t=>!query||t.join(" ").toLowerCase().includes(query.toLowerCase())).map(t=><tr key={t[0]}><td><strong>{t[0]}</strong></td><td>{t[1]}</td><td>{t[2]}</td><td>{t[3]}</td><td><span className={"badge "+badgeTone(t[4])}>{t[4]}</span></td><td>{t[5]}</td></tr>)}</tbody></table></div>
        </section>
      </main>
    </div>
  );
}
