import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, DefaultValues } from "react-hook-form";
// Types
import { FormDataSchema } from "@/lib/schemas/schema";
type FormValues = z.infer<typeof FormDataSchema>;
// Default Form Values
import { formDefaultValues } from "@/lib/config/formDefaultValues";

export default function useAppForm(defaultValues?: DefaultValues<FormValues>) {
  return useForm<FormValues>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: formDefaultValues,
    mode: "all",
  });
}
