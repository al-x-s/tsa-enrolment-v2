"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Hooks
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import { useUserSelections } from "@/components/Providers/UserSelectionsProvider";

// Types
import { Model } from "@prisma/client";

// Components
import FormWrapper from "@/components/FrontEndForm/FormWrapper";
import FormActions from "@/components/FrontEndForm/FormActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

function FormFieldInput({ ...props }) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.className}>
          <div className="flex items-baseline justify-between">
            <FormLabel className="text-white">{props.label}</FormLabel>
          </div>
          <FormControl>
            <Input placeholder="" {...field} />
          </FormControl>

          <FormMessage />
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
  const { purchased_model, hire_purchase_byo } = instrument_options;

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

                <article className="bg-[#E6D3F9] p-2 rounded-sm mb-6">
                  <h2 className="py-2 text-center font-semibold">
                    Instrument Rental Costs
                  </h2>
                  <Table className="mb-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-3/5">Item</TableHead>
                        <TableHead className="w-2/5 text-right">
                          Price Per Month
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{instrument} Rental</TableCell>
                        <TableCell className="text-right">{`$${selectedInstrumentData?.hire_cost}`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Insurance (optional)</TableCell>
                        <TableCell className="text-right">{`$${selectedInstrumentData?.hire_insurance}`}</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>TOTAL:</TableCell>
                        <TableCell className="text-right">{`$${
                          (selectedInstrumentData?.hire_cost ?? 0) +
                          (selectedInstrumentData?.hire_insurance ?? 0)
                        } a month`}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                  <Accordion className="px-2" type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        What are the rental costs for other instruments?
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table className="mb-4">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Instruments</TableHead>
                              <TableHead>Cost Per Month</TableHead>
                              <TableHead>
                                Insurance Per Month (optional)
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {hireableTableData?.map(
                              ({ instruments, hire_cost, insurance_cost }) => (
                                <TableRow key={crypto.randomUUID()}>
                                  <TableCell>
                                    {instruments.join(", ")}
                                  </TableCell>
                                  <TableCell>${hire_cost}</TableCell>
                                  <TableCell>${insurance_cost}</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Do you have a rent to buy scheme?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Yes we do! Here are our terms for the rent to buy
                          scheme:
                        </p>
                        <br />
                        <ul
                          role="list"
                          className="flex flex-col gap-1 list list-disc leading-6 pl-6"
                        >
                          <li className="leading-6">
                            The instrument may be purchased at any time
                            throughout the rental period.
                          </li>
                          <li className="leading-6">
                            For the first 12 months all rental payments
                            (excluding insurance) are deducted from the retail
                            price of the instrument.
                          </li>
                          <li className="leading-6">
                            Between 12 and 24 months 50% of rental payments are
                            deducted
                          </li>
                          <li className="leading-6">
                            After 24 months no more equity is put towards the
                            buyout price.
                          </li>
                          <li className="leading-6">
                            You can contact TSA at any time to obtain a buy-out
                            price. We do not contact customers to give updates
                            on buyout prices unless requested by you.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </article>

                {/* RENTAL TERMS AND CONDITIONS */}

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
                    className="w-full mb-6"
                  />
                  <FormFieldInput
                    control={control}
                    name="instrument_options.nearest_relative_phone"
                    label="Nearest Relative Contact Number"
                    className="w-full mb-6"
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
                      className="w-full mb-6"
                    />

                    <FormFieldInput
                      control={control}
                      name="instrument_options.main_earner_mobile"
                      label="Mobile Number"
                      className="w-full mb-6"
                    />
                  </div>
                  <div className="md:flex md:flex-row md:gap-4">
                    <FormFieldInput
                      control={control}
                      name="instrument_options.main_earner_employer_name"
                      label="Employer Name"
                      className="w-full mb-6"
                    />
                    <FormFieldInput
                      control={control}
                      name="instrument_options.main_earner_employer_phone"
                      label="Employer Contact Number"
                      className="w-full mb-6"
                    />
                  </div>
                </div>
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
            {hire_purchase_byo === "bring own" && (
              <>
                <h2 className="text-white text-2xl text-center mb-6 font-bold">
                  Choosing The Right Instrument
                </h2>
                <h3 className="text-white font-semibold text-xl mb-4">
                  Be wary of 'budget' instruments
                </h3>
                <p className="text-white mb-4 leading-8">
                  Although 'budget' instruments advertised online or through a
                  chain/discount store can present a cheap initial outlay, they
                  are not always the best option. Repair costs, poor resale and
                  difficulty in playing make these instruments a poor choice. If
                  you are budget conscious, consider buying a reputable brand
                  instrument secondhand instead.
                </p>
                <p className="text-white mb-4 leading-8">
                  'Budget' instruments are generally made of inferior material
                  which won't hold up to the rigors of primary school use. They
                  may last 12 months or they may last 12 weeks. Once they do
                  need a trip to the repair shop even a basic service will cost
                  around $110. In fact, most repairers refuse to work on
                  'budget' instruments altogether.
                </p>
                <p className="text-white mb-4 leading-8">
                  Also be aware that many 'budget' brand instruments save money
                  by leaving out features and materials that make it easier to
                  play for young musicians. This makes learning harder for your
                  child, decreasing their chance of success.
                </p>
                <p className="text-white mb-4 leading-8">
                  Purchasing a reputable brand will ensure your child is
                  learning on a durable instrument that is easier to play and
                  will hold greater resale value. It gives the best chance of
                  success and will almost certainly cost you less in the long
                  run.
                </p>
                <p className="text-white mb-4 leading-8">
                  If you'd like advice on which brands are reputable, or where
                  you may find suitable second hand options please contact us on{" "}
                  <Link
                    href="tel:(02)96517333"
                    className="text-[#F6BD60] underline"
                  >
                    9651 7333
                  </Link>{" "}
                  (extension #2).
                </p>
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
