import { z, type ZodTypeAny } from "zod";

export const apiMetaSchema = z.object({
  requestId: z.string().min(1),
  timestamp: z.string().min(1),
  version: z.string().optional()
});

export function apiEnvelopeSchema<TSchema extends ZodTypeAny>(dataSchema: TSchema) {
  return z.object({
    data: dataSchema,
    meta: apiMetaSchema
  });
}

export const pageInfoSchema = z.object({
  cursor: z.string().nullable().optional(),
  hasNextPage: z.boolean()
});

export function paginatedSchema<TSchema extends ZodTypeAny>(itemSchema: TSchema) {
  return z.object({
    items: z.array(itemSchema),
    pageInfo: pageInfoSchema
  });
}
