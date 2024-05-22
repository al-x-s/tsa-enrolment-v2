"use client";
import React from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

// Hooks
import { DataContext } from "@/lib/hooks/DataContextProvider";
import useAppFormContext from "@/lib/hooks/useAppFormContext";

// Server Actions
import getInstrumentData from "@/lib/server_actions/getInstrumentData";

// Types
import {
  Accessory,
  PurchaseOptions,
  InstrumentData,
  SelectedAccessory,
} from "@/lib/types";

// Components
import FormWrapper from "@/components/FormWrapper";
import FormActions from "@/components/FormActions";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AccessoryOption } from "@/components/ui/accessory_option";

export default function InstrumentOptionsPage() {
  const router = useRouter();
  const { watch, setValue } = useAppFormContext();
  const { student_school, student_details, accessories } = watch();
  const { instrument } = student_details;

  const { instrumentData } = React.useContext(DataContext);

  // Instantiate accessoriesData to store accessoriesData from db
  const [accessoriesData, setAccessoriesData] = React.useState<
    Accessory[] | null
  >(null);

  // Create filterAndSort function to parse accessoriesData
  const filterAndSort = (array: Accessory[] | null) => {
    // remove items with status of "Hidden"
    array?.filter((option) => option.status !== "Inactive");
    const order: any = { true: 1, false: 2 };
    // sort by is_reccomended
    array?.sort((a: any, b: any) => {
      return order[a.is_recommended] - order[b.is_recommended];
    });
    return array;
  };

  // Create initAccessoriesObject function that initialzes the accessories object based on accessoriesData
  const initAccessoriesObject = (accessories: Accessory[] | null) => {
    if (!accessories) return;
    const result: SelectedAccessory = {};
    accessories.forEach((accessory: any) => {
      const { name } = accessory;
      result[name] = false;
    });
  };

  // Fetch instrument data from db and assign filtered instrument accessories to accessoriesData
  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
    }

    if (!instrument) {
      return;
    }
    async function runEffect() {
      if (!instrumentData) {
        return;
      }

      // const response: InstrumentData = await getInstrumentData(instrument);
      const sortedAccessories = filterAndSort(instrumentData.accessories);
      setAccessoriesData(sortedAccessories);

      // Check for existing accessories value
      if (accessories !== null) {
        return;
      }

      // Otherwise set accessories to initAccessories
      const initAccessories: SelectedAccessory = {};
      sortedAccessories?.forEach((accessory: Accessory) => {
        const { name } = accessory;
        initAccessories[name] = false;
      });

      setValue("accessories", initAccessories);
    }

    runEffect();
  }, []);

  // A function that will be passed to AccessoryOption component
  const updateAccessoriesObject = (name: string, value: boolean) => {
    if (!accessories) return;

    const updatedObject: any = { ...accessories };
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
            {accessoriesData?.map((data) => (
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
