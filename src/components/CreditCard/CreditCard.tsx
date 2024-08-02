import React from "react";
import Image from "next/image";
import FormFieldInput from "@/components/FormFieldInput/FormFieldInput"; // import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import CreditCardInput from "./CreditCardInput";
import useCardImage from "@/lib/hooks/useCardImage";

export default function CreditCard({ children, ...props }: any) {
  const cardImage = useCardImage(props.ccNumber);
  return (
    <section className="border border-white rounded-lg p-4 my-4 max-w-[400px] self-center">
      <div className="flex flex-row items-center">
        <h2 className="font-ubuntu text-white font-semibold">Card Details</h2>
        <div className="flex gap-2 ml-auto items-center">
          <Image
            src={`/images/cc_visa.svg`}
            alt="Visa"
            width={780}
            height={500}
            className="max-w-[40px]"
          />
          <Image
            src={`/images/cc_mastercard.svg`}
            alt="Mastercard"
            width={780}
            height={500}
            className="max-w-[40px]"
          />
        </div>
      </div>
      <FormFieldInput
        control={props.control}
        name={`${props.schemaObject}.cc_name`}
        label="Name on Card"
      />
      <div className="flex justify-between gap-2">
        <CreditCardInput
          control={props.control}
          name={`${props.schemaObject}.cc_number`}
          label="Card Number"
          format="#### #### #### ####"
        />
        <Image
          src={cardImage}
          alt="Credit Card Icon"
          width={780}
          height={500}
          className="max-w-[60px] self-start pt-[1.4rem]"
        />
      </div>
      <div className="flex flex-row gap-4">
        <CreditCardInput
          control={props.control}
          name={`${props.schemaObject}.cc_expiry`}
          label="Expiry"
          format="##/##"
        />
        <CreditCardInput
          control={props.control}
          name={`${props.schemaObject}.cc_cvv`}
          label="CVV"
          format="###"
        />
      </div>
      {children}
    </section>
  );
}
