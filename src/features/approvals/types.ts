import type { OperationLifecycle } from "../../shared/mutations/lifecycle";

export type DecisionIntent = "approve" | "reject";
export type MutationLifecycle = OperationLifecycle;

export type ApprovalDecisionPreview = {
  approvalId: string;
  intent: DecisionIntent;
  lifecycle: MutationLifecycle;
  requestedAt: string;
  requestId: string;
};
