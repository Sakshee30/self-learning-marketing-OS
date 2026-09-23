import { create } from "zustand";
import type { AccessScope } from "../scope/accessScope";

export type DirtyWorkItem = {
  id: string;
  label: string;
  route: string;
  sessionGeneration: number;
  organizationId: string;
  workspaceId: string;
  scopeGeneration: number;
  updatedAt: string;
};

type DirtyWorkState = {
  items: Record<string, DirtyWorkItem>;
  register: (item: DirtyWorkItem) => void;
  clear: (id: string) => void;
  clearScope: (scope: AccessScope) => void;
  clearAll: () => void;
};

export const useDirtyWorkStore = create<DirtyWorkState>((set) => ({
  items: {},
  register: (item) =>
    set((state) => ({
      items: {
        ...state.items,
        [item.id]: item
      }
    })),
  clear: (id) =>
    set((state) => {
      const next = { ...state.items };
      delete next[id];
      return { items: next };
    }),
  clearScope: (scope) =>
    set((state) => ({
      items: Object.fromEntries(
        Object.entries(state.items).filter(([, item]) =>
          !(
            item.sessionGeneration === scope.sessionGeneration &&
            item.organizationId === scope.organizationId &&
            item.workspaceId === scope.workspaceId &&
            item.scopeGeneration === scope.scopeGeneration
          )
        )
      )
    })),
  clearAll: () => set({ items: {} })
}));

export function dirtyItemsForScope(
  items: Record<string, DirtyWorkItem>,
  scope: AccessScope | null
) {
  if (!scope) return [];

  return Object.values(items).filter(
    (item) =>
      item.sessionGeneration === scope.sessionGeneration &&
      item.organizationId === scope.organizationId &&
      item.workspaceId === scope.workspaceId &&
      item.scopeGeneration === scope.scopeGeneration
  );
}
