import { create } from "zustand";

type WorkspaceState = {
  organizationId: string | null;
  workspaceId: string | null;
  sidebarCollapsed: boolean;
  setWorkspace: (organizationId: string, workspaceId: string) => void;
  clearWorkspace: () => void;
  toggleSidebar: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  organizationId: null,
  workspaceId: null,
  sidebarCollapsed: false,
  setWorkspace: (organizationId, workspaceId) => set({ organizationId, workspaceId }),
  clearWorkspace: () => set({ organizationId: null, workspaceId: null }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
}));
