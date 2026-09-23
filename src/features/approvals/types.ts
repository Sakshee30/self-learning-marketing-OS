export type DecisionIntent = "approve" | "reject";

export type MutationLifecycle =
  | "idle"
  | "validating"
  | "submitting"
  | "confirmed_success"
  | "confirmed_rejection"
  | "conflict"
  | "outcome_unknown";

export type ApprovalDecisionPreview = {
  approvalId: string;
  intent: DecisionIntent;
  lifecycle: MutationLifecycle;
  requestedAt: string;
  requestId: string;
};
