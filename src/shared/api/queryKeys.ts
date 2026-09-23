export const queryKeys = {
  workspace: (workspaceId: string) => ["workspace", workspaceId] as const,
  campaigns: (workspaceId: string) => ["workspace", workspaceId, "campaigns"] as const,
  customers: (workspaceId: string) => ["workspace", workspaceId, "customers"] as const,
  approvals: (workspaceId: string) => ["workspace", workspaceId, "approvals"] as const,
  agents: (workspaceId: string) => ["workspace", workspaceId, "agents"] as const,
  experiments: (workspaceId: string) => ["workspace", workspaceId, "experiments"] as const,
  integrations: (workspaceId: string) => ["workspace", workspaceId, "integrations"] as const,
  worldModel: (workspaceId: string) => ["workspace", workspaceId, "world-model"] as const
};
