import { useState } from "react";
import { CreditCard, Gauge, ReceiptText, Users } from "lucide-react";
import { Button, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

const usage=[
  ["Agent execution","4.2M actions","$2,410","62%"],
  ["Model tokens","1.8B","$2,104","71%"],
  ["Event volume","248M","$1,128","84%"],
  ["Storage","4.8 TB","$1,200","88%"]
] as const;

export default function BillingPage(){
  const [intent,setIntent]=useState<string|null>(null);
  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><span className="section-kicker">SUBSCRIPTION & USAGE</span><h1>Billing & Usage</h1><p className="mt-3">Understand plan entitlements, seats, metered AI/data consumption, budgets and invoices. Commercial changes become backend-confirmed billing operations rather than browser-only state.</p></div><Button variant="secondary" onClick={()=>setIntent("Subscription management requested.")}><CreditCard size={16}/> Manage subscription</Button></header>

      {intent&&<div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4"><strong className="text-sm text-violet-900">Billing action staged</strong><p className="mb-0 mt-1 text-xs text-violet-800">{intent} No plan, payment method or budget has changed in the billing system.</p></div>}

      <section className="mb-4 grid gap-3 md:grid-cols-4"><MetricCard label="Current plan" value="Enterprise" detail="Annual contract" icon={<CreditCard size={18}/>} /><MetricCard label="Monthly usage" value="$6,842" detail="81% forecast" icon={<Gauge size={18}/>} /><MetricCard label="Seats" value="48 / 60" detail="12 available" icon={<Users size={18}/>} /><MetricCard label="Next invoice" value="$8,400" detail="Oct 1" icon={<ReceiptText size={18}/>} /></section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5"><span className="section-kicker">METERED USAGE</span><h2>Workspace consumption</h2><div className="mt-4 overflow-x-auto"><table><thead><tr><th>Meter</th><th>Usage</th><th>Cost</th><th>Budget</th></tr></thead><tbody>{usage.map(([meter,value,cost,budget])=><tr key={meter}><td><strong>{meter}</strong></td><td>{value}</td><td>{cost}</td><td>{budget}</td></tr>)}</tbody></table></div></Panel>
        <Panel className="h-fit p-5"><span className="section-kicker">BUDGET GUARDRAIL</span><h2>Forecast</h2><p>Model and agent consumption is forecast to finish below the workspace monthly budget because of routing and caching efficiencies.</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-[81%] rounded-full bg-violet-500"/></div><div className="mt-2 flex justify-between text-xs text-growth-muted"><span>81% forecast</span><span>$8,400 limit</span></div><Button className="mt-4 w-full" variant="secondary" onClick={()=>setIntent("Monthly AI/data budget change requested.")}>Request budget change</Button></Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_.9fr]">
        <Panel className="p-5"><span className="section-kicker">ENTITLEMENTS</span><h2>Plan capabilities</h2><div className="mt-4 grid gap-2">{[["AI CMO & agents","Enabled"],["Advanced attribution","Enabled"],["Digital Twin","Enabled"],["Enterprise SSO","Enabled"],["Custom retention","Enabled"],["Dedicated tenant profile","Available"]].map(([feature,state])=><div key={feature} className="flex items-center justify-between rounded-lg border border-growth-line p-3"><span className="text-xs font-semibold">{feature}</span><StatusBadge tone={state==="Enabled"?"success":"accent"}>{state}</StatusBadge></div>)}</div></Panel>
        <Panel className="p-5"><span className="section-kicker">INVOICES</span><h2>Billing history</h2><div className="mt-4 overflow-x-auto"><table><thead><tr><th>Invoice</th><th>Period</th><th>Amount</th><th>State</th></tr></thead><tbody>{[["INV-0926","Sep 2026","$8,400","Paid"],["INV-0826","Aug 2026","$8,400","Paid"],["INV-0726","Jul 2026","$8,400","Paid"]].map(([id,period,amount,state])=><tr key={id}><td><strong>{id}</strong></td><td>{period}</td><td>{amount}</td><td><StatusBadge tone="success">{state}</StatusBadge></td></tr>)}</tbody></table></div></Panel>
      </section>
    </>
  );
}
