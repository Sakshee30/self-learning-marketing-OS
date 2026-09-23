import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock3,
  FileCheck2,
  Filter,
  RefreshCw,
  ShieldCheck,
  X
} from "lucide-react";
import { approvals as seed } from "../../../data";
import { Badge, Button, PageHeader, RiskBadge } from "../../../components/Ui";
import { Panel, StatusBadge } from "../../../shared/ui";
import type { ApprovalItem } from "../../../types";
import type { ApprovalDecisionPreview, DecisionIntent } from "../types";

function lifecycleLabel(decision?: ApprovalDecisionPreview) {
  if (!decision) return "No decision submitted";
  switch (decision.lifecycle) {
    case "validating": return "Validating authority";
    case "submitting": return "Awaiting backend confirmation";
    case "confirmed_success": return "Confirmed";
    case "confirmed_rejection": return "Rejected by backend";
    case "conflict": return "Conflict";
    case "outcome_unknown": return "Outcome unknown";
    default: return "Ready";
  }
}

function lifecycleTone(decision?: ApprovalDecisionPreview): "neutral" | "success" | "warning" | "danger" | "accent" {
  if (!decision) return "neutral";
  if (decision.lifecycle === "confirmed_success") return "success";
  if (decision.lifecycle === "confirmed_rejection" || decision.lifecycle === "conflict") return "danger";
  if (decision.lifecycle === "submitting" || decision.lifecycle === "outcome_unknown") return "warning";
  return "accent";
}

export default function ApprovalsPage() {
  const [items] = useState<ApprovalItem[]>(seed);
  const [selected, setSelected] = useState<ApprovalItem | null>(items[0] ?? null);
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecisionPreview>>({});

  const pending = useMemo(() => items.filter((item) => item.status === "Pending"), [items]);
  const selectedDecision = selected ? decisions[selected.id] : undefined;

  function stageDecision(id: string, intent: DecisionIntent) {
    const requestId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

    setDecisions((current) => ({
      ...current,
      [id]: {
        approvalId: id,
        intent,
        lifecycle: "submitting",
        requestedAt: new Date().toISOString(),
        requestId
      }
    }));
  }

  function markUnknown(id: string) {
    setDecisions((current) => {
      const existing = current[id];
      if (!existing) return current;
      return {
        ...current,
        [id]: { ...existing, lifecycle: "outcome_unknown" }
      };
    });
  }

  function resetPreview(id: string) {
    setDecisions((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="GOVERNED AUTONOMY"
        title="Approval Center"
        description="Review consequential AI proposals with evidence, forecast, policy verdict and rollback context. The frontend records an intent; only the backend may confirm the durable decision."
        actions={<Button variant="secondary"><Filter size={16} /> Filters</Button>}
      />

      <div className="approval-summary">
        <div><span>Pending</span><strong>{pending.length}</strong><small>Needs human decision</small></div>
        <div><span>Decision intents</span><strong>{Object.keys(decisions).length}</strong><small>Frontend preview requests</small></div>
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
            {items.map((item) => {
              const decision = decisions[item.id];
              return (
                <button
                  className={"approval-master-item " + (selected?.id === item.id ? "selected" : "")}
                  key={item.id}
                  onClick={() => setSelected(item)}
                >
                  <div className="approval-master-line">
                    <strong>{item.title}</strong>
                    <StatusBadge tone={lifecycleTone(decision)}>
                      {decision ? lifecycleLabel(decision) : item.status}
                    </StatusBadge>
                  </div>
                  <p>{item.agent}</p>
                  <div><RiskBadge risk={item.risk} /><span>{item.requestedAt}</span></div>
                </button>
              );
            })}
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
                  <span>Attribution confidence 94%</span>
                  <span>14-day holdout</span>
                  <span>Spend guardrail passed</span>
                  <span>Rollback plan attached</span>
                </div>
              </div>

              <div className="impact-scenarios">
                <div><span>Conservative</span><strong>+3.1%</strong><small>Revenue lift</small></div>
                <div className="recommended"><span>Expected</span><strong>+7.8%</strong><small>Revenue lift</small></div>
                <div><span>Upside</span><strong>+12.6%</strong><small>Revenue lift</small></div>
              </div>

              <Panel className="mb-4 p-4 shadow-none">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    {selectedDecision?.lifecycle === "outcome_unknown"
                      ? <AlertTriangle className="mt-0.5 text-amber-700" size={19} />
                      : selectedDecision
                        ? <Clock3 className="mt-0.5 text-violet-700" size={19} />
                        : <FileCheck2 className="mt-0.5 text-slate-500" size={19} />}
                    <div>
                      <span className="section-kicker">DECISION MUTATION</span>
                      <strong className="block text-sm">{lifecycleLabel(selectedDecision)}</strong>
                      <p className="mb-0 mt-1 text-xs text-growth-muted">
                        {selectedDecision
                          ? "Intent: " + selectedDecision.intent + ". Request ID: " + selectedDecision.requestId
                          : "No decision has been sent. Review evidence and choose an intent when ready."}
                      </p>
                    </div>
                  </div>
                  <StatusBadge tone={lifecycleTone(selectedDecision)}>{lifecycleLabel(selectedDecision)}</StatusBadge>
                </div>

                {selectedDecision?.lifecycle === "submitting" && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <strong className="text-xs text-amber-900">Waiting for authoritative acknowledgement</strong>
                    <p className="mb-0 mt-1 text-xs text-amber-800">
                      The UI deliberately does not change this approval to completed. When the backend exists it must return the durable approval state, receipt reference and execution eligibility.
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-amber-900"
                      onClick={() => markUnknown(selected.id)}
                    >
                      Simulate lost acknowledgement
                    </button>
                  </div>
                )}

                {selectedDecision?.lifecycle === "outcome_unknown" && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <strong className="text-xs text-red-900">Outcome is unknown—do not retry blindly</strong>
                    <p className="mb-0 mt-1 text-xs text-red-800">
                      A production client must reconcile using the idempotency/request ID before issuing another decision.
                    </p>
                  </div>
                )}
              </Panel>

              <div className="approval-actions">
                {selectedDecision ? (
                  <Button variant="secondary" onClick={() => resetPreview(selected.id)}>
                    <RefreshCw size={16} /> Reset preview intent
                  </Button>
                ) : (
                  <>
                    <Button variant="danger" onClick={() => stageDecision(selected.id, "reject")}>
                      <X size={16} /> Submit reject intent
                    </Button>
                    <Button onClick={() => stageDecision(selected.id, "approve")}>
                      <Check size={16} /> Submit approval intent
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </article>
      </div>
    </>
  );
}
