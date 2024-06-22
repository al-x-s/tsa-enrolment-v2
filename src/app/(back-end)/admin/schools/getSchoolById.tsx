"use server";
import prisma from "@/prisma/client";
import { formSchema } from "./[school_id]/schema";
import { SchoolData } from "@/lib/types";
import { revalidatePath } from "next/cache";

async function getSchoolById({
  school_id,
}: {
  school_id: number;
}): Promise<SchoolData | null> {
  try {
    const school = await prisma.school.findFirst({
      where: {
        id: school_id,
      },
      include: {
        programs: { include: { program: true } },
      },
    });

    if (school) {
      return school;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

const update = async (formData: any, id: number) => {
  const keys = Object.keys(formData);
  const fieldName = keys[0];
  const schema = formSchema.pick({ [fieldName]: true });
  const parsed = schema.safeParse(formData);

  console.log("Form Data", formData[fieldName]);

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
        console.log("db error");
        return { isSuccess: false };
      }
    } catch (error) {
      console.log(error);
      return { isSuccess: false };
    }
  } else {
    console.log("no attempt to update db");
    return {
      isSuccess: false,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
};

export { update, getSchoolById };
