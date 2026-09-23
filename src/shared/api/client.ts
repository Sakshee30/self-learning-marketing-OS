import { env } from "../config/env";
import type { RequestContext } from "./contracts";
import { problemDetailsSchema, type ProblemDetails } from "./problemDetails";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly requestId?: string,
    public readonly details?: unknown,
    public readonly operationId?: string,
    public readonly retryable?: boolean,
    public readonly fieldErrors?: ProblemDetails["fieldErrors"]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function contextHeaders(context?: RequestContext): Record<string, string> {
  const headers: Record<string, string> = {};
  if (context?.organizationId) headers["x-organization-id"] = context.organizationId;
  if (context?.workspaceId) headers["x-workspace-id"] = context.workspaceId;
  if (context?.requestId) headers["x-request-id"] = context.requestId;
  if (context?.operationId) headers["x-operation-id"] = context.operationId;
  if (context?.idempotencyKey) headers["idempotency-key"] = context.idempotencyKey;
  if (context?.expectedVersion) headers["if-match"] = context.expectedVersion;
  return headers;
}

function createDeadlineSignal(
  source: AbortSignal | null | undefined,
  deadlineMs: number | undefined
) {
  if (!source && !deadlineMs) {
    return { signal: undefined as AbortSignal | undefined, cleanup: () => undefined };
  }

  const controller = new AbortController();
  let timeout: number | undefined;

  const abortFromSource = () => controller.abort(source?.reason);
  if (source) {
    if (source.aborted) controller.abort(source.reason);
    else source.addEventListener("abort", abortFromSource, { once: true });
  }

  if (deadlineMs && deadlineMs > 0) {
    timeout = window.setTimeout(() => {
      controller.abort(new DOMException("Request deadline exceeded", "TimeoutError"));
    }, deadlineMs);
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      source?.removeEventListener("abort", abortFromSource);
    }
  };
}

async function readProblem(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) return undefined;

  try {
    const raw = await response.json();
    const parsed = problemDetailsSchema.safeParse(raw);
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  context?: RequestContext
): Promise<T> {
  const deadline = createDeadlineSignal(init.signal, context?.deadlineMs);

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      signal: deadline.signal ?? init.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...contextHeaders(context),
        ...init.headers
      },
      credentials: "include"
    });

    const requestId = response.headers.get("x-request-id") ?? undefined;

    if (!response.ok) {
      const problem = await readProblem(response);

      throw new ApiError(
        problem?.detail ?? problem?.title ?? `Request failed with status ${response.status}`,
        response.status,
        problem?.code,
        problem?.requestId ?? requestId,
        problem,
        problem?.operationId ?? context?.operationId,
        problem?.retryable,
        problem?.fieldErrors
      );
    }

    if (response.status === 204) return undefined as T;

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return undefined as T;

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError(
        "The request deadline expired before confirmation.",
        0,
        "REQUEST_TIMEOUT",
        context?.requestId,
        undefined,
        context?.operationId,
        true
      );
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "The request was cancelled before confirmation.",
        0,
        "REQUEST_ABORTED",
        context?.requestId,
        undefined,
        context?.operationId,
        false
      );
    }

    throw new ApiError(
      "The network request failed before an authoritative outcome was confirmed.",
      0,
      "NETWORK_ERROR",
      context?.requestId,
      error,
      context?.operationId,
      true
    );
  } finally {
    deadline.cleanup();
  }
}
