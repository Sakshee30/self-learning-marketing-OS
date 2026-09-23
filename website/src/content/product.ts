export const operatingLoop = [
  "Goal",
  "Observe",
  "Understand",
  "Predict",
  "Decide",
  "Simulate",
  "Approve",
  "Execute",
  "Measure",
  "Learn",
  "Correct"
] as const;

export type CapabilityGroup = {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly string[];
};

export const capabilityGroups: readonly CapabilityGroup[] = [
  {
    eyebrow: "Start & command",
    title: "Give the AI a business outcome, not a pile of disconnected tasks.",
    description:
      "The launchpad and AI Command Center establish objectives, commercial constraints, evidence readiness, autonomy boundaries, and the ranked work that deserves attention next.",
    items: ["Workspace Launchpad", "AI Command Center", "AI CMO"]
  },
  {
    eyebrow: "Understand & decide",
    title: "Build a living model of the business before acting.",
    description:
      "GrowthOS brings business evidence, customer understanding, market signals, opportunities, and revenue intelligence into the decision process.",
    items: [
      "Business World Model",
      "Growth Opportunities",
      "Customers & Audiences",
      "Market Intelligence",
      "Revenue Intelligence"
    ]
  },
  {
    eyebrow: "Execute",
    title: "Turn approved strategy into coordinated specialist work.",
    description:
      "Execution surfaces cover the marketing disciplines that normally live across separate teams and tools while preserving explicit approval boundaries for material actions.",
    items: [
      "Campaigns",
      "Creative Studio",
      "SEO / GEO / AEO",
      "Social & Creator Growth",
      "Lifecycle / CRM",
      "Website Experience & CRO",
      "Automations",
      "AI Agents"
    ]
  },
  {
    eyebrow: "Learn",
    title: "Make every verified outcome improve the next decision.",
    description:
      "Experiments, memory, and the Growth Digital Twin connect hypotheses and forecasts with actual outcomes so the system can correct itself rather than repeat stale playbooks.",
    items: [
      "Experiments",
      "Marketing Memory",
      "Decision Memory",
      "Growth Digital Twin"
    ]
  },
  {
    eyebrow: "Govern & operate",
    title: "Keep consequential work visible, reviewable, and bounded.",
    description:
      "Approvals, audit trails, integrations, roles, usage, and workspace controls provide the operating envelope around autonomous work.",
    items: [
      "Human Approval Center",
      "Governance",
      "Audit & Decision Receipts",
      "Data & Integrations",
      "Team & Roles",
      "Billing & Usage",
      "Workspace Settings"
    ]
  }
] as const;

export const autonomyPolicies = [
  {
    label: "Autonomous",
    tone: "autonomous",
    summary: "Research, analysis, forecasting, drafting, opportunity detection, and side-effect-free simulation.",
    examples: ["Collect evidence", "Rank opportunities", "Draft strategy", "Simulate outcomes"]
  },
  {
    label: "Human approval",
    tone: "approval",
    summary: "Material actions wait for an authorized person when policy requires a decision.",
    examples: ["Budget changes", "External publishing", "Customer communication", "Production-impacting changes"]
  },
  {
    label: "Blocked / governed",
    tone: "blocked",
    summary: "Destructive, irreversible, or policy-bypassing actions stay outside ordinary autonomous execution.",
    examples: ["Destructive data actions", "Policy bypass", "Unauthorized execution", "Irreversible high-risk changes"]
  }
] as const;

export const decisionReceipt = [
  "Goal",
  "Evidence",
  "Forecast",
  "Policy verdict",
  "Approval",
  "Execution",
  "Provider confirmation",
  "Actual outcome",
  "Verification",
  "Learning"
] as const;

export const trustPrinciples = [
  {
    title: "Human approval is a system boundary",
    body:
      "Approval state is part of the execution lifecycle. A proposed or queued action is not presented as completed work."
  },
  {
    title: "Backend policy stays authoritative",
    body:
      "The interface may explain or disable unavailable actions, but backend authorization and policy evaluation remain the source of truth."
  },
  {
    title: "Workspace boundaries are explicit",
    body:
      "Protected requests are designed around authenticated organization, workspace, membership, permission, plan, and entitlement context."
  },
  {
    title: "Consequential actions are traceable",
    body:
      "Decision receipts connect the objective, evidence, forecast, policy verdict, approval, execution, outcome, verification, and learning."
  },
  {
    title: "Accessibility is part of completion",
    body:
      "The product contract targets WCAG 2.2 AA, including keyboard access, visible focus, associated errors, reflow, and non-drag alternatives."
  },
  {
    title: "Claims require evidence",
    body:
      "The website does not invent customer results, security certifications, or guaranteed outcomes that the repository cannot substantiate."
  }
] as const;
