"use server";
import z from "zod";
import {
  deleteEntity,
  createEntity,
  updateEntity,
  parseFormData,
  addOrRemoveConnection,
  getItemByCondition,
  findOne,
} from "@/lib/helpers/dbHelpers";
import { DeleteResult } from "@/lib/types/types";
import { accessorySchema } from "@/lib/schemas/schema";
import prisma from "@/prisma/client";
import { Accessory } from "@prisma/client";

export async function getAccessory(accessory_id: number): Promise<Accessory> {
  try {
    const accessory = await findOne(prisma.accessory, { id: accessory_id });
    return accessory;
  } catch (error) {
    throw error;
  }
}

export async function getAccessoriesByInstrument(
  instrument_id: number
): Promise<(Accessory & { instrument_id: number })[]> {
  const result = await getItemByCondition<Accessory>({
    model: prisma.accessory,
    condition: "some",
    relatedEntity: "instruments",
    relatedEntityId: instrument_id,
  });
  return result.map((item: Accessory & { relatedEntityId: number }) => ({
    ...item,
    instrument_id: item.relatedEntityId,
  }));
}

export async function getAccessoriesNotLinkedToInstrument(
  instrument_id: number
): Promise<(Accessory & { instrument_id: number })[]> {
  const result = await getItemByCondition<Accessory>({
    model: prisma.accessory,
    condition: "none",
    relatedEntity: "instruments",
    relatedEntityId: instrument_id,
  });
  return result.map((item: Accessory & { relatedEntityId: number }) => ({
    ...item,
    instrument_id: item.relatedEntityId,
  }));
}

export const removeAccessory = async ({
  instrument_id,
  accessory_id,
}: {
  instrument_id: number;
  accessory_id: number;
}) => {
  return await addOrRemoveConnection({
    model: prisma.instrument,
    foreign_key: "accessories",
    row_id: instrument_id,
    connection_id: accessory_id,
    action: "disconnect",
  });
};

export const addAccessory = async ({
  instrument_id,
  accessory_id,
}: {
  instrument_id: number;
  accessory_id: number;
}) => {
  return await addOrRemoveConnection({
    model: prisma.instrument,
    foreign_key: "accessories",
    row_id: instrument_id,
    connection_id: accessory_id,
    action: "connect",
  });
};

export async function deleteAccessory(
  accessory_id: number
): Promise<DeleteResult> {
  return await deleteEntity(
    prisma.accessory,
    accessory_id,
    "admin/accessories"
  );
}

export const createAccessory = async (
  formData: z.infer<typeof accessorySchema>
) => {
  const parsedData = parseFormData(formData, accessorySchema);
  const result = await createEntity(
    prisma.accessory,
    parsedData,
    "/admin/accessories"
  );
  return result;
};

export const updateAccessory = async ({
  formData,
  accessory_id,
}: {
  formData: z.infer<typeof accessorySchema>;
  accessory_id: number;
}) => {
  const parsedData = parseFormData(formData, accessorySchema);
  const result = await updateEntity(
    prisma.accessory,
    parsedData,
    accessory_id,
    "/admin/accessories"
  );
  return result;
};
