import { useMemo, useState } from "react";
import {
  Cable,
  CheckCircle2,
  CircleAlert,
  PlugZap,
  RefreshCw,
  Search,
  ShieldCheck
} from "lucide-react";
import { Button, Input, IntegrationCard, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

type ConnectionStatus = "connected" | "attention" | "available" | "setup_required";

type Integration = {
  id: string;
  name: string;
  category: string;
  status: ConnectionStatus;
  purpose: string;
  freshness: string;
  confidence: string;
  scopes: string[];
};

const seedIntegrations: Integration[] = [
  {
    id: "website",
    name: "Website & Product Analytics",
    category: "First-party",
    status: "connected",
    purpose: "Events, sessions, conversion and product behavior",
    freshness: "Real time",
    confidence: "99.8%",
    scopes: ["events:read", "conversions:read", "sessions:read"]
  },
  {
    id: "crm",
    name: "CRM & Pipeline",
    category: "Revenue",
    status: "attention",
    purpose: "Leads, accounts, opportunities and revenue outcomes",
    freshness: "2 min",
    confidence: "93%",
    scopes: ["contacts:read", "opportunities:read", "revenue:read"]
  },
  {
    id: "google",
    name: "Google Ads",
    category: "Paid media",
    status: "connected",
    purpose: "Campaigns, spend, clicks, search terms and conversions",
    freshness: "3 min",
    confidence: "99.4%",
    scopes: ["campaigns:read", "spend:read", "conversions:write"]
  },
  {
    id: "meta",
    name: "Meta Ads",
    category: "Paid media",
    status: "connected",
    purpose: "Campaigns, creatives, audiences and conversion signals",
    freshness: "5 min",
    confidence: "99.1%",
    scopes: ["campaigns:read", "audiences:write", "capi:write"]
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    category: "Paid media",
    status: "available",
    purpose: "B2B campaign, audience and lead-gen evidence",
    freshness: "Not connected",
    confidence: "—",
    scopes: ["campaigns:read", "leads:read"]
  },
  {
    id: "email",
    name: "Email & Lifecycle",
    category: "Lifecycle",
    status: "setup_required",
    purpose: "Journeys, engagement, suppression and attributed revenue",
    freshness: "Setup required",
    confidence: "—",
    scopes: ["events:read", "messages:write", "suppression:read"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "Messaging",
    status: "available",
    purpose: "Lead conversations, templates and lifecycle activation",
    freshness: "Not connected",
    confidence: "—",
    scopes: ["messages:read", "templates:read", "messages:write"]
  },
  {
    id: "warehouse",
    name: "Data Warehouse",
    category: "Data",
    status: "available",
    purpose: "Modeled customer, product and revenue evidence",
    freshness: "Not connected",
    confidence: "—",
    scopes: ["tables:read"]
  }
];

function statusTone(status: ConnectionStatus): "success" | "warning" | "danger" | "neutral" {
  if (status === "connected") return "success";
  if (status === "attention") return "warning";
  if (status === "setup_required") return "danger";
  return "neutral";
}

function statusLabel(status: ConnectionStatus) {
  return status.replaceAll("_", " ");
}

export default function IntegrationsPage() {
  const [items, setItems] = useState(seedIntegrations);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((item) =>
      [item.name, item.category, item.purpose].some((field) => field.toLowerCase().includes(value))
    );
  }, [items, query]);

  const connected = items.filter((item) => item.status === "connected").length;
  const attention = items.filter((item) => item.status === "attention" || item.status === "setup_required").length;

  function beginConnection(item: Integration) {
    setNotice(
      item.name + " is ready for backend OAuth/API authorization. The frontend will not pretend the connection succeeded before the provider confirms it."
    );
    setItems((current) =>
      current.map((candidate) =>
        candidate.id === item.id && candidate.status === "available"
          ? { ...candidate, status: "setup_required" }
          : candidate
      )
    );
  }

  function refreshMetadata(item: Integration) {
    setNotice(
      item.name + " metadata refresh was requested in the frontend preview. Freshness and provider health remain unchanged until the backend returns authoritative sync state."
    );
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">EVIDENCE FABRIC</span>
          <h1>Data & Integrations</h1>
          <p className="mt-3">
            Connect first-party behavior, ad platforms, CRM, lifecycle, commerce and warehouse evidence.
            Every source exposes freshness, scopes, quality and activation authority separately.
          </p>
        </div>
        <Button onClick={() => { setQuery(""); setNotice("Select an available provider below to begin its governed connection flow."); }}><PlugZap size={16} /> Add integration</Button>
      </header>

      {notice && (
        <div className="mb-4 flex items-start justify-between gap-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="flex gap-2">
            <ShieldCheck className="mt-0.5 text-violet-700" size={18} />
            <p className="mb-0 text-xs text-violet-900">{notice}</p>
          </div>
          <button className="text-xs font-semibold text-violet-700" onClick={() => setNotice(null)}>Dismiss</button>
        </div>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Connected sources" value={String(connected)} detail="Authoritative provider connection" icon={<Cable size={18} />} />
        <MetricCard label="Needs attention" value={String(attention)} detail="Schema or setup issue" icon={<CircleAlert size={18} />} />
        <MetricCard label="Events / day" value="8.4M" detail="+9% vs prior 30d" />
        <MetricCard label="Data trust score" value="94%" detail="Revenue-linked confidence" />
      </section>

      <Panel className="mb-4 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="section-kicker">CONNECTION CATALOG</span>
            <h2>Operating systems</h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} />
            <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search integrations…" aria-label="Search integrations" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {filtered.map((item) => (
            <IntegrationCard
              key={item.id}
              name={item.name}
              category={item.category}
              description={item.purpose}
              status={statusLabel(item.status)}
              statusTone={statusTone(item.status)}
              freshness={item.freshness}
              confidence={item.confidence}
              scopes={item.scopes}
              action={
                item.status === "connected" ? (
                  <Button variant="secondary" onClick={() => refreshMetadata(item)}>
                    <RefreshCw size={15} /> Refresh metadata
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => beginConnection(item)}>
                    Configure connection
                  </Button>
                )
              }
            />
          ))}
        </div>
      </Panel>

      <section className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <div>
              <span className="section-kicker">ADSYNC</span>
              <h2>Conversion activation readiness</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ["Meta CAPI", "Ready", "Browser + server event deduplication configured"],
              ["Google Enhanced Conversions", "Ready", "Hashed first-party identifiers available"],
              ["Offline revenue sync", "Attention", "CRM campaign identifiers missing on 7% of closed opportunities"],
              ["Audience sync", "Ready", "Consent and suppression checks enabled"]
            ].map(([name, status, detail]) => (
              <div key={name} className="flex items-start justify-between gap-3 rounded-lg border border-growth-line p-3">
                <div>
                  <strong className="block text-sm">{name}</strong>
                  <span className="mt-1 block text-xs leading-5 text-growth-muted">{detail}</span>
                </div>
                <StatusBadge tone={status === "Ready" ? "success" : "warning"}>{status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <span className="section-kicker">DATA QUALITY</span>
          <h2>Current issue</h2>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <strong className="text-sm text-amber-900">CRM opportunity lineage gap</strong>
            <p className="mb-0 mt-2 text-xs leading-5 text-amber-800">
              Seven percent of recently closed opportunities are missing source-normalized campaign identifiers.
              Revenue reporting remains available, but attribution confidence is reduced until mapping is repaired.
            </p>
          </div>
          <Button className="mt-4" variant="secondary">Open data-quality workflow</Button>
        </Panel>
      </section>
    </>
  );
}
