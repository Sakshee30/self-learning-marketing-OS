import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkspaceStore } from "../../../shared/store/workspaceStore";
import { findOrganization, findWorkspace, previewWorkspaces } from "../preview";

export function useWorkspaceScope() {
  const queryClient = useQueryClient();
  const organizationId = useWorkspaceStore((state) => state.organizationId);
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (!organizationId || !workspaceId) {
      const initial = previewWorkspaces[0];
      if (initial) setWorkspace(initial.organizationId, initial.id);
    }
  }, [organizationId, workspaceId, setWorkspace]);

  const switchWorkspace = useCallback(
    async (targetWorkspaceId: string) => {
      const target = previewWorkspaces.find((item) => item.id === targetWorkspaceId);
      if (!target || target.id === workspaceId) return;

      setSwitching(true);
      await queryClient.cancelQueries();
      queryClient.clear();
      setWorkspace(target.organizationId, target.id);
      setSwitching(false);
    },
    [queryClient, setWorkspace, workspaceId]
  );

  return {
    organization: findOrganization(organizationId),
    workspace: findWorkspace(workspaceId),
    workspaces: previewWorkspaces,
    switching,
    switchWorkspace
  };
}
