export type AiExecutionState =
  | "queued"
  | "researching"
  | "reasoning"
  | "planning"
  | "simulating"
  | "waiting_for_approval"
  | "approved"
  | "executing"
  | "verifying"
  | "completed"
  | "learning"
  | "failed"
  | "cancelled";

export type AiExecution = {
  id: string;
  workspaceId: string;
  goal: string;
  state: AiExecutionState;
  evidenceRefs: string[];
  approvalId?: string;
  decisionReceiptId?: string;
  createdAt: string;
  updatedAt: string;
};
