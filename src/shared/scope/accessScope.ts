import type { RequestContext } from "../api/contracts";

export type AccessScope = {
  sessionGeneration: number;
  organizationId: string;
  workspaceId: string;
  scopeGeneration: number;
};

export const accessScopeKey = (scope: AccessScope) =>
  [
    "session",
    scope.sessionGeneration,
    "organization",
    scope.organizationId,
    "workspace",
    scope.workspaceId,
    "generation",
    scope.scopeGeneration
  ] as const;

export function isQueryForScope(queryKey: readonly unknown[], scope: AccessScope) {
  const prefix = accessScopeKey(scope);
  return prefix.every((value, index) => queryKey[index] === value);
}

export function toRequestContext(scope: AccessScope, requestId?: string): RequestContext {
  return {
    organizationId: scope.organizationId,
    workspaceId: scope.workspaceId,
    requestId
  };
}
