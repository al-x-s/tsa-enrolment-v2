"use server";

import prisma from "@/prisma/client";

import { InstrumentModel, Accessory } from "@prisma/client";
import { InstrumentWithRelations } from "@/lib/types";

const filterAndSortAccessories = (array: Accessory[] | undefined) => {
  // remove items with status of "Hidden"
  const filtered = array?.filter((option) => option.status !== "Inactive");
  const order: any = { true: 1, false: 2 };
  // sort by is_reccomended
  filtered?.sort((a: any, b: any) => {
    return order[a.is_recommended] - order[b.is_recommended];
  });
  return filtered;
};

const filterAndSortModels = (array: InstrumentModel[] | undefined) => {
  // remove items with status of "Hidden"
  const filtered = array?.filter((option) => option.status !== "Hidden");
  // order filtered array
  const order: any = { Available: 1, "Sold Out": 2 };
  filtered?.sort((a: any, b: any) => {
    return order[a.status] - order[b.status];
  });
  return filtered;
};

export default async function getInstrumentData(
  instrument: string
): Promise<any> {
  const instrumentData = await prisma.instrument.findFirst({
    where: {
      name: instrument,
    },
    include: {
      accessories: true,
      models: true,
    },
  });

  const purchaseOptions: InstrumentModel[] | undefined = filterAndSortModels(
    instrumentData?.models
  );

  const accessoriesOptions: Accessory[] | undefined = filterAndSortAccessories(
    instrumentData?.accessories
  );

  const result = {
    instrumentData,
    purchaseOptions,
    accessoriesOptions,
  };
  return JSON.parse(JSON.stringify(result));
}
