"use server";
import z from "zod";
import { accessorySchema, gradeSchema } from "@/lib/schema";
import prisma from "@/prisma/client";
import { Accessory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { QueryClient } from "@tanstack/react-query";

async function getAccessory(accessory_id: number): Promise<Accessory> {
  try {
    const accessory = await prisma.accessory.findFirst({
      where: {
        id: accessory_id,
      },
    });

    return JSON.parse(JSON.stringify(accessory));
  } catch (error) {
    return JSON.parse(JSON.stringify(error));
  }
}

async function getAccessoriesByInstrument(
  instrument_id: number
): Promise<(Accessory & { instrument_id: number })[] | undefined> {
  try {
    const accessories = await prisma.accessory.findMany({
      where: {
        instruments: {
          some: { id: instrument_id },
        },
      },
    });
    // return accessories;
    const result = accessories.map((item) => ({
      ...item,
      instrument_id,
    }));
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error fetching accessories", error);
    return undefined;
  }
}

async function getAccessoriesNotLinkedToInstrument(
  instrument_id: number
): Promise<(Accessory & { instrument_id: number })[] | undefined> {
  try {
    const accessories = await prisma.accessory.findMany({
      where: {
        instruments: {
          none: { id: instrument_id },
        },
      },
    });

    const result = accessories.map((item) => ({
      ...item,
      instrument_id,
    }));
    if (result) {
      return result;
    }
  } catch (error) {
    console.error(
      "Error fetching grades not associated with instrument",
      error
    );
    return undefined;
  }
}

const removeAccessory = async ({
  instrument_id,
  accessory_id,
}: {
  instrument_id: number;
  accessory_id: number;
}) => {
  try {
    const result = await prisma.instrument.update({
      where: { id: instrument_id },
      data: {
        accessories: {
          disconnect: { id: accessory_id },
        },
      },
      include: {
        accessories: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteAccessory = async (accessory_id: number) => {
  try {
    const result = await prisma.accessory.delete({
      where: {
        id: accessory_id,
      },
    });

    if (result) {
      revalidatePath(`/admin/accessories`);
      return { isSuccess: true };
    } else {
      return { isSuccess: false };
    }
  } catch (error) {
    return {
      isSuccess: false,
      issues: error,
    };
  }
};

const addAccessory = async ({
  instrument_id,
  accessory_id,
}: {
  instrument_id: number;
  accessory_id: number;
}) => {
  try {
    const result = await prisma.instrument.update({
      where: { id: instrument_id },
      data: {
        accessories: {
          connect: { id: accessory_id },
        },
      },
      include: {
        accessories: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const createAccessory = async (formData: z.infer<typeof accessorySchema>) => {
  try {
    const result = await prisma.accessory.create({
      data: {
        name: formData.name,
        status: formData.status,
        price: formData.price,
        is_recommended: formData.is_recommended,
        description_short: formData.description_short,
        description_long: formData.description_long,
      },
    });

    if (result) {
      revalidatePath(`/admin/accessories`);
      return { isSuccess: true };
    } else {
      return { isSuccess: false, issues: "Failed to create Accessory" };
    }
  } catch (error) {
    return {
      isSuccess: false,
      issues: error,
    };
  }
};

const updateAccessory = async ({
  formData,
  accessory_id,
}: {
  formData: any;
  accessory_id: number;
}) => {
  const parsed = accessorySchema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.accessory.update({
        where: {
          id: accessory_id,
        },
        data: {
          name: formData.name,
          status: formData.status,
          price: formData.price,
          is_recommended: formData.is_recommended,
          description_short: formData.description_short,
          description_long: formData.description_long,
        },
      });

      if (result) {
        revalidatePath(`/admin/accessories/${accessory_id}`);
        return result;
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw Error;
  }
};

export {
  getAccessoriesByInstrument,
  getAccessoriesNotLinkedToInstrument,
  addAccessory,
  getAccessory,
  createAccessory,
  updateAccessory,
  removeAccessory,
  deleteAccessory,
};
