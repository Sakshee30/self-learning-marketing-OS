import type { Entitlement, Membership, Organization, Workspace } from "../../shared/schemas/saas";

export type UserIdentity = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

export type AppBootstrap = {
  user: UserIdentity;
  organizations: Organization[];
  workspaces: Workspace[];
  memberships: Membership[];
  entitlements: Entitlement[];
  activeOrganizationId: string | null;
  activeWorkspaceId: string | null;
};

export const EMPTY_BOOTSTRAP: AppBootstrap = {
  user: {
    id: "demo-user",
    email: "demo@growthos.local",
    displayName: "Demo user"
  },
  organizations: [],
  workspaces: [],
  memberships: [],
  entitlements: [],
  activeOrganizationId: null,
  activeWorkspaceId: null
};
