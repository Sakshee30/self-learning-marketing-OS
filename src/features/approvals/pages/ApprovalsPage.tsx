import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Filter,
  RefreshCw,
  ShieldCheck,
  X
} from "lucide-react";
import { approvals as seed } from "../../../data";
import { Badge, Button, PageHeader, RiskBadge } from "../../../components/Ui";
import {
  EvidenceViewer,
  ExecutionStatus,
  StatusBadge
} from "../../../shared/ui";
import { createOperationIdentity } from "../../../shared/mutations/operation";
import { operationLifecycleLabel } from "../../../shared/mutations/lifecycle";
import type { ApprovalItem } from "../../../types";
import type { ApprovalDecisionPreview, DecisionIntent } from "../types";
import { useAccessScope } from "../../workspace/hooks/useAccessScope";
import { DecisionJourney, GovernedExecutionLegend } from "../../../compositions/governed-execution/DecisionJourney";
import { decisionBelongsToScope, useGovernedExecutionStore } from "../../../compositions/governed-execution/store";

function lifecycleTone(decision?: ApprovalDecisionPreview): "neutral" | "success" | "warning" | "danger" | "accent" {
  if (!decision) return "neutral";
  if (decision.lifecycle === "confirmed_success") return "success";
  if (decision.lifecycle === "confirmed_rejection" || decision.lifecycle === "conflict") return "danger";
  if (decision.lifecycle === "submitting" || decision.lifecycle === "outcome_unknown") return "warning";
  return "accent";
}

export default function ApprovalsPage() {
  const accessScope = useAccessScope();
  const governedDecision = useGovernedExecutionStore((state) => state.current);
  const recordApprovalIntent = useGovernedExecutionStore((state) => state.recordApprovalIntent);
  const activeDecision =
    decisionBelongsToScope(governedDecision, accessScope) ? governedDecision : null;

  const items = useMemo<ApprovalItem[]>(() => {
    if (!activeDecision) return seed;

    const governedItem: ApprovalItem = {
      id: activeDecision.id,
      title: activeDecision.title,
      description: activeDecision.rationale,
      agent: "AI CMO",
      impact: activeDecision.simulation
        ? `Modeled pipeline ${activeDecision.simulation.modeledPipeline.toLocaleString()} with ${activeDecision.simulation.confidence}% confidence`
        : activeDecision.forecast,
      risk: activeDecision.risk,
      status: "Pending",
      requestedAt: "Just now"
    };

    return [governedItem, ...seed.filter((item) => item.id !== governedItem.id)];
  }, [activeDecision]);

  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id ?? "");
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecisionPreview>>({});

  useEffect(() => {
    if (activeDecision) setSelectedId(activeDecision.id);
  }, [activeDecision]);

  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const pending = useMemo(() => items.filter((item) => item.status === "Pending"), [items]);
  const selectedDecision = selected ? decisions[selected.id] : undefined;
  const selectedIsGovernedDecision = Boolean(activeDecision && selected?.id === activeDecision.id);

  function stageDecision(id: string, intent: DecisionIntent) {
    const operation = createOperationIdentity(accessScope ?? undefined);

    if (activeDecision && accessScope && id === activeDecision.id) {
      recordApprovalIntent(activeDecision.id, accessScope, intent, operation.operationId);
    }

    setDecisions((current) => ({
      ...current,
      [id]: {
        approvalId: id,
        intent,
        lifecycle: "submitting",
        requestedAt: new Date().toISOString(),
        operationId: operation.operationId
      }
    }));
  }

  function markUnknown(id: string) {
    setDecisions((current) => {
      const existing = current[id];
      if (!existing) return current;
      return {
        ...current,
        [id]: {
          ...existing,
          lifecycle: "outcome_unknown",
          requestId: "preview-lost-ack"
        }
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
                  className={"approval-master-item " + (selectedId === item.id ? "selected" : "")}
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="approval-master-line">
                    <strong>{item.title}</strong>
                    <StatusBadge tone={lifecycleTone(decision)}>
                      {decision ? operationLifecycleLabel(decision.lifecycle) : item.status}
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

              {selectedIsGovernedDecision && activeDecision ? (
                <div className="mb-4 grid gap-3">
                  <DecisionJourney stage={activeDecision.stage} />
                  <GovernedExecutionLegend />
                </div>
              ) : null}

              <EvidenceViewer
                title="Evidence behind this proposal"
                items={
                  selectedIsGovernedDecision && activeDecision
                    ? [
                        {
                          id: "goal-evidence",
                          label: "Business goal",
                          source: "AI CMO",
                          detail: activeDecision.goal
                        },
                        {
                          id: "simulation-evidence",
                          label: "Digital Twin simulation",
                          source: "Growth Digital Twin",
                          detail: activeDecision.simulation
                            ? `${activeDecision.simulation.scenarioName}: modeled pipeline ${activeDecision.simulation.modeledPipeline.toLocaleString()} at ${activeDecision.simulation.confidence}% confidence.`
                            : "Simulation evidence has not yet been attached."
                        },
                        {
                          id: "policy-evidence",
                          label: "Approval trigger",
                          source: "Governance",
                          detail: activeDecision.approvalReason
                        }
                      ]
                    : [
                        { id: "attribution", label: "Attribution model", source: "Revenue Intelligence", detail: "14-day holdout and CRM revenue reconciliation.", confidence: 94 },
                        { id: "policy", label: "Policy evaluation", source: "Governance", detail: "Budget, brand, audience and frequency guardrails passed." },
                        { id: "rollback", label: "Rollback plan", source: "Execution planner", detail: "The proposed change is reversible after provider confirmation." }
                      ]
                }
              />

              <div className="reasoning-box mt-4">
                <div className="reasoning-title"><ShieldCheck size={18} /> Why AI recommends this</div>
                <p>
                  The predicted upside remains positive under the conservative scenario, but execution changes a
                  material business lever, so policy requires human approval.
                </p>
              </div>

              <div className="impact-scenarios">
                <div><span>Conservative</span><strong>+3.1%</strong><small>Revenue lift</small></div>
                <div className="recommended"><span>Expected</span><strong>+7.8%</strong><small>Revenue lift</small></div>
                <div><span>Upside</span><strong>+12.6%</strong><small>Revenue lift</small></div>
              </div>

              {selectedDecision ? (
                <div className="mb-4 grid gap-3">
                  <ExecutionStatus
                    lifecycle={selectedDecision.lifecycle}
                    operationId={selectedDecision.operationId}
                    requestId={selectedDecision.requestId}
                    message={
                      selectedDecision.lifecycle === "submitting"
                        ? `Intent: ${selectedDecision.intent}. The UI is waiting for authoritative acknowledgement and does not mark this decision completed.`
                        : undefined
                    }
                  />

                  {selectedDecision.lifecycle === "submitting" && (
                    <button
                      type="button"
                      className="justify-self-start text-xs font-semibold text-amber-900"
                      onClick={() => markUnknown(selected.id)}
                    >
                      Simulate lost acknowledgement
                    </button>
                  )}
                </div>
              ) : null}

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
