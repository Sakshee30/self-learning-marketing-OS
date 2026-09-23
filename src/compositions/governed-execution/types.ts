import type { AccessScope } from "../../shared/scope/accessScope";

export type GovernedDecisionStage =
  | "proposed"
  | "simulated"
  | "approval_required"
  | "approval_intent_submitted";

export type GovernedDecisionRisk = "Low" | "Medium" | "High";

export type GovernedDecisionSimulation = {
  scenarioName: string;
  modeledPipeline: number;
  incrementalSpend: number;
  confidence: number;
  risk: GovernedDecisionRisk;
  approvalRequired: boolean;
  simulatedAt: string;
};

export type GovernedDecisionDraft = {
  id: string;
  scope: AccessScope;
  source: "ai-cmo" | "digital-twin";
  title: string;
  goal: string;
  rationale: string;
  forecast: string;
  confidence: number;
  risk: GovernedDecisionRisk;
  approvalReason: string;
  evidenceRefs: string[];
  stage: GovernedDecisionStage;
  createdAt: string;
  simulation?: GovernedDecisionSimulation;
  approvalIntent?: {
    intent: "approve" | "reject";
    operationId: string;
    requestedAt: string;
  };
};
