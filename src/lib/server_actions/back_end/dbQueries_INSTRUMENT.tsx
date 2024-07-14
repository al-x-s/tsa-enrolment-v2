"use server";
import prisma from "@/prisma/client";
import z from "zod";
import { Instrument, InstrumentModel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  schoolInstrumentSchema,
  instrumentSchema,
  modelSchema,
} from "@/lib/schema";

async function getInstrumentById(
  instrument_id: number
): Promise<Instrument | undefined> {
  const instrument = await prisma.instrument.findFirst({
    where: {
      id: instrument_id,
    },
  });

  if (!instrument) {
    return undefined;
  }

  return instrument;
}

async function getInstrumentModels(
  instrument_id: number
): Promise<(InstrumentModel & { instrument_id: number })[] | undefined> {
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

async function getInstrumentModel(
  model_id: number
): Promise<InstrumentModel | undefined> {
  const result = await prisma.instrumentModel.findFirst({
    where: {
      id: model_id,
    },
  });

  if (result) {
    return result;
  }
}

async function getInstrumentsBySchool(school_id: number | undefined): Promise<
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

async function getInstrumentsNotInSchool(
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

const removeInstrument = async ({
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

const addInstrument = async ({
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

const updateSchoolInstrument = async ({
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

async function deleteInstrument(instrument_id: number): Promise<any> {
  try {
    const result = await prisma.instrument.delete({
      where: {
        id: instrument_id,
      },
    });

    if (result) {
      revalidatePath("admin/instruments");
      return { isSuccess: true };
    }
  } catch (error) {
    console.error("Error deleting instrument", error);
    return null;
  }
}

async function deleteModel(model_id: number): Promise<any> {
  try {
    const result = await prisma.instrumentModel.delete({
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

const updateInstrument = async ({
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
const updateInstrumentModel = async ({
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
      const result = await prisma.instrumentModel.update({
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

export {
  getInstrumentsBySchool,
  getInstrumentsNotInSchool,
  getInstrumentById,
  addInstrument,
  getInstrumentModels,
  getInstrumentModel,
  updateInstrumentModel,
  removeInstrument,
  updateSchoolInstrument,
  deleteInstrument,
  updateInstrument,
  deleteModel,
};