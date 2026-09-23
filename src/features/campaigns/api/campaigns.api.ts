import { z } from "zod";
import { apiRequestValidated } from "../../../shared/api/client";
import type { RequestContext } from "../../../shared/api/contracts";
import { apiEnvelopeSchema } from "../../../shared/api/schemas";
import { campaignSchema, type CreateCampaignInput } from "../schemas/campaign.schema";

const campaignsEnvelopeSchema = apiEnvelopeSchema(z.array(campaignSchema));
const campaignEnvelopeSchema = apiEnvelopeSchema(campaignSchema);

export function listCampaigns(context: RequestContext, signal?: AbortSignal | undefined) {
  return apiRequestValidated(
    "/campaigns",
    campaignsEnvelopeSchema,
    {
      method: "GET",
      ...(signal ? { signal } : {})
    },
    {
      ...context,
      deadlineMs: context.deadlineMs ?? 10_000
    }
  );
}

export function createCampaign(
  input: CreateCampaignInput,
  context: RequestContext,
  signal?: AbortSignal | undefined
) {
  return apiRequestValidated(
    "/campaigns",
    campaignEnvelopeSchema,
    {
      method: "POST",
      body: JSON.stringify(input),
      ...(signal ? { signal } : {})
    },
    {
      ...context,
      deadlineMs: context.deadlineMs ?? 15_000
    }
  );
}
