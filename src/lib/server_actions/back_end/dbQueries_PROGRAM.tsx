"use server";
import prisma from "@/prisma/client";
import z from "zod";
// import { Program } from "@/lib/types";
import { Program } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { programSchema } from "@/lib/schema";

async function getProgram(program_id: number): Promise<Program> {
  try {
    const program = await prisma.program.findFirst({
      where: {
        id: program_id,
      },
    });

    return JSON.parse(JSON.stringify(program));
  } catch (error) {
    return JSON.parse(JSON.stringify(error));
  }
}

async function getProgramsBySchool(school_id: number | undefined): Promise<
  | (Program & {
      school_id: number;
      status: string;
    })[]
  | undefined
> {
  if (!school_id) return undefined;

  try {
    const programs = await prisma.schoolProgram.findMany({
      where: {
        schoolId: school_id,
      },
      select: {
        schoolId: true,
        program: true,
        status: true,
      },
      orderBy: {
        status: "asc",
      },
    });

    const result = programs.map((item: any) => ({
      ...item.program,
      school_id: item.schoolId,
      status: item.status,
    }));
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error fetching school programs", error);
    return undefined;
  }
}

async function getProgramsNotInSchool(
  school_id: number
): Promise<(Program & { school_id: number })[] | undefined> {
  if (!school_id) return undefined;

  try {
    const instruments = await prisma.program.findMany({
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
        name: "asc",
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
    console.error("Error fetching programs not in school", error);
    return undefined;
  }
}

const removeProgram = async (school_id: number, program_id: number) => {
  if (!program_id || !school_id) return;

  try {
    const result = await prisma.schoolProgram.delete({
      where: {
        schoolId_programId: {
          programId: program_id,
          schoolId: school_id,
        },
      },
    });

    if (result) {
      revalidatePath(`/admin/schools/${school_id}/programs`);
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

const deleteProgram = async (program_id: number) => {
  try {
    const result = await prisma.program.delete({
      where: {
        id: program_id,
      },
    });

    if (result) {
      revalidatePath(`/admin/programs`);
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

const addProgram = async (school_id: number, program_id: number) => {
  if (!program_id || !school_id) return;

  try {
    const result = await prisma.schoolProgram.create({
      data: {
        school: {
          connect: { id: school_id },
        },
        program: {
          connect: { id: program_id },
        },
      },
    });

    if (result) {
      revalidatePath(`/admin/schools/${school_id}/programs/add`);
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

const updateSchoolProgram = async (
  formData: any,
  school_id: number,
  program_id: number
) => {
  const formSchema = z.object({
    status: z.enum(["Active", "Inactive"]),
  });

  const parsed = formSchema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.schoolProgram.update({
        where: {
          schoolId_programId: {
            programId: program_id,
            schoolId: school_id,
          },
        },
        data: {
          status: formData.status,
        },
      });

      if (result) {
        revalidatePath(`/admin/schools/${school_id}/programs`);
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

const updateProgram = async (formData: any, program_id: number) => {
  const parsed = programSchema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.program.update({
        where: {
          id: program_id,
        },
        data: {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          classType: formData.classType,
          tuition_fee: formData.tuition_fee,
          rehearsal_fee: formData.rehearsal_fee,
          enrol_fee: formData.enrol_fee,
          program_status: formData.program_status,
        },
      });

      if (result) {
        revalidatePath(`/admin/programs/${program_id}`);
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
  getProgram,
  getProgramsBySchool,
  getProgramsNotInSchool,
  addProgram,
  removeProgram,
  deleteProgram,
  updateSchoolProgram,
  updateProgram,
};
