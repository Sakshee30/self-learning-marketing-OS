import { useState } from "react";
import { AlertTriangle, LockKeyhole, ShieldCheck, Siren } from "lucide-react";
import { Button, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

const policies=[
  ["Budget & bids","12 rules","0 exceptions","Enforced"],
  ["Customer contact","9 rules","1 exception","Enforced"],
  ["External publishing","11 rules","0 exceptions","Enforced"],
  ["Model & tool use","14 rules","0 exceptions","Enforced"],
  ["Data retention","8 rules","2 exceptions","Review"]
] as const;

export default function GovernancePage(){
  const [intent,setIntent]=useState<string|null>(null);

  return (
    <>
      <header className="mb-6 max-w-4xl"><span className="section-kicker">TRUST & CONTROL</span><h1>Governance</h1><p className="mt-3">Define autonomy, data access, model use, approvals, consent, retention, exceptions and kill switches. Security controls are policy contracts, not cosmetic toggles.</p></header>

      {intent&&<div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><strong className="text-sm text-amber-900">Sensitive change staged</strong><p className="mb-0 mt-1 text-xs text-amber-800">{intent} The production policy remains unchanged until the backend control service confirms the reviewed change.</p></div>}

      <section className="mb-4 grid gap-3 md:grid-cols-4"><MetricCard label="Policy coverage" value="98%" detail="+2 pts" icon={<ShieldCheck size={18}/>} /><MetricCard label="Open exceptions" value="3" detail="-4 this month"/><MetricCard label="Audit completeness" value="100%" detail="Sensitive paths covered"/><MetricCard label="High-risk bypasses" value="0" detail="Fail-closed"/></section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5"><span className="section-kicker">POLICY CATALOG</span><h2>Autonomy and data rules</h2><div className="mt-4 overflow-x-auto"><table><thead><tr><th>Policy</th><th>Rules</th><th>Exceptions</th><th>State</th></tr></thead><tbody>{policies.map(([name,rules,exceptions,state])=><tr key={name}><td><strong>{name}</strong></td><td>{rules}</td><td>{exceptions}</td><td><StatusBadge tone={state==="Enforced"?"success":"warning"}>{state}</StatusBadge></td></tr>)}</tbody></table></div></Panel>

        <Panel className="h-fit border-red-100 p-5"><div className="flex items-center gap-2"><Siren size={19} className="text-red-700"/><span className="section-kicker mb-0">KILL SWITCHES</span></div><h2 className="mt-3">Emergency controls</h2><p>Emergency revocation must be authoritative and auditable. The customer frontend can request it but cannot pretend the operation succeeded.</p>
          <div className="grid gap-2"><Button variant="danger" onClick={()=>setIntent("Pause all autonomous execution requested.")}>Request autonomy pause</Button><Button variant="secondary" onClick={()=>setIntent("External publishing disable requested.")}>Request publish lock</Button><Button variant="secondary" onClick={()=>setIntent("Model tool execution disable requested.")}>Request model-tool lock</Button></div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Panel className="p-5"><div className="flex items-center gap-2"><LockKeyhole size={18} className="text-violet-700"/><strong className="text-sm">Consent & contact</strong></div><div className="mt-4 grid gap-2">{[["Consent check","Required"],["Suppression check","Required"],["New outbound","Human approval"],["Frequency cap","Enforced"]].map(([label,state])=><div key={label} className="flex justify-between gap-3 rounded-lg border border-growth-line p-3"><span className="text-xs">{label}</span><StatusBadge tone={state==="Enforced"||state==="Required"?"success":"warning"}>{state}</StatusBadge></div>)}</div></Panel>
        <Panel className="p-5"><div className="flex items-center gap-2"><ShieldCheck size={18} className="text-violet-700"/><strong className="text-sm">Model & agent policy</strong></div><div className="mt-4 grid gap-2">{[["Approved model providers","2"],["Tool allowlists","14"],["PII to external model","Blocked by default"],["High-risk tools","Approval required"]].map(([label,state])=><div key={label} className="flex justify-between gap-3 rounded-lg border border-growth-line p-3"><span className="text-xs">{label}</span><strong className="text-xs">{state}</strong></div>)}</div></Panel>
        <Panel className="p-5"><div className="flex items-center gap-2"><AlertTriangle size={18} className="text-amber-700"/><strong className="text-sm">Exceptions</strong></div><div className="mt-4 grid gap-2">{[["RET-009","Retention policy","Expires 7d"],["CONTACT-012","Customer contact","Review"],["DATA-004","Regional export","Expires 2d"]].map(([id,scope,state])=><div key={id} className="rounded-lg border border-growth-line p-3"><div className="flex justify-between gap-2"><strong className="text-xs">{id}</strong><StatusBadge tone="warning">{state}</StatusBadge></div><span className="mt-1 block text-xs text-growth-muted">{scope}</span></div>)}</div></Panel>
      </section>
    </>
  );
}
