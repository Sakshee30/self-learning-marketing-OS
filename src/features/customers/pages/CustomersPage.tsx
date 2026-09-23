import { useMemo, useState } from "react";
import { Search, Sparkles, UserRoundCheck, Users } from "lucide-react";
import { Button, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

type Customer = {
  id: string;
  name: string;
  company: string;
  lifecycle: string;
  intent: number;
  ltv: number;
  leadScore: number;
  identity: string;
  source: string;
};

const customers: Customer[] = [
  { id: "CUS-1048", name: "Maya Patel", company: "Vertex Analytics", lifecycle: "Opportunity", intent: 94, ltv: 48200, leadScore: 92, identity: "Resolved", source: "Organic + LinkedIn" },
  { id: "CUS-1047", name: "Arjun Singh", company: "Acme Commerce", lifecycle: "Expansion", intent: 88, ltv: 71800, leadScore: 89, identity: "Resolved", source: "Product + CRM" },
  { id: "CUS-1046", name: "Elena Rossi", company: "Atlas Mobility", lifecycle: "Trial", intent: 81, ltv: 29400, leadScore: 84, identity: "Resolved", source: "Google Ads" },
  { id: "CUS-1045", name: "Noah Williams", company: "Northwind Ops", lifecycle: "Nurture", intent: 76, ltv: 21400, leadScore: 78, identity: "Partial", source: "Meta + Direct" }
];

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Customer>(customers[0]!);
  const [audienceStaged, setAudienceStaged] = useState(false);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return customers;
    return customers.filter((item) => [item.name, item.company, item.lifecycle, item.source].some((field) => field.toLowerCase().includes(value)));
  }, [query]);

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">CUSTOMER INTELLIGENCE · ENRICH</span>
          <h1>Customers & Audiences</h1>
          <p className="mt-3">
            Resolve identity across first-party touchpoints, enrich lifecycle context, score intent and value, and build activation-ready audiences without losing source lineage or consent boundaries.
          </p>
        </div>
        <Button onClick={() => setAudienceStaged(true)}><Users size={16} /> Build audience</Button>
      </header>

      {audienceStaged && (
        <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <strong className="text-sm text-violet-900">Audience draft staged</strong>
          <p className="mb-0 mt-1 text-xs text-violet-800">High-intent, high-LTV mid-market profiles are selected for review. No ad-platform or messaging activation has occurred.</p>
        </div>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Unified profiles" value="184K" detail="+6.4K this month" icon={<Users size={18} />} />
        <MetricCard label="Identity match rate" value="91.8%" detail="+1.7 pts" />
        <MetricCard label="High intent now" value="8,421" detail="+11% vs prior week" />
        <MetricCard label="Expansion-ready" value="2,104" detail="High-LTV cohort" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel className="p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div><span className="section-kicker">CUSTOMER GRAPH</span><h2>Resolved profiles</h2></div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer or company…" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Customer</th><th>Stage</th><th>Intent</th><th>Lead score</th><th>Predicted LTV</th><th>Identity</th></tr></thead>
              <tbody>{filtered.map((item) => (
                <tr key={item.id} onClick={() => setSelected(item)} className="cursor-pointer hover:bg-slate-50">
                  <td><strong>{item.name}</strong><div className="text-[11px] text-slate-400">{item.company}</div></td>
                  <td>{item.lifecycle}</td><td>{item.intent}%</td><td>{item.leadScore}</td><td>{"$"}{item.ltv.toLocaleString()}</td>
                  <td><StatusBadge tone={item.identity === "Resolved" ? "success" : "warning"}>{item.identity}</StatusBadge></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="flex items-center gap-2"><UserRoundCheck className="text-violet-700" size={19} /><span className="section-kicker mb-0">CUSTOMER 360</span></div>
          <h2 className="mt-3">{selected.name}</h2>
          <p>{selected.company} · {selected.lifecycle}</p>

          <div className="grid grid-cols-2 gap-2">
            {[
              ["Intent", selected.intent + "%"],
              ["Lead score", String(selected.leadScore)],
              ["Predicted LTV", "$" + selected.ltv.toLocaleString()],
              ["Identity", selected.identity],
              ["Primary source", selected.source],
              ["Consent", "Eligible"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3"><span className="text-xs text-growth-muted">{label}</span><strong className="mt-1 block text-xs">{value}</strong></div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-4">
            <div className="flex items-center gap-2"><Sparkles size={16} className="text-violet-700" /><strong className="text-xs text-violet-900">AI interpretation</strong></div>
            <p className="mb-0 mt-1 text-xs text-violet-800">
              This account matches the emerging high-LTV segment and shows strong pricing-page intent. Lifecycle activation would require approval if it introduces new outbound communication.
            </p>
          </div>
        </Panel>
      </section>
    </>
  );
}
