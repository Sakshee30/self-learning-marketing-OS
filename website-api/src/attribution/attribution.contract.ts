import { z } from "zod";

const campaignValue = z.string().trim().min(1).max(256);

const touchpointSchema = z
  .object({
    campaignId: z.string().trim().min(1).max(128).optional(),
    utmSource: campaignValue.optional(),
    utmMedium: campaignValue.optional(),
    utmCampaign: campaignValue.optional(),
    utmTerm: campaignValue.optional(),
    utmContent: campaignValue.optional(),
    landingPath: z.string().trim().min(1).max(2_048).optional(),
    capturedAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

export const attributionInputSchema = z
  .object({
    firstTouch: touchpointSchema.optional(),
    lastTouch: touchpointSchema.optional(),
    pageRevision: z.string().trim().min(1).max(128).optional(),
    experimentVariant: z.string().trim().min(1).max(128).optional(),
  })
  .strict();

export type AttributionInput = z.infer<typeof attributionInputSchema>;

export type StoredAttribution =
  | { status: "unknown" }
  | ({ status: "known" } & AttributionInput);

function hasTouchpointValue(touchpoint: z.infer<typeof touchpointSchema> | undefined): boolean {
  return Boolean(touchpoint && Object.keys(touchpoint).length > 0);
}

export function normalizeAttribution(attribution: AttributionInput | undefined): StoredAttribution {
  if (
    !attribution ||
    (!hasTouchpointValue(attribution.firstTouch) &&
      !hasTouchpointValue(attribution.lastTouch) &&
      attribution.pageRevision === undefined &&
      attribution.experimentVariant === undefined)
  ) {
    return { status: "unknown" };
  }

  return { status: "known", ...attribution };
}
