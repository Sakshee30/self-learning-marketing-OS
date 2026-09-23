import { z } from "zod";

export const cmoGoalSchema = z.object({
  objective: z.string().min(12, "Describe the outcome the AI should own"),
  metric: z.enum(["qualified_pipeline", "revenue", "profit", "cac", "retention", "activation"]),
  targetValue: z.string().min(1, "Enter the target value"),
  horizonDays: z.number().int().min(7).max(730),
  maxCac: z.number().nonnegative(),
  spendCeiling: z.number().nonnegative(),
  riskTolerance: z.enum(["conservative", "balanced", "growth"]),
  approvalPolicy: z.enum(["strict", "governed", "preapproved_envelope"])
});

export type CmoGoalInput = z.infer<typeof cmoGoalSchema>;
