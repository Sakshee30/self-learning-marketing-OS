import { useMemo, useState } from "react";
import { Download, FileCheck2, Search } from "lucide-react";
import {
  Button,
  DecisionReceipt,
  EvidenceViewer,
  Input,
  MetricCard,
  Panel,
  Select,
  StatusBadge
} from "../../../shared/ui";

type Receipt = {
  id: string;
  time: string;
  actor: string;
  type: string;
  action: string;
  result: string;
  risk: "Low" | "Medium" | "High";
  goal: string;
  evidence: string[];
  forecast: string;
  policy: string;
  approval: string;
  verification: string;
};

const receipts: Receipt[] = [
  { id: "APR-1042", time: "21:36", actor: "AI CMO", type: "Decision", action: "Recommended paid-search budget reallocation", result: "Approval requested", risk: "High", goal: "Increase qualified pipeline without exceeding CAC $420", evidence: ["14 connected signals", "3 prior experiments", "Attribution confidence 94%"], forecast: "+$62K incremental revenue", policy: "Budget change requires human approval", approval: "Pending", verification: "Not executed" },
  { id: "VER-0918", time: "21:28", actor: "Revenue Analyst", type: "Verification", action: "Validated CRM revenue against campaign identifiers", result: "Verified", risk: "Low", goal: "Maintain trustworthy revenue attribution", evidence: ["CRM close events", "Campaign identity graph"], forecast: "N/A", policy: "Read-only verification", approval: "Not required", verification: "Verified" },
  { id: "POL-0831", time: "20:31", actor: "Policy Engine", type: "Guardrail", action: "Blocked publish because legal claim required review", result: "Blocked safely", risk: "High", goal: "Preserve brand/legal policy", evidence: ["Claim classifier", "Brand policy"], forecast: "Avoid unsafe publication", policy: "Legal claim review required", approval: "Blocked", verification: "Verified block" }
];

function policyVerdict(receipt: Receipt): "allow" | "approval_required" | "blocked" {
  if (receipt.approval === "Blocked") return "blocked";
  if (receipt.approval === "Pending") return "approval_required";
  return "allow";
}

function verificationState(receipt: Receipt): "pending" | "verified" | "failed" {
  if (receipt.verification.toLowerCase().includes("verified")) return "verified";
  return "pending";
}

export default function AuditPage() {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [selected, setSelected] = useState<Receipt>(receipts[0]!);

  const visible = useMemo(
    () =>
      receipts.filter(
        (item) =>
          (risk === "All" || item.risk === risk) &&
          (!query.trim() ||
            [item.id, item.actor, item.action, item.type].some((value) =>
              value.toLowerCase().includes(query.toLowerCase())
            ))
      ),
    [query, risk]
  );

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">TRUST, EVIDENCE & ACCOUNTABILITY</span>
          <h1>Audit & Decision Receipts</h1>
          <p className="mt-3">
            Frontend contract for tracing observations, recommendations, approvals, policy decisions,
            execution and verified outcomes. Preview records are clearly distinguished from the future immutable backend audit store.
          </p>
        </div>
        <Button variant="secondary"><Download size={16} /> Export request</Button>
      </header>

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Receipt examples" value="1,248" detail="Preview operating dataset" icon={<FileCheck2 size={18} />} />
        <MetricCard label="Policy checks" value="4,892" detail="100% represented" />
        <MetricCard label="Blocked safely" value="18" detail="No UI bypass state" />
        <MetricCard label="Receipt fields" value="100%" detail="Goal → verification" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_430px]">
        <Panel className="p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="section-kicker">AUDIT STREAM PREVIEW</span>
              <h2>Traceable activity</h2>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search receipts…" />
              </div>
              <Select value={risk} onChange={(event) => setRisk(event.target.value)} aria-label="Risk filter">
                <option>All</option><option>Low</option><option>Medium</option><option>High</option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Time</th><th>ID / Actor</th><th>Type</th><th>Action</th><th>Result</th><th>Risk</th></tr></thead>
              <tbody>
                {visible.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="cursor-pointer hover:bg-slate-50"
                    aria-selected={selected.id === item.id}
                  >
                    <td>{item.time}</td>
                    <td><strong>{item.id}</strong><div className="type-caption text-slate-400">{item.actor}</div></td>
                    <td>{item.type}</td>
                    <td>{item.action}</td>
                    <td><StatusBadge tone={item.result.includes("Blocked") ? "warning" : item.result === "Verified" ? "success" : "accent"}>{item.result}</StatusBadge></td>
                    <td><StatusBadge tone={item.risk === "High" ? "danger" : item.risk === "Medium" ? "warning" : "neutral"}>{item.risk}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid h-fit gap-4">
          <DecisionReceipt
            receipt={{
              receiptId: selected.id,
              goal: selected.goal,
              actor: selected.actor,
              evidenceCount: selected.evidence.length,
              forecast: selected.forecast,
              policyVerdict: policyVerdict(selected),
              approvalState: selected.approval,
              verificationState: verificationState(selected)
            }}
          />

          <EvidenceViewer
            title="Receipt evidence"
            items={selected.evidence.map((item, index) => ({
              id: selected.id + "-evidence-" + index,
              label: item,
              source: selected.type,
              detail: index === 0 ? selected.policy : "Linked evidence reference retained by the authoritative receipt."
            }))}
          />

          <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
            <p className="mb-0 text-xs text-violet-900">
              When the backend is connected, receipt IDs, actor identity, timestamps, policy verdicts and outcome
              verification come from durable server records. The frontend must never invent a confirmed receipt.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
