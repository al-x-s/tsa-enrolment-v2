"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Hooks
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import { useUserSelections } from "@/components/Providers/UserSelectionsProvider";

// Types
import { Model } from "@prisma/client";
type HirePaymentMethod = "credit card" | "direct debit" | "";

// Components
import FormWrapper from "@/components/FrontEndForm/FormWrapper";
import FormActions from "@/components/FrontEndForm/FormActions";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelOption } from "@/components/ModelOption/ModelOption";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Rental Terms
import {
  rentalTermsCheckboxes,
  RentalTermsDialogContent,
} from "@/app/(front-end)/instrument_options/rentalTerms";
import BringOwnMessage from "./BringOwnMessage";
import InstrumentRentalCosts from "./InstrumentRentalCosts";
import { RadioOption } from "@/app/(front-end)/instrument_options/PaymentMethod";
import CreditCard from "@/components/CreditCard/CreditCard";
import DirectDebit from "@/app/(front-end)/instrument_options/DirectDebit";
import FormFieldInput from "@/components/FormFieldInput/FormFieldInput";
import { Input } from "@/components/ui/input";

function CustomCheckbox({ ...props }) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem
          className="space-x-3 space-y-0 mb-1"
          ref={(node) => {
            if (
              props.errors?.instrument_options?.agree_rental_terms?.[
                props.id
              ] &&
              node
            ) {
              node.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
        >
          <div className="flex flex-row items-start space-x-3 px-4 py-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormDescription className="text-white">
                {props.term}
              </FormDescription>
            </div>
          </div>
          <FormMessage className="pl-8" />
        </FormItem>
      )}
    />
  );
}

export default function InstrumentOptionsPage() {
  const router = useRouter();
  const { hireableTableData, availableModels, selectedInstrumentData } =
    useUserSelections();
  // React hook form config
  const { trigger, formState, control, watch, setValue, setFocus } =
    useAppFormContext();
  const { errors } = formState;
  const { student_school, instrument_options, student_details } = watch();
  const { instrument } = student_details;
  const { purchased_model, hire_purchase_byo, hire_payment_method } =
    instrument_options as {
      purchased_model: string;
      hire_purchase_byo: string;
      hire_payment_method: HirePaymentMethod;
    };

  const hire_cc_number =
    "hire_cc_number" in instrument_options
      ? instrument_options.hire_cc_number
      : "";

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
      return;
    }

    if (!instrument) {
      return;
    }
  }, []);

  // This is passed to the modelOptions to set the value of the purchased model when selected
  const selectModel: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (event.target instanceof HTMLButtonElement) {
      setValue("instrument_options.purchased_model", event.target.value, {
        shouldValidate: true,
      });
    }
  };

  // ValidateStep functions
  const validateStep = async () => {
    const isValid = await trigger(["instrument_options"], {
      shouldFocus: true,
    });

    if (isValid) {
      router.push("/accessories");
    }
  };

  // Previous Step function
  function previousStep() {
    router.push("/your_details");
  }

  return (
    <div className="shadow-lg h-full">
      <FormWrapper
        heading="Instrument Options"
        description="Choose to hire or buy an instrument."
      >
        {errors.instrument_options?.purchased_model?.message &&
          hire_purchase_byo === "purchase" && (
            <p className="text-highlight ml-8 mb-2">
              {errors.instrument_options.purchased_model.message}
            </p>
          )}
        <ScrollArea className="px-4 md:px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-hidden">
          <div className="flex flex-col mt-6">
            <FormField
              control={control}
              name="instrument_options.hire_purchase_byo"
              render={({ field }) => (
                <FormItem className="space-y-3 mb-6">
                  <FormLabel className="text-white">
                    Select a hire, purchase or alternate option
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {selectedInstrumentData?.can_hire === true && (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hire" />
                          </FormControl>
                          <FormLabel className="font-ubuntu text-white">
                            Hire
                          </FormLabel>
                        </FormItem>
                      )}
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="purchase" />
                        </FormControl>
                        <FormLabel className="font-ubuntu text-white">
                          Purchase
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bring own" />
                        </FormControl>
                        <FormLabel className="font-ubuntu text-white">
                          Bring your own
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hire_purchase_byo === "hire" && (
              <div>
                <h2 className="text-white text-2xl text-center mb-6 font-bold">
                  Rental Application
                </h2>

                <InstrumentRentalCosts
                  selectedInstrumentData={selectedInstrumentData}
                  hireableTableData={hireableTableData}
                  instrument={instrument}
                />

                <FormLabel className="text-white font-semibold">
                  Instrument Insurance
                </FormLabel>
                <FormField
                  control={control}
                  name="instrument_options.inst_is_insured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white font-semibold">
                          Tick this box to include instrument insurance
                        </FormLabel>
                        <FormDescription className="text-white italic">
                          Recommended by TSA
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="md:flex md:flex-row md:gap-4">
                  <FormFieldInput
                    control={control}
                    name="instrument_options.nearest_relative_name"
                    label="Nearest Relative Name"
                  />
                  <FormField
                    control={control}
                    name="instrument_options.nearest_relative_phone"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6 pt-4">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-white">
                            Nearest Relative Contact Number
                          </FormLabel>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <FormControl>
                            <Input placeholder="" type="tel" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="border boder-2 border-white px-4 pt-4 mb-6 rounded">
                  <h2 className="pb-4 text-white font-bold">
                    Household Main Income Earner
                  </h2>
                  <div className="md:flex md:flex-row md:gap-4">
                    <FormFieldInput
                      control={control}
                      name="instrument_options.main_earner_name"
                      label="Name"
                    />
                    <FormField
                      control={control}
                      name="instrument_options.main_earner_mobile"
                      render={({ field }) => (
                        <FormItem className="w-full pb-6 pt-4">
                          <div className="flex items-baseline justify-between">
                            <FormLabel className="text-white">
                              Mobile Number
                            </FormLabel>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <FormControl>
                              <Input placeholder="" type="tel" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:flex md:flex-row md:gap-4">
                    <FormFieldInput
                      control={control}
                      name="instrument_options.main_earner_employer_name"
                      label="Employer Name"
                    />
                    <FormField
                      control={control}
                      name="instrument_options.main_earner_employer_phone"
                      render={({ field }) => (
                        <FormItem className="w-full pb-6 pt-4">
                          <div className="flex items-baseline justify-between">
                            <FormLabel className="text-white">
                              Employer Contact Number
                            </FormLabel>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <FormControl>
                              <Input placeholder="" type="tel" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/*RENTAL TERM PAYMENT OPTIONS 
                hire_payment_method
                  1 - CREDIT CARD
                  2 - DEBIT CARD
                
                */}
                <FormField
                  control={control}
                  name="instrument_options.hire_payment_method"
                  render={({ field }) => (
                    <FormItem className="space-y-3 mb-4">
                      <FormLabel className="text-white">
                        Payment Method
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <RadioOption
                            value="credit card"
                            label="Credit Card"
                          />
                          <RadioOption
                            value="direct debit"
                            label="Direct Debit"
                          />
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {hire_payment_method === "credit card" && (
                  <>
                    <p className="text-white pb-2 font-semibold">
                      I/We authorise Teaching Services Australia to debit my/our
                      account detailed below until further notice.
                    </p>
                    <CreditCard
                      control={control}
                      ccNumber={hire_cc_number}
                      schemaObject="instrument_options"
                    />
                  </>
                )}
                {hire_payment_method === "direct debit" && (
                  <>
                    <p className="text-white pb-2 font-semibold">
                      I hereby give TSA authorisation to debit my:
                    </p>
                    <DirectDebit control={control} />
                  </>
                )}
                <p className="text-white pb-6 font-semibold">
                  Please read through the{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Link href="" className="text-[#F6BD60] underline">
                        rental terms and conditions
                      </Link>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] md:max-h-[70vh] max-w-[90vw] md:max-w-lg rounded">
                      <DialogHeader>
                        <DialogTitle className="mb-2 text-xl text-center">
                          Instrument Rental Terms and Conditions
                        </DialogTitle>
                      </DialogHeader>
                      <RentalTermsDialogContent />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="unstyled"
                            className="px-6 py-2 text-white bg-gradient-to-br from-theme-600 to bg-theme-900 rounded my-2 shadow hover:text-theme-grey-light"
                          >
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>{" "}
                  before proceeding.
                </p>
                {rentalTermsCheckboxes.map(({ name, id, term }) => (
                  <CustomCheckbox
                    key={name}
                    control={control}
                    name={name}
                    errors={errors}
                    term={term}
                    id={id}
                  />
                ))}
              </div>
            )}

            {hire_purchase_byo === "purchase" && (
              <>
                <h2 className="text-white text-2xl text-center mb-6 font-bold">
                  Choose an Instrument
                </h2>
                {availableModels?.map((data: Model) => (
                  <ModelOption
                    key={crypto.randomUUID()}
                    handleClick={selectModel}
                    selectedModel={purchased_model}
                    modelData={data}
                  />
                ))}
              </>
            )}
            {hire_purchase_byo === "bring own" && <BringOwnMessage />}
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
          type="button"
          className="bg-[#2656cf] hover:bg-[#233e85] rounded lg:rounded-br transition duration-300 text-white ml-auto px-[17px] lg:my-3 lg:mr-3 lg:px-8 py-[10px] lg:py-3 text-sm lg:text-lg"
          onClick={validateStep}
        >
          Next Step
        </button>
      </FormActions>
    </div>
  );
}
