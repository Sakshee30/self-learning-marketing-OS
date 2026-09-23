import { create } from "zustand";
import type { AccessScope } from "../../shared/scope/accessScope";
import type {
  GovernedDecisionDraft,
  GovernedDecisionSimulation
} from "./types";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `decision-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sameScope(left: AccessScope, right: AccessScope) {
  return (
    left.sessionGeneration === right.sessionGeneration &&
    left.organizationId === right.organizationId &&
    left.workspaceId === right.workspaceId &&
    left.scopeGeneration === right.scopeGeneration
  );
}

type GovernedExecutionState = {
  current: GovernedDecisionDraft | null;
  stageProposal: (
    scope: AccessScope,
    proposal: Omit<
      GovernedDecisionDraft,
      "id" | "scope" | "source" | "stage" | "createdAt" | "simulation" | "approvalIntent"
    >
  ) => GovernedDecisionDraft;
  attachSimulation: (
    id: string,
    scope: AccessScope,
    simulation: GovernedDecisionSimulation
  ) => void;
  requireApproval: (id: string, scope: AccessScope) => void;
  recordApprovalIntent: (
    id: string,
    scope: AccessScope,
    intent: "approve" | "reject",
    operationId: string
  ) => void;
  clear: () => void;
};

export const useGovernedExecutionStore = create<GovernedExecutionState>((set, get) => ({
  current: null,

  stageProposal: (scope, proposal) => {
    const draft: GovernedDecisionDraft = {
      ...proposal,
      id: createId(),
      scope,
      source: "ai-cmo",
      stage: "proposed",
      createdAt: new Date().toISOString()
    };

    set({ current: draft });
    return draft;
  },

  attachSimulation: (id, scope, simulation) => {
    const current = get().current;
    if (!current || current.id !== id || !sameScope(current.scope, scope)) return;

    set({
      current: {
        ...current,
        source: "digital-twin",
        simulation,
        stage: "simulated"
      }
    });
  },

  requireApproval: (id, scope) => {
    const current = get().current;
    if (!current || current.id !== id || !sameScope(current.scope, scope)) return;

    set({
      current: {
        ...current,
        stage: "approval_required"
      }
    });
  },

  recordApprovalIntent: (id, scope, intent, operationId) => {
    const current = get().current;
    if (!current || current.id !== id || !sameScope(current.scope, scope)) return;

    set({
      current: {
        ...current,
        stage: "approval_intent_submitted",
        approvalIntent: {
          intent,
          operationId,
          requestedAt: new Date().toISOString()
        }
      }
    });
  },

  clear: () => set({ current: null })
}));

export function decisionBelongsToScope(
  decision: GovernedDecisionDraft | null,
  scope: AccessScope | null
) {
  if (!decision || !scope) return false;
  return sameScope(decision.scope, scope);
}
