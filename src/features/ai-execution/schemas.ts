import { z } from "zod";

export const aiExecutionStateSchema = z.enum([
  "queued",
  "researching",
  "reasoning",
  "planning",
  "simulating",
  "waiting_for_approval",
  "approved",
  "executing",
  "verifying",
  "completed",
  "learning",
  "failed",
  "cancelled"
]);

export const aiExecutionSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  goal: z.string().min(1),
  state: aiExecutionStateSchema,
  evidenceRefs: z.array(z.string()),
  approvalId: z.string().optional(),
  decisionReceiptId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});
