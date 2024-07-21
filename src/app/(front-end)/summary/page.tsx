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
import DirectDebit from "@/components/DirectDebit/DirectDebit";
import CreditCard from "@/components/CreditCard/CreditCard";
import { SummaryTable } from "@/components/SummaryTable/SummaryTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import PaymentMethod from "@/components/PaymentMethod/PaymentMethod";

// Types
import { FormSelections } from "@/lib/types/types";

export default function SummaryPage() {
  const router = useRouter();
  const {
    selectedSchoolData,
    selectedInstrumentData,
    selectedModelData,
    selectedAccessoriesData,
    selectedProgramData,
  } = useUserSelections();
  const { watch, control } = useAppFormContext();
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
  const { payment_method } = payment_options;
  const cc_number =
    "cc_number" in payment_options ? payment_options.cc_number : "";

  const cardImage = useCardImage(
    payment_method === "credit card" && cc_number ? cc_number : ""
  );

  if (
    !selectedSchoolData ||
    !selectedProgramData ||
    !selectedInstrumentData ||
    !selectedModelData ||
    !selectedAccessoriesData
  ) {
    return;
  }

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

            {hire_purchase_byo !== "purchase" && (
              <PaymentMethod control={control} hpb={hire_purchase_byo} />
            )}

            {payment_method === "credit card" && (
              <CreditCard control={control} cardImage={cardImage} />
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
