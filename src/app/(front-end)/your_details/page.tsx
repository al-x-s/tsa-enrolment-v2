"use client";
import React from "react";
import clsx from "clsx";
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import { useRouter } from "next/navigation";
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
import InputFormatted from "@/components/ui/input_formatted";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import getHireableTableData from "@/lib/server_actions/front_end/getHireableTableData";

export default function YourDetailsPage() {
  const router = useRouter();
  const { trigger, formState, control, watch, setFocus } = useAppFormContext();
  const { errors } = formState;
  const {
    student_school,
    student_details,
    your_details,
    school_id,
    program_type,
  } = watch();
  const { client_email, confirm_client_email } = your_details;
  const instrument = student_details.instrument;
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
      return;
    }

    queryClient.prefetchQuery({
      queryKey: ["getHireableTableData", instrument],
      queryFn: () => getHireableTableData(parseInt(school_id!), program_type!),
    });
  }, []);

  const isEmailMatch = client_email === confirm_client_email ? true : false;

  // Previous Step function
  function previousStep() {
    router.push("/tuition_type");
  }

  const validateStep = async () => {
    if (client_email !== confirm_client_email) {
      setFocus("your_details.client_email");
      return;
    }

    const isValid = await trigger(["your_details"], { shouldFocus: true });

    if (isValid) {
      router.push("/instrument_options");
    }
  };

  return (
    <div className="shadow-lg h-full">
      <FormWrapper
        heading="Your Details"
        description="Please provide your contact information."
      >
        <ScrollArea className="px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-auto mb-1">
          <div className="flex flex-col mt-6">
            <div className="md:flex md:flex-row md:gap-4">
              <FormField
                control={control}
                name="your_details.client_first_name"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">
                        Your First Name
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="your_details.client_surname"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">Your Surname</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="your_details.client_email"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-white">Email Address</FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEmailMatch && (
              <p className="text-highlight text-sm text-right">
                Email fields must match
              </p>
            )}

            <FormField
              control={control}
              name="your_details.confirm_client_email"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-white">
                      Confirm Email Address
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:flex md:flex-row md:gap-4">
            <FormField
              control={control}
              name="your_details.client_mobile"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-white">Mobile Number</FormLabel>
                  </div>
                  <FormControl>
                    {/* <Input placeholder="" {...field} /> */}
                    <InputFormatted
                      {...field}
                      format="#### ### ###"
                      type="tel"
                      allowEmptyFormatting={true}
                    />
                  </FormControl>
                  {errors.your_details?.client_mobile && (
                    <p className="text-highlight text-sm">
                      A mobile number is required
                    </p>
                  )}
                  {/* <FormDescription>Your first name.</FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="your_details.relationship"
              render={({ field }) => (
                <FormItem className="md:w-1/2 pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-white">
                      Relationship to student
                    </FormLabel>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Parent" className="ml-3">
                        Parent
                      </SelectItem>
                      <SelectItem value="Grandparent" className="ml-3">
                        Grandparent
                      </SelectItem>
                      <SelectItem value="Guardian" className="ml-3">
                        Guardian
                      </SelectItem>
                      <SelectItem value="Other" className="ml-3">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border boder-2 border-white px-4 pt-4 mb-6">
            <h2 className="pb-4 text-white font-bold">Your Address</h2>
            <FormField
              control={control}
              name="your_details.client_street_address"
              render={({ field }) => (
                <FormItem className="pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-white">Street Address</FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:flex md:flex-row md:gap-4">
              <FormField
                control={control}
                name="your_details.client_city_suburb"
                render={({ field }) => (
                  <FormItem className="md:w-1/3 pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">City/Suburb</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="your_details.client_state"
                render={({ field }) => (
                  <FormItem className="pb-6 md:w-1/3">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">State</FormLabel>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "NSW",
                          "ACT",
                          "VIC",
                          "QLD",
                          "TAS",
                          "SA",
                          "NT",
                          "WA",
                        ].map((state) => (
                          <SelectItem
                            value={state}
                            key={state}
                            className="ml-3"
                          >
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="your_details.client_postcode"
                render={({ field }) => (
                  <FormItem className="md:w-1/3 pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">Postcode</FormLabel>
                    </div>
                    <FormControl>
                      {/* <Input placeholder="" {...field} /> */}
                      <InputFormatted
                        {...field}
                        format="####"
                        type="tel"
                        allowEmptyFormatting={true}
                      />
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription>Your first name.</FormDescription> */}
                  </FormItem>
                )}
              />
            </div>
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
