"use server";

import prisma from "@/prisma/client";
import { generateAllHireOptionsObject } from "../../helpers/generateAllHireOptionsObject";
import { ProgramType } from "@prisma/client";

import { HireableTableData } from "@/lib/types/types";

export default async function getHireableTableData(
  school_id: number,
  program_type: string
): Promise<HireableTableData[]> {
  const data = await prisma.schoolInstrument.findMany({
    where: {
      schoolId: school_id,
      status: "Available",
      instrument: {
        can_hire: true,
        program_type: program_type as ProgramType,
      },
    },
    select: {
      instrument: {
        select: {
          name: true,
          hire_cost: true,
          hire_insurance: true,
        },
      },
    },
  });

  const result = generateAllHireOptionsObject(data);
  return JSON.parse(JSON.stringify(result));
}
