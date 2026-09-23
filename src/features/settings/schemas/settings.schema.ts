import { z } from "zod";

export const workspaceSettingsSchema = z.object({
  name: z.string().min(2),
  region: z.enum(["ap-south-1","us-east-1","eu-west-1"]),
  currency: z.enum(["USD","INR","EUR","GBP"]),
  timezone: z.string().min(2),
  draftAutomatically: z.boolean(),
  requireExternalApproval: z.boolean(),
  requireRollback: z.boolean(),
  approvalNotifications: z.boolean(),
  materialKpiNotifications: z.boolean()
});

export type WorkspaceSettingsInput = z.infer<typeof workspaceSettingsSchema>;
