"use server";

import prisma from "@/prisma/client";

export default async function getAllHireableInstruments(): Promise<any> {
  const result = await prisma.instrument.findMany({
    where: { can_hire: true },
    select: {
      name: true,
      hire_cost: true,
      hire_insurance: true,
    },
  });
  return JSON.parse(JSON.stringify(result));
}
