import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { formIdSchema } from "../submissions/submission.contract";
import { publishedFormSchema } from "./form-schema";

export { formIdSchema };

export const publishFormVersionBodySchema = z.object({
  sourceRevision: z.string().regex(/^[a-f0-9]{64}$/i, "sourceRevision must be a SHA-256 hex digest"),
  schema: publishedFormSchema,
}).strict();

export type PublishFormVersionBody = z.infer<typeof publishFormVersionBodySchema>;

export interface PublishedFormVersionReceipt {
  formId: string;
  formVersionId: string;
  version: number;
  sourceRevision: string;
  publishedAt: string;
  replayed: boolean;
}

function tokenDigest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function isAuthorizedCmsSync(
  authorizationHeader: string | undefined,
  configuredToken: string | undefined,
): boolean {
  if (!configuredToken || !authorizationHeader?.startsWith("Bearer ")) return false;
  const provided = authorizationHeader.slice("Bearer ".length).trim();
  if (!provided) return false;
  return timingSafeEqual(tokenDigest(provided), tokenDigest(configuredToken));
}
