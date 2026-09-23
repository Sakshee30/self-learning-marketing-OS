import { z } from "zod";

export const creativeBriefSchema = z.object({
  objective: z.string().min(10, "Describe the business objective"),
  audience: z.string().min(3, "Define the audience"),
  offer: z.string().min(3, "Describe the offer"),
  proof: z.string().min(3, "Add the evidence or proof"),
  tone: z.enum(["authoritative", "direct", "educational", "aspirational"]),
  variants: z.number().int().min(1).max(8)
});

export type CreativeBriefInput = z.infer<typeof creativeBriefSchema>;
