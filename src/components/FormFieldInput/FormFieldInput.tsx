import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

function FormFieldInput({ ...props }) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="w-full pb-6 pt-4">
          <div className="flex items-baseline justify-between">
            <FormLabel className="text-white">{props.label}</FormLabel>
          </div>
          <div className="flex items-center justify-between gap-2">
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormFieldInput;
