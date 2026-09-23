import { ApiError } from "../api/client";

export type OperationLifecycle =
  | "idle"
  | "validating"
  | "submitting"
  | "confirmed_success"
  | "confirmed_rejection"
  | "conflict"
  | "outcome_unknown";

export type OperationState = {
  lifecycle: OperationLifecycle;
  operationId?: string;
  requestId?: string;
  message?: string;
};

export function classifyMutationFailure(error: unknown): OperationLifecycle {
  if (error instanceof ApiError) {
    if (error.status === 409 || error.status === 412) return "conflict";

    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 403 ||
      error.status === 404 ||
      error.status === 422 ||
      error.code === "VALIDATION_FAILED" ||
      error.code === "FORBIDDEN" ||
      error.code === "NOT_FOUND"
    ) {
      return "confirmed_rejection";
    }

    if (
      error.status === 0 ||
      error.status === 408 ||
      error.status === 425 ||
      error.status === 429 ||
      error.status >= 500 ||
      error.code === "REQUEST_TIMEOUT" ||
      error.code === "REQUEST_ABORTED"
    ) {
      return "outcome_unknown";
    }
  }

  return "outcome_unknown";
}

export function operationLifecycleLabel(lifecycle: OperationLifecycle) {
  switch (lifecycle) {
    case "idle": return "Ready";
    case "validating": return "Validating";
    case "submitting": return "Awaiting confirmation";
    case "confirmed_success": return "Confirmed";
    case "confirmed_rejection": return "Rejected";
    case "conflict": return "Conflict";
    case "outcome_unknown": return "Outcome unknown";
  }
}
