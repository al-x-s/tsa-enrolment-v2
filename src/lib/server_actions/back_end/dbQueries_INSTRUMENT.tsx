"use server";
import prisma from "@/prisma/client";
import z from "zod";
import { Instrument } from "@/lib/types";
import { revalidatePath } from "next/cache";

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

const removeInstrument = async (school_id: number, instrument_id: number) => {
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

    if (result) {
      revalidatePath(`/admin/schools/${school_id}/instruments`);
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

const addInstrument = async (school_id: number, instrument_id: number) => {
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

    if (result) {
      revalidatePath(`/admin/schools/${school_id}/instruments/add`);
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

const updateSchoolInstrument = async (
  formData: any,
  school_id: number,
  instrument_id: number
) => {
  const formSchema = z.object({
    enrolled: z.number(),
    cap: z.number(),
    status: z.enum(["Available", "Unavailable", "Hidden"]),
  });

  const parsed = formSchema.safeParse(formData);

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

      if (result) {
        revalidatePath(`/admin/schools/${school_id}/instruments`);
        return { isSuccess: true };
      } else {
        return { isSuccess: false };
      }
    } catch (error) {
      return { isSuccess: false };
    }
  } else {
    return {
      isSuccess: false,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
};

export {
  getInstrumentsBySchool,
  getInstrumentsNotInSchool,
  addInstrument,
  removeInstrument,
  updateSchoolInstrument,
};
