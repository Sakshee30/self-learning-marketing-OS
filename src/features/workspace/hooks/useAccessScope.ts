import { useAuthStore } from "../../auth/store/authStore";
import { useWorkspaceStore } from "../../../shared/store/workspaceStore";
import type { AccessScope } from "../../../shared/scope/accessScope";

export function useAccessScope(): AccessScope | null {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const sessionGeneration = useAuthStore((state) => state.sessionGeneration);
  const organizationId = useWorkspaceStore((state) => state.organizationId);
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const scopeGeneration = useWorkspaceStore((state) => state.scopeGeneration);

  if (
    status !== "authenticated" ||
    !user ||
    !organizationId ||
    !workspaceId
  ) {
    return null;
  }

  return {
    sessionGeneration,
    organizationId,
    workspaceId,
    scopeGeneration
  };
}
