import { z } from "zod";

export const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  resource_levy: z.number(),
  facility_hire: z.number(),
  grades: z.object({
    K: z.boolean(),
    "1": z.boolean(),
    "2": z.boolean(),
    "3": z.boolean(),
    "4": z.boolean(),
    "5": z.boolean(),
    "6": z.boolean(),
    "7": z.boolean(),
    "8": z.boolean(),
    "9": z.boolean(),
    "10": z.boolean(),
    "11": z.boolean(),
    "12": z.boolean(),
  }),
  offers_instrument_rental: z.boolean(),
  instrument_options: z.object({}),
  programs: z.object({}),
});
