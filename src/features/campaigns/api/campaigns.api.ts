import { apiRequest } from "../../../shared/api/client";
import type { ApiEnvelope, RequestContext } from "../../../shared/api/contracts";
import type { Campaign, CreateCampaignInput } from "../schemas/campaign.schema";

export function listCampaigns(context: RequestContext) {
  return apiRequest<ApiEnvelope<Campaign[]>>("/campaigns", { method: "GET" }, context);
}

export function createCampaign(input: CreateCampaignInput, context: RequestContext) {
  return apiRequest<ApiEnvelope<Campaign>>(
    "/campaigns",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    context
  );
}
