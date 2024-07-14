"use server";
import z from "zod";
import prisma from "@/prisma/client";

import { schoolSchema } from "@/lib/schema";
// import { SchoolData } from "@/lib/types";
import { School } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getSchoolById({
  school_id,
}: {
  school_id: number;
}): Promise<School | null> {
  try {
    const school = await prisma.school.findFirst({
      where: {
        id: school_id,
      },
      include: {
        programs: { include: { program: true } },
        grades: { include: { grade: true } },
        instruments: { include: { instrument: true } },
      },
    });

    if (school) {
      return school;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching school", error);
    return null;
  }
}

async function getSchoolsByInstrument(
  instrument_id: number
): Promise<School[] | undefined> {
  try {
    const schools = await prisma.schoolInstrument.findMany({
      where: {
        instrumentId: instrument_id,
      },
      select: {
        school: {
          select: {
            id: true,
            name: true,
            state_territory: true,
          },
        },
      },
      orderBy: {
        school: { name: "asc" },
      },
    });

    const result = schools.map((item: any) => ({
      ...item.school,
    }));
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error fetching schools by instrument", error);
    return undefined;
  }
}

async function deleteSchool(school_id: number): Promise<any> {
  try {
    const school = await prisma.school.delete({
      where: {
        id: school_id,
      },
    });

    if (school) {
      revalidatePath("admin/schools");
      return { isSuccess: true };
    }
  } catch (error) {
    console.error("Error deleting school", error);
    return null;
  }
}

const createSchool = async (formData: z.infer<typeof schoolSchema>) => {
  try {
    const result = await prisma.school.create({
      data: {
        name: formData.name,
        state_territory: formData.state_territory,
        facility_hire: formData.facility_hire,
        resource_levy: formData.resource_levy,
        offers_instrument_rental: formData.offers_instrument_rental,
      },
    });

    if (result) {
      return {
        isSuccess: true,
        redirect: `/admin/schools/${result.id}/general`,
      };
    } else {
      return { isSuccess: false, issues: "Failed to create grade" };
    }
  } catch (error) {
    return {
      isSuccess: false,
      issues: error,
    };
  }
};

const updateSchool = async ({
  formData,
  id,
}: {
  formData: any;
  id: number;
}) => {
  const keys = Object.keys(formData);
  const fieldName = keys[0];
  const schema = schoolSchema.pick({ [fieldName]: true });
  const parsed = schema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.school.update({
        where: {
          id: id,
        },
        data: {
          [fieldName]: formData[fieldName],
        },
      });

      if (result) {
        revalidatePath(`/admin/schools/${id}/`);
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
  updateSchool,
  createSchool,
  getSchoolById,
  deleteSchool,
  getSchoolsByInstrument,
};
