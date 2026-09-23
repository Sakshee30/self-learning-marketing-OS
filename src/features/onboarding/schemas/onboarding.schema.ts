import { z } from "zod";

export const companyProfileSchema = z.object({
  organizationName: z.string().min(2, "Enter the company name"),
  workspaceName: z.string().min(2, "Enter the workspace name"),
  website: z.string().url("Enter a valid website URL"),
  businessModel: z.enum(["b2b_saas", "b2c", "ecommerce", "marketplace", "services", "other"]),
  primaryMarket: z.string().min(2, "Enter the primary market"),
  timezone: z.string().min(2),
  currency: z.string().length(3)
});

export const growthSetupSchema = z.object({
  objective: z.string().min(12, "Describe the business outcome the AI should own"),
  target: z.string().min(2, "Enter the target"),
  horizonDays: z.number().int().min(7).max(730),
  maxCac: z.number().nonnegative(),
  spendCeiling: z.number().nonnegative(),
  grossMargin: z.number().min(0).max(100)
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
export type GrowthSetupInput = z.infer<typeof growthSetupSchema>;
