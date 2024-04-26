import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, DefaultValues } from "react-hook-form";
// Types
import { FormDataSchema } from "@/lib/schema";
type FormValues = z.infer<typeof FormDataSchema>;
// Default Form Values
import { formDefaultValues } from "@/lib/formDefaultValues";

export default function useAppForm(defaultValues?: DefaultValues<FormValues>) {
  return useForm<FormValues>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: formDefaultValues,
    mode: "all",
  });
}
