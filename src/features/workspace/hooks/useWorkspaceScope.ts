import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth/store/authStore";
import { isQueryForScope, type AccessScope } from "../../../shared/scope/accessScope";
import { useWorkspaceStore } from "../../../shared/store/workspaceStore";
import { findOrganization, findWorkspace, previewWorkspaces } from "../preview";

export function useWorkspaceScope() {
  const queryClient = useQueryClient();
  const sessionGeneration = useAuthStore((state) => state.sessionGeneration);
  const organizationId = useWorkspaceStore((state) => state.organizationId);
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const scopeGeneration = useWorkspaceStore((state) => state.scopeGeneration);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const [switching, setSwitching] = useState(false);

  const switchWorkspace = useCallback(
    async (targetWorkspaceId: string) => {
      const target = previewWorkspaces.find((item) => item.id === targetWorkspaceId);
      if (!target || target.id === workspaceId) return;

      const previousScope: AccessScope | null =
        organizationId && workspaceId
          ? {
              sessionGeneration,
              organizationId,
              workspaceId,
              scopeGeneration
            }
          : null;

      setSwitching(true);

      if (previousScope) {
        await queryClient.cancelQueries({
          predicate: (query) => isQueryForScope(query.queryKey, previousScope)
        });
      }

      setWorkspace(target.organizationId, target.id);

      if (previousScope) {
        queryClient.removeQueries({
          predicate: (query) => isQueryForScope(query.queryKey, previousScope)
        });
      }

      setSwitching(false);
    },
    [
      organizationId,
      queryClient,
      scopeGeneration,
      sessionGeneration,
      setWorkspace,
      workspaceId
    ]
  );

  return {
    organization: findOrganization(organizationId),
    workspace: findWorkspace(workspaceId),
    workspaces: previewWorkspaces,
    switching,
    switchWorkspace
  };
}
