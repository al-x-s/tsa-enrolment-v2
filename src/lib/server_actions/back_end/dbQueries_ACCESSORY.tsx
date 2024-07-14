"use server";
import z from "zod";
import { gradeSchema } from "@/lib/schema";
import prisma from "@/prisma/client";
import { Accessory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { QueryClient } from "@tanstack/react-query";

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

// const deleteGrade = async (grade_id: number) => {
//   try {
//     const result = await prisma.grade.delete({
//       where: {
//         id: grade_id,
//       },
//     });

//     if (result) {
//       revalidatePath(`/admin/grades`);
//       return { isSuccess: true };
//     } else {
//       return { isSuccess: false };
//     }
//   } catch (error) {
//     return {
//       isSuccess: false,
//       issues: error,
//     };
//   }
// };

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

// const createGrade = async (formData: z.infer<typeof gradeSchema>) => {
//   try {
//     const result = await prisma.grade.create({
//       data: {
//         name: formData.name,
//         category: formData.category,
//         order: formData.order,
//         state_territory: formData.state_territory,
//       },
//     });

//     if (result) {
//       revalidatePath(`/admin/grades`);
//       return { isSuccess: true };
//     } else {
//       return { isSuccess: false, issues: "Failed to create grade" };
//     }
//   } catch (error) {
//     return {
//       isSuccess: false,
//       issues: error,
//     };
//   }
// };

// const updateGrade = async (formData: any, grade_id: number) => {
//   const schema = gradeSchema.omit({ state_territory: true });
//   const parsed = schema.safeParse(formData);

//   if (parsed.success) {
//     // update db
//     console.log("parsed successfully");
//     try {
//       const result = await prisma.grade.update({
//         where: {
//           id: grade_id,
//         },
//         data: {
//           name: formData.name,
//           category: formData.category,
//           order: formData.order,
//         },
//       });

//       if (result) {
//         revalidatePath(`/admin/grades`);
//         return { isSuccess: true };
//       } else {
//         return { isSuccess: false };
//       }
//     } catch (error) {
//       return { isSuccess: false };
//     }
//   } else {
//     return {
//       isSuccess: false,
//       issues: parsed.error.issues.map((issue) => issue.message),
//     };
//   }
// };

export {
  getAccessoriesByInstrument,
  getAccessoriesNotLinkedToInstrument,
  addAccessory,
  //   createAccessory,
  //   updateAccessory,
  removeAccessory,
  //   deleteAccessory,
};
