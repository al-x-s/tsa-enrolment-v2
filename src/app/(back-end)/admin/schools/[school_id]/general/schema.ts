import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  resource_levy: z.number(),
  facility_hire: z.number(),
  offers_instrument_rental: z.boolean(),
});
