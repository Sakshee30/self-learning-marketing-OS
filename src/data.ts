import type { Agent, ApprovalItem, Kpi, NavItem } from "./types";

export const navItems: NavItem[] = [
  { label: "Command Center", path: "/command", icon: "Sparkles", section: "Operate" },
  { label: "Business World Model", path: "/world-model", icon: "Globe2", section: "Think" },
  { label: "Growth Opportunities", path: "/opportunities", icon: "Telescope", section: "Think" },
  { label: "Revenue Intelligence", path: "/revenue", icon: "ChartNoAxesCombined", section: "Measure" },
  { label: "Customers & Audiences", path: "/customers", icon: "Users", section: "Understand" },
  { label: "Market Intelligence", path: "/market", icon: "Radar", section: "Understand" },
  { label: "Campaigns", path: "/campaigns", icon: "Megaphone", section: "Execute", permission: "campaigns.write" },
  { label: "Creative Studio", path: "/creative", icon: "Palette", section: "Execute", permission: "creative.write" },
  { label: "SEO & GEO", path: "/organic", icon: "SearchCheck", section: "Execute" },
  { label: "Social", path: "/social", icon: "MessageCircleMore", section: "Execute" },
  { label: "Lifecycle", path: "/lifecycle", icon: "Workflow", section: "Execute" },
  { label: "Experience & CRO", path: "/experiences", icon: "PanelsTopLeft", section: "Execute" },
  { label: "Experiments", path: "/experiments", icon: "FlaskConical", section: "Learn" },
  { label: "Automations", path: "/automations", icon: "Zap", section: "AI Workforce", permission: "automation.write" },
  { label: "AI Agents", path: "/agents", icon: "Bot", section: "AI Workforce" },
  { label: "Approvals", path: "/approvals", icon: "BadgeCheck", section: "AI Workforce", badge: "4" },
  { label: "Memory & Decisions", path: "/memory", icon: "BrainCircuit", section: "Learn" },
  { label: "Digital Twin", path: "/digital-twin", icon: "ScanSearch", section: "Learn" },
  { label: "Data & Integrations", path: "/data", icon: "Cable", section: "Platform", permission: "data.manage" },
  { label: "Governance", path: "/governance", icon: "ShieldCheck", section: "Platform", permission: "governance.manage" },
  { label: "Team & Roles", path: "/team", icon: "UserRoundCog", section: "Workspace", permission: "team.manage" },
  { label: "Billing & Usage", path: "/billing", icon: "CreditCard", section: "Workspace", permission: "billing.manage" },
  { label: "Super Admin", path: "/super-admin", icon: "Shield", section: "Platform", roles: ["super_admin"] }
];

export const kpis: Kpi[] = [
  { label: "Revenue influenced", value: "$1.84M", delta: "+18.6%", direction: "up", hint: "Attributed + modeled" },
  { label: "Incremental profit", value: "$418K", delta: "+12.4%", direction: "up", hint: "AI-optimized last 30d" },
  { label: "Qualified pipeline", value: "$3.2M", delta: "+9.1%", direction: "up", hint: "Across paid + lifecycle" },
  { label: "Cost per revenue $", value: "$0.21", delta: "-7.8%", direction: "down", hint: "Lower is better" }
];

export const approvals: ApprovalItem[] = [
  {
    id: "APR-1042",
    title: "Shift 18% budget from generic search to high-intent PMax",
    description: "Forecasted +$62K incremental revenue with stable CAC. Changes daily spend caps.",
    agent: "Paid Growth Agent",
    impact: "+$62K forecast revenue",
    risk: "High",
    status: "Pending",
    requestedAt: "8 min ago"
  },
  {
    id: "APR-1041",
    title: "Publish 14 GEO landing page improvements",
    description: "Updates answer-first copy and structured data on commercially important pages.",
    agent: "Organic Growth Agent",
    impact: "+11% answer visibility",
    risk: "Medium",
    status: "Pending",
    requestedAt: "21 min ago"
  },
  {
    id: "APR-1039",
    title: "Launch churn rescue journey for high-value accounts",
    description: "Targets accounts with declining product usage using email + CRM tasks.",
    agent: "Lifecycle Agent",
    impact: "$28K ARR protected",
    risk: "Medium",
    status: "Pending",
    requestedAt: "43 min ago"
  },
  {
    id: "APR-1038",
    title: "Pause 3 fatigued Meta creatives",
    description: "Frequency and conversion efficiency crossed the configured fatigue threshold.",
    agent: "Creative Intelligence",
    impact: "$4.1K spend protected",
    risk: "Low",
    status: "Pending",
    requestedAt: "1 hr ago"
  }
];

export const agents: Agent[] = [
  { name: "AI CMO", domain: "Cross-channel strategy", status: "Running", autonomy: "Approval required", actions: 28, outcome: "+$124K opportunity" },
  { name: "Paid Growth Agent", domain: "Google · Meta · LinkedIn", status: "Running", autonomy: "Approval required", actions: 47, outcome: "-8.4% blended CAC" },
  { name: "Organic Growth Agent", domain: "SEO · GEO · content", status: "Learning", autonomy: "Draft", actions: 19, outcome: "+13% organic pipeline" },
  { name: "Lifecycle Agent", domain: "Email · CRM · retention", status: "Running", autonomy: "Approval required", actions: 31, outcome: "+$39K expansion" },
  { name: "Creative Intelligence", domain: "Concepts · variants · fatigue", status: "Running", autonomy: "Draft", actions: 54, outcome: "+17% CTR" },
  { name: "Revenue Analyst", domain: "Attribution · incrementality · profit", status: "Waiting", autonomy: "Observe", actions: 15, outcome: "94% data confidence" }
];
