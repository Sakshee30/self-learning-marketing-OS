import { z } from "zod";

export const experimentDraftSchema = z.object({
  name: z.string().min(3, "Enter an experiment name"),
  hypothesis: z.string().min(12, "State the causal hypothesis"),
  primaryMetric: z.enum(["qualified_conversion", "pipeline", "revenue", "cac", "activation", "retention"]),
  holdoutPercent: z.number().min(5).max(50),
  durationDays: z.number().int().min(3).max(90),
  minimumSample: z.number().int().min(100),
  approvalRequired: z.boolean()
});

export type ExperimentDraftInput = z.infer<typeof experimentDraftSchema>;
