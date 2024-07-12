"use server";
import z from "zod";
import { gradeSchema } from "@/lib/schema";
import prisma from "@/prisma/client";
import { Grade } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getGradesBySchool(
  school_id: number | undefined
): Promise<(Grade & { school_id: number })[] | undefined> {
  if (!school_id) return undefined;

  try {
    const grades = await prisma.schoolGrade.findMany({
      where: {
        schoolId: school_id,
      },
      select: {
        schoolId: true,
        grade: true,
      },
      orderBy: {
        grade: { order: "asc" },
      },
    });

    const result = grades.map((item) => ({
      ...item.grade,
      school_id: item.schoolId,
    }));
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error fetching grades", error);
    return undefined;
  }
}

async function getGradesNotInSchool(
  school_id: number,
  state_territory: string
): Promise<(Grade & { school_id: number })[] | undefined> {
  if (!state_territory) return undefined;

  try {
    const grades = await prisma.grade.findMany({
      where: {
        state_territory: state_territory,
        AND: {
          NOT: {
            schools: {
              some: {
                schoolId: school_id,
              },
            },
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    const result = grades.map((item) => ({
      ...item,
      school_id: school_id,
    }));

    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Error fetching grades by state or territory", error);
    return undefined;
  }
}

const removeGrade = async (school_id: number, grade_id: number) => {
  if (!grade_id || !school_id) return;

  try {
    const result = await prisma.schoolGrade.delete({
      where: {
        gradeId_schoolId: {
          gradeId: grade_id,
          schoolId: school_id,
        },
      },
    });

    if (result) {
      revalidatePath(`/admin/schools/${school_id}/grades`);
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

const deleteGrade = async (grade_id: number) => {
  try {
    const result = await prisma.grade.delete({
      where: {
        id: grade_id,
      },
    });

    if (result) {
      revalidatePath(`/admin/grades`);
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

const addGrade = async (school_id: number, grade_id: number) => {
  if (!grade_id || !school_id) return;

  try {
    const result = await prisma.schoolGrade.create({
      data: {
        school: {
          connect: { id: school_id },
        },
        grade: {
          connect: { id: grade_id },
        },
      },
    });

    if (result) {
      revalidatePath(`/admin/schools/${school_id}/grades/add`);
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

const createGrade = async (formData: z.infer<typeof gradeSchema>) => {
  try {
    const result = await prisma.grade.create({
      data: {
        name: formData.name,
        category: formData.category,
        order: formData.order,
        state_territory: formData.state_territory,
      },
    });

    if (result) {
      revalidatePath(`/admin/grades`);
      return { isSuccess: true };
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

const updateGrade = async (formData: any, grade_id: number) => {
  const schema = gradeSchema.omit({ state_territory: true });
  const parsed = schema.safeParse(formData);

  if (parsed.success) {
    // update db
    console.log("parsed successfully");
    try {
      const result = await prisma.grade.update({
        where: {
          id: grade_id,
        },
        data: {
          name: formData.name,
          category: formData.category,
          order: formData.order,
        },
      });

      if (result) {
        revalidatePath(`/admin/grades`);
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
  getGradesBySchool,
  getGradesNotInSchool,
  addGrade,
  createGrade,
  updateGrade,
  removeGrade,
  deleteGrade,
};
