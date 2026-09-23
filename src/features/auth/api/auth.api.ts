import { apiRequest } from "../../../shared/api/client";
import type { ApiEnvelope } from "../../../shared/api/contracts";
import type { ForgotPasswordInput, SignInInput, SignUpInput } from "../schemas/auth.schema";
import type { AuthSession } from "../types";

export function createSession(input: SignInInput) {
  return apiRequest<ApiEnvelope<AuthSession>>("/auth/session", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function registerAccount(input: SignUpInput) {
  return apiRequest<ApiEnvelope<AuthSession>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function requestPasswordReset(input: ForgotPasswordInput) {
  return apiRequest<void>("/auth/password-reset", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function destroySession() {
  return apiRequest<void>("/auth/session", { method: "DELETE" });
}
