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

import { findOne } from "@/lib/helpers/dbHelpers";

export async function getInstrumentById(
  instrument_id: number
): Promise<Instrument | undefined> {
  const instrument = await findOne(prisma.instrument, { id: instrument_id });

  if (!instrument) {
    return undefined;
  }

  return instrument;
}

export async function getInstrumentModels(
  instrument_id: number
): Promise<(Model & { instrument_id: number })[] | undefined> {
  const instrument = await prisma.instrument.findFirst({
    where: {
      id: instrument_id,
    },
    include: {
      models: true,
    },
  });

  const result = instrument?.models.map((item: any) => ({
    ...item,
    instrument_id: instrument_id,
  }));
  if (result) {
    return result;
  }
}

export async function getInstrumentsBySchool(
  school_id: number | undefined
): Promise<
  | (Instrument & {
      school_id: number;
      status: string;
      cap: number;
      enrolled: number;
    })[]
  | undefined
> {
  if (!school_id) return undefined;

  try {
    const instruments = await prisma.schoolInstrument.findMany({
      where: {
        schoolId: school_id,
      },
      select: {
        schoolId: true,
        instrument: true,
        status: true,
        enrolled: true,
        cap: true,
      },
      orderBy: {
        instrument: { program_type: "asc" },
      },
    });

    const result = instruments.map((item: any) => ({
      ...item.instrument,
      school_id: item.schoolId,
      status: item.status,
      enrolled: item.enrolled,
      cap: item.cap,
    }));
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error fetching school instruments", error);
    return undefined;
  }
}

export async function getInstrumentsNotInSchool(
  school_id: number
): Promise<(Instrument & { school_id: number })[] | undefined> {
  if (!school_id) return undefined;

  try {
    const instruments = await prisma.instrument.findMany({
      where: {
        NOT: {
          schools: {
            some: {
              schoolId: school_id,
            },
          },
        },
      },
      orderBy: {
        program_type: "asc",
      },
    });

    const result = instruments.map((item) => ({
      ...item,
      school_id: school_id,
    }));

    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error fetching instruments not in school", error);
    return undefined;
  }
}

export const removeInstrument = async ({
  school_id,
  instrument_id,
}: {
  school_id: number;
  instrument_id: number;
}) => {
  if (!instrument_id || !school_id) return;

  try {
    const result = await prisma.schoolInstrument.delete({
      where: {
        instrumentId_schoolId: {
          instrumentId: instrument_id,
          schoolId: school_id,
        },
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const addInstrument = async ({
  school_id,
  instrument_id,
}: {
  school_id: number;
  instrument_id: number;
}) => {
  if (!instrument_id || !school_id) return;

  try {
    const result = await prisma.schoolInstrument.create({
      data: {
        school: {
          connect: { id: school_id },
        },
        instrument: {
          connect: { id: instrument_id },
        },
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateSchoolInstrument = async ({
  formData,
  school_id,
  instrument_id,
}: {
  formData: any;
  school_id: number;
  instrument_id: number;
}) => {
  const parsed = schoolInstrumentSchema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.schoolInstrument.update({
        where: {
          instrumentId_schoolId: {
            instrumentId: instrument_id,
            schoolId: school_id,
          },
        },
        data: {
          cap: formData.cap,
          enrolled: formData.enrolled,
          status: formData.status,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  } else {
    throw Error;
  }
};

export async function deleteInstrument(
  instrument_id: number
): Promise<DeleteResult> {
  return await deleteEntity(
    prisma.instrument,
    instrument_id,
    "admin/instruments"
  );
}

export const updateInstrument = async ({
  formData,
  id,
}: {
  formData: any;
  id: number;
}) => {
  const keys = Object.keys(formData);
  const fieldName = keys[0];
  const schema = instrumentSchema.pick({ [fieldName]: true });
  const parsed = schema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.instrument.update({
        where: {
          id: id,
        },
        data: {
          [fieldName]: formData[fieldName],
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

export const createInstrument = async (
  formData: z.infer<typeof instrumentSchema>
) => {
  const parsed = instrumentSchema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.instrument.create({
        data: {
          name: formData.name,
          program_type: formData.program_type,
          can_hire: formData.can_hire,
          hire_cost: formData.hire_cost,
          hire_insurance: formData.hire_insurance,
        },
      });

      if (result) {
        return {
          isSuccess: true,
          redirect: `/admin/instruments/${result.id}/general`,
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

export async function getInstrumentImages() {
  const models = await prisma.model.findMany({
    select: {
      image: true,
      brand: true,
      model: true,
      instrument_category: {
        select: {
          name: true,
        },
      },
    },
  });

  const uniqueImages = new Set();
  const result: {
    instrument_name: string;
    images: {
      image: string;
      brand: string;
      model: string;
    }[];
  }[] = [];

  models.forEach((curr) => {
    const instrumentName = curr.instrument_category[0].name;
    const imageData = {
      image: curr.image,
      brand: curr.brand,
      model: curr.model,
    };

    if (!uniqueImages.has(imageData.image)) {
      uniqueImages.add(imageData.image);

      const existingInstrument = result.find(
        (i) => i.instrument_name === instrumentName
      );
      if (existingInstrument) {
        existingInstrument.images.push(imageData);
      } else {
        result.push({
          instrument_name: instrumentName,
          images: [imageData],
        });
      }
    }
  });

  return result;
}
