import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import type { RequestContext } from "../../../shared/api/contracts";
import type { CreateCampaignInput } from "../schemas/campaign.schema";
import { createCampaign, listCampaigns } from "../api/campaigns.api";

export function useCampaigns(context: RequestContext & { workspaceId: string }) {
  return useQuery({
    queryKey: queryKeys.campaigns(context.workspaceId),
    queryFn: () => listCampaigns(context),
    enabled: Boolean(context.workspaceId)
  });
}

export function useCreateCampaign(context: RequestContext & { workspaceId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => createCampaign(input, context),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns(context.workspaceId)
      });
    }
  });
}
