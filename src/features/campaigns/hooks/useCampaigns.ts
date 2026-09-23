import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { useAuthoritativeMutation } from "../../../shared/mutations/useAuthoritativeMutation";
import type { OperationIdentity } from "../../../shared/mutations/operation";
import { toRequestContext, type AccessScope } from "../../../shared/scope/accessScope";
import type { CreateCampaignInput } from "../schemas/campaign.schema";
import { createCampaign, listCampaigns } from "../api/campaigns.api";

export function useCampaigns(scope: AccessScope | null) {
  return useQuery({
    queryKey: scope ? queryKeys.campaigns(scope) : ["campaigns", "scope-unavailable"],
    queryFn: ({ signal }) => {
      if (!scope) throw new Error("Workspace scope is not ready");
      return listCampaigns(toRequestContext(scope), signal);
    },
    enabled: Boolean(scope)
  });
}

export function useCreateCampaign(scope: AccessScope | null) {
  const queryClient = useQueryClient();

  return useAuthoritativeMutation({
    mutationKey: scope ? [...queryKeys.campaigns(scope), "create"] : ["campaigns", "create", "scope-unavailable"],
    ...(scope ? { scope } : {}),
    execute: ({ variables, operation, signal }: {
      variables: CreateCampaignInput;
      operation: OperationIdentity;
      signal: AbortSignal;
    }) => {
      if (!scope) throw new Error("Workspace scope is not ready");

      return createCampaign(
        variables,
        {
          ...toRequestContext(scope),
          operationId: operation.operationId,
          idempotencyKey: operation.idempotencyKey
        },
        signal
      );
    },
    onConfirmed: () => {
      if (!scope) return;
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns(scope)
      });
    }
  });
}
