"use server";

import prisma from "@/prisma/client";
import { generateAllHireOptionsObject } from "../../helpers/generateAllHireOptionsObject";

type HireableTableData = {
  hire_cost: number | null;
  insurance_cost: number | null;
  instruments: string[];
};

export default async function getHireableTableData(
  school_id: number,
  program_type: string
): Promise<HireableTableData[]> {
  const data = await prisma.schoolInstrument.findMany({
    where: {
      schoolId: school_id,
      status: "Available",
      instrument: { can_hire: true, program_type: program_type },
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
