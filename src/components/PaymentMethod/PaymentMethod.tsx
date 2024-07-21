import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function RadioOption({ ...props }) {
  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem value={props.value} />
      </FormControl>
      <FormLabel className="font-ubuntu text-white">{props.label}</FormLabel>
    </FormItem>
  );
}

export default function PaymentMethod({ ...props }) {
  return (
    <FormField
      control={props.control}
      name="payment_options.payment_method"
      render={({ field }) => (
        <FormItem className="space-y-3 mb-4">
          <FormLabel className="text-white">Payment Method</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <RadioOption value="credit card" label="Credit Card" />
              {props.hpb === "hire" && (
                <RadioOption value="direct debit" label="Direct Debit" />
              )}
              {props.hpb === "bring own" && (
                <RadioOption value="invoice" label="Prefer to be invoiced" />
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
