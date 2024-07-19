"use server";
import z from "zod";
import {
  deleteEntity,
  createEntity,
  updateEntity,
  parseFormData,
  addOrRemoveConnection,
} from "@/lib/helpers/dbHelpers";
import { DeleteResult } from "@/lib/types";
import { gradeSchema } from "@/lib/schema";
import prisma from "@/prisma/client";
import { Grade } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getGrades(): Promise<Grade[]> {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        schools: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return grades;
  } catch (error) {
    throw error;
  }
}

export async function getGradesBySchool(
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

export async function getGradesNotInSchool(
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

export const removeGrade = async ({
  school_id,
  grade_id,
}: {
  school_id: number;
  grade_id: number;
}) => {
  return await addOrRemoveConnection({
    model: prisma.school,
    foreign_key: "grades",
    row_id: school_id,
    connection_id: grade_id,
    action: "disconnect",
  });
};

export const addGrade = async ({
  school_id,
  grade_id,
}: {
  school_id: number;
  grade_id: number;
}) => {
  return await addOrRemoveConnection({
    model: prisma.school,
    foreign_key: "grades",
    row_id: school_id,
    connection_id: grade_id,
    action: "connect",
  });
};

export async function deleteGrade(grade_id: number): Promise<DeleteResult> {
  return await deleteEntity(prisma.grade, grade_id, "admin/grades");
}

export const createGrade = async (formData: z.infer<typeof gradeSchema>) => {
  const parsedData = parseFormData(formData, gradeSchema);
  const result = await createEntity(prisma.grade, parsedData, "/admin/grades");
  if (result) {
    revalidatePath("/admin/grades");
  }
  return result;
};

export const updateGrade = async (formData: any, grade_id: number) => {
  const schema = gradeSchema.omit({ state_territory: true });
  const parsedData = parseFormData(formData, schema);

  const result = await updateEntity(
    prisma.grade,
    parsedData,
    grade_id,
    "/admin/grades"
  );
  if (result) {
    revalidatePath(`/admin/grades`);
    return { isSuccess: true };
  } else {
    return { isSuccess: false };
  }
};
