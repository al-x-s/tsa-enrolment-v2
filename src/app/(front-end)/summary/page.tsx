"use client";
import React from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

// Hooks
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import { useQuery } from "@tanstack/react-query";

// Components
import Link from "next/link";
import FormWrapper from "@/components/FormWrapper";
import FormActions from "@/components/FormActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SummaryTable } from "@/components/SummaryTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputFormatted from "@/components/ui/input_formatted";

// Images
import Image from "next/image";
import cc_blank from "@/images/credit-card.svg";
import cc_visa from "@/images/visa.svg";
import cc_mastercard from "@/images/mastercard.svg";

// Server Actions
import getSchoolData from "@/lib/server_actions/front_end/getSchoolData";
import getInstrumentData from "@/lib/server_actions/front_end/getInstrumentData";
import getProgramsData from "@/lib/server_actions/front_end/getProgramsData";

// Types
import { UserData } from "@/lib/types";

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

function PaymentMethod({ ...props }) {
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

function CreditCardInput({ ...props }) {
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

function CreditCard({ ...props }) {
  return (
    <section className="border border-white rounded-lg p-4 my-4 max-w-[400px] self-center">
      <div className="flex flex-row items-center">
        <h2 className="font-ubuntu text-white font-semibold">Card Details</h2>
        <div className="flex gap-2 ml-auto items-center">
          <Image src={cc_visa} alt="Visa" width={40} />
          <Image src={cc_mastercard} alt="Mastercard" width={40} />
        </div>
      </div>
      <FormField
        control={props.control}
        name="payment_options.cc_name"
        render={({ field }) => (
          <FormItem className="w-full pb-6 pt-4">
            <div className="flex items-baseline justify-between">
              <FormLabel className="text-white">Name on Card</FormLabel>
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
      <div className="flex justify-between gap-2">
        <CreditCardInput
          control={props.control}
          name="payment_options.cc_number"
          label="Card Number"
          format="#### #### #### ####"
        />
        <Image
          src={props.cardType}
          alt="Credit Card Icon"
          className="w-[60px] self-start pt-[1.4rem]"
        />
      </div>
      <div className="flex flex-row gap-4">
        <CreditCardInput
          control={props.control}
          name="payment_options.cc_expiry"
          label="Expiry"
          format="##/##"
        />
        <CreditCardInput
          control={props.control}
          name="payment_options.cc_ccv"
          label="CCV"
          format="###"
        />
      </div>
    </section>
  );
}

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

export default function SummaryPage() {
  const router = useRouter();
  const { formState, watch, control } = useAppFormContext();
  const {
    student_school,
    student_details,
    selected_program_id,
    instrument_options,
    accessories,
    payment_options,
    school_id,
    program_type,
  } = watch();
  const { instrument } = student_details;
  const { inst_is_insured, hire_purchase_byo, purchased_model } =
    instrument_options;
  const { payment_method, cc_number } = payment_options;

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
    }
  }, []);

  const { data: schoolData } = useQuery({
    queryKey: ["schoolData", student_school],
    queryFn: () => getSchoolData(student_school),
  });

  const { data: programsData } = useQuery({
    queryKey: ["programsData", school_id, program_type],
    queryFn: () => getProgramsData(parseInt(school_id!), program_type),
    enabled: !!schoolData,
  });

  const { data, isPending } = useQuery({
    queryKey: ["instrumentData", instrument],
    queryFn: () => getInstrumentData(instrument),
    enabled: !!programsData,
  });

  if (isPending) {
    return <p>loading</p>;
  }

  if (!data) {
    return;
  }

  const { instrumentData, accessoriesOptions } = data;

  const userData: UserData | undefined = {
    selected_program_id,
    hire_purchase_byo,
    inst_is_insured,
    purchased_model,
    accessories,
    instrument,
  };

  const [cardType, setCardType] = React.useState(cc_blank);

  React.useEffect(() => {
    // * keep in mind that when you use these in your zod Schema you'll have to account for the white spaces from the input formatting
    // * const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/
    // * const masterCardRegex = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
    const visaStartRegex = /^4/;
    const masterCardStartRegex = /^(5[1-5]|2(22[1-9]|2[3-9]|[3-6]|7[0-1]|720))/;

    if (cc_number === undefined) {
      return;
    }

    if (visaStartRegex.test(cc_number)) {
      setCardType(cc_visa);
    } else if (masterCardStartRegex.test(cc_number)) {
      setCardType(cc_mastercard);
    } else {
      setCardType(cc_blank);
    }
  }, [cc_number]);

  // Previous Step function
  function previousStep() {
    router.push("/accessories");
  }

  return (
    <div className="shadow-lg h-full">
      <FormWrapper
        heading="Summary"
        description="Please review before submitting your enrolment."
      >
        <ScrollArea className="px-4 md:px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-hidden">
          <div className="flex flex-col mt-6">
            <SummaryTable
              userData={userData}
              instrumentData={instrumentData}
              accessoriesOptions={accessoriesOptions}
              schoolData={schoolData}
              programsData={programsData}
            />
            <h1 className="mt-4 text-white text-xl font-semibold">
              When will my first payment be processed?
            </h1>

            <p className="text-white mt-2">
              Payments are processed at the beginning of each term or if you are
              enrolling during the term it will be processed immediately. If you
              are enrolling for the next calendar year you will not be charged
              for tuition or for any associated instrument costs until the term
              is beginning.
            </p>

            <h1 className="mt-4 text-white text-xl font-semibold text-center">
              Payment
            </h1>

            {hire_purchase_byo !== "purchase" && (
              <PaymentMethod control={control} hpb={hire_purchase_byo} />
            )}

            {payment_method === "credit card" && (
              <CreditCard control={control} cardType={cardType} />
            )}
            {payment_method === "direct debit" && (
              <DirectDebit control={control} />
            )}
          </div>
        </ScrollArea>
      </FormWrapper>
      <FormActions>
        <button
          type="button"
          className="hover:text-slate-200 rounded lg:rounded-br transition duration-300 text-white mr-auto px-[17px] lg:my-3 lg:ml-3 lg:px-8 py-[10px] lg:py-3 text-sm lg:text-lg"
          onClick={previousStep}
        >
          Previous Step
        </button>
        <button
          type="submit"
          className="bg-[#2656cf] hover:bg-[#233e85] rounded lg:rounded-br transition duration-300 text-white ml-auto px-[17px] lg:my-3 lg:mr-3 lg:px-8 py-[10px] lg:py-3 text-sm lg:text-lg"
        >
          Submit
        </button>
      </FormActions>
    </div>
  );
}
