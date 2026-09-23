import { z } from "zod";

export const planSchema = z.enum(["starter", "growth", "scale", "enterprise"]);
export const workspaceStatusSchema = z.enum(["trial", "active", "past_due", "suspended"]);
export const membershipRoleSchema = z.enum([
  "owner",
  "admin",
  "marketing_manager",
  "analyst",
  "approver",
  "viewer"
]);

export const organizationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  createdAt: z.string().optional()
});

export const workspaceSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  plan: planSchema,
  status: workspaceStatusSchema,
  timezone: z.string().default("UTC"),
  currency: z.string().length(3).default("USD")
});

export const membershipSchema = z.object({
  userId: z.string().min(1),
  organizationId: z.string().min(1),
  workspaceId: z.string().min(1),
  role: membershipRoleSchema,
  permissions: z.array(z.string())
});

export const entitlementSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean(),
  limit: z.number().nonnegative().nullable().optional(),
  used: z.number().nonnegative().optional()
});

export const growthGoalSchema = z.object({
  objective: z.string().min(10),
  target: z.string().min(1),
  horizonDays: z.number().int().positive(),
  maxCac: z.number().nonnegative().optional(),
  spendCeiling: z.number().nonnegative().optional()
});

export type Plan = z.infer<typeof planSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
export type Membership = z.infer<typeof membershipSchema>;
export type Entitlement = z.infer<typeof entitlementSchema>;
export type GrowthGoal = z.infer<typeof growthGoalSchema>;
