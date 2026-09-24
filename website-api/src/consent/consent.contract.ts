import { z } from "zod";

const consentKeySchema = z.string().regex(/^[a-z][a-z0-9._-]{1,63}$/);

export const consentBodySchema = z
  .object({
    subjectId: z.string().uuid().optional(),
    policyVersion: z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9._:-]+$/),
    decisions: z
      .record(consentKeySchema, z.enum(["granted", "denied"]))
      .refine((decisions) => Object.keys(decisions).length >= 1, "At least one consent decision is required")
      .refine((decisions) => Object.keys(decisions).length <= 50, "At most 50 consent decisions are allowed"),
    source: z
      .object({
        path: z.string().max(2_048).optional(),
        locale: z.string().trim().min(2).max(35).optional(),
      })
      .strict()
      .default({}),
  })
  .strict();

export type ConsentBody = z.infer<typeof consentBodySchema>;

export interface ConsentReceipt {
  consentRecordId: string;
  subjectId: string;
  policyVersion: string;
  recordedAt: string;
}
