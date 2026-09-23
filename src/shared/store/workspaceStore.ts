import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WorkspaceState = {
  organizationId: string | null;
  workspaceId: string | null;
  scopeGeneration: number;
  sidebarCollapsed: boolean;
  setWorkspace: (organizationId: string, workspaceId: string) => void;
  clearWorkspace: () => void;
  toggleSidebar: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      organizationId: null,
      workspaceId: null,
      scopeGeneration: 0,
      sidebarCollapsed: false,
      setWorkspace: (organizationId, workspaceId) =>
        set((state) => {
          if (
            state.organizationId === organizationId &&
            state.workspaceId === workspaceId
          ) {
            return state;
          }

          return {
            organizationId,
            workspaceId,
            scopeGeneration: state.scopeGeneration + 1
          };
        }),
      clearWorkspace: () =>
        set((state) => ({
          organizationId: null,
          workspaceId: null,
          scopeGeneration: state.scopeGeneration + 1
        })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
    }),
    {
      name: "growthos-workspace",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ organizationId, workspaceId, sidebarCollapsed }) => ({
        organizationId,
        workspaceId,
        sidebarCollapsed
      })
    }
  )
);
