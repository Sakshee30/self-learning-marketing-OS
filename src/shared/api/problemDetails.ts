import { z } from "zod";

export const fieldProblemSchema = z.object({
  field: z.string().min(1),
  code: z.string().optional(),
  message: z.string().min(1)
});

export const problemDetailsSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  status: z.number().int().optional(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  code: z.string().optional(),
  requestId: z.string().optional(),
  operationId: z.string().optional(),
  retryable: z.boolean().optional(),
  fieldErrors: z.array(fieldProblemSchema).optional()
}).passthrough();

export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
export type FieldProblem = z.infer<typeof fieldProblemSchema>;
