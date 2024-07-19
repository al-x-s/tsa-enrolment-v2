"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Hooks
import useAppFormContext from "@/lib/hooks/useAppFormContext";

// Components
import FormWrapper from "@/components/FormWrapper";
import FormActions from "@/components/FormActions";
import ProgramOption from "@/components/ProgramOption/ProgramOption";
import { ScrollArea } from "@/components/ui/scroll-area";

// Server Actions
import getProgramsData from "@/lib/server_actions/front_end/getProgramsData";

// Types
import { SchoolProgramWithPrograms } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import getSchoolData from "@/lib/server_actions/front_end/getSchoolData";

export default function TuitionTypePage() {
  const router = useRouter();

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
      return;
    }
  });

  // React hook form config
  const { trigger, formState, control, watch, setValue } = useAppFormContext();
  const {
    student_school,
    program_type,
    school_id,
    student_details,
    selected_program_id,
  } = watch();
  const { instrument } = student_details;
  const { errors } = formState;

  // Get page data
  const { data: schoolData } = useQuery({
    queryKey: ["schoolData", student_school],
    queryFn: () => getSchoolData(student_school),
  });

  const { data: programsData, isPending } = useQuery({
    queryKey: ["programsData", school_id, program_type],
    queryFn: () => getProgramsData(parseInt(school_id!), program_type),
  });

  if (isPending) {
    return;
  }

  console.log("Programs Data --->", programsData);

  // Desctructure schoolData
  const { levyFee } = schoolData;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (event.target instanceof HTMLButtonElement) {
      setValue("selected_program_id", event.target.value, {
        shouldValidate: true,
      });
    }
  };

  // Validates form fields on this page
  const validateStep = async () => {
    const isValid = await trigger(["selected_program_id"]);

    if (isValid) {
      router.push("/your_details");
    }
  };

  // Previous Step function
  function previousStep() {
    router.push("/student_details");
  }

  return (
    <div className="shadow-lg h-full">
      <FormWrapper
        heading="Tuition Type"
        description="Choose your tuition type."
      >
        {errors.selected_program_id?.message && (
          <p className="text-highlight ml-8 mb-2">
            {errors.selected_program_id.message}
          </p>
        )}
        <ScrollArea className="px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-auto">
          <div className="flex flex-col mt-6">
            {programsData?.map((program: any) => (
              <ProgramOption
                key={program.programId}
                schoolProgramStatus={program.status}
                programData={program.program}
                levyFee={parseInt(levyFee)}
                handleClick={handleClick}
                selectedTuitionType={selected_program_id}
              />
            ))}
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
