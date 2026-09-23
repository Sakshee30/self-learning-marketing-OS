import type { Permission, Role, RoleDefinition } from "./types";

export const roleDefinitions: RoleDefinition[] = [
  {
    role: "super_admin",
    name: "Super Admin",
    description: "Platform-wide SaaS operations, tenants, plans, security and governance.",
    permissions: [
      "workspace.manage",
      "team.manage",
      "billing.manage",
      "campaigns.write",
      "creative.write",
      "automation.write",
      "analytics.view",
      "approvals.decide",
      "data.manage",
      "governance.manage",
      "platform.manage"
    ]
  },
  {
    role: "owner",
    name: "Workspace Owner",
    description: "Owns workspace configuration, billing, team access and all marketing operations.",
    permissions: [
      "workspace.manage",
      "team.manage",
      "billing.manage",
      "campaigns.write",
      "creative.write",
      "automation.write",
      "analytics.view",
      "approvals.decide",
      "data.manage",
      "governance.manage"
    ]
  },
  {
    role: "admin",
    name: "Workspace Admin",
    description: "Runs the workspace, integrations, team and governed execution.",
    permissions: [
      "workspace.manage",
      "team.manage",
      "campaigns.write",
      "creative.write",
      "automation.write",
      "analytics.view",
      "approvals.decide",
      "data.manage",
      "governance.manage"
    ]
  },
  {
    role: "marketing_manager",
    name: "Marketing Manager",
    description: "Plans and operates campaigns, content, audiences and lifecycle programs.",
    permissions: [
      "campaigns.write",
      "creative.write",
      "automation.write",
      "analytics.view",
      "approvals.decide"
    ]
  },
  {
    role: "analyst",
    name: "Analyst",
    description: "Reads performance, attribution, customer, experiment and data-quality insights.",
    permissions: ["analytics.view"]
  },
  {
    role: "approver",
    name: "Approver",
    description: "Reviews AI-proposed consequential actions and approves or rejects them.",
    permissions: ["analytics.view", "approvals.decide"]
  },
  {
    role: "viewer",
    name: "Viewer",
    description: "Read-only workspace visibility with no execution authority.",
    permissions: ["analytics.view"]
  }
];

export function permissionsFor(role: Role): Permission[] {
  return roleDefinitions.find((item) => item.role === role)?.permissions ?? [];
}

export function hasPermission(role: Role, permission?: Permission): boolean {
  if (!permission) return true;
  return permissionsFor(role).includes(permission);
}

export function roleLabel(role: Role): string {
  return roleDefinitions.find((item) => item.role === role)?.name ?? role;
}
