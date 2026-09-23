import { z } from "zod";

export const campaignStatusSchema = z.enum([
  "draft",
  "simulating",
  "approval_required",
  "approved",
  "scheduled",
  "running",
  "paused",
  "completed"
]);

export const campaignSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  name: z.string().min(2),
  objective: z.string().min(2),
  status: campaignStatusSchema,
  channels: z.array(z.string()),
  budget: z.number().nonnegative(),
  currency: z.string().length(3),
  approvalId: z.string().optional(),
  decisionReceiptId: z.string().optional()
});

export const createCampaignInputSchema = campaignSchema
  .omit({
    id: true,
    workspaceId: true,
    status: true,
    approvalId: true,
    decisionReceiptId: true
  })
  .extend({
    requiresHumanApproval: z.boolean()
  });

export type Campaign = z.infer<typeof campaignSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignInputSchema>;
