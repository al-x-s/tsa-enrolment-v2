import React from "react";
import { FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";

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

export default RadioOption;
