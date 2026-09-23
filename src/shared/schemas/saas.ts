import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2)
});

export const workspaceSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  plan: z.enum(["starter", "growth", "scale", "enterprise"]),
  status: z.enum(["trial", "active", "past_due", "suspended"])
});

export const growthGoalSchema = z.object({
  objective: z.string().min(10),
  target: z.string().min(1),
  horizonDays: z.number().int().positive(),
  maxCac: z.number().nonnegative().optional(),
  spendCeiling: z.number().nonnegative().optional()
});

export type Organization = z.infer<typeof organizationSchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
export type GrowthGoal = z.infer<typeof growthGoalSchema>;
