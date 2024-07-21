"use server";
import prisma from "@/prisma/client";
import { SchoolProgramWithPrograms } from "@/lib/types/types";

export default async function getProgramsData(
  school_id: number | undefined,
  program_type: "Band" | "Keyboard" | "String" | "Guitar" | undefined
): Promise<SchoolProgramWithPrograms[]> {
  const result = await prisma.schoolProgram.findMany({
    where: {
      schoolId: school_id,
      program: { type: program_type },
    },
    include: {
      program: true,
    },
  });

  // Sort results before returning to client
  const order: any = { Group: 1, Private: 2, Rehearsal: 3 };
  result?.sort((a: SchoolProgramWithPrograms, b: SchoolProgramWithPrograms) => {
    return order[a.program.classType] - order[b.program.classType];
  });
  return result;
}
