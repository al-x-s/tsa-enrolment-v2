"use client";
import React from "react";

// Next
import { useRouter } from "next/navigation";

// Hooks
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import { useUserSelections } from "@/components/Providers/UserSelectionsProvider";
import useCardImage from "@/lib/hooks/useCardImage";

// Components
import FormWrapper from "@/components/FrontEndForm/FormWrapper";
import FormActions from "@/components/FrontEndForm/FormActions";
import CreditCard from "@/components/CreditCard/CreditCard";
import { SummaryTable } from "@/components/SummaryTable/SummaryTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Types
import { FormSelections } from "@/lib/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import RadioOption from "./RadioOption";
// export function RadioOption({ ...props }) {
//   return (
//     <FormItem className="flex items-center space-x-3 space-y-0">
//       <FormControl>
//         <RadioGroupItem value={props.value} />
//       </FormControl>
//       <FormLabel className="font-ubuntu text-white">{props.label}</FormLabel>
//     </FormItem>
//   );
// }

export default function SummaryPage() {
  const router = useRouter();
  const {
    selectedSchoolData,
    selectedInstrumentData,
    selectedModelData,
    selectedAccessoriesData,
    selectedProgramData,
  } = useUserSelections();
  const { watch, control, setValue } = useAppFormContext();
  const {
    student_school,
    student_details,
    selected_program_id,
    instrument_options,
    accessories,
    payment_options,
  } = watch();

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
    }
  }, []);

  const { instrument } = student_details;
  const { inst_is_insured, hire_purchase_byo, purchased_model } =
    instrument_options;
  const { payment_method, use_same_card } = payment_options;
  const cc_number =
    "cc_number" in payment_options ? payment_options.cc_number : "";
  const hire_payment_method =
    "hire_payment_method" in instrument_options
      ? instrument_options.hire_payment_method
      : "";

  const hire_cc_number =
    "cc_number" in instrument_options ? instrument_options.cc_number : "";
  const hire_cc_name =
    "cc_name" in instrument_options ? instrument_options.cc_name : "";
  const hire_cc_cvv =
    "cc_cvv" in instrument_options ? instrument_options.cc_cvv : "";
  const hire_cc_expiry =
    "cc_expiry" in instrument_options ? instrument_options.cc_expiry : "";

  if (
    !selectedSchoolData ||
    !selectedProgramData ||
    !selectedInstrumentData ||
    !selectedModelData ||
    !selectedAccessoriesData
  ) {
    return;
  }

  React.useEffect(() => {
    if (use_same_card) {
      setValue("payment_options.cc_name", hire_cc_name);
      setValue("payment_options.cc_number", hire_cc_number);
      setValue("payment_options.cc_cvv", hire_cc_cvv);
      setValue("payment_options.cc_expiry", hire_cc_expiry);
    } else {
      setValue("payment_options.cc_name", "");
      setValue("payment_options.cc_number", "");
      setValue("payment_options.cc_cvv", "");
      setValue("payment_options.cc_expiry", "");
    }
  }, [use_same_card]);

  const formSelections: FormSelections = {
    selected_program_id,
    hire_purchase_byo,
    inst_is_insured,
    purchased_model,
    accessories,
    instrument,
  };

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
              formSelections={formSelections}
              selectedInstrumentData={selectedInstrumentData}
              selectedModelData={selectedModelData}
              selectedAccessoriesData={selectedAccessoriesData}
              schoolData={selectedSchoolData}
              selectedProgramData={selectedProgramData}
            />
            <h1 className="mt-4 text-white text-xl font-semibold">
              When will my first payment be processed?
            </h1>

            <p className="text-white mt-2">
              Payments are processed at the beginning of each term or if you are
              enrolling during the term it will be processed immediately. If you
              are enrolling for the next calendar year you will not be charged
              for tuition or for any associated instrument costs until the
              middle of January.
            </p>

            <h1 className="mt-4 text-white text-xl font-semibold text-center">
              Payment
            </h1>

            {hire_purchase_byo === "bring own" && (
              <FormField
                control={control}
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

                        <RadioOption
                          value="invoice"
                          label="Prefer to be invoiced"
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {hire_purchase_byo === "hire" &&
              hire_payment_method === "credit card" && (
                <FormField
                  control={control}
                  name="payment_options.use_same_card"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white font-semibold leading-6">
                          Tick this box if you'd like to use the previously
                          provided credit card to pay for term fee's
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

            {payment_method === "credit card" && (
              <>
                <CreditCard
                  control={control}
                  ccNumber={cc_number}
                  schemaObject="payment_options"
                >
                  <FormField
                    control={control}
                    name="payment_options.cc_autodebit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white font-semibold leading-6">
                            Tick this box if you would like TSA to use this
                            Credit Card to automatically debit lesson fees at
                            the commencement of each term.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CreditCard>
              </>
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
