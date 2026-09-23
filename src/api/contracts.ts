import type { ApprovalItem, Role } from "../types";

export interface SessionResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  workspace: {
    id: string;
    name: string;
    plan: string;
  };
  role: Role;
}

export interface Goal {
  id: string;
  name: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  status: "on_track" | "at_risk" | "off_track";
}

export interface ApprovalDecisionRequest {
  decision: "approve" | "reject";
  reason?: string;
  expectedVersion: number;
}

export interface ApprovalDecisionResponse {
  approval: ApprovalItem;
  executionId?: string;
  auditReceiptId: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  state: "queued" | "running" | "waiting_approval" | "verified" | "failed";
  startedAt: string;
  approvalId?: string;
}

export interface IntegrationHealth {
  id: string;
  provider: string;
  status: "healthy" | "warning" | "error";
  lastSyncAt: string | null;
  latencySeconds: number | null;
}

export interface UsageSummary {
  period: string;
  seats: { used: number; limit: number };
  agentActions: number;
  modelTokens: number;
  eventVolume: number;
  estimatedCost: number;
}

/**
 * Backend contract map:
 * GET    /v1/session
 * GET    /v1/goals/current
 * GET    /v1/command-center
 * GET    /v1/approvals
 * POST   /v1/approvals/:id/decision
 * GET    /v1/agents
 * GET    /v1/automations
 * POST   /v1/automations/:id/runs
 * GET    /v1/integrations
 * GET    /v1/usage
 * GET    /v1/audit
 *
 * Consequential mutations must be authorized server-side. Frontend RBAC is UX only.
 */
