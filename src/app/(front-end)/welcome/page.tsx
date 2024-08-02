"use client";
import React from "react";
import { useRouter } from "next/navigation";

// React Hook Form and Form Provider
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import FormWrapper from "@/components/FrontEndForm/FormWrapper";
import FormActions from "@/components/FrontEndForm/FormActions";

// React Query and related server actions
import { useQuery } from "@tanstack/react-query";
import getSchoolsData from "@/lib/server_actions/front_end/getSchoolsData";

// Components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WelcomeMessage } from "./WelcomeMessage";

export default function WelcomePage() {
  const router = useRouter();

  // React hook form config
  const { trigger, formState, control, watch, setValue } = useAppFormContext();
  const { student_school } = watch();
  const { errors } = formState;

  // Get page data
  const {
    data: schoolsData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["schoolsData"],
    queryFn: async () => {
      const data = await getSchoolsData();
      return data;
    },
  });

  React.useEffect(() => {
    if (!student_school) {
      return;
    }
    // If student_school is changed the below form values will be reset
    setValue("student_details.student_grade", "");
    setValue("student_details.instrument", "");
    setValue("selected_program_id", "");
    setValue("instrument_options.purchased_model", "");
    setValue("accessories", {});
  }, [student_school]);

  if (isPending || isError) {
    return;
  }

  const school_names = Object.keys(schoolsData);

  // Check form fields before moving to student_details
  const validateStep = async () => {
    const isValid = await trigger(["student_school", "agree_tsa_terms"], {
      shouldFocus: true,
    });

    if (isValid) {
      router.push("/student_details");
    }
  };

  return (
    <div className="shadow-lg h-full">
      <FormWrapper
        heading="TSA Online Enrolment"
        description="Please select your school to begin."
      >
        <ScrollArea className="px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-hidden">
          <div className="flex flex-col mt-6">
            <FormField
              control={control}
              name="student_school"
              render={({ field }) => (
                <FormItem className="pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-white">Student School</FormLabel>
                    <FormMessage />
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {school_names.map((name: string) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {student_school !== "" && (
              <>
                <WelcomeMessage
                  student_school={student_school}
                  schoolsData={schoolsData}
                  control={control}
                  errors={errors}
                />
              </>
            )}
          </div>
        </ScrollArea>
      </FormWrapper>
      <FormActions>
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
