import { env } from "../config/env";
import type { RequestContext } from "./contracts";

type ApiErrorBody = {
  message?: string;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly requestId?: string,
    public readonly details?: unknown
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
  return headers;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  context?: RequestContext
): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
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
    let body: ApiErrorBody | undefined;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = undefined;
    }

    throw new ApiError(
      body?.message ?? `Request failed with status ${response.status}`,
      response.status,
      body?.code,
      requestId,
      body?.details
    );
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined as T;

  return response.json() as Promise<T>;
}
