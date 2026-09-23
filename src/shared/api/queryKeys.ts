import { accessScopeKey, type AccessScope } from "../scope/accessScope";

function featureKey(scope: AccessScope, feature: string) {
  return [...accessScopeKey(scope), feature] as const;
}

export const queryKeys = {
  scope: (scope: AccessScope) => accessScopeKey(scope),
  workspace: (scope: AccessScope) => featureKey(scope, "workspace"),
  campaigns: (scope: AccessScope) => featureKey(scope, "campaigns"),
  customers: (scope: AccessScope) => featureKey(scope, "customers"),
  approvals: (scope: AccessScope) => featureKey(scope, "approvals"),
  agents: (scope: AccessScope) => featureKey(scope, "agents"),
  experiments: (scope: AccessScope) => featureKey(scope, "experiments"),
  integrations: (scope: AccessScope) => featureKey(scope, "integrations"),
  worldModel: (scope: AccessScope) => featureKey(scope, "world-model"),
  revenue: (scope: AccessScope) => featureKey(scope, "revenue"),
  opportunities: (scope: AccessScope) => featureKey(scope, "opportunities"),
  memory: (scope: AccessScope) => featureKey(scope, "memory"),
  digitalTwin: (scope: AccessScope) => featureKey(scope, "digital-twin")
};
