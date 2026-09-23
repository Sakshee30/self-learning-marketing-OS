import { useCallback, useRef, useState } from "react";
import { useMutation, type MutationKey } from "@tanstack/react-query";
import type { AccessScope } from "../scope/accessScope";
import { createOperationIdentity, type OperationIdentity } from "./operation";
import {
  classifyMutationFailure,
  type OperationLifecycle,
  type OperationState
} from "./lifecycle";

type MutationExecutor<TData, TVariables> = (args: {
  variables: TVariables;
  operation: OperationIdentity;
  signal: AbortSignal;
}) => Promise<TData>;

export function useAuthoritativeMutation<TData, TVariables>({
  mutationKey,
  scope,
  execute,
  onConfirmed
}: {
  mutationKey?: MutationKey | undefined;
  scope?: AccessScope | undefined;
  execute: MutationExecutor<TData, TVariables>;
  onConfirmed?: ((data: TData, variables: TVariables, operation: OperationIdentity) => void) | undefined;
}) {
  const [operationState, setOperationState] = useState<OperationState>({
    lifecycle: "idle"
  });
  const controllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<
    TData,
    unknown,
    { variables: TVariables; operation: OperationIdentity }
  >({
    ...(mutationKey ? { mutationKey } : {}),
    mutationFn: ({ variables, operation }) => {
      const controller = new AbortController();
      controllerRef.current = controller;
      return execute({ variables, operation, signal: controller.signal });
    },
    onMutate: ({ operation }) => {
      setOperationState({
        lifecycle: "submitting",
        operationId: operation.operationId
      });
    },
    onSuccess: (data, { variables, operation }) => {
      setOperationState({
        lifecycle: "confirmed_success",
        operationId: operation.operationId
      });
      controllerRef.current = null;
      onConfirmed?.(data, variables, operation);
    },
    onError: (error, { operation }) => {
      const lifecycle = classifyMutationFailure(error);
      const requestId =
        typeof error === "object" &&
        error !== null &&
        "requestId" in error &&
        typeof error.requestId === "string"
          ? error.requestId
          : undefined;

      setOperationState({
        lifecycle,
        operationId: operation.operationId,
        requestId,
        message: error instanceof Error ? error.message : "The operation could not be confirmed."
      });
      controllerRef.current = null;
    }
  });

  const submit = useCallback(
    (variables: TVariables, reuseOperation?: OperationIdentity | undefined) => {
      const operation = reuseOperation ?? createOperationIdentity(scope);
      setOperationState({
        lifecycle: "validating",
        operationId: operation.operationId
      });
      mutation.mutate({ variables, operation });
      return operation;
    },
    [mutation, scope]
  );

  const reset = useCallback(() => {
    mutation.reset();
    setOperationState({ lifecycle: "idle" });
  }, [mutation]);

  const cancelWait = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return {
    ...mutation,
    submit,
    resetOperation: reset,
    cancelWait,
    operationState,
    lifecycle: operationState.lifecycle as OperationLifecycle
  };
}
