import type { Organization, Workspace } from "../../shared/schemas/saas";

export const previewOrganizations: Organization[] = [
  {
    id: "org-northstar",
    name: "Northstar Labs",
    slug: "northstar-labs"
  }
];

export const previewWorkspaces: Workspace[] = [
  {
    id: "ws-production",
    organizationId: "org-northstar",
    name: "Production",
    slug: "production",
    plan: "enterprise",
    status: "active",
    timezone: "Asia/Kolkata",
    currency: "USD"
  },
  {
    id: "ws-growth-lab",
    organizationId: "org-northstar",
    name: "Growth Lab",
    slug: "growth-lab",
    plan: "growth",
    status: "trial",
    timezone: "Asia/Kolkata",
    currency: "USD"
  }
];

export function findOrganization(id: string | null) {
  return previewOrganizations.find((item) => item.id === id) ?? previewOrganizations[0];
}

export function findWorkspace(id: string | null) {
  return previewWorkspaces.find((item) => item.id === id) ?? previewWorkspaces[0];
}
