import { QueryClient } from "@tanstack/react-query";
import { queryPolicies, retryDelay, shouldRetryRead } from "./policies";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...queryPolicies.operational,
      retry: shouldRetryRead,
      retryDelay
    },
    mutations: {
      retry: false
    }
  }
});
