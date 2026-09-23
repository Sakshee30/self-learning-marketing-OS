import { useEffect, type ReactNode } from "react";
import { previewWorkspaces } from "../../features/workspace/preview";
import { useWorkspaceStore } from "../../shared/store/workspaceStore";
import { ErrorState, LoadingState } from "../../shared/ui";

export function WorkspaceBootstrapGate({ children }: { children: ReactNode }) {
  const organizationId = useWorkspaceStore((state) => state.organizationId);
  const workspaceId = useWorkspaceStore((state) => state.workspaceId);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);

  useEffect(() => {
    if (organizationId && workspaceId) return;

    const initial = previewWorkspaces[0];
    if (initial) {
      setWorkspace(initial.organizationId, initial.id);
    }
  }, [organizationId, setWorkspace, workspaceId]);

  if (organizationId && workspaceId) return <>{children}</>;

  if (previewWorkspaces.length === 0) {
    return (
      <ErrorState
        title="No workspace is available"
        description="GrowthOS could not resolve an authorized workspace. The protected application shell has not been mounted."
      />
    );
  }

  return <LoadingState label="Resolving your workspace and access context…" />;
}
