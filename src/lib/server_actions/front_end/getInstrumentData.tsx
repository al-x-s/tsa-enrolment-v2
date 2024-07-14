"use server";

import prisma from "@/prisma/client";

import { InstrumentModel, Accessory } from "@prisma/client";
import { InstrumentWithRelations } from "@/lib/types";

type InstrumentDataResult = {
  instrumentData: InstrumentWithRelations;
  purchaseOptions: InstrumentModel[];
  accessoriesOptions: Accessory[];
};

const filterAndSortAccessories = (array: Accessory[]): Accessory[] => {
  // remove items with status of "Hidden"
  // const filtered = array.filter((option) => option.status !== "Inactive");
  const order: Record<string, number> = { true: 1, false: 2 };
  // sort by is_reccomended
  array.sort((a, b) => {
    return order[String(a.is_recommended)] - order[String(b.is_recommended)];
  });
  return array;
};

const filterAndSortModels = (array: InstrumentModel[]): InstrumentModel[] => {
  // const filtered = array.filter((option) => option.status !== "Hidden");
  const order: Record<string, number> = { Available: 1, Sold_Out: 2 };
  array.sort((a, b) => (order[a.status] || 0) - (order[b.status] || 0));
  return array;
};

export default async function getInstrumentData(
  instrument: string
): Promise<InstrumentDataResult | null> {
  const instrumentData = await prisma.instrument.findFirst({
    where: {
      name: instrument,
    },
    include: {
      accessories: {
        where: {
          status: {
            not: "Inactive",
          },
        },
        orderBy: [{ is_recommended: "desc" }, { id: "asc" }],
      },
      models: {
        orderBy: [
          {
            status: "asc",
          },
          { id: "asc" },
        ],
      },
    },
  });

  if (!instrumentData) {
    return null;
  }

  const purchaseOptions: InstrumentModel[] = filterAndSortModels(
    instrumentData?.models
  );

  const accessoriesOptions: Accessory[] = filterAndSortAccessories(
    instrumentData?.accessories
  );

  const result = {
    instrumentData,
    purchaseOptions,
    accessoriesOptions,
  };
  return JSON.parse(JSON.stringify(result));
}
