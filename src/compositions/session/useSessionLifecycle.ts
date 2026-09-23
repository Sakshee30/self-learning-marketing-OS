import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useWorkspaceStore } from "../../shared/store/workspaceStore";
import { clearOnboardingPreview } from "../../features/onboarding/previewState";
import { useDirtyWorkStore } from "../../shared/drafts/dirtyWorkStore";

export function useSessionLifecycle() {
  const queryClient = useQueryClient();
  const authSignOut = useAuthStore((state) => state.signOut);
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace);
  const clearDirtyWork = useDirtyWorkStore((state) => state.clearAll);

  const signOut = useCallback(() => {
    void queryClient.cancelQueries();
    queryClient.clear();
    clearWorkspace();
    clearOnboardingPreview();
    clearDirtyWork();
    authSignOut();
  }, [authSignOut, clearDirtyWork, clearWorkspace, queryClient]);

  return { signOut };
}
