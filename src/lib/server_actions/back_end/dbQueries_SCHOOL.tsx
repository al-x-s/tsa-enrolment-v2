"use server";
import prisma from "@/prisma/client";
import { formSchema } from "../../../app/(back-end)/admin/schools/[school_id]/general/schema";
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

const updateSchool = async (formData: any, id: number) => {
  const keys = Object.keys(formData);
  const fieldName = keys[0];
  const schema = formSchema.pick({ [fieldName]: true });
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

export { updateSchool, getSchoolById, deleteSchool };
