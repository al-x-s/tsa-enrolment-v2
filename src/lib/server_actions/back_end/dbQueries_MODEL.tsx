"use server";
import prisma from "@/prisma/client";
import z from "zod";
import { DeleteResult } from "@/lib/types";
import { deleteEntity } from "@/lib/helpers/dbHelpers";
import { Instrument, Model } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  schoolInstrumentSchema,
  instrumentSchema,
  modelSchema,
} from "@/lib/schema";

export async function getModel(model_id: number): Promise<Model | undefined> {
  const result = await prisma.model.findFirst({
    where: {
      id: model_id,
    },
  });

  if (result) {
    return result;
  }
}

export async function deleteModel(model_id: number): Promise<any> {
  try {
    const result = await prisma.model.delete({
      where: {
        id: model_id,
      },
    });

    if (result) {
      revalidatePath("admin/instruments");
      return { isSuccess: true };
    }
  } catch (error) {
    console.error("Error deleting model", error);
    return null;
  }
}

export const updateModel = async ({
  formData,
  id,
}: {
  formData: any;
  id: number;
}) => {
  const parsed = modelSchema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.model.update({
        where: {
          id: id,
        },
        data: {
          model: formData.model,
          brand: formData.brand,
          image: formData.image,
          status: formData.status,
          rrp: formData.rrp,
          sale_price: formData.sale_price,
        },
      });

      if (result) {
        revalidatePath(`/admin/instruments/${id}/`);
        return result;
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw Error;
  }
};

export const createModel = async ({
  formData,
  instrument_id,
}: {
  formData: any;
  instrument_id: number;
}) => {
  const parsed = modelSchema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.model.create({
        data: {
          model: formData.model,
          brand: formData.brand,
          image: formData.image,
          status: formData.status,
          rrp: formData.rrp,
          sale_price: formData.sale_price,
          instrument_category: {
            connect: {
              id: instrument_id,
            },
          },
        },
      });

      if (result) {
        return {
          isSuccess: true,
          id: instrument_id,
          redirect: `/admin/instruments/${instrument_id}/models`,
        };
      } else {
        return { isSuccess: false, issues: "Failed to create model" };
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw Error;
  }
};
