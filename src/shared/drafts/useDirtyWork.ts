import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { AccessScope } from "../scope/accessScope";
import { useDirtyWorkStore } from "./dirtyWorkStore";

export function useDirtyWork({
  id,
  label,
  dirty,
  scope
}: {
  id: string;
  label: string;
  dirty: boolean;
  scope: AccessScope | null;
}) {
  const location = useLocation();
  const register = useDirtyWorkStore((state) => state.register);
  const clear = useDirtyWorkStore((state) => state.clear);

  useEffect(() => {
    if (!dirty || !scope) {
      clear(id);
      return;
    }

    register({
      id,
      label,
      route: location.pathname,
      sessionGeneration: scope.sessionGeneration,
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      scopeGeneration: scope.scopeGeneration,
      updatedAt: new Date().toISOString()
    });

    return () => clear(id);
  }, [clear, dirty, id, label, location.pathname, register, scope]);

  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}
