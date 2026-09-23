import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
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

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => {
      if (!scope) throw new Error("Workspace scope is not ready");
      return createCampaign(input, toRequestContext(scope));
    },
    onSuccess: () => {
      if (!scope) return;
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns(scope)
      });
    }
  });
}
