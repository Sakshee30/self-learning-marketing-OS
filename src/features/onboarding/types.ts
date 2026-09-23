export type OnboardingStep =
  | "workspace"
  | "company"
  | "integrations"
  | "business"
  | "goals"
  | "autonomy"
  | "approvals"
  | "world-model";

export const onboardingSteps: Array<{ id: OnboardingStep; label: string }> = [
  { id: "workspace", label: "Create workspace" },
  { id: "company", label: "Company profile" },
  { id: "integrations", label: "Connect data" },
  { id: "business", label: "Define business" },
  { id: "goals", label: "Set growth goals" },
  { id: "autonomy", label: "AI autonomy" },
  { id: "approvals", label: "Approval rules" },
  { id: "world-model", label: "Build world model" }
];
