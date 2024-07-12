import { z } from "zod";

export const programSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["Band", "String", "Keyboard", "Guitar"]),
  classType: z.enum(["Group", "Private", "Rehearsal"]),
  tuition_fee: z.number(),
  rehearsal_fee: z.number(),
  enrol_fee: z.number(),
  program_status: z.enum(["Active", "Inactive"]),
});
