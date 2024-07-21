import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import InputFormatted from "@/components/ui/input_formatted";

export default function CreditCardInput({ ...props }) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="w-full pb-6">
          <div className="flex items-baseline justify-between">
            <FormLabel className="text-white">{props.label}</FormLabel>
          </div>
          <div className="flex items-center justify-between gap-2">
            <FormControl>
              <InputFormatted {...field} format={props.format} type="tel" />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
