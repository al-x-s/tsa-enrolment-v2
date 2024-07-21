"use server";

import prisma from "@/prisma/client";

import { Model, Accessory, Instrument } from "@prisma/client";

type InstrumentDataResult = {
  instrumentData: Instrument;
  models: Model[];
  accessories: Accessory[];
};

async function fetchInstrumentData(instrument: string) {
  return await prisma.instrument.findFirst({
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
}

function processModelOptions(models: Model[]): Model[] {
  const order: Record<string, number> = { Available: 1, Sold_Out: 2 };
  models.sort((a, b) => (order[a.status] || 0) - (order[b.status] || 0));
  return models;
}

function processAccessoriesOptions(accessories: Accessory[]): Accessory[] {
  const order: Record<string, number> = { true: 1, false: 2 };
  accessories.sort((a, b) => {
    return order[String(a.is_recommended)] - order[String(b.is_recommended)];
  });
  return accessories;
}

function removeDuplicateDataFromInstrumentData(data: any): any {
  const { accessories, models, ...rest } = data;
  return rest;
}

export default async function getInstrumentData(
  instrument: string
): Promise<InstrumentDataResult> {
  let instrumentData = await fetchInstrumentData(instrument);

  if (!instrumentData) {
    throw new Error("Instrument not found");
  }

  const models = processModelOptions(instrumentData.models);
  const accessories = processAccessoriesOptions(instrumentData.accessories);

  instrumentData = removeDuplicateDataFromInstrumentData(instrumentData);

  const result = {
    instrumentData: instrumentData as Instrument,
    models,
    accessories,
  };

  return result;
}
