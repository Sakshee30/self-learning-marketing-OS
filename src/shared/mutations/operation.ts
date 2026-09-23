import type { AccessScope } from "../scope/accessScope";

export type OperationIdentity = {
  operationId: string;
  idempotencyKey: string;
  createdAt: string;
  scope?: AccessScope;
};

function fallbackId() {
  return `op-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createOperationIdentity(scope?: AccessScope): OperationIdentity {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : fallbackId();

  return {
    operationId: id,
    idempotencyKey: id,
    createdAt: new Date().toISOString(),
    scope
  };
}
