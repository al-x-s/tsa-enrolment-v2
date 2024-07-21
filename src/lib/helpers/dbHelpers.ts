import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { DeleteResult } from "../types/types";
import { z } from "zod";

export function parseFormData<T>(formData: T, schema: z.ZodSchema): T {
  const parsed = schema.safeParse(formData);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }
  return parsed.data;
}

export const findOne = async (model: any, where: object) => {
  return await model.findUnique({ where });
};

export const findMany = async (model: any, where: object = {}) => {
  return await model.findMany({ where });
};

export async function getItemByCondition<T>({
  model,
  condition,
  relatedEntity,
  relatedEntityId,
}: {
  model: any;
  condition: "some" | "none";
  relatedEntity: string;
  relatedEntityId: number;
}): Promise<(T & { relatedEntityId: number })[]> {
  try {
    const items: T[] = await findMany(model, {
      [relatedEntity]: {
        [condition]: { id: relatedEntityId },
      },
    });
    return items.map((item) => ({
      ...item,
      relatedEntityId,
    }));
  } catch (error) {
    console.error(`Error fetching items with condition ${condition}`, error);
    return [];
  }
}

export const createOne = async <T>(model: any, data: T) => {
  return await model.create({ data });
};

export const createEntity = async <T>(
  model: any,
  formData: T,
  revalidatePathStr: string
) => {
  try {
    const result = await createOne(model, formData);

    if (result) {
      revalidatePath(revalidatePathStr);
      return { isSuccess: true };
    } else {
      return { isSuccess: false, issues: "Failed to create entity" };
    }
  } catch (error) {
    return {
      isSuccess: false,
      issues: error,
    };
  }
};

export const updateOne = async (model: any, where: object, data: object) => {
  return await model.update({ where, data });
};

export async function updateEntity(
  model: any,
  parsedData: any,
  entityId: number,
  revalidatePathUrl: string
) {
  try {
    const result = updateOne(model, { id: entityId }, parsedData);

    if (result) {
      revalidatePath(revalidatePathUrl);
      return result;
    }
  } catch (error) {
    throw error;
  }
}

export const addOrRemoveConnection = async ({
  model,
  foreign_key,
  row_id,
  connection_id,
  action,
}: {
  model: any;
  foreign_key: string;
  row_id: number;
  connection_id: number;
  action: "connect" | "disconnect";
}) => {
  try {
    const result = updateOne(
      model,
      { id: row_id },
      { [foreign_key]: { [action]: { id: connection_id } } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteOne = async (model: any, where: object) => {
  return await model.delete({ where });
};

export const deleteEntity = async (
  model: any,
  id: number,
  revalidatePathUrl: string
): Promise<DeleteResult> => {
  try {
    const entity = await deleteOne(model, { id });

    if (entity) {
      revalidatePath(revalidatePathUrl);
      return { isSuccess: true };
    } else {
      return { isSuccess: false, error: new Error("Entity not found") };
    }
  } catch (error) {
    console.error(`Error deleting entity from model ${model}`, error);
    return { isSuccess: false, error };
  }
};
