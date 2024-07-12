"use client";
import React from "react";
import { useRouter } from "next/navigation";

// React Hook Form and Form Provider
import useAppFormContext from "@/lib/hooks/useAppFormContext";
import FormWrapper from "@/components/FormWrapper";
import FormActions from "@/components/FormActions";

// React Query and related server actions
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getSchoolNames from "@/lib/server_actions/front_end/getSchoolNames";
import getSchoolData from "@/lib/server_actions/front_end/getSchoolData";

// Components
import { Button } from "@/components/ui/button";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

// Terms and Conditions
import { GeneralTermsDialogContent } from "./generalTerms";

function WelcomeMessage({ ...props }) {
  return (
    <div>
      <p className="text-white pb-4 leading-8">
        Thank you for expressing an interest in your child joining the{" "}
        <span className="font-semibold">{props.student_school}</span> band
        program. Teaching Services Australia works closely with your child's
        school to provide an inclusive and equitable instrumental tuition
        program and welcome you as you embark upon this journey with us.
      </p>
      <p className="text-white pb-4 leading-8">
        For many students, band is the first exposure they have to instrumental
        music. Whether they join band as a fun, social experience or as a
        stepping stone to more serious music making, we aim to give all students
        the skills and knowledge necessary to succeed on their instrument and
        hope to inspire them to delve further into the rewarding world of music
        and the benefits it offers.
      </p>
      <p className="text-white pb-4 leading-8">
        If you're ready to proceed with the enrolment please read and agree to
        the{" "}
        <Dialog>
          <DialogTrigger asChild>
            <Link href="" className="text-[#F6BD60] underline">
              terms and conditions
            </Link>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] md:max-h-[70vh] max-w-[90vw] md:max-w-lg rounded">
            <DialogHeader>
              <DialogTitle className="mb-2 text-xl text-center">
                TSA Terms and Conditions
              </DialogTitle>
            </DialogHeader>
            <GeneralTermsDialogContent />

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
        then press the next step button below.
      </p>
      <FormField
        control={props.control}
        name="agree_tsa_terms"
        render={({ field }) => (
          <FormItem className="flex flex-col items-start rounded-md border p-4 mb-6">
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  ref={(node) => {
                    if (props.errors?.agree_tsa_terms && node) {
                      node.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                />
              </FormControl>
              <div className="leading-none">
                <FormLabel className="text-white font-semibold">
                  I agree to the terms and conditions
                </FormLabel>
              </div>
            </div>

            <FormMessage className="ml-6" />
          </FormItem>
        )}
      />

      <p className="text-white pb-4 leading-8">
        If you'd like more information before proceeding we'd encourage you to
        visit{" "}
        <Link
          href="www.teachingservices.com.au"
          className="text-[#F6BD60] underline"
        >
          www.teachingservices.com.au
        </Link>{" "}
        . If you'd prefer you can contact us by emailing{" "}
        <Link
          href="mailto:enrolments@teachingservices.com.au"
          className="text-[#F6BD60] underline"
        >
          enrolments@teachingservices.com.au
        </Link>{" "}
        or speak with us on{" "}
        <Link href="tel:(02)96517333" className="text-[#F6BD60] underline">
          9651 7333
        </Link>{" "}
        (ext #2).
      </p>
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();

  // React hook form config
  const { trigger, formState, control, watch, setValue } = useAppFormContext();
  const { student_school } = watch();
  const { errors } = formState;

  // Get page data
  const {
    data: schoolNames,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["schoolNames"],
    queryFn: async () => {
      const data = await getSchoolNames();
      return data;
    },
  });

  // Prefetch schoolData when student_school is changed
  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (!student_school) {
      return;
    }

    // If student_school is changed the below values will be reset
    setValue("student_details.student_grade", "");
    setValue("student_details.instrument", "");
    setValue("selected_program_id", "");
    setValue("instrument_options.purchased_model", "");
    setValue("accessories", {});
    setValue("school_id", "");
    setValue("program_type", "");

    // schoolData is prefetched
    queryClient.prefetchQuery({
      queryKey: ["schoolData", student_school],
      queryFn: () => getSchoolData(student_school),
    });
  }, [student_school]);

  // Fetch school data to set value of school_id and levy within validateStep function
  const { data: schoolData, isPending } = useQuery({
    queryKey: ["schoolData", student_school],
    queryFn: () => getSchoolData(student_school),
    enabled: !!student_school,
  });

  // Check form fields before moving to student_details
  const validateStep = async () => {
    const isValid = await trigger(["student_school", "agree_tsa_terms"], {
      shouldFocus: true,
    });

    setValue("school_id", schoolData?.schoolId.toString());

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
                      {schoolNames?.map((school: any) => (
                        <SelectItem key={school.name} value={school.name}>
                          {school.name}
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
