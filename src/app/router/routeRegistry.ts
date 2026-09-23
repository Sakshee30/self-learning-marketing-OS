import type { Permission } from "../../types";

export type UnsavedWorkPolicy = "none" | "warn" | "preserve";

export type CustomerRouteMeta = {
  id: string;
  path: string;
  title: string;
  breadcrumb: string;
  section?: string;
  icon?: string;
  permission?: Permission;
  capability?: string;
  authenticationRequired: boolean;
  workspaceRequired: boolean;
  unsavedWorkPolicy: UnsavedWorkPolicy;
  navigation?: boolean;
  badge?: string;
};

export const customerRouteRegistry: CustomerRouteMeta[] = [
  {
    id: "auth.sign-in",
    path: "/auth/sign-in",
    title: "Sign in",
    breadcrumb: "Sign in",
    authenticationRequired: false,
    workspaceRequired: false,
    unsavedWorkPolicy: "none"
  },
  {
    id: "auth.sign-up",
    path: "/auth/sign-up",
    title: "Create account",
    breadcrumb: "Create account",
    authenticationRequired: false,
    workspaceRequired: false,
    unsavedWorkPolicy: "warn"
  },
  {
    id: "auth.forgot-password",
    path: "/auth/forgot-password",
    title: "Reset password",
    breadcrumb: "Reset password",
    authenticationRequired: false,
    workspaceRequired: false,
    unsavedWorkPolicy: "warn"
  },
  {
    id: "onboarding",
    path: "/onboarding",
    title: "Workspace onboarding",
    breadcrumb: "Onboarding",
    authenticationRequired: true,
    workspaceRequired: false,
    unsavedWorkPolicy: "preserve"
  },
  {
    id: "launchpad",
    path: "/launchpad",
    title: "Workspace Launchpad",
    breadcrumb: "Launchpad",
    section: "Start",
    icon: "Settings2",
    permission: "workspace.manage",
    capability: "workspace",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "command-center",
    path: "/command",
    title: "AI Command Center",
    breadcrumb: "Command Center",
    section: "Operate",
    icon: "Sparkles",
    capability: "command_center",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "ai-cmo",
    path: "/ai-cmo",
    title: "AI CMO",
    breadcrumb: "AI CMO",
    section: "Operate",
    icon: "BrainCircuit",
    capability: "ai_cmo",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "world-model",
    path: "/world-model",
    title: "Business World Model",
    breadcrumb: "World Model",
    section: "Think",
    icon: "Globe2",
    capability: "world_model",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "opportunities",
    path: "/opportunities",
    title: "Growth Opportunities",
    breadcrumb: "Opportunities",
    section: "Think",
    icon: "Telescope",
    capability: "opportunities",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "revenue",
    path: "/revenue",
    title: "Revenue Intelligence",
    breadcrumb: "Revenue",
    section: "Measure",
    icon: "ChartNoAxesCombined",
    capability: "revenue",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "customers",
    path: "/customers",
    title: "Customers & Audiences",
    breadcrumb: "Customers",
    section: "Understand",
    icon: "Users",
    capability: "customers",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "market",
    path: "/market",
    title: "Market Intelligence",
    breadcrumb: "Market",
    section: "Understand",
    icon: "Radar",
    capability: "market",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "campaigns",
    path: "/campaigns",
    title: "Campaigns",
    breadcrumb: "Campaigns",
    section: "Execute",
    icon: "Megaphone",
    permission: "campaigns.write",
    capability: "campaigns",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "creative",
    path: "/creative",
    title: "Creative Studio",
    breadcrumb: "Creative",
    section: "Execute",
    icon: "Palette",
    permission: "creative.write",
    capability: "creative",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "organic",
    path: "/organic",
    title: "SEO & GEO",
    breadcrumb: "SEO & GEO",
    section: "Execute",
    icon: "SearchCheck",
    capability: "organic",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "social",
    path: "/social",
    title: "Social & Creator Growth",
    breadcrumb: "Social",
    section: "Execute",
    icon: "MessageCircleMore",
    capability: "social",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "lifecycle",
    path: "/lifecycle",
    title: "Lifecycle & CRM",
    breadcrumb: "Lifecycle",
    section: "Execute",
    icon: "Workflow",
    capability: "lifecycle",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "experiences",
    path: "/experiences",
    title: "Experience & CRO",
    breadcrumb: "Experience & CRO",
    section: "Execute",
    icon: "PanelsTopLeft",
    capability: "experiences",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "experiments",
    path: "/experiments",
    title: "Experiments",
    breadcrumb: "Experiments",
    section: "Learn",
    icon: "FlaskConical",
    capability: "experiments",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "automations",
    path: "/automations",
    title: "Automations",
    breadcrumb: "Automations",
    section: "AI Workforce",
    icon: "Zap",
    permission: "automation.write",
    capability: "automations",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "agents",
    path: "/agents",
    title: "AI Agents",
    breadcrumb: "AI Agents",
    section: "AI Workforce",
    icon: "Bot",
    capability: "agents",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "approvals",
    path: "/approvals",
    title: "Human Approval Center",
    breadcrumb: "Approvals",
    section: "AI Workforce",
    icon: "BadgeCheck",
    permission: "approvals.decide",
    capability: "approvals",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true,
    badge: "4"
  },
  {
    id: "memory",
    path: "/memory",
    title: "Marketing Memory & Decisions",
    breadcrumb: "Memory & Decisions",
    section: "Learn",
    icon: "BrainCircuit",
    capability: "memory",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "digital-twin",
    path: "/digital-twin",
    title: "Growth Digital Twin",
    breadcrumb: "Digital Twin",
    section: "Learn",
    icon: "ScanSearch",
    capability: "digital_twin",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "data",
    path: "/data",
    title: "Data & Integrations",
    breadcrumb: "Data & Integrations",
    section: "Platform",
    icon: "Cable",
    permission: "data.manage",
    capability: "integrations",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "governance",
    path: "/governance",
    title: "Governance",
    breadcrumb: "Governance",
    section: "Platform",
    icon: "ShieldCheck",
    permission: "governance.manage",
    capability: "governance",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "audit",
    path: "/audit",
    title: "Audit & Decision Receipts",
    breadcrumb: "Audit & Receipts",
    section: "Platform",
    icon: "ShieldCheck",
    permission: "governance.manage",
    capability: "audit",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "team",
    path: "/team",
    title: "Team & Roles",
    breadcrumb: "Team & Roles",
    section: "Workspace",
    icon: "UserRoundCog",
    permission: "team.manage",
    capability: "team",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  },
  {
    id: "billing",
    path: "/billing",
    title: "Billing & Usage",
    breadcrumb: "Billing & Usage",
    section: "Workspace",
    icon: "CreditCard",
    permission: "billing.manage",
    capability: "billing",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "none",
    navigation: true
  },
  {
    id: "settings",
    path: "/settings",
    title: "Workspace Settings",
    breadcrumb: "Workspace Settings",
    section: "Workspace",
    icon: "Settings2",
    permission: "workspace.manage",
    capability: "settings",
    authenticationRequired: true,
    workspaceRequired: true,
    unsavedWorkPolicy: "preserve",
    navigation: true
  }
];

export function routeMetaFor(pathname: string) {
  return customerRouteRegistry.find((route) => route.path === pathname);
}

export const customerNavigationRoutes = customerRouteRegistry.filter((route) => route.navigation);
