"use client";
import React from "react";
import clsx from "clsx";
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import { useRouter } from "next/navigation";

// Components
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

// Server Actions
import getInstrumentData from "@/lib/server_actions/front_end/getInstrumentData";

// Helper Functions
import generateInstrumentSelectMap from "@/lib/helpers/generateInstrumentSelectMap";

// Types
import { InstrumentSelectMap, SchoolGradeWithGrades } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getSchoolData from "@/lib/server_actions/front_end/getSchoolData";
import getProgramsData from "@/lib/server_actions/front_end/getProgramsData";

export default function StudentDetailsPage() {
  const router = useRouter();

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
    }
  }, []);

  // React hook form config
  const { trigger, formState, control, watch, setValue } = useAppFormContext();
  const { errors } = formState;
  const { student_school, student_details, school_id } = watch();
  const { student_medical, instrument } = student_details;

  // Get page data
  const { data: schoolData, isPending } = useQuery({
    queryKey: ["schoolData", student_school],
    queryFn: () => getSchoolData(student_school),
  });

  // TODO - Need a better loading state
  if (isPending) {
    return <p>loading</p>;
  }

  // Destructure values from schoolData and set school_id
  const { grades, instruments, enrolmentYear, schoolId } = schoolData;

  // Prefetch data when instrument is changed
  const queryClient = useQueryClient();
  React.useEffect(() => {
    // Prefetch Instrument Data
    queryClient.prefetchQuery({
      queryKey: ["instrumentData", instrument],
      queryFn: () => getInstrumentData(instrument),
    });

    // Prefetch Programs Data
    // queryClient.prefetchQuery({
    //   queryKey: ["programsData", school_id, instrument],
    //   queryFn: () => getProgramsData(parseInt(school_id!), instrument),
    // });

    // If instrument is changed the below values will be reset
    setValue("selected_program_id", "");
    setValue("instrument_options.purchased_model", "");
    setValue("accessories", {});
    setValue("program_type", "Band");
  }, [instrument]);

  // Fetch instrument data to set value of program type within validateStep function
  const { data } = useQuery({
    queryKey: ["instrumentData", instrument],
    queryFn: () => getInstrumentData(instrument),
    enabled: !!instrument,
  });

  // Check form fields before moving to tuition_type
  const validateStep = async () => {
    const isValid = await trigger(["student_details"], {
      shouldFocus: true,
    });

    const { instrumentData } = data;
    setValue("program_type", instrumentData?.program_type);

    if (isValid) {
      router.push("/tuition_type");
    }
  };

  // Return to previous step function
  function previousStep() {
    router.push("/welcome");
  }

  return (
    <div className="shadow-lg h-full">
      <FormWrapper
        heading="Student Info"
        description="Please provide the details of the child you are enrolling."
      >
        <ScrollArea className="px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-auto mb-1">
          <div className="flex flex-col mt-6">
            <div className="md:flex md:flex-row md:gap-4">
              <FormField
                control={control}
                name="student_details.student_first_name"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">
                        Student First Name
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription>Your first name.</FormDescription> */}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="student_details.student_surname"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">
                        Student Surname
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription>Your first name.</FormDescription> */}
                  </FormItem>
                )}
              />
            </div>
            <div className="md:flex md:flex-row md:gap-4">
              <FormField
                control={control}
                name="student_details.student_grade"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">
                        Student Grade in{" "}
                        <span className="font-bold text-[#F6BD60]">
                          {enrolmentYear}
                        </span>
                      </FormLabel>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grades.map((item: any) => (
                          <SelectItem
                            key={item.grade.name}
                            value={`${item.grade.name} in ${enrolmentYear}`}
                            className="ml-3"
                          >
                            {item.grade.name}
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
                name="student_details.instrument"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-white">
                        Instrument Choice
                      </FormLabel>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an instrument" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {instruments.map((section: any) => (
                          <SelectGroup key={crypto.randomUUID()}>
                            <SelectLabel key={section.program}>
                              {section.program}
                            </SelectLabel>
                            {section.children.map((option: any) => (
                              <SelectItem
                                value={option.label}
                                key={option.label}
                                disabled={option.disabled}
                                className="ml-3"
                              >
                                {option.label}
                                <span className="ml-3">
                                  {option.message ? `(${option.message})` : ""}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="student_details.previous_student"
              render={({ field }) => (
                <FormItem
                  className="space-y-3 pb-6"
                  ref={(node) => {
                    if (errors?.student_details?.previous_student && node) {
                      node.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                >
                  <FormLabel className="text-white">
                    Has this child learned an instrument with TSA before?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-ubuntu text-white">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-ubuntu text-white">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="student_details.opportunity_student"
              render={({ field }) => (
                <FormItem
                  className="space-y-3 pb-6"
                  ref={(node) => {
                    if (errors?.student_details?.opportunity_student && node) {
                      node.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                >
                  <FormLabel className="text-white">
                    Is this child currently enrolled in an opportunity class?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-ubuntu text-white">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-ubuntu text-white">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="student_details.student_medical"
              render={({ field }) => (
                <FormItem className="pb-6">
                  <FormLabel className="text-white">
                    Does your child have any life-threatening medical conditions
                    or special learning requirements?
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} maxLength={1000} />
                  </FormControl>
                  <div className="flex items-baseline justify-between">
                    <FormMessage />
                    <p className="text-white text-sm ml-auto">
                      {`${
                        student_medical != undefined
                          ? student_medical.length
                          : 0
                      } `}
                      / 1000
                    </p>
                  </div>
                </FormItem>
              )}
            />
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
