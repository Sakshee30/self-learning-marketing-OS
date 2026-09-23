import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Tooltip from "@radix-ui/react-tooltip";
import { HashRouter } from "react-router-dom";
import { AppErrorBoundary } from "../../shared/errors/AppErrorBoundary";
import { queryClient } from "../query/queryClient";
import { RouteLifecycle } from "../router/RouteLifecycle";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider delayDuration={300}>
          <HashRouter><RouteLifecycle />{children}</HashRouter>
        </Tooltip.Provider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
