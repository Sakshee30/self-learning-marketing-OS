import { createHash } from "node:crypto";
import { z } from "zod";
import { attributionInputSchema } from "../attribution/attribution.contract";

const scalarFieldValue = z.union([
  z.string().max(5_000),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

const fieldValue = z.union([scalarFieldValue, z.array(scalarFieldValue).max(100)]);

export const formIdSchema = z.string().regex(/^[a-z0-9][a-z0-9_-]{1,63}$/);

export const submissionBodySchema = z
  .object({
    fields: z
      .record(z.string().min(1).max(64), fieldValue)
      .refine((fields) => Object.keys(fields).length >= 1, "At least one field is required")
      .refine((fields) => Object.keys(fields).length <= 50, "At most 50 fields are allowed"),
    source: z
      .object({
        path: z.string().max(2_048).optional(),
        referrer: z.string().max(2_048).optional(),
        campaignId: z.string().max(128).optional(),
      })
      .strict()
      .default({}),
    attribution: attributionInputSchema.optional(),
    consentRecordId: z.string().uuid().optional(),
  })
  .strict();

export type SubmissionBody = z.infer<typeof submissionBodySchema>;

export interface SubmissionReceipt {
  submissionId: string;
  formId: string;
  formVersionId: string;
  acceptedAt: string;
  replayed: boolean;
}

export function parseIdempotencyKey(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  if (normalized.length < 8 || normalized.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    throw new Error("Idempotency-Key must be 8-128 URL-safe characters");
  }
  return normalized;
}

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${canonicalize(child)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function createRequestFingerprint(body: SubmissionBody): string {
  return createHash("sha256").update(canonicalize(body)).digest("hex");
}
