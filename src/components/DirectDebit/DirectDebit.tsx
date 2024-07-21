import React from "react";
import FormFieldInput from "@/components/FormFieldInput/FormFieldInput";

function DirectDebit({ ...props }) {
  return (
    <section className="border border-white rounded-lg p-4 my-4 max-w-[400px] self-center">
      <h2 className="font-ubuntu text-white font-semibold">
        Direct Debit Details
      </h2>
      <FormFieldInput
        control={props.control}
        name="payment_options.bank_name"
        label="Bank Name"
      />
      <FormFieldInput
        control={props.control}
        name="payment_options.bank_street_address"
        label="Bank Street Address"
      />
      <div className="flex flex-row gap-4">
        <FormFieldInput
          control={props.control}
          name="payment_options.bank_city_suburb"
          label="Bank Suburb"
        />
        <FormFieldInput
          control={props.control}
          name="payment_options.bank_state"
          label="Bank State"
        />
      </div>
      <div className="flex flex-row gap-4">
        <FormFieldInput
          control={props.control}
          name="payment_options.bank_postcode"
          label="Bank Postcode"
        />
        <FormFieldInput
          control={props.control}
          name="payment_options.bank_country"
          label="Bank Country"
        />
      </div>
      <FormFieldInput
        control={props.control}
        name="payment_options.bank_acc_name"
        label="Bank Account Name"
      />
      <div className="flex flex-row gap-4">
        <FormFieldInput
          control={props.control}
          name="payment_options.bank_bsb"
          label="BSB"
        />
        <FormFieldInput
          control={props.control}
          name="payment_options.bank_acc_number"
          label="Account Number"
        />
      </div>
    </section>
  );
}

export default DirectDebit;
