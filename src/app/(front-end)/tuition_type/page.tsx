"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Hooks
import { DataContext } from "@/lib/hooks/DataContextProvider";
import useAppFormContext from "@/lib/hooks/useAppFormContext";

// Components
import FormWrapper from "@/components/FormWrapper";
import FormActions from "@/components/FormActions";
import { TuitionTypeOption } from "@/components/ui/tuition_type_option";
import { ScrollArea } from "@/components/ui/scroll-area";

// Server Actions
import getAllHireableInstruments from "@/lib/server_actions/getAllHireableInstruments";

// Helper functions
import filterProgramsByInstrument from "@/lib/helpers/filterProgramsByInstrument";

// Types
import { Programs, SchoolData, HireableInstrumentInput } from "@/lib/types";

export default function TuitionTypePage() {
  const router = useRouter();
  const { trigger, formState, control, watch, setValue } = useAppFormContext();
  const { errors } = formState;
  const { student_school, student_details, selected_program_id } = watch();
  const instrument = student_details.instrument;

  // Instantiating schoolData and programsData
  // const [schoolData, setSchoolData] = React.useState<SchoolData | null>(null);
  const { schoolData, setAllHireableInstruments } =
    React.useContext(DataContext);
  const [programsData, setProgramsData] = React.useState<Programs[] | null>(
    null
  );

  const levyFee = schoolData?.resource_levy;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (event.target instanceof HTMLButtonElement) {
      setValue("selected_program_id", event.target.value, {
        shouldValidate: true,
      });
    }
  };

  // Fetching schoolData and programsData data from server
  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
      return;
    }

    async function runEffect() {
      if (!schoolData) {
        return;
      }

      const response: HireableInstrumentInput[] =
        await getAllHireableInstruments();
      console.log("response --->", response);
      setAllHireableInstruments(response);

      const programs: any = filterProgramsByInstrument(
        instrument,
        schoolData.instrument_options,
        schoolData.programs
      );

      setProgramsData(programs);
    }

    runEffect();
  }, []);

  // Ordering programsData
  const order: any = { Group: 1, Private: 2, "Band Only": 3 };
  programsData?.sort((a: Programs, b: Programs) => {
    return order[a.program.classType] - order[b.program.classType];
  });

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
          <p className="text-destructive ml-8 mb-2">
            {errors.selected_program_id.message}
          </p>
        )}
        <ScrollArea className="px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-auto">
          <div className="flex flex-col mt-6">
            {programsData?.map((program) => (
              <TuitionTypeOption
                key={program.programId}
                programData={program.program}
                levyFee={levyFee}
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
