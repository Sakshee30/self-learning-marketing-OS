import { useMemo, useState } from "react";
import { Check, Filter, ShieldCheck, X } from "lucide-react";
import { approvals as seed } from "../data";
import { Badge, Button, PageHeader, RiskBadge } from "../components/Ui";
import type { ApprovalItem } from "../types";

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>(seed);
  const [selected, setSelected] = useState<ApprovalItem | null>(items[0] ?? null);

  const pending = useMemo(() => items.filter((item) => item.status === "Pending"), [items]);

  function decide(id: string, status: "Approved" | "Rejected") {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    setSelected((current) => (current?.id === id ? { ...current, status } : current));
  }

  return (
    <>
      <PageHeader
        eyebrow="GOVERNED AUTONOMY"
        title="Approval Center"
        description="The AI can explore, analyze and prepare work automatically. Material changes stay here until an authorized human approves them."
        actions={<Button variant="secondary"><Filter size={16} /> Filters</Button>}
      />

      <div className="approval-summary">
        <div><span>Pending</span><strong>{pending.length}</strong><small>Needs human decision</small></div>
        <div><span>Approved today</span><strong>{items.filter((i) => i.status === "Approved").length + 12}</strong><small>Across 5 agents</small></div>
        <div><span>Median review time</span><strong>11m</strong><small>Within 30m policy</small></div>
        <div><span>Protected spend</span><strong>$84K</strong><small>Covered by approval gates</small></div>
      </div>

      <div className="split-layout">
        <article className="panel approval-master">
          <div className="panel-head compact">
            <h2>Decision queue</h2>
            <Badge tone="warning">{pending.length} pending</Badge>
          </div>
          <div className="approval-master-list">
            {items.map((item) => (
              <button
                className={"approval-master-item " + (selected?.id === item.id ? "selected" : "")}
                key={item.id}
                onClick={() => setSelected(item)}
              >
                <div className="approval-master-line">
                  <strong>{item.title}</strong>
                  <Badge tone={item.status === "Approved" ? "success" : item.status === "Rejected" ? "danger" : "warning"}>
                    {item.status}
                  </Badge>
                </div>
                <p>{item.agent}</p>
                <div><RiskBadge risk={item.risk} /><span>{item.requestedAt}</span></div>
              </button>
            ))}
          </div>
        </article>

        <article className="panel approval-detail">
          {selected && (
            <>
              <div className="approval-detail-top">
                <div>
                  <span className="section-kicker">{selected.id}</span>
                  <h2>{selected.title}</h2>
                </div>
                <RiskBadge risk={selected.risk} />
              </div>
              <p className="lead">{selected.description}</p>

              <div className="decision-evidence">
                <div><span>Proposed by</span><strong>{selected.agent}</strong></div>
                <div><span>Expected impact</span><strong>{selected.impact}</strong></div>
                <div><span>Confidence</span><strong>87%</strong></div>
                <div><span>Rollback</span><strong>Available</strong></div>
              </div>

              <div className="reasoning-box">
                <div className="reasoning-title"><ShieldCheck size={18} /> Why AI recommends this</div>
                <p>
                  The recommendation passed budget, brand, audience, frequency and attribution policy checks.
                  The predicted upside remains positive under the conservative scenario, but execution changes a
                  material business lever, so policy requires human approval.
                </p>
                <div className="evidence-chips">
                  <span>Attribution confidence 94%</span><span>14-day holdout</span><span>Spend guardrail passed</span>
                </div>
              </div>

              <div className="impact-scenarios">
                <div><span>Conservative</span><strong>+3.1%</strong><small>Revenue lift</small></div>
                <div className="recommended"><span>Expected</span><strong>+7.8%</strong><small>Revenue lift</small></div>
                <div><span>Upside</span><strong>+12.6%</strong><small>Revenue lift</small></div>
              </div>

              <div className="approval-actions">
                <Button variant="danger" disabled={selected.status !== "Pending"} onClick={() => decide(selected.id, "Rejected")}><X size={16} /> Reject</Button>
                <Button disabled={selected.status !== "Pending"} onClick={() => decide(selected.id, "Approved")}><Check size={16} /> Approve & execute</Button>
              </div>
            </>
          )}
        </article>
      </div>
    </>
  );
}
