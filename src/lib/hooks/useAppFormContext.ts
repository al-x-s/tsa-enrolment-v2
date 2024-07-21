import { z } from "zod";

import { useFormContext } from "react-hook-form";
// Types
// import { FormValues } from "@/types/form";
import { FormDataSchema } from "@/lib/schemas/schema";

type FormValues = z.infer<typeof FormDataSchema>;

export default function useAppFormContext() {
  return useFormContext<FormValues>();
}
