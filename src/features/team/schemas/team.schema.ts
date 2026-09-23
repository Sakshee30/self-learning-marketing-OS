import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  role: z.enum(["owner", "admin", "marketing_manager", "analyst", "approver", "viewer"])
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
