import { ApiError } from "../../shared/api/client";

export const queryPolicies = {
  reference: {
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  },
  operational: {
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  },
  sensitive: {
    staleTime: 0,
    gcTime: 2 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  }
} as const;

export function shouldRetryRead(failureCount: number, error: unknown) {
  if (failureCount >= 2) return false;

  if (error instanceof ApiError) {
    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 403 ||
      error.status === 404 ||
      error.status === 409 ||
      error.status === 412 ||
      error.status === 422
    ) {
      return false;
    }

    return error.status === 0 || error.status === 408 || error.status === 425 || error.status === 429 || error.status >= 500;
  }

  return failureCount < 1;
}

export function retryDelay(attempt: number) {
  const base = Math.min(1000 * 2 ** attempt, 8000);
  const jitter = Math.floor(base * 0.2 * Math.random());
  return base + jitter;
}
