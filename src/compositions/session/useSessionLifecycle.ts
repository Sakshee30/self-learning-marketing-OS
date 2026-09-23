import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useWorkspaceStore } from "../../shared/store/workspaceStore";
import { clearOnboardingPreview } from "../../features/onboarding/previewState";

export function useSessionLifecycle() {
  const queryClient = useQueryClient();
  const authSignOut = useAuthStore((state) => state.signOut);
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace);

  const signOut = useCallback(() => {
    void queryClient.cancelQueries();
    queryClient.clear();
    clearWorkspace();
    clearOnboardingPreview();
    authSignOut();
  }, [authSignOut, clearWorkspace, queryClient]);

  return { signOut };
}
