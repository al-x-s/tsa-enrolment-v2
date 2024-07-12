"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Hooks
import useAppFormContext from "@/lib/hooks/useAppFormContext";

// Server Actions
import getInstrumentData from "@/lib/server_actions/front_end/getInstrumentData";

// Types
import { SelectedAccessory } from "@/lib/types";

// Components
import FormWrapper from "@/components/FormWrapper";
import FormActions from "@/components/FormActions";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AccessoryOption } from "@/components/ui/accessory_option";
import { useQuery } from "@tanstack/react-query";

export default function InstrumentOptionsPage() {
  const router = useRouter();
  // React hook form config
  const { watch, setValue } = useAppFormContext();
  const { student_school, student_details, accessories } = watch();
  const { instrument } = student_details;

  // Get page data
  const { data, isPending } = useQuery({
    queryKey: ["instrumentData", instrument],
    queryFn: () => getInstrumentData(instrument),
  });

  if (isPending) {
    return <p>loading...</p>;
  }

  const { accessoriesOptions } = data;

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
    }
  }, []);

  // A function that will be passed to AccessoryOption component
  const updateAccessoriesObject = (name: string, value: boolean) => {
    if (!accessories) return;

    const updatedObject: SelectedAccessory = { ...accessories };
    updatedObject[name] = value;

    setValue("accessories", updatedObject);
  };

  const nextStep = () => {
    router.push("/summary");
  };

  // Previous Step function
  function previousStep() {
    router.push("/instrument_options");
  }
  return (
    <div className="shadow-lg h-full">
      <FormWrapper
        heading="Accessories"
        description="Items to assist with learning"
      >
        <ScrollArea className="px-4 md:px-8 max-h-[calc(100%-160px)] lg:max-h-none overflow-auto">
          <div className="flex flex-col mt-6">
            {accessoriesOptions?.map((data: any) => (
              <AccessoryOption
                updateAccessoriesObject={updateAccessoriesObject}
                accessories={accessories}
                data={data}
                key={crypto.randomUUID()}
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
          onClick={nextStep}
        >
          Next Step
        </button>
      </FormActions>
    </div>
  );
}
